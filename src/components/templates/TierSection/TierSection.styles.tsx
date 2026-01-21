// Next
import Image from "next/image"

// Theme
import theme from "@/theme"

// MUI
import Grid from "@mui/material/Grid2"
import { styled } from "@mui/material/styles"

export const StyledContainerTierSection = styled(Grid)(() => ({
  minHeight: "80vh",
  paddingTop: "340px",
  paddingBottom: "100px",
  background:
    "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.70) 40%, rgba(255, 255, 255, 1) 100%)",
}))

export const StyledSection = styled(Grid)(() => ({
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
  },
}))

export const StyledTier = styled(Grid)(() => ({
  opacity: 0,
  transform: "translateY(30px)",
  transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
  marginBottom: "40px",

  "&.fade-in": {
    opacity: 1,
    transform: "translateY(0)",
  },

  img: {
    filter: "invert(42%) sepia(87%) saturate(230%) hue-rotate(355deg) brightness(94%) contrast(87%)",
  },
}))

export const StyledTierIcon = styled(Image)(() => ({
  margin: "0 auto 30px",
}))
