"use client"

// React
import React, { useEffect, useState } from "react"

// MUI
import Typography from "@mui/material/Typography"

// Styles
import { StyledPanel } from "./InfoPanel.styles"

// Components
import BookCallButton from "@/components/atoms/BookCallButton/BookCallButton"

function InfoPanel() {
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = () => {
    const totalScroll = document.body.scrollHeight - window.innerHeight
    const currentScroll = window.scrollY
    const progress = currentScroll / totalScroll

    const clampedProgress = Math.min(Math.max(progress, 0), 1)
    setScrollProgress(clampedProgress)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <StyledPanel progress={scrollProgress}>
      <Typography variant="h2">
        Work less,<br></br>get paid more
      </Typography>
      <BookCallButton />
    </StyledPanel>
  )
}

export default InfoPanel
