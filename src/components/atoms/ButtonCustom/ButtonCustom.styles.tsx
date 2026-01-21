import { Button } from "@mui/material"
import { styled } from "@mui/material/styles"

export const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: "Norse, Arial, sans-serif",
  fontSize: "22px",
  fontWeight: "800",
  borderRadius: "50px",
  background: theme.palette.secondary.main,
  padding: "10px 40px",
  transition: "all 0.2s ease-in-out",
  marginTop: "20px",
  "&:hover": {
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
}))
