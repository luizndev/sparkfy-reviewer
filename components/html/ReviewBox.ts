import { escapeHTML } from "../../lib/html"
import { renderIssueCard } from "./IssueCard"

export const renderAIResponse = (text: string): string => {
  let html = ""
  const fileRegex = /\[\[FILE:\s*(.*?)\]\]([\s\S]*?)\[\[END_FILE\]\]/gi
  let match
  let foundAny = false

  while ((match = fileRegex.exec(text)) !== null) {
    foundAny = true
    const filePath = match[1].trim()
    const content = match[2].trim()

    const splitParts = content.split(/(?=(?:HEADER|CABE[CÇ]ALHO):\s*)/i).filter(p => p.trim())
    let issuesHtml = ""

    for (const part of splitParts) {
      const headerM = part.match(/(?:HEADER|CABE[CÇ]ALHO):\s*(.+)/i)
      if (!headerM) continue
      issuesHtml += renderIssueCard(headerM[1].trim(), part.slice(headerM[0].length))
    }

    if (issuesHtml) {
      html += `
        <div style="margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(255,7,61,0.07);border:1px solid rgba(255,7,61,0.25);border-radius:10px 10px 0 0;border-bottom:none;">
            <span style="font-size:11px;font-weight:700;color:#FF073D;text-transform:uppercase;letter-spacing:.06em;">📄 ${escapeHTML(filePath)}</span>
          </div>
          <div style="border:1px solid rgba(255,7,61,0.15);border-radius:0 0 10px 10px;overflow:hidden;">
            ${issuesHtml}
          </div>
        </div>
      `
    }
  }

  return foundAny ? html : `<div style="color:#8b949e;font-size:14px;">${escapeHTML(text)}</div>`
}
