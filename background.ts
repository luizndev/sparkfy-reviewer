import { reviewCode } from "./services/ai"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "RUN_REVIEW") {
    const { diff, apiKey, instructions, provider, language } = message.payload


    if (sender.tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: () => {
        }
      })
    }

    reviewCode(apiKey, diff, instructions, provider, language)
      .then((review) => {
        sendResponse({ success: true, review })
      })
      .catch((error) => {
        console.error("Sparkfy Reviewer Background: Review failed", error)
        sendResponse({ success: false, error: error.message })
      })

    return true
  }
})

