import { escapeHTML, getTypeBadgeColor, parseIssueSection, extractCodeBlocks } from "../../lib/html"
import { renderCodeBlock } from "./CodeBlock"

export const renderIssueCard = (title: string, body: string): string => {
  const typeMatch = body.match(/(?:TYPE|TIPO):\s*(.+)/i)
  const type = typeMatch ? typeMatch[1].trim() : ""
  
  const context = parseIssueSection(body, "(?:CONTEXT[O]?|CONTEXTO)")
  const problem = parseIssueSection(body, "(?:PROBLEM[A]?|PROBLEMA)")
  const solution = parseIssueSection(body, "(?:SOLUTION|SOLU[CÇ][AÃ]O)")
  
  const codeBlocks = extractCodeBlocks(body)
  const beforeCode = codeBlocks[0] || ""
  const afterCode = codeBlocks[1] || ""

  const colors = getTypeBadgeColor(type)
  const typeBadge = type
    ? `<span style="display:inline-block;background:${colors.bg};color:${colors.fg};padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px;">${escapeHTML(type)}</span>`
    : ""

  const sectionHTML = (label: string, content: string, color: string): string => {
    if (!content) return ""
    return `<div style="margin-bottom:12px;">
      <span style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:4px;">${label}</span>
      <p style="font-size:13px;color:${color};margin:0;line-height:1.6;">${escapeHTML(content)}</p>
    </div>`
  }

  return `
    <div style="background:transparent; color:#e6edf3;">
      <div style="margin-bottom:12px;display:flex;align-items:center;gap:8px;">
        <span style="font-weight:700;font-size:14px;color:#e6edf3;flex:1;">${escapeHTML(title)}</span>
        ${typeBadge}
      </div>
      <div style="space-y-3;">
        ${sectionHTML("Context", context || "", "#8b949e")}
        ${sectionHTML("Problem", problem || "", "#f85149")}
        ${sectionHTML("Solution", solution || "", "#3fb950")}
        ${beforeCode ? renderCodeBlock(beforeCode, "Before") : ""}
        ${afterCode ? renderCodeBlock(afterCode, "After (Suggested Fix)") : ""}
      </div>
    </div>
  `
}
