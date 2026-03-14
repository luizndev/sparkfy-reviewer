import type { PlasmoCSConfig } from "plasmo"

import { injectReviewBox } from "~components/injectors/reviewBox"
import { getGitHubDiff } from "~components/scrapers/github"
import { getGitLabDiff } from "~components/scrapers/gitlab"

export const config: PlasmoCSConfig = {
  matches: [
    "https://github.com/*/pull/*",
    "https://gitlab.com/*/-/merge_requests/*"
  ]
}

const injectTriggerButton = (): void => {
  if (document.getElementById("sparkfy-trigger-btn")) return

  const actions =
    document.querySelector(".gh-header-actions") ||
    document.querySelector(".detail-page-header-actions") ||
    document.querySelector("#partial-discussion-header .gh-header-actions") ||
    document.querySelector(".pr-toolbar .diffbar-item")

  if (!actions) return

  const PLAY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`
  const LOADING_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><path d="M12 19v4M12 1v4"/><path d="M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83"/><path d="M1 12h4M19 12h4"/><path d="M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`

  const btn = document.createElement("button")
  btn.id = "sparkfy-trigger-btn"
  btn.innerHTML = `${PLAY_ICON} <span style="margin-left: 6px;">Run AI Review</span>`
  btn.style.backgroundColor = "#238636"
  btn.style.color = "white"
  btn.style.border = "none"
  btn.style.borderRadius = "6px"
  btn.style.padding = "6px 12px"
  btn.style.fontSize = "14px"
  btn.style.fontWeight = "600"
  btn.style.cursor = "pointer"
  btn.style.marginLeft = "8px"
  btn.style.transition = "background-color 0.2s"
  btn.style.display = "flex"
  btn.style.alignItems = "center"
  btn.style.justifyContent = "center"

  btn.onmouseover = () => (btn.style.backgroundColor = "#2ea043")
  btn.onmouseout = () => (btn.style.backgroundColor = "#238636")

  btn.onclick = async () => {
    btn.disabled = true
    btn.innerHTML = `${LOADING_ICON} <span style="margin-left: 6px;">Fazendo Review</span>`
    btn.style.opacity = "0.7"

    await startAIReview()

    btn.disabled = false
    btn.innerHTML = `${PLAY_ICON} <span style="margin-left: 6px;">Run AI Review</span>`
    btn.style.opacity = "1"
  }

  actions.prepend(btn)
}

const startAIReview = (): void => {
  if (!chrome.runtime?.id) {
    alert(
      "Extension context invalidated. Please refresh the page (F5) to continue using Sparkfy Reviewer."
    )
    return
  }

  chrome.storage.local.get(
    ["aiProvider", "apiKeys", "apiModels", "reviewInstructions", "language"],
    (result) => {
      const {
        aiProvider = "google",
        apiKeys = {},
        apiModels = {},
        reviewInstructions,
        language = "pt"
      } = result
      const apiKey = apiKeys[aiProvider]
      const modelName = apiModels[aiProvider]

      if (!apiKey) {
        alert(
          `Please set your ${aiProvider.toUpperCase()} API Key in the Sparkfy Reviewer extension popup.`
        )
        return
      }

      const diff = window.location.href.includes("gitlab.com")
        ? getGitLabDiff()
        : getGitHubDiff()

      if (!diff || diff.length < 10) {
        alert("No code changes detected to review.")
        return
      }

      const finalInstructions =
        reviewInstructions ||
        "Analyze the code for Clean Code, SOLID, Typescript Strict, Security and Performance."

      injectReviewBox("Analyzing code changes with " + aiProvider + "...", true)

      chrome.runtime.sendMessage(
        {
          type: "RUN_REVIEW",
          payload: {
            diff,
            apiKey,
            instructions: finalInstructions,
            provider: aiProvider,
            language,
            modelName
          }
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Sparkfy Reviewer: Runtime error from background:",
              chrome.runtime.lastError
            )
            injectReviewBox(
              "Error: Extension communication failed. Please refresh (F5)."
            )
            return
          }

          if (response && response.success) {
            injectReviewBox(response.review)
          } else {
            injectReviewBox(
              "AI Review failed: " + (response?.error || "Unknown error")
            )
          }
        }
      )
    }
  )
}

const observer = new MutationObserver(() => {
  if (
    window.location.href.includes("/pull/") ||
    window.location.href.includes("/merge_requests/")
  ) {
    injectTriggerButton()
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "RUN_FROM_POPUP") {
    startAIReview()
    sendResponse({ success: true })
  }
})

observer.observe(document.body, { childList: true, subtree: true })
injectTriggerButton()
