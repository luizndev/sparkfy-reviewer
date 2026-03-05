import { SPARKFY_ICON } from "../../lib/icons"
import { renderAIResponse } from "../html/ReviewBox"
import { injectFileReview } from "./fileReview"
import { i18n } from "../popup/i18n"

let currentLanguage: keyof typeof i18n = "pt"

const initLanguage = (): void => {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["language"], (result) => {
      currentLanguage = result.language || "pt"
    })
  }
}

const getTranslation = (key: keyof (typeof i18n)["pt"]): string => {
  return i18n[currentLanguage][key] || ""
}

export const setupCopyListener = (): void => {
  if ((window as any)._sparkfy_copy_listener) return

  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest(".sparkfy-copy-btn") as HTMLElement
    if (!target) return

    const code = target.getAttribute("data-code") || ""
    navigator.clipboard.writeText(code).then(() => {
      const orig = target.innerHTML
      target.innerHTML = `<span style="font-size:10px;font-weight:700;color:#FF073D;">Copied!</span>`
      setTimeout(() => { target.innerHTML = orig }, 2000)
    })
  })

  ;(window as any)._sparkfy_copy_listener = true
}

export const setupLoaderStyles = (): void => {
  if (document.getElementById("sparkfy-style")) return

  const style = document.createElement("style")
  style.id = "sparkfy-style"
  style.innerHTML = `
    .sparkfy-loader {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,7,61,0.2);
      border-top: 2px solid #FF073D;
      border-radius: 50%;
      animation: sparkfy-spin 0.8s linear infinite;
      flex-shrink: 0;
    }
    @keyframes sparkfy-spin { to { transform: rotate(360deg); } }
    
    .sparkfy-accordion {
      cursor: pointer;
      user-select: none;
      transition: background 0.2s ease;
    }
    
    .sparkfy-accordion:not(.sparkfy-accordion-disabled):hover {
      background: rgba(255,7,61,0.12) !important;
    }
    
    .sparkfy-accordion-disabled {
      cursor: default !important;
    }
    
    .sparkfy-accordion-icon {
      transition: transform 0.3s ease;
      display: inline-block;
    }
    
    .sparkfy-accordion-icon.open {
      transform: rotate(180deg);
    }
    
    .sparkfy-accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    
    .sparkfy-accordion-content.open {
      max-height: 2000px;
      overflow: visible;
    }
  `
  document.head.appendChild(style)
}

export const injectReviewBox = (text: string, isLoading = false): void => {
  initLanguage()

  let box = document.getElementById("sparkfy-ai-review")
  const container =
    document.querySelector(".gh-header-meta") ||
    document.querySelector(".gh-header") ||
    document.querySelector(".detail-page-header") ||
    document.querySelector("[data-testid='progressive-diffs-list']")?.parentElement

  if (!isLoading && text.includes("[[FILE:")) {
    const fileRegex = /\[\[FILE:\s*(.*?)\]\]([\s\S]*?)\[\[END_FILE\]\]/gi
    let match
    let foundAny = false


    while ((match = fileRegex.exec(text)) !== null) {
      const filePath = match[1].trim()
      const reviewContent = match[2].trim()
      
      const injected = injectFileReview(filePath, reviewContent)
      if (injected) {
        foundAny = true
      } else {
        console.error(`[Sparkfy] ❌ Failed to inject review for: "${filePath}"`)
      }
    }

    if (foundAny) {
    } else {
      console.warn("Sparkfy Reviewer: Per-file injection failed - no files were successfully injected")
    }
  }

  if (!container) {
    console.warn("Sparkfy Reviewer: Container not found for review box")
    return
  }

  if (!box) {
    box = document.createElement("div")
    box.id = "sparkfy-ai-review"
    Object.assign(box.style, {
      background: "#0d1117",
      border: "1px solid rgba(255,7,61,0.25)",
      margin: "10px 0 20px 0",
      borderRadius: "8px",
      color: "#c9d1d9",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      position: "relative",
      zIndex: "100",
      overflow: "hidden"
    })
    container.prepend(box)
  }

  const statusText = isLoading
    ? getTranslation("analyzing")
    : getTranslation("reviewCompleted")

  const accordionId = "sparkfy-accordion-" + Date.now()
  const isOpen = isLoading ? "open" : ""

  const contentHtml = !isLoading && text ? renderAIResponse(text) : ""

  box.innerHTML = `
    <div class="sparkfy-accordion ${isLoading ? "sparkfy-accordion-disabled" : ""}" data-accordion="${accordionId}" style="display:flex;align-items:center;gap:10px;padding:10px 16px;background:rgba(255,7,61,0.08);">
      ${SPARKFY_ICON}
      <div style="flex:1;display:flex;align-items:center;gap:10px;">
        <span style="color:#FF073D;font-weight:700;font-size:14px;white-space:nowrap;">Sparkfy AI Review</span>
        <span style="font-size:12px;color:#8b949e;border-left:1px solid rgba(255,255,255,0.1);padding-left:10px;">${statusText}</span>
      </div>
      ${isLoading ? '<span class="sparkfy-loader"></span>' : ""}
    </div>
  `

  const header = box.querySelector(".sparkfy-accordion") as HTMLElement
  const content = box.querySelector(".sparkfy-accordion-content") as HTMLElement
  const icon = box.querySelector(".sparkfy-accordion-icon") as SVGElement

  if (!isLoading) {
    header.addEventListener("click", () => {
      const isCurrentlyOpen = content.classList.contains("open")
      if (isCurrentlyOpen) {
        content.classList.remove("open")
        icon.classList.remove("open")
      } else {
        content.classList.add("open")
        icon.classList.add("open")
      }
    })
  }

  setupCopyListener()
  setupLoaderStyles()
}
