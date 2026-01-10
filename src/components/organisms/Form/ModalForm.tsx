// React
import React, { useState, useRef, useEffect } from "react"

// MUI
import { Dialog, DialogContent, DialogActions, TextField, Box, Typography } from "@mui/material"

// Components
import ButtonCustom from "@/components/atoms/ButtonCustom/ButtonCustom"

// Styles
import { FormContainer, FormSectionTitle } from "./ModalForm.styles"

// Properties
import { ModalFormProps } from "./ModalForm.props"

// Constants
import { initialFormData, requiredFields } from "./ModalForm.constants"

const ModalForm = ({ open, handleClose }: ModalFormProps) => {
  const formRenderedTime = useRef(Date.now())
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (open) {
      formRenderedTime.current = Date.now()
      setSuccess(false)
      setFormData(initialFormData)
      setErrors({})
    }
  }, [open])

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
    setErrors(prev => ({ ...prev, [field]: false }))
  }

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = true
        console.log(`Missing required field: ${field}`)
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      console.warn("❗️Validation failed. Fill required fields.")
      return
    }

    if (formData.honeypot || Date.now() - formRenderedTime.current < 3000) {
      console.warn("🤖 Bot detected")
      return
    }

    try {
      const response = await fetch("/api/send-form-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("✅ Form successfully sent!")
        setSuccess(true)
      } else {
        console.error("❌ Error sending form:", await response.text())
      }
    } catch (error) {
      console.error("❌ Error:", error)
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
          <Box component="form" onSubmit={handleSubmit}>
            <FormContainer>
              {/* Honeypot hidden field */}
              <Box sx={{ display: "none" }}>
                <TextField
                  label="Leave this field blank"
                  value={formData.honeypot}
                  onChange={handleChange("honeypot")}
                  autoComplete="off"
                  fullWidth
                />
              </Box>

              {/* Personal Information */}
              <FormSectionTitle variant="h6">Apply here</FormSectionTitle>
              <TextField
                required
                label="Full Name"
                value={formData.fullName}
                error={errors.fullName}
                helperText={errors.fullName && "Required"}
                onChange={handleChange("fullName")}
                fullWidth
              />

              <TextField
                required
                label="Age"
                value={formData.age}
                error={errors.age}
                helperText={errors.age && "Required"}
                onChange={handleChange("age")}
                fullWidth
              />

              <TextField
                required
                label="Instagram Handle"
                value={formData.instagram}
                error={errors.instagram}
                helperText={errors.instagram && "Required"}
                onChange={handleChange("instagram")}
                fullWidth
              />

              <TextField
                required
                type="email"
                label="Email"
                value={formData.email}
                error={errors.email}
                helperText={errors.email && "Required"}
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
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <ButtonCustom onClick={handleClose}>Close</ButtonCustom>
        {!success && <ButtonCustom onClick={handleSubmit}>Submit</ButtonCustom>}
      </DialogActions>
    </Dialog>
  )
}

export default ModalForm
