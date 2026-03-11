import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"
import { cn } from "~lib/utils"

export const MODELS_BY_PROVIDER = {
  gemini: [
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" }
  ],
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "o1-mini", label: "o1 Mini" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" }
  ],
  claude: [
    { value: "claude-3-5-sonnet-20240620", label: "Claude 3.5 Sonnet" },
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" }
  ],
  openrouter: [
    { value: "meta-llama/llama-3-70b-instruct", label: "Llama 3 70B" },
    { value: "google/gemini-pro-1.5", label: "Gemini Pro 1.5 (OR)" },
    { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 (OR)" },
    { value: "mistralai/mistral-large", label: "Mistral Large" }
  ]
}

interface ModelSelectProps {
  provider: keyof typeof MODELS_BY_PROVIDER
  value: string
  onChange: (value: string) => void
  label: string
}

export const ModelSelect = ({
  provider,
  value,
  onChange,
  label
}: ModelSelectProps) => {
  const models = MODELS_BY_PROVIDER[provider] || []

  return (
    <div className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-muted/50 border-border rounded-md px-3 py-2 text-[12px] font-medium outline-none h-10 shadow-none">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent className="bg-muted/50 border-border border backdrop-blur-md">
          {models.map((m) => (
            <SelectItem
              key={m.value}
              value={m.value}
              className="text-[12px] cursor-pointer">
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
