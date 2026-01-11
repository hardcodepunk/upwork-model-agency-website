import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { Redis } from "@upstash/redis"
import { APPLICATION_FORM_FIELDS, ApplicationFormData } from "@/lib/applicationForm"

const redis = Redis.fromEnv()

const RATE_LIMIT_WINDOW_SEC = 600
const RATE_LIMIT_MAX = 20

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

function validatePayload(raw: unknown): { ok: true; data: ApplicationFormData } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) return { ok: false, error: "Invalid payload" }
  const obj = raw as Record<string, unknown>

  const fullName = typeof obj.fullName === "string" ? obj.fullName.trim() : ""
  const age = typeof obj.age === "string" ? obj.age.trim() : ""
  const instagram = typeof obj.instagram === "string" ? obj.instagram.trim() : ""
  const email = typeof obj.email === "string" ? obj.email.trim() : ""
  const onlyfans = typeof obj.onlyfans === "string" ? obj.onlyfans.trim() : ""
  const honeypot = typeof obj.honeypot === "string" ? obj.honeypot : ""
  const renderedAt = typeof obj.renderedAt === "number" ? obj.renderedAt : undefined
  const turnstileToken = typeof obj.turnstileToken === "string" ? obj.turnstileToken : undefined

  for (const field of APPLICATION_FORM_FIELDS) {
    if (!String({ fullName, age, instagram, email }[field]).trim()) {
      return { ok: false, error: `Missing ${field}` }
    }
  }

  if (!fullName || fullName.length > 120) return { ok: false, error: "Invalid name" }

  const ageNum = Number(age)
  if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 99) return { ok: false, error: "Invalid age" }

  if (!instagram || instagram.length > 60) return { ok: false, error: "Invalid instagram" }
  if (!email || email.length > 254 || !isEmail(email)) return { ok: false, error: "Invalid email" }
  if (onlyfans && onlyfans.length > 60) return { ok: false, error: "Invalid onlyfans" }
  if (honeypot) return { ok: false, error: "Bot" }

  return { ok: true, data: { fullName, age, instagram, email, onlyfans, honeypot, renderedAt, turnstileToken } }
}

async function rateLimitOrThrow(ip: string) {
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

  const ok = await rateLimitOrThrow(ip)
  if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 })

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

  const secure = smtpPort === 465

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
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
