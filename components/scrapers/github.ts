export const getGitHubDiff = (): string => {

  let fileBlocks = Array.from(document.querySelectorAll(
    'div[id^="diff-"], .file.js-file, [data-details-container-group="file"], .Diff-module__diff__rx9XH'
  ))

  fileBlocks = [...new Set(fileBlocks)]

  let fullDiff = ""

  fileBlocks.forEach((block, index) => {
    const nameSelectors = [
      'h3.DiffFileHeader-module__file-name__VVXpg a',
      'h3[id^="heading-"] a',
      '.file-header .file-info a',
      'a.Link--primary',
      '[data-file-path]'
    ]

    let fileName = ""
    for (const selector of nameSelectors) {
      const el = block.querySelector(selector) || (selector.startsWith('[') ? block : null)
      if (el) {
        fileName = el.getAttribute('data-file-path') || el.textContent?.trim() || ""
        if (fileName) break
      }
    }
    fileName = fileName || `Unknown File ${index + 1}`

    const rows = block.querySelectorAll('tr.diff-line-row, .js-file-line-container .js-file-line')
    let fileDiff = ""

    rows.forEach(row => {
      const textElement = row.querySelector('.diff-text-inner') || row.querySelector('.blob-code-inner') || row
      let text = (textElement as HTMLElement).innerText || ""
      
      const isAddition = row.querySelector('.addition') || row.classList.contains('blob-code-addition')
      const isDeletion = row.querySelector('.deletion') || row.classList.contains('blob-code-deletion')

      if (isAddition) {
        fileDiff += "+ " + text.replace(/^\+/, "") + "\n"
      } else if (isDeletion) {
        fileDiff += "- " + text.replace(/^-/, "") + "\n"
      } else {
        fileDiff += "  " + text + "\n"
      }
    })

    if (fileDiff) {
      console.log(`[Sparkfy] Captured code for ${fileName}:`, fileDiff)
      fullDiff += `FILE: ${fileName}\n`
      fullDiff += fileDiff
      fullDiff += "--------------------------------------------------\n\n"
    }
  })

  if (!fullDiff || fullDiff.length < 10) {
    console.warn("Sparkfy Reviewer: High-level scraping failed. Trying raw text fallback...")
    const additions = document.querySelectorAll('.addition, .blob-code-addition')
    const deletions = document.querySelectorAll('.deletion, .blob-code-deletion')

    if (additions.length > 0 || deletions.length > 0) {
      fullDiff = "FILE: Partial Scrape (Fallback)\n"
      deletions.forEach(d => fullDiff += "- " + (d as HTMLElement).innerText.replace(/^[\s+-]+/, "") + "\n")
      additions.forEach(a => fullDiff += "+ " + (a as HTMLElement).innerText.replace(/^[\s+-]+/, "") + "\n")
    }
  }



  return fullDiff
}
