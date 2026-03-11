import { Moon, Sun } from "lucide-react"

import { useTheme } from "~hooks/useTheme"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-muted/50 text-foreground hover:bg-accent transition-colors duration-200"
      aria-label="Toggle Theme">
      {theme === "light" ? (
        <Sun
          size={14}
          className="text-primary animate-in zoom-in-50 duration-300"
        />
      ) : (
        <Moon
          size={14}
          className="text-primary animate-in zoom-in-50 duration-300"
        />
      )}
    </button>
  )
}
