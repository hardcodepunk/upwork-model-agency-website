"use client"

// Components
import ButtonCustom from "@/components/atoms/ButtonCustom/ButtonCustom"

// Styles
import { StyledContainerCtaSection } from "./CtaSection.styles"

// Properties
import { CtaSectionProps } from "./CtaSection.props"

export function CtaSection({ setIsOpen }: CtaSectionProps) {
  return (
    <StyledContainerCtaSection>
      <ButtonCustom onClick={() => setIsOpen(true)}>Apply now</ButtonCustom>
    </StyledContainerCtaSection>
  )
}

export default CtaSection
