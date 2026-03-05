import { Play } from "lucide-react"
import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import { Textarea } from "~components/ui/textarea"
import { cn } from "~lib/utils"

interface SettingsFormsProps {
  provider: string
  apiKey: string
  instructions: string
  status: string
  isRunning: boolean
  onApiKeyChange: (key: string) => void
  onInstructionsChange: (instr: string) => void
  onSave: () => void
  onRun: () => void
  labels: {
    apiKey: string
    apiKeyPlaceholder: string
    instructions: string
    instructionsPlaceholder: string
    save: string
    run: string
    running: string
  }
}

export const SettingsForms = ({
  provider,
  apiKey,
  instructions,
  status,
  isRunning,
  onApiKeyChange,
  onInstructionsChange,
  onSave,
  onRun,
  labels
}: SettingsFormsProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-1.5">
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {provider.toUpperCase()} {labels.apiKey}
        </Label>
        <Input
          type="password"
          placeholder={labels.apiKeyPlaceholder}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="bg-input"
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
          className="bg-input"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-border"
          onClick={onSave}>
          {labels.save}
        </Button>
        <Button
          className="flex-1"
          onClick={(e) => {
            e.preventDefault()
            onRun()
          }}
          disabled={isRunning}>
          {isRunning ? (
            <>
              <svg width="14" height="14" className="mr-1.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <path d="M12 19v4M12 1v4"/>
                <path d="M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83"/>
                <path d="M1 12h4M19 12h4"/>
                <path d="M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
              {labels.running}
            </>
          ) : (
            <>
              <Play size={14} className="mr-1.5" />
              {labels.run}
            </>
          )}
        </Button>
      </div>

      {status && (
        <div
          className={cn(
            "text-center text-xs font-medium rounded-lg py-2 px-3 border",
            status.startsWith("Error") || status.startsWith("Err")
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-primary/10 text-primary border-primary/20"
          )}>
          {status}
        </div>
      )}
    </div>
  )
}
