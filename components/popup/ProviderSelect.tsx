import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"
import { useProviderIcon, type ProviderIconName } from "~hooks/useProviderIcon"

const PROVIDERS: { value: ProviderIconName; label: string }[] = [
  { value: "gemini", label: "Gemini" },
  { value: "openai", label: "OpenAI" },
  { value: "claude", label: "Claude" },
  { value: "openrouter", label: "OpenRouter" }
]

export type ProviderValue = ProviderIconName

interface ProviderSelectProps {
  value: ProviderValue
  onChange: (value: ProviderValue) => void
  label: string
}

const ProviderItemIcon = ({ name }: { name: ProviderIconName }) => {
  const { getIcon } = useProviderIcon(name)
  return getIcon("w-4 h-4 text-foreground")
}

export const ProviderSelect = ({
  value,
  onChange,
  label
}: ProviderSelectProps) => {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={(v) => onChange(v as ProviderValue)}>
        <SelectTrigger className="w-full bg-muted/50 border-border rounded-md px-3 py-2 text-[12px] font-medium outline-none h-10 shadow-none">
          <SelectValue placeholder="Select Provider" />
        </SelectTrigger>
        <SelectContent className="bg-muted/50 border-border border backdrop-blur-md">
          {PROVIDERS.map((p) => (
            <SelectItem
              key={p.value}
              value={p.value}
              className="text-[12px] cursor-pointer">
              <div className="flex items-center gap-2">
                <ProviderItemIcon name={p.value} />
                <span className="text-foreground">{p.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
