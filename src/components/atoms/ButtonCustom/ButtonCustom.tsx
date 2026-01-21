import React from "react"
import { ButtonProps } from "@mui/material"
import { StyledButton } from "./ButtonCustom.styles"

type AnchorExtras = React.AnchorHTMLAttributes<HTMLAnchorElement>
type ButtonCustomProps = ButtonProps & Pick<AnchorExtras, "target" | "rel" | "href">

const ButtonCustom = (props: ButtonCustomProps) => {
  return <StyledButton {...props} />
}

export default ButtonCustom
