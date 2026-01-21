"use client"

// React
import { useState } from "react"

// Components
import Splash from "@/components/templates/Splash/Splash"
import InfoSection from "@/components/templates/InfoSection/InfoSection"
import TierSection from "@/components/templates/TierSection/TierSection"
import AnimatedFixedLogo from "@/components/molecules/AnimatedFixedLogo/AnimatedFixedLogo"
import Footer from "@/components/templates/Footer/Footer"
import BackgroundFrames from "@/components/atoms/BackgroundFrames/BackgroundFrames"
import CtaSection from "@/components/templates/CtaSection/CtaSection"
import FollowerSection from "@/components/templates/FollowerSection/FollowerSection"
import ModalForm from "@/components/organisms/Form/ModalForm"

// Styles
import { StyledContainer } from "./page.styles"

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <StyledContainer>
        <AnimatedFixedLogo />
        <BackgroundFrames />
        <Splash setIsOpen={setIsOpen} />
        <InfoSection setIsOpen={setIsOpen} />
      </StyledContainer>

      <FollowerSection />
      <TierSection />
      <CtaSection setIsOpen={setIsOpen} />
      <ModalForm open={isOpen} handleClose={() => setIsOpen(false)} />
      <Footer />
    </>
  )
}
