import { GoogleGenerativeAI } from "@google/generative-ai"

export type ProviderType = "gemini" | "openai" | "claude" | "openrouter"

export async function reviewCode(
  apiKey: string,
  diff: string,
  instructions: string,
  provider: ProviderType = "gemini",
  language: "pt" | "en" | "es" = "pt",
  modelName?: string
): Promise<string> {
  const langMap = {
    pt: "Portuguese (Português)",
    "en": "English",
    "es": "Spanish (Español)"
  }

  const systemPrompt = `
You are a Senior Staff Software Engineer specialized in JavaScript, TypeScript, React, and Clean Code. 
Your mindset is focused on high-performance, scalable, and maintainable systems.

CRITICAL: You MUST provide the ENTIRE review in ${langMap[language]}. 

Your job is to analyze code changes and identify improvements based on these CUSTOM RULES:
"${instructions}"

SENIOR ENGINEER PRIORITIES:
1. DRY (Don't Repeat Yourself): Suggest abstractions if logic is repeated.
2. Type Safety: Identify "any" types and suggest strict interfaces/types.
3. Clean Code: Recommend removing unnecessary comments or logs.
4. UI Best Practices: Suggest using utilities like 'cn' for conditional classes or interpolations.
5. Performance & Security: Identify leaks or vulnerabilities.

IMPORTANT REVIEW RULES:
1. For each file with issues, you MUST wrap the review in: [[FILE: path/to/file]] ... [[END_FILE]]
2. Inside each file block, you can have multiple issues.
3. For each issue, provide a SHORT descriptive HEADER.
4. Explain clearly what must be changed and why (Context, Problem, Solution).
5. Always suggest a FIXED version of the code snippet.
6. Only report REAL problems with clear benefits.

OUTPUT FORMAT PER FILE:
[[FILE: file/path]]

HEADER: <short title for the fix like "Remover comentário", "User 'cn' utility", "Tipagem estrita">
TYPE: <bug | clean-code | solid | performance | types>
LINE: <line_number_in_the_new_version_of_the_file>

CONTEXT:
<brief explanation>

PROBLEM:
<what's wrong>

SOLUTION:
<how to fix>

CODE BEFORE:
\`\`\`ts
<old code>
\`\`\`

CODE AFTER (SUGGESTED FIX):
\`\`\`ts
<improved code>
\`\`\`

[[END_FILE]]
`

  const userPrompt = `
CODE CHANGES TO REVIEW:

${diff}
`

  // GEMINI
  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: modelName || "gemini-1.5-pro" })

    try {
      const result = await model.generateContent(systemPrompt + "\n\n" + userPrompt)
      const response = await result.response
      return response.text()
    } catch (error: any) {
      throw new Error(`Gemini Error: ${error.message || "Unknown error"}`)
    }
  }

  // OPENAI
  if (provider === "openai") {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName || "gpt-4-turbo-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      return data.choices[0].message.content
    } catch (error: any) {
      throw new Error(`OpenAI Error: ${error.message || "Unknown error"}`)
    }
  }

  // CLAUDE
  if (provider === "claude") {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: modelName || "claude-3-sonnet-20240229",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }]
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      return data.content[0].text
    } catch (error: any) {
      throw new Error(`Claude Error: ${error.message || "Unknown error"}`)
    }
  }

  // OPENROUTER
  if (provider === "openrouter") {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://sparkfy.com",
          "X-Title": "Sparkfy Reviewer"
        },
        body: JSON.stringify({
          model: modelName || "meta-llama/llama-3-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      return data.choices[0].message.content
    } catch (error: any) {
      throw new Error(`OpenRouter Error: ${error.message || "Unknown error"}`)
    }
  }

  throw new Error("Unsupported AI Provider")
}
