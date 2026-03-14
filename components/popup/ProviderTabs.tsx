import { AI_PROVIDERS } from "~constants/ai-providers"
import { cn } from "~lib/utils"

export type ProviderValue = (typeof AI_PROVIDERS)[number]["value"]

type ProviderTabsProps = {
  value: ProviderValue
  onChange: (value: ProviderValue) => void
  label: string
}

export const ProviderTabs = ({ value, onChange, label }: ProviderTabsProps) => {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="grid grid-cols-4 gap-1 bg-secondary p-1 rounded-lg">
        {AI_PROVIDERS.map((provider) => (
          <button
            key={provider.value}
            onClick={() => onChange(provider.value)}
            className={cn(
              "py-1.5 rounded-md text-[11px] font-semibold transition-all",
              value === provider.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}>
            {provider.label}
          </button>
        ))}
      </div>
    </div>
  )
}
