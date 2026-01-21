"use client"

// React
import { useEffect, useRef, useState } from "react"

// MUI
import { Typography } from "@mui/material"

// Styles
import { StyledContainerTierSection, StyledSection, StyledTier, StyledTierIcon } from "./TierSection.styles"
import { StyledContainer } from "@/app/page.styles"

const TierSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [fadeInIndex, setFadeInIndex] = useState(0)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setFadeInIndex(prev => {
        if (prev >= 3) return prev
        return prev + 1
      })
    }, 300)
    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <StyledContainerTierSection>
      <StyledContainer>
        <StyledSection ref={sectionRef} container spacing={{ xs: 2, md: 4 }}>
          <StyledTier size={{ xs: 12, sm: 6, md: 4 }} className={fadeInIndex >= 1 ? "fade-in" : ""}>
            <StyledTierIcon src="/icons/icon__tier.svg" alt="Gold Tier 1" width={50} height={70} />
            <Typography color="secondary" variant="h3">
              Tailored Content Strategy
            </Typography>
            <Typography color="primary" variant="body1">
              Our experts design a personalized plan just for you. We determine the ideal content, posting schedule, and
              messaging that work best to build your brand and make your impact felt.
            </Typography>
          </StyledTier>

          <StyledTier size={{ xs: 12, sm: 6, md: 4 }} className={fadeInIndex >= 2 ? "fade-in" : ""}>
            <StyledTierIcon src="/icons/icon__tier.svg" alt="Silver Tier 2" width={50} height={70} />
            <Typography color="secondary" variant="h3">
              Massive Platform Reach
            </Typography>
            <Typography color="primary" variant="body1">
              With our dominant presence on Instagram and TikTok, your content is automatically showcased to millions.
              We ensure that every post finds its perfect audience without you having to lift a finger.
            </Typography>
          </StyledTier>

          <StyledTier size={{ xs: 12, sm: 6, md: 4 }} className={fadeInIndex >= 3 ? "fade-in" : ""}>
            <StyledTierIcon src="/icons/icon__tier.svg" alt="Bronze Tier 3" width={50} height={70} />
            <Typography color="secondary" variant="h3">
              Effortless Growth and Earnings
            </Typography>
            <Typography color="primary" variant="body1">
              Imagine earning more while working less. Our comprehensive management means you can focus on what you
              love—while we drive your brand’s growth, boost your visibility, and create lucrative opportunities.
            </Typography>
          </StyledTier>
        </StyledSection>
      </StyledContainer>
    </StyledContainerTierSection>
  )
}

export default TierSection
