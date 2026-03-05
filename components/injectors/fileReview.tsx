import React, { useState } from "react"
import { createRoot } from "react-dom/client"

import { SPARKFY_ICON } from "../../lib/icons"
import { renderIssueCard } from "../html/IssueCard"
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

const FileReviewAccordion = ({
  filename,
  issuesHtml,
  suggestionsCount
}: {
  filename: string
  issuesHtml: string
  suggestionsCount: number
}) => {
  const [isOpen, setIsOpen] = useState(false)

  React.useEffect(() => {
    initLanguage()
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          padding: "10px 16px",
          background: "rgba(255,7,61,0.08)",
          border: "none",
          cursor: "pointer",
          userSelect: "none",
          transition: "background 0.2s ease",
          borderRadius: "6px"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,7,61,0.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,7,61,0.08)")}
       >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            <svg
            style={{
              width: "14px",
              height: "14px",
              color: "#FF073D",
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>

          <div
            style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: SPARKFY_ICON }}
          />

  

          <span style={{ color: "#FF073D", fontWeight: "700", fontSize: "14px", whiteSpace: "nowrap" }}>
            Sparkfy AI Review: {filename}
          </span>
        </div>

        {/* Lado Direito: Contador de Sugestões */}
        <span style={{ color: "#8b949e", fontSize: "11px", fontWeight: "500", opacity: 0.8, whiteSpace: "nowrap" }}>
          {suggestionsCount} {getTranslation("suggestions")}
        </span>
      </button>

      {isOpen && (
        <div style={{ width: "100%", background: "#0d1117", borderTop: "1px solid rgba(255,7,61,0.1)" }}>
          <div
            style={{ padding: "16px" }}
            dangerouslySetInnerHTML={{ __html: issuesHtml }}
          />
        </div>
      )}
    </>
  )
}

export const injectFileReview = (
  filePath: string,
  content: string
): boolean => {
  initLanguage()
  const filename = filePath.split("/").pop() || filePath

  const allHeaders = [
    ...document.querySelectorAll<HTMLElement>("[data-file-path]")
  ]

  let fileContainer: HTMLElement | null = null
  let fileHeader: HTMLElement | null = null

  for (const h of allHeaders) {
    const headerPath = h.getAttribute("data-file-path") || ""
    if (
      headerPath === filePath ||
      headerPath.endsWith(filePath) ||
      filePath.endsWith(headerPath)
    ) {
      fileHeader = h
      fileContainer = h.closest(
        '.file, .file-holder, [id^="diff-"], [data-file]'
      ) as HTMLElement
      if (fileContainer) {
        break
      }
    }
  }

  if (!fileContainer) {
    console.error(`[Sparkfy] ❌ Container NOT found for ${filePath}`)
    return false
  }

  fileContainer
    .querySelectorAll(".sparkfy-review-box")
    .forEach((el) => el.remove())

  const splitParts = content
    .split(/(?=(?:HEADER|CABE[CÇ]ALHO):\s*)/i)
    .filter((p) => p.trim())

  let issuesHtml = ""
  for (const part of splitParts) {
    const headerMatch = part.match(/(?:HEADER|CABE[CÇ]ALHO):\s*(.+)/i)
    if (!headerMatch) continue

    const issueTitle = headerMatch[1].trim()
    const issueBody = part.slice(headerMatch[0].length)
    const lineMatch = issueBody.match(/(?:LINE|LINHA):\s*(\d+)/i)
    const lineSuffix = lineMatch ? ` (${getTranslation("line")} ${lineMatch[1]})` : ""

    const cardHtml = renderIssueCard(issueTitle + lineSuffix, issueBody)
    issuesHtml += cardHtml
  }

  if (!issuesHtml) {
    console.warn(
      `[Sparkfy] WARNING: No valid suggestions parsed for ${filename}`
    )
    return false
  }

  const reviewDiv = document.createElement("div")
  reviewDiv.style.cssText = `
    margin: 12px 0 20px 0;
    border: 1px solid rgba(255,7,61,0.25);
    border-radius: 8px;
    background: #0d1117;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  `

  const diffContent = fileContainer.querySelector(
    '[data-test-id="diff-container"], [role="table"], .blob-wrapper, .diff-table'
  )

  if (diffContent) {
    diffContent.insertAdjacentElement("beforebegin", reviewDiv)
  } else {
    fileContainer.insertBefore(reviewDiv, fileContainer.firstChild)
  }

  const root = createRoot(reviewDiv)

  root.render(
    <FileReviewAccordion
      filename={filename}
      issuesHtml={issuesHtml}
      suggestionsCount={splitParts.length}
    />
  )
  return true
}
