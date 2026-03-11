import { reviewCode } from "./services/ai"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "RUN_REVIEW") {
    const { diff, apiKey, instructions, provider, language, modelName } = message.payload

    reviewCode(apiKey, diff, instructions, provider, language, modelName)
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

