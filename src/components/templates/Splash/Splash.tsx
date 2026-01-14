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
import BookCallButton from "@/components/atoms/BookCallButton/BookCallButton"

const Splash = () => {
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
          <BookCallButton />
        </StyledSplashBodyRight>
      </StyledSplashBody>
    </StyledSplash>
  )
}

export default Splash
