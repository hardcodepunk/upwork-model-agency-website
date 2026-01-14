"use client"

// Components
import BookCallButton from "@/components/atoms/BookCallButton/BookCallButton"

// Styles
import { StyledContainerCtaSection } from "./CtaSection.styles"

export function CtaSection() {
  return (
    <StyledContainerCtaSection>
      <BookCallButton />
    </StyledContainerCtaSection>
  )
}

export default CtaSection
