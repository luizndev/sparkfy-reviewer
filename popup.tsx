import { useEffect, useState } from "react"
import logoUrl from "url:~assets/logo.svg"
import { i18n } from "~components/popup/i18n"
import { LanguageDropdown, type LangValue } from "~components/popup/LanguageDropdown"
import { ProviderTabs, type ProviderValue } from "~components/popup/ProviderTabs"
import { SettingsForms } from "~components/popup/SettingsForms"

import "./styles/globals.css"

const IndexPopup = () => {
  const [provider, setProvider] = useState<ProviderValue>("gemini")
  const [language, setLanguage] = useState<LangValue>("pt")
  const [keys, setKeys] = useState({ gemini: "", openai: "", claude: "" })
  const [instructions, setInstructions] = useState(
    "Analyze the code for Clean Code, SOLID, Typescript Strict, Security and Performance."
  )
  const [status, setStatus] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const t = i18n[language]

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(
        ["aiProvider", "apiKeys", "reviewInstructions", "language"],
        (result) => {
          if (result.aiProvider) setProvider(result.aiProvider)
          if (result.apiKeys) setKeys(result.apiKeys)
          if (result.reviewInstructions) setInstructions(result.reviewInstructions)
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
        <LanguageDropdown value={language} onChange={setLanguage} />
      </div>

      <div className="space-y-4">
        <div className="px-4 pt-4">
          <ProviderTabs
            value={provider}
            onChange={setProvider}
            label={t.provider}
          />
        </div>

        <SettingsForms
          provider={provider}
          apiKey={keys[provider]}
          instructions={instructions}
          status={status}
          isRunning={isRunning}
          onApiKeyChange={(key) =>
            setKeys((prev) => ({ ...prev, [provider]: key }))
          }
          onInstructionsChange={setInstructions}
          onSave={handleSave}
          onRun={handleRunReview}
          labels={{
            apiKey: t.apiKey,
            apiKeyPlaceholder: t.apiKeyPlaceholder,
            instructions: t.instructions,
            instructionsPlaceholder: t.instructionsPlaceholder,
            save: t.save,
            run: t.run,
            running: t.running
          }}
        />
      </div>

      <div className="px-4 py-2.5 border-t border-border text-center text-[10px] text-muted-foreground">
        Sparkfy Reviewer v0.0.1
      </div>
    </div>
  )
}

export default IndexPopup
