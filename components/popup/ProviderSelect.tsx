import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"
import { AI_PROVIDERS } from "~constants/ai-providers"
import { useProviderIcon, type ProviderIconName } from "~hooks/useProviderIcon"

export type ProviderValue = (typeof AI_PROVIDERS)[number]["value"]

interface ProviderSelectProps {
  value: ProviderValue
  onChange: (value: ProviderValue) => void
  label: string
}

function ProviderItemIcon({ name }: { name: ProviderIconName }) {
  const { getIcon } = useProviderIcon(name)
  return getIcon("w-4 h-4 text-foreground")
}

export function ProviderSelect({
  value = "google",
  onChange,
  label
}: ProviderSelectProps) {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as ProviderValue)}>
        <SelectTrigger className="w-full bg-muted/50 border-border rounded-md px-3 py-2 text-[12px] font-medium outline-none h-10 shadow-none">
          <SelectValue placeholder="Select Provider" />
        </SelectTrigger>
        <SelectContent className="bg-muted/50 border-border border backdrop-blur-md">
          {AI_PROVIDERS.map((provider) => (
            <SelectItem
              key={provider.value}
              value={provider.value}
              className="text-[12px] cursor-pointer">
              <div className="flex items-center gap-2">
                <ProviderItemIcon name={provider.value} />
                <span className="text-foreground">{provider.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
