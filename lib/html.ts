export const escapeHTML = (str: string): string =>
  str.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m] || m
  )

export const getTypeBadgeColor = (type: string): { bg: string; fg: string } => {
  const colors: Record<string, { bg: string; fg: string }> = {
    bug: { fg: "#da3633", bg: "#da363322" },
    "clean-code": { fg: "#1f6feb", bg: "#1f6feb22" },
    "clean code": { fg: "#1f6feb", bg: "#1f6feb22" },
    solid: { fg: "#388bfd", bg: "#388bfd22" },
    performance: { fg: "#d29922", bg: "#d2992222" },
    types: { fg: "#3fb950", bg: "#3fb95022" }
  }
  return colors[type.toLowerCase()] || { fg: "#8957e5", bg: "#8957e522" }
}

export const parseIssueSection = (
  body: string,
  pattern: string
): string | null => {
  const regex = new RegExp(
    pattern + ":\\s*([\\s\\S]*?)(?=\\n(?:TYPE|TIPO|CONTEXT|CONTEXTO|PROBLEM|PROBLEMA|SOLUTION|SOLU[CÇ][AÃ]O|C[OÓ]DIGO|CODE|LINE|LINHA|$))",
    "i"
  )
  const match = body.match(regex)
  return match ? match[1].trim() : null
}

export const extractCodeBlocks = (body: string): string[] => {
  const blocks: string[] = []
  body.replace(/```(?:[a-z]+)?\n([\s\S]*?)```/g, (_, code) => {
    blocks.push(code.trim())
    return ""
  })
  return blocks
}
