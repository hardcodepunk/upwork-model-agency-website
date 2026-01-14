import Link from "next/link"
import Image from "next/image"
import IconButton from "@mui/material/IconButton"
import { IconButtonCustomProps } from "./IconButtonCustom.props"

const IconButtonCustom = ({ iconSrc, href, ...props }: IconButtonCustomProps & { href?: string }) => {
  if (href) {
    return (
      <IconButton component={Link} href={href} disableRipple color="primary" {...props}>
        {iconSrc ? <Image src={iconSrc} alt={props["aria-label"] || "icon"} width={24} height={24} /> : null}
      </IconButton>
    )
  }

  return (
    <IconButton disableRipple color="primary" {...props}>
      {iconSrc ? <Image src={iconSrc} alt={props["aria-label"] || "icon"} width={24} height={24} /> : null}
    </IconButton>
  )
}

export default IconButtonCustom
