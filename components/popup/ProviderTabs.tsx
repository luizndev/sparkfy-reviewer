import { cn } from "~lib/utils"

const PROVIDERS = [
  { value: "gemini" as const, label: "Gemini" },
  { value: "openai" as const, label: "OpenAI" },
  { value: "claude" as const, label: "Claude" }
]

export type ProviderValue = "gemini" | "openai" | "claude"

export const ProviderTabs = ({
  value,
  onChange,
  label
}: {
  value: ProviderValue
  onChange: (v: ProviderValue) => void
  label: string
}) => {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="grid grid-cols-3 gap-1 bg-secondary p-1 rounded-lg">
        {PROVIDERS.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={cn(
              "py-1.5 rounded-md text-[11px] font-semibold transition-all",
              value === p.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
