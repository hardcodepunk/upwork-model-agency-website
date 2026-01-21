import { Box, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

export const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}))

export const FormSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginTop: theme.spacing(3),
}))
