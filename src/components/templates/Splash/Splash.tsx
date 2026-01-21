// MUI
import { Typography } from "@mui/material"
import {
  StyledSplash,
  StyledSplashBody,
  StyledSplashBodyLeft,
  StyledSplashBodyLeftEmphasis,
  StyledSplashBodyRight,
  StyledSplashBodyRightEmphasis,
} from "./Splash.styles"

// Components
import MainNav from "@/components/organisms/MainNav/MainNav"
import ButtonCustom from "@/components/atoms/ButtonCustom/ButtonCustom"

// Properties
import { SplashProps } from "./Splash.props"

const Splash = ({ setIsOpen }: SplashProps) => {
  return (
    <StyledSplash>
      <MainNav />
      <Typography color="primary" variant="h1">
        Valhalla Girls
      </Typography>
      <StyledSplashBody>
        <StyledSplashBodyLeft>
          Become a
          <StyledSplashBodyLeftEmphasis>
            Valhalla Girl
            <br />
          </StyledSplashBodyLeftEmphasis>
          and enter today
        </StyledSplashBodyLeft>
        <StyledSplashBodyRight>
          Accepting only <StyledSplashBodyRightEmphasis>a select number</StyledSplashBodyRightEmphasis> of models
          <ButtonCustom onClick={() => setIsOpen(true)}>Become Valhalla girl</ButtonCustom>
        </StyledSplashBodyRight>
      </StyledSplashBody>
    </StyledSplash>
  )
}

export default Splash
