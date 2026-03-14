export const GOOGLE_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.1-pro-preview"
] as const

export const ANTHROPIC_MODELS = [
  "claude-haiku-4-5",
  "claude-sonnet-4-5",
  "claude-sonnet-4-6",
  "claude-opus-4-5",
  "claude-opus-4-6"
] as const

export const OPENAI_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-5",
  "gpt-5-mini",
  "gpt-5.1",
  "gpt-5.2",
  "gpt-5.3-codex"
] as const

export async function getOpenRouterModels(): Promise<string[]> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/models?output_modality=text"
  )

  if (!response.ok) {
    return []
  }

  const json = await response.json()
  return json?.data?.map((model: { id: string }) => model.id) || []
}

export const AI_MODELS = {
  google: GOOGLE_MODELS,
  anthropic: ANTHROPIC_MODELS,
  openai: OPENAI_MODELS,
  openrouter: getOpenRouterModels
}
