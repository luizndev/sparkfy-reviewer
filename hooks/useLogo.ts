import logoDark from "url:~assets/logo.svg"
import logoLight from "url:~assets/logotipo.svg"
import { useTheme } from "./useTheme"

export const useLogo = () => {
  const { theme } = useTheme()
  const logoUrl = theme === "dark" ? logoDark : logoLight
  
  return { logoUrl, theme }
}
