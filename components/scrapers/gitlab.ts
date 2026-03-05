export const getGitLabDiff = (): string => {
  const fileBlocks = document.querySelectorAll(".diff-file, .js-file-title")

  let fullDiff = ""

  fileBlocks.forEach((block, index) => {
    const fileNameElement = block.querySelector(".file-title-name, .file-header-content a")
    const fileName = fileNameElement?.textContent?.trim() || `Unknown File ${index + 1}`

    const additions = block.querySelectorAll(".line_content.new")
    const deletions = block.querySelectorAll(".line_content.old")


    if (additions.length > 0 || deletions.length > 0) {
      fullDiff += `FILE: ${fileName}\n`
      deletions.forEach(line => {
        fullDiff += "- " + (line as HTMLElement).innerText + "\n"
      })
      additions.forEach(line => {
        fullDiff += "+ " + (line as HTMLElement).innerText + "\n"
      })
      fullDiff += "--------------------------------------------------\n\n"
    }
  })



  return fullDiff
}
