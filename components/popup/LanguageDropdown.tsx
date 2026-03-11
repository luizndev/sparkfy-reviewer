import { Check, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import enIcon from "url:~assets/language/en.svg"
import esIcon from "url:~assets/language/es.svg"
import ptIcon from "url:~assets/language/pt.svg"

import { cn } from "~lib/utils"

const LANGUAGES = [
  { value: "en" as const, label: "English", icon: enIcon },
  { value: "pt" as const, label: "Português", icon: ptIcon },
  { value: "es" as const, label: "Español", icon: esIcon }
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
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border bg-muted/50 text-sm text-foreground hover:bg-accent transition-colors h-8">
        <img
          src={current.icon}
          alt={current.label}
          className="w-5 h-4 object-cover rounded-[2px]"
        />
        <span className="font-medium text-[11px] uppercase tracking-wider">
          {current.value}
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
        <div className="absolute right-0 top-full mt-1.5 w-40 rounded-lg border border-border bg-muted/50 shadow-xl overflow-hidden z-[9999] backdrop-blur-md">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                onChange(lang.value)
                setOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent/50",
                value === lang.value
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground"
              )}>
              <img
                src={lang.icon}
                alt={lang.label}
                className="w-5 h-4 object-cover rounded-[2px]"
              />
              <span className="flex-1 text-left font-medium text-[12px]">
                {lang.label}
              </span>
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
