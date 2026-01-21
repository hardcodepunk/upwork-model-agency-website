import React, { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogActions, TextField, Box, Typography } from "@mui/material"
import { FormContainer, FormSectionTitle } from "./ModalForm.styles"
import { ModalFormProps } from "./ModalForm.props"
import { APPLICATION_FORM_FIELDS, initialFormData } from "@/lib/applicationForm"
import ButtonCustom from "@/components/atoms/ButtonCustom/ButtonCustom"

const CALENDLY_APPLY_URL = "https://calendly.com/bvon878-gocn/30min"

type FormData = typeof initialFormData & {
  renderedAt?: number
  turnstileToken?: string
}

type RequiredField = (typeof APPLICATION_FORM_FIELDS)[number]
type FieldErrorMap = Partial<Record<keyof FormData, string>>

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

const ModalForm = ({ open, handleClose }: ModalFormProps) => {
  const formRenderedTime = useRef<number>(Date.now())
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FieldErrorMap>({})

  useEffect(() => {
    if (!open) return
    const now = Date.now()
    formRenderedTime.current = now
    setSuccess(false)
    setIsSubmitting(false)
    setFormData({ ...initialFormData, renderedAt: now })
    setErrors({})
  }, [open])

  const handleChange =
    <K extends keyof FormData>(field: K) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormData(prev => ({ ...prev, [field]: value }))
      setErrors(prev => {
        if (!prev[field]) return prev
        const next = { ...prev }
        delete next[field]
        return next
      })
    }

  const validateForm = () => {
    const nextErrors: FieldErrorMap = {}

    for (const field of APPLICATION_FORM_FIELDS) {
      const v = String(formData[field as RequiredField] ?? "").trim()
      if (!v) nextErrors[field] = "Required"
    }

    const fullName = String(formData.fullName ?? "").trim()
    if (fullName && fullName.length > 120) nextErrors.fullName = "Too long"

    const ageRaw = String(formData.age ?? "").trim()
    if (ageRaw) {
      const ageNum = Number(ageRaw)
      if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 99) nextErrors.age = "Invalid age (18–99)"
    }

    const instagram = String(formData.instagram ?? "").trim()
    if (instagram && instagram.length > 60) nextErrors.instagram = "Too long"

    const email = String(formData.email ?? "").trim()
    if (email && (email.length > 254 || !isEmail(email))) nextErrors.email = "Invalid email"

    const onlyfans = String(formData.onlyfans ?? "").trim()
    if (onlyfans && onlyfans.length > 60) nextErrors.onlyfans = "Too long"

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!validateForm()) return
    if (formData.honeypot || Date.now() - formRenderedTime.current < 3000) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/send-form-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        await response.text()
      }
    } catch {
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" fullWidth maxWidth="sm">
      <DialogContent dividers>
        {success ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4} gap={2}>
            <Typography variant="h3" gutterBottom>
              To Valhalla!
            </Typography>

            <Typography variant="body1" textAlign="center">
              We&apos;ve successfully received your application. We&apos;ll be in touch soon.
            </Typography>

            <Typography variant="body1" textAlign="center">
              Want to speed things up? You can optionally schedule a quick call.
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
              <ButtonCustom href={CALENDLY_APPLY_URL} target="_blank" rel="noopener noreferrer">
                Schedule optional call
              </ButtonCustom>

              <ButtonCustom onClick={handleClose}>Close</ButtonCustom>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormContainer>
              <Box sx={{ display: "none" }}>
                <TextField
                  label="Leave this field blank"
                  value={formData.honeypot}
                  onChange={handleChange("honeypot")}
                  autoComplete="off"
                  fullWidth
                />
              </Box>

              <FormSectionTitle variant="h6">Apply here</FormSectionTitle>

              <TextField
                required
                label="Full Name"
                value={formData.fullName}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName ?? ""}
                onChange={handleChange("fullName")}
                fullWidth
              />

              <TextField
                required
                label="Age"
                type="number"
                value={formData.age}
                error={Boolean(errors.age)}
                helperText={errors.age ?? ""}
                onChange={handleChange("age")}
                inputProps={{ min: 18, max: 99, inputMode: "numeric", pattern: "[0-9]*" }}
                fullWidth
              />

              <TextField
                required
                label="Instagram Handle"
                value={formData.instagram}
                error={Boolean(errors.instagram)}
                helperText={errors.instagram ?? ""}
                onChange={handleChange("instagram")}
                fullWidth
              />

              <TextField
                required
                type="email"
                label="Email"
                value={formData.email}
                error={Boolean(errors.email)}
                helperText={errors.email ?? ""}
                onChange={handleChange("email")}
                fullWidth
              />

              <TextField
                label="OnlyFans Username"
                value={formData.onlyfans}
                error={Boolean(errors.onlyfans)}
                helperText={errors.onlyfans ?? ""}
                onChange={handleChange("onlyfans")}
                fullWidth
              />
            </FormContainer>

            <DialogActions sx={{ px: 0 }}>
              <ButtonCustom onClick={handleClose} disabled={isSubmitting}>
                Close
              </ButtonCustom>
              <ButtonCustom type="submit" disabled={isSubmitting}>
                Submit
              </ButtonCustom>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ModalForm
