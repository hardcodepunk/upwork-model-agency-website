// InfoPanel.styles.tsx

// Theme
import theme from "@/theme"

// MUI
import { styled } from "@mui/material"

// Properties
import { StyledPanelProps } from "./InfoPanel.props"

export const StyledPanel = styled("div")<StyledPanelProps>(({ progress }) => {
  const fadeInStart = 0.3
  const fadeOutEnd = 0.5

  let opacity
  if (progress <= fadeInStart) {
    opacity = 0
  } else if (progress >= fadeOutEnd) {
    opacity = 0
  } else if (progress > fadeInStart && progress < (fadeInStart + fadeOutEnd) / 2) {
    opacity = (progress - fadeInStart) / ((fadeOutEnd - fadeInStart) / 2)
  } else {
    opacity = (fadeOutEnd - progress) / ((fadeOutEnd - fadeInStart) / 2)
  }

  opacity = Math.max(0, Math.min(1, opacity))

  const translateY = (0.5 - progress) * 100

  return {
    position: "fixed",
    top: "50%",
    right: "5%",
    width: "30%",
    transform: `translateY(-50%) translateY(${translateY}px)`,
    opacity,
    transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
    textAlign: "right",
    zIndex: 10,
    [theme.breakpoints.down("sm")]: {
      width: "54%",
    },
  }
})
