import { escapeHTML } from "../../lib/html"
import { COPY_ICON } from "../../lib/icons"

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
