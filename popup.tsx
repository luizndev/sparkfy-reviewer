import { ClipboardList, Play, Settings } from "lucide-react"
import { useEffect, useState } from "react"

import { i18n } from "~components/popup/i18n"
import {
  LanguageDropdown,
  type LangValue
} from "~components/popup/LanguageDropdown"
import {
  ProviderSelect,
  type ProviderValue
} from "~components/popup/ProviderSelect"
import { SettingsForms } from "~components/popup/SettingsForms"
import { ThemeToggle } from "~components/popup/ThemeToggle"
import { Button } from "~components/ui/button"
import { useLogo } from "~hooks/useLogo"
import { cn } from "~lib/utils"

import "./styles/globals.css"

import { AI_MODELS } from "~constants/ai-models"

const IndexPopup = () => {
  const { logoUrl } = useLogo()
  const [activeTab, setActiveTab] = useState<"reviewer" | "config">("reviewer")
  const [provider, setProvider] = useState<ProviderValue>("google")
  const [language, setLanguage] = useState<LangValue>("pt")
  const [keys, setKeys] = useState({
    google: "",
    openai: "",
    anthropic: "",
    openrouter: ""
  })
  const [models, setModels] = useState({
    google: AI_MODELS.google[0],
    openai: AI_MODELS.openai[0],
    anthropic: AI_MODELS.anthropic[0],
    openrouter: ""
  })
  const [instructions, setInstructions] = useState(
    "Analyze the code for Clean Code, SOLID, Typescript Strict, Security and Performance. Focused on Senior JS/TS Engineer persona."
  )
  const [status, setStatus] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const t = i18n[language]

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(
        [
          "aiProvider",
          "apiKeys",
          "apiModels",
          "reviewInstructions",
          "language"
        ],
        (result) => {
          if (result.aiProvider) setProvider(result.aiProvider)
          if (result.apiKeys) setKeys({ ...keys, ...result.apiKeys })
          if (result.apiModels) setModels({ ...models, ...result.apiModels })
          if (result.reviewInstructions)
            setInstructions(result.reviewInstructions)
          if (result.language) setLanguage(result.language)
        }
      )
    }
  }, [])

  const handleSave = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set(
        {
          aiProvider: provider,
          apiKeys: keys,
          apiModels: models,
          reviewInstructions: instructions,
          language
        },
        () => {
          setStatus(t.saved)
          setTimeout(() => setStatus(""), 2000)
        }
      )
    }
  }

  const handleRunReview = () => {
    setIsRunning(true)
    setStatus("")
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (!activeTab?.id) {
        setStatus(t.noTab)
        setIsRunning(false)
        return
      }
      const url = activeTab.url || ""
      if (!url.includes("/pull/") && !url.includes("/merge_requests/")) {
        setStatus(t.notPR)
        setIsRunning(false)
        return
      }
      chrome.tabs.sendMessage(
        activeTab.id,
        { type: "RUN_FROM_POPUP" },
        (response) => {
          setIsRunning(false)
          if (chrome.runtime.lastError || !response?.success) {
            setStatus(t.errorRefresh)
          } else {
            setStatus(t.reviewStarted)
          }
          setTimeout(() => setStatus(""), 3000)
        }
      )
    })
  }

  return (
    <div className="w-[320px] bg-background text-foreground flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="Sparkfy" className="h-6 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageDropdown value={language} onChange={setLanguage} />
        </div>
      </div>

      <div className="flex bg-muted/50 p-1 mx-4 mt-4 rounded-lg border border-border">
        <button
          onClick={() => setActiveTab("reviewer")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[12px] font-semibold transition-all",
            activeTab === "reviewer"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}>
          <ClipboardList size={14} />
          {(t as any).tabReviewer}
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[12px] font-semibold transition-all",
            activeTab === "config"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}>
          <Settings size={14} />
          {(t as any).tabConfig}
        </button>
      </div>

      <div className="flex-1 overflow-visible">
        {activeTab === "reviewer" ? (
          <div className="p-4 space-y-4">
            <div className="bg-secondary/30 rounded-xl p-6 border border-border flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Play className="text-primary w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight">
                  Sparkfy AI Review
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed px-4">
                  {t.analyzing}
                </p>
              </div>
              <Button
                className="w-full h-10 font-bold"
                onClick={handleRunReview}
                disabled={isRunning}>
                {isRunning ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      className="mr-1.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <path d="M12 19v4M12 1v4" />
                      <path d="M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83" />
                      <path d="M1 12h4M19 12h4" />
                      <path d="M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                    </svg>
                    {t.running}
                  </>
                ) : (
                  <>
                    <Play size={14} className="mr-1.5" />
                    {t.run}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="px-4 pt-4">
              <ProviderSelect
                value={provider}
                onChange={setProvider}
                label={t.provider}
              />
            </div>

            <SettingsForms
              provider={provider}
              apiKey={keys[provider]}
              model={models[provider]}
              instructions={instructions}
              onApiKeyChange={(key) =>
                setKeys((prev) => ({ ...prev, [provider]: key }))
              }
              onModelChange={(model) =>
                setModels((prev) => ({ ...prev, [provider]: model }))
              }
              onInstructionsChange={setInstructions}
              onSave={handleSave}
              labels={{
                apiKey: t.apiKey,
                apiKeyPlaceholder: t.apiKeyPlaceholder,
                instructions: t.instructions,
                instructionsPlaceholder: t.instructionsPlaceholder,
                save: t.save,
                model: (t as any).model
              }}
            />
          </div>
        )}
      </div>

      {status && (
        <div className="px-4 pb-4">
          <div
            className={cn(
              "text-center text-xs font-medium rounded-lg py-2.5 px-3 border animate-in fade-in slide-in-from-top-1",
              status.startsWith("Error") ||
                status.startsWith("Erro") ||
                status.startsWith("Sem") ||
                status.startsWith("Não")
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-primary/10 text-primary border-primary/20"
            )}>
            {status}
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border text-center text-[10px] text-muted-foreground bg-card/50">
        Sparkfy Reviewer v0.0.2
      </div>
    </div>
  )
}

export default IndexPopup
