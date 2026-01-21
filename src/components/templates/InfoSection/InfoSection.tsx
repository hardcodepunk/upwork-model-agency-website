"use client"

// Components
import InfoPanel from "@/components/molecules/InfoPanel/InfoPanel"

// Styles
import { StyledSection } from "./InfoSection.styles"

// Properties
import { InfoSectionProps } from "./InfoSection.props"

const InfoSection = ({ setIsOpen }: InfoSectionProps) => {
  return (
    <StyledSection>
      <InfoPanel setIsOpen={setIsOpen} />
    </StyledSection>
  )
}

export default InfoSection
