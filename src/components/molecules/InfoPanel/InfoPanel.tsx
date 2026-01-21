"use client"

// React
import React, { useEffect, useState } from "react"

// MUI
import Typography from "@mui/material/Typography"

// Styles
import { StyledPanel } from "./InfoPanel.styles"

// Components
import ButtonCustom from "@/components/atoms/ButtonCustom/ButtonCustom"
import { InfoPanelProps } from "./InfoPanel.props"

const InfoPanel = ({ setIsOpen }: InfoPanelProps) => {
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
      <ButtonCustom onClick={() => setIsOpen(true)}>Become Valhalla girl</ButtonCustom>
    </StyledPanel>
  )
}

export default InfoPanel
