"use client"

import ButtonCustom from "@/components/atoms/ButtonCustom/ButtonCustom"
import { CALENDLY_APPLY_URL } from "@/lib/links"

const BookCallButton = () => {
  return (
    <ButtonCustom onClick={() => window.open(CALENDLY_APPLY_URL, "_blank", "noopener,noreferrer")}>
      Apply now
    </ButtonCustom>
  )
}

export default BookCallButton
