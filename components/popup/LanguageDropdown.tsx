import { Check, ChevronDown, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "~lib/utils"

const LANGUAGES = [
  { value: "en" as const, label: "English", flag: "🇺🇸" },
  { value: "pt" as const, label: "Português", flag: "🇧🇷" },
  { value: "es" as const, label: "Español", flag: "🇪🇸" }
]

export type LangValue = "en" | "pt" | "es"

export const LanguageDropdown = ({
  value,
  onChange
}: {
  value: LangValue
  onChange: (v: LangValue) => void
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find((l) => l.value === value)!

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-secondary text-sm text-foreground hover:bg-accent transition-colors">
        <Globe size={13} className="text-primary" />
        <span className="font-medium text-xs uppercase tracking-wide">
          {current.value.toUpperCase()}
        </span>
        <ChevronDown
          size={12}
          className={cn(
            "transition-transform text-muted-foreground",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                onChange(lang.value)
                setOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-accent",
                value === lang.value
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}>
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-left font-medium">{lang.label}</span>
              {value === lang.value && (
                <Check size={14} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
