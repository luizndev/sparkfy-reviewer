import { escapeHTML } from "../../lib/html"
import { COPY_ICON } from "../../lib/icons"

// Renderiza código com estilo diff unificado (GitHub style)
export const renderDiffBlock = (beforeCode: string, afterCode: string): string => {
  if (!beforeCode && !afterCode) return ""
  
  console.log('[Sparkfy] renderDiffBlock called with:', { 
    beforeLength: beforeCode?.length, 
    afterLength: afterCode?.length 
  })
  
  const beforeLines = beforeCode ? beforeCode.split('\n').filter(line => line.trim()) : []
  const afterLines = afterCode ? afterCode.split('\n').filter(line => line.trim()) : []
  
  console.log('[Sparkfy] Lines parsed:', { beforeLines: beforeLines.length, afterLines: afterLines.length })
  
  let diffHTML = ""
  
  // Adiciona linhas removidas (before)
  if (beforeLines.length > 0) {
    beforeLines.forEach(line => {
      diffHTML += `<div style="display:flex;background:#3d1319;border-left:3px solid #f85149;">
        <span style="padding:2px 10px;color:#8b949e;font-size:11px;min-width:40px;text-align:right;user-select:none;background:#1c1118;">−</span>
        <span style="padding:2px 12px;color:#f85149;flex:1;">${escapeHTML(line)}</span>
      </div>`
    })
  }
  
  // Adiciona linhas adicionadas (after)
  if (afterLines.length > 0) {
    afterLines.forEach(line => {
      diffHTML += `<div style="display:flex;background:#1b2b1a;border-left:3px solid #3fb950;">
        <span style="padding:2px 10px;color:#8b949e;font-size:11px;min-width:40px;text-align:right;user-select:none;background:#0d1a0c;">+</span>
        <span style="padding:2px 12px;color:#3fb950;flex:1;">${escapeHTML(line)}</span>
      </div>`
    })
  }
  
  if (!diffHTML) {
    console.warn('[Sparkfy] No diff HTML generated!')
    return ""
  }
  
  return `
    <div style="border:1px solid #30363d;border-radius:6px;overflow:hidden;margin-top:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#161b22;border-bottom:1px solid #30363d;">
        <span style="font-size:11px;font-weight:600;color:#8b949e;">💡 Código Sugerido (Diff)</span>
        <button class="sparkfy-copy-btn" data-code="${escapeHTML(afterCode || beforeCode)}" title="Copiar código sugerido" style="background:#21262d;border:1px solid #30363d;border-radius:6px;cursor:pointer;color:#c9d1d9;display:flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;transition:all .15s;">
          ${COPY_ICON}
        </button>
      </div>
      <div style="font-size:12px;font-family:ui-monospace,'SF Mono',Menlo,Monaco,Consolas,monospace;background:#0d1117;overflow-x:auto;">
        ${diffHTML}
      </div>
    </div>
  `
}

// Fallback para renderizar código simples quando não há diff
export const renderCodeBlock = (code: string, label: string): string => `
  <div style="border:1px solid #30363d;border-radius:6px;overflow:hidden;margin-top:8px;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:#161b22;border-bottom:1px solid #30363d;">
      <span style="font-size:11px;font-weight:600;color:#8b949e;">${label}</span>
      <button class="sparkfy-copy-btn" data-code="${escapeHTML(code)}" title="Copy" style="background:#21262d;border:1px solid #30363d;border-radius:6px;cursor:pointer;color:#c9d1d9;display:flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;transition:all .15s;">
        ${COPY_ICON}
      </button>
    </div>
    <pre style="margin:0;padding:12px 16px;overflow-x:auto;font-size:12px;color:#e6edf3;background:#0d1117;line-height:1.5;font-family:ui-monospace,'SF Mono',Menlo,monospace;"><code>${escapeHTML(code)}</code></pre>
  </div>
`
