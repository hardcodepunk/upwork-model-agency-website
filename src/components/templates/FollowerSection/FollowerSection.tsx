"use client"

// React
import { useEffect, useRef, useState } from "react"

// MUI
import { Typography } from "@mui/material"

// Styles
import { StyledContainer } from "@/app/page.styles"
import {
  StyledContainerFollowerSection,
  StyledSection,
  StyledFollower,
  StyledFollowerCount,
} from "./FollowerSection.styles"

const animateCount = (target: number, duration: number, setter: (val: number) => void) => {
  let start = 0
  const increment = target / (duration / 16)

  const step = () => {
    start += increment
    if (start >= target) {
      setter(target)
    } else {
      setter(Math.floor(start))
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

const FollowerSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [tiktokFollowers, setTiktokFollowers] = useState(0)
  const [instagramFollowers, setInstagramFollowers] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animateCount(700000, 1000, setTiktokFollowers)
          animateCount(855000, 1000, setInstagramFollowers)
          setHasAnimated(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [hasAnimated])

  return (
    <StyledContainerFollowerSection>
      <StyledContainer>
        <StyledSection ref={sectionRef} container spacing={{ xs: 2, md: 4 }}>
          <StyledFollower item md={6} className={hasAnimated ? "fade-in" : ""}>
            <Typography color="secondary" variant="h3">
              You&apos;ll be exposed to
            </Typography>
            <StyledFollowerCount>{tiktokFollowers.toLocaleString("de-DE")}</StyledFollowerCount>
            <Typography color="secondary" variant="h3">
              TikTok followers
            </Typography>
          </StyledFollower>
          <StyledFollower item md={6} className={hasAnimated ? "fade-in" : ""}>
            <Typography color="secondary" variant="h3">
              You&apos;ll be exposed to
            </Typography>
            <StyledFollowerCount>{instagramFollowers.toLocaleString("de-DE")}</StyledFollowerCount>
            <Typography color="secondary" variant="h3">
              Instagram followers
            </Typography>
          </StyledFollower>
        </StyledSection>
      </StyledContainer>
    </StyledContainerFollowerSection>
  )
}

export default FollowerSection

