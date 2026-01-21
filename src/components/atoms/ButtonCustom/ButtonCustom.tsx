// Styles
import { StyledButton } from "./ButtonCustom.styles"

type ButtonCustomProps = React.ComponentProps<typeof StyledButton>

const ButtonCustom = (props: ButtonCustomProps) => {
  return <StyledButton {...props} />
}

export default ButtonCustom
