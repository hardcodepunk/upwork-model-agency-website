import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createClient, type RedisClientType } from "redis"
import { APPLICATION_FORM_FIELDS, type ApplicationFormData } from "@/lib/applicationForm"

export const runtime = "nodejs"

const RATE_LIMIT_WINDOW_SEC = 600
const RATE_LIMIT_MAX = 20

let redisClient: RedisClientType | null = null
let redisConnecting: ReturnType<RedisClientType["connect"]> | null = null

function getClientIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return "unknown"
}

function escapeHtml(v: string) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

function pickString(obj: Record<string, unknown>, key: string) {
  const v = obj[key]
  return typeof v === "string" ? v.trim() : ""
}

function validatePayload(raw: unknown): { ok: true; data: ApplicationFormData } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) return { ok: false, error: "Invalid payload" }
  const obj = raw as Record<string, unknown>

  const fullName = pickString(obj, "fullName")
  const age = pickString(obj, "age")
  const instagram = pickString(obj, "instagram")
  const email = pickString(obj, "email")
  const onlyfans = pickString(obj, "onlyfans")
  const honeypot = typeof obj.honeypot === "string" ? obj.honeypot : ""
  const renderedAt = typeof obj.renderedAt === "number" ? obj.renderedAt : undefined
  const turnstileToken = typeof obj.turnstileToken === "string" ? obj.turnstileToken : undefined

  const requiredMap: Record<string, string> = { fullName, age, instagram, email }
  for (const field of APPLICATION_FORM_FIELDS) {
    if (!requiredMap[field]?.trim()) return { ok: false, error: `Missing ${field}` }
  }

  if (fullName.length > 120) return { ok: false, error: "Invalid name" }

  const ageNum = Number(age)
  if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 99) return { ok: false, error: "Invalid age" }

  if (instagram.length > 60) return { ok: false, error: "Invalid instagram" }
  if (email.length > 254 || !isEmail(email)) return { ok: false, error: "Invalid email" }
  if (onlyfans && onlyfans.length > 60) return { ok: false, error: "Invalid onlyfans" }
  if (honeypot) return { ok: false, error: "Bot" }

  return { ok: true, data: { fullName, age, instagram, email, onlyfans, honeypot, renderedAt, turnstileToken } }
}

async function ensureRedis(): Promise<RedisClientType | null> {
  const url = process.env.REDIS_URL
  if (!url) return null

  if (redisClient?.isOpen) return redisClient

  if (!redisClient) {
    redisClient = createClient({ url })
    redisClient.on("error", err => console.error("Redis error:", err))
  }

  if (!redisClient.isOpen) {
    if (!redisConnecting) {
      redisConnecting = redisClient.connect().finally(() => {
        redisConnecting = null
      })
    }
    await redisConnecting
  }

  return redisClient
}

async function rateLimit(ip: string): Promise<boolean> {
  const redis = await ensureRedis()
  if (!redis) return true

  const key = `rl:apply:${ip}`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW_SEC)
  return count <= RATE_LIMIT_MAX
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const body = new URLSearchParams()
  body.set("secret", secret)
  body.set("response", token)
  if (ip !== "unknown") body.set("remoteip", ip)

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })

  if (!res.ok) return false
  const json = (await res.json()) as { success?: boolean }
  return Boolean(json.success)
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  let allowed = true
  try {
    allowed = await rateLimit(ip)
  } catch (err) {
    console.error("Rate limit failure:", err)
    allowed = true
  }

  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 })

  const contentLength = request.headers.get("content-length")
  if (contentLength && Number(contentLength) > 50_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const validated = validatePayload(raw)
  if (!validated.ok) return NextResponse.json({ error: "Invalid submission" }, { status: 400 })

  if (validated.data.renderedAt && Date.now() - validated.data.renderedAt < 3000) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
  }

  const turnstileOk = await verifyTurnstile(validated.data.turnstileToken, ip)
  if (!turnstileOk) return NextResponse.json({ error: "Invalid submission" }, { status: 400 })

  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || "0")
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const emailFrom = process.env.EMAIL_FROM
  const emailTo = process.env.EMAIL_TO

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !emailFrom || !emailTo) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  })

  const rows: Array<[string, string]> = [
    ["fullName", validated.data.fullName],
    ["age", validated.data.age],
    ["instagram", validated.data.instagram],
    ["email", validated.data.email],
    ["onlyfans", validated.data.onlyfans || "N/A"],
    ["ip", ip],
  ]

  const html = `
    <h2>New Application</h2>
    ${rows.map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</p>`).join("")}
  `

  try {
    await transporter.sendMail({
      from: `"Valhalla Girls Application" <${emailFrom}>`,
      to: emailTo,
      replyTo: validated.data.email,
      subject: "New submission",
      html,
    })

    return NextResponse.json({ message: "OK" }, { status: 200 })
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
