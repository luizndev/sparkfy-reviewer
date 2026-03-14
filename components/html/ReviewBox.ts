import { escapeHTML } from "../../lib/html"
import { renderIssueCard } from "./IssueCard"

interface SeverityCount {
  CRITICAL: number
  HIGH: number
  MEDIUM: number
  LOW: number
  INFO: number
}

const calculateScore = (severities: SeverityCount): number => {
  const weights = { CRITICAL: -20, HIGH: -10, MEDIUM: -5, LOW: -2, INFO: 0 }
  const totalDeduction = 
    severities.CRITICAL * weights.CRITICAL +
    severities.HIGH * weights.HIGH +
    severities.MEDIUM * weights.MEDIUM +
    severities.LOW * weights.LOW
  
  const score = Math.max(0, Math.min(100, 100 + totalDeduction))
  return Math.round(score)
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "#51cf66" // Verde claro
  if (score >= 60) return "#ffa94d" // Amarelo alaranjado
  if (score >= 40) return "#ff6b6b" // Laranja suave
  return "#FF073D" // Primary red do projeto
}

const renderScoreBadge = (score: number, severities: SeverityCount): string => {
  const color = getScoreColor(score)
  const totalIssues = Object.values(severities).reduce((a, b) => a + b, 0)
  
  return `
    <div style="background:linear-gradient(135deg, rgba(255,7,61,0.08) 0%, rgba(255,107,107,0.08) 100%);border:1px solid rgba(255,7,61,0.3);border-radius:12px;padding:16px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="flex:1;">
          <div style="font-size:11px;font-weight:700;color:#FF073D;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Code Quality Score</div>
          <div style="font-size:32px;font-weight:800;color:${color};line-height:1;">${score}<span style="font-size:18px;color:#8b949e;">/100</span></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:10px;">
          ${severities.CRITICAL > 0 ? `<div style="display:flex;align-items:center;gap:4px;background:rgba(255,7,61,0.15);padding:4px 8px;border-radius:6px;border:1px solid rgba(255,7,61,0.3);"><span>🔴</span><span style="color:#FF073D;font-weight:700;">${severities.CRITICAL}</span></div>` : ""}
          ${severities.HIGH > 0 ? `<div style="display:flex;align-items:center;gap:4px;background:rgba(255,107,107,0.15);padding:4px 8px;border-radius:6px;border:1px solid rgba(255,107,107,0.3);"><span>🟠</span><span style="color:#ff6b6b;font-weight:700;">${severities.HIGH}</span></div>` : ""}
          ${severities.MEDIUM > 0 ? `<div style="display:flex;align-items:center;gap:4px;background:rgba(255,169,77,0.15);padding:4px 8px;border-radius:6px;border:1px solid rgba(255,169,77,0.3);"><span>🟡</span><span style="color:#ffa94d;font-weight:700;">${severities.MEDIUM}</span></div>` : ""}
          ${severities.LOW > 0 ? `<div style="display:flex;align-items:center;gap:4px;background:rgba(81,207,102,0.15);padding:4px 8px;border-radius:6px;border:1px solid rgba(81,207,102,0.3);"><span>🟢</span><span style="color:#51cf66;font-weight:700;">${severities.LOW}</span></div>` : ""}
        </div>
      </div>
      <div style="margin-top:12px;font-size:11px;color:#8b949e;">
        ${totalIssues} issue${totalIssues !== 1 ? "s" : ""} encontrado${totalIssues !== 1 ? "s" : ""}
      </div>
    </div>
  `
}

export const renderAIResponse = (text: string): string => {
  let html = ""
  const fileRegex = /\[\[FILE:\s*(.*?)\]\]([\s\S]*?)\[\[END_FILE\]\]/gi
  let match
  let foundAny = false
  
  const severities: SeverityCount = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    INFO: 0
  }

  // First pass: count severities
  let tempText = text
  const severityRegex = /(?:SEVERITY|SEVERIDADE):\s*(CRITICAL|HIGH|MEDIUM|LOW|INFO)/gi
  let severityMatch
  while ((severityMatch = severityRegex.exec(tempText)) !== null) {
    const sev = severityMatch[1].toUpperCase() as keyof SeverityCount
    if (sev in severities) {
      severities[sev]++
    }
  }

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

  if (foundAny) {
    const score = calculateScore(severities)
    const scoreBadge = renderScoreBadge(score, severities)
    return scoreBadge + html
  }

  return `<div style="color:#8b949e;font-size:14px;">${escapeHTML(text)}</div>`
}
