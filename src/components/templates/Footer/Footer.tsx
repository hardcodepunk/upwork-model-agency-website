"use client"

// React
import React from "react"

// MUI
import { Link } from "@mui/material"

// Components
import SocialIcons from "@/components/molecules/SocialIcons/SocialIcons"

// Styles
import { FooterContainer } from "./Footer.styles"

const Footer = () => {
  return (
    <FooterContainer>
      <Link
        href="mailto:mgmt@valhallagirls.com"
        underline="none"
        color="inherit"
        aria-label="Email Valhalla Girls management"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontWeight: "bold",
        }}
      >
        mgmt@valhallagirls.com
      </Link>

      <SocialIcons />
    </FooterContainer>
  )
}

export default Footer
