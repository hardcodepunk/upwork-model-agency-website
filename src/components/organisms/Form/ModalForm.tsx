import React, { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogActions, TextField, Box, Typography } from "@mui/material"
import ButtonCustom from "@/components/atoms/ButtonCustom/ButtonCustom"
import { FormContainer, FormSectionTitle } from "./ModalForm.styles"
import { ModalFormProps } from "./ModalForm.props"
import { APPLICATION_FORM_FIELDS, initialFormData } from "@/lib/applicationForm"

type FormData = typeof initialFormData & {
  renderedAt?: number
  turnstileToken?: string
}

type RequiredField = (typeof APPLICATION_FORM_FIELDS)[number]

const ModalForm = ({ open, handleClose }: ModalFormProps) => {
  const formRenderedTime = useRef<number>(Date.now())
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({})

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
      setErrors(prev => ({ ...prev, [field]: false }))
    }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {}
    for (const field of APPLICATION_FORM_FIELDS) {
      const value = formData[field as RequiredField]
      if (!value) newErrors[field] = true
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
            <Typography variant="h3" gutterBottom>
              To Valhalla!
            </Typography>
            <Typography variant="body1" textAlign="center">
              We&apos;ve successfully received your application. We&apos;ll be in touch soon.
            </Typography>
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
                helperText={errors.fullName ? "Required" : ""}
                onChange={handleChange("fullName")}
                fullWidth
              />

              <TextField
                required
                label="Age"
                value={formData.age}
                error={Boolean(errors.age)}
                helperText={errors.age ? "Required" : ""}
                onChange={handleChange("age")}
                fullWidth
              />

              <TextField
                required
                label="Instagram Handle"
                value={formData.instagram}
                error={Boolean(errors.instagram)}
                helperText={errors.instagram ? "Required" : ""}
                onChange={handleChange("instagram")}
                fullWidth
              />

              <TextField
                required
                type="email"
                label="Email"
                value={formData.email}
                error={Boolean(errors.email)}
                helperText={errors.email ? "Required" : ""}
                onChange={handleChange("email")}
                fullWidth
              />

              <TextField
                label="OnlyFans Username"
                value={formData.onlyfans}
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

      {success && (
        <DialogActions>
          <ButtonCustom onClick={handleClose}>Close</ButtonCustom>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default ModalForm
