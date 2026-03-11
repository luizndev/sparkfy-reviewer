import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import {
  ModelSelect,
  type MODELS_BY_PROVIDER
} from "~components/ui/ModelSelect"
import { Textarea } from "~components/ui/textarea"

interface SettingsFormsProps {
  provider: keyof typeof MODELS_BY_PROVIDER
  apiKey: string
  model: string
  instructions: string
  onApiKeyChange: (key: string) => void
  onModelChange: (model: string) => void
  onInstructionsChange: (instr: string) => void
  onSave: () => void
  labels: {
    apiKey: string
    apiKeyPlaceholder: string
    instructions: string
    instructionsPlaceholder: string
    save: string
    model: string
  }
}

export const SettingsForms = ({
  provider,
  apiKey,
  model,
  instructions,
  onApiKeyChange,
  onModelChange,
  onInstructionsChange,
  onSave,
  labels
}: SettingsFormsProps) => {
  return (
    <div className="px-4 pb-4 space-y-4">
      <ModelSelect
        provider={provider}
        value={model}
        onChange={onModelChange}
        label={labels.model}
      />

      <div className="space-y-1.5">
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {provider.toUpperCase()} {labels.apiKey}
        </Label>
        <Input
          type="password"
          placeholder={labels.apiKeyPlaceholder}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="bg-muted/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {labels.instructions}
        </Label>
        <Textarea
          placeholder={labels.instructionsPlaceholder}
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          rows={3}
          className="bg-muted/50 resize-none"
        />
      </div>

      <Button className="w-full" onClick={onSave}>
        {labels.save}
      </Button>
    </div>
  )
}
