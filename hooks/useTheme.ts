import { useEffect, useState } from "react"

export type Theme = "light" | "dark"

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    // Initial load
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["theme"], (result) => {
        const savedTheme = result.theme || "dark"
        setTheme(savedTheme)
        updateDOM(savedTheme)
      })

      // Listen for changes from other components/popups
      const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        if (changes.theme) {
          setTheme(changes.theme.newValue)
          updateDOM(changes.theme.newValue)
        }
      }

      chrome.storage.onChanged.addListener(handleStorageChange)
      return () => chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  const updateDOM = (t: Theme) => {
    if (t === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    updateDOM(newTheme)
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ theme: newTheme })
    }
  }

  return { theme, toggleTheme }
}
