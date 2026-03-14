import { memo, useEffect, useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"
import { AI_MODELS } from "~constants/ai-models"

import { Combobox } from "./combobox"

const { openrouter, ...modelsWithoutOpenRouter } = AI_MODELS
export const MODELS_BY_PROVIDER = modelsWithoutOpenRouter
interface ModelSelectProps {
  provider: keyof typeof AI_MODELS
  value: string
  onChange: (value: string) => void
  label: string
}

export const ModelSelect = ({
  provider = "google",
  value,
  onChange,
  label
}: ModelSelectProps) => {
  const [openRouterModels, setOpenRouterModels] = useState<string[]>([])

  async function fetchOpenRouterModels() {
    const response = await openrouter()
    setOpenRouterModels(response)
  }

  useEffect(() => {
    fetchOpenRouterModels()
  }, [])

  if (provider == "openrouter") {
    return (
      <OpenRouterModelSelect
        value={value}
        onChange={onChange}
        label={label}
        models={openRouterModels}
      />
    )
  }

  const models = MODELS_BY_PROVIDER[provider] || []

  return (
    <div className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-muted/50 border-border rounded-md px-3 py-2 text-[12px] font-medium outline-none h-10 shadow-none">
          <SelectValue placeholder="Select a Model..." />
        </SelectTrigger>
        <SelectContent className="bg-muted/50 border-border border backdrop-blur-md">
          {models.map((model) => (
            <SelectItem
              key={model}
              value={model}
              className="text-[12px] cursor-pointer">
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface OpenRouterModelSelectProps
  extends Omit<ModelSelectProps, "provider"> {
  models: string[]
}

const OpenRouterModelSelect = memo(
  ({ value, onChange, label, models }: OpenRouterModelSelectProps) => {
    return (
      <div className="flex flex-col space-y-1.5">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Combobox
          items={models}
          value={value}
          onChange={onChange}
          placeholder="Select a model..."
        />
      </div>
    )
  }
)
