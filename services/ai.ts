import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"

import { AI_MODELS } from "~/constants/ai-models"
import { getSystemPrompt, getUserPrompt } from "~constants/prompts"

export type ProviderType = "google" | "openai" | "anthropic" | "openrouter"

export type SupportedLanguages = "pt" | "en" | "es"

export async function reviewCode(
  apiKey: string,
  diff: string,
  instructions: string,
  provider: ProviderType = "google",
  language: SupportedLanguages = "pt",
  modelName?: string
): Promise<string> {
  const langMap = {
    pt: "Portuguese (Português)",
    en: "English",
    es: "Spanish (Español)"
  }

  const systemPrompt = getSystemPrompt(langMap[language], instructions)
  const userPrompt = getUserPrompt(diff)

  if (provider === "google") {
    try {
      const response = await handleGoogleModelResponse({
        apiKey,
        modelName,
        userPrompt,
        systemPrompt
      })

      return response
    } catch (error) {
      throw new Error(`Gemini Error: ${error.message || "Unknown error"}`)
    }
  }

  if (provider === "openai") {
    try {
      const response = await handleOpenAIModelResponse({
        apiKey,
        modelName,
        userPrompt,
        systemPrompt
      })

      return response
    } catch (error) {
      throw new Error(`OpenAI Error: ${error.message || "Unknown error"}`)
    }
  }

  if (provider === "anthropic") {
    try {
      const response = await handleAnthropicModelResponse({
        apiKey,
        modelName,
        userPrompt,
        systemPrompt
      })

      return response
    } catch (error) {
      throw new Error(`Anthropic Error: ${error.message || "Unknown error"}`)
    }
  }

  if (provider === "openrouter") {
    try {
      const response = await handleOpenRouterModelResponse({
        apiKey,
        modelName,
        userPrompt,
        systemPrompt
      })

      return response
    } catch (error) {
      throw new Error(`OpenRouter Error: ${error.message || "Unknown error"}`)
    }
  }

  throw new Error("Unsupported AI Provider")
}

interface HandleModelResponseParams {
  modelName: string
  userPrompt: string
  apiKey: string
  systemPrompt?: string
}

async function handleGoogleModelResponse({
  apiKey,
  modelName,
  userPrompt,
  systemPrompt
}: HandleModelResponseParams) {
  if (
    !AI_MODELS.google.includes(modelName as (typeof AI_MODELS.google)[number])
  ) {
    throw new Error(`Invalid Google model: ${modelName}`)
  }

  const google = createGoogleGenerativeAI({
    apiKey
  })

  const model = google(modelName)

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt
  })

  return text
}

async function handleAnthropicModelResponse({
  apiKey,
  modelName,
  userPrompt,
  systemPrompt
}: HandleModelResponseParams) {
  if (
    !AI_MODELS.anthropic.includes(
      modelName as (typeof AI_MODELS.anthropic)[number]
    )
  ) {
    throw new Error(`Invalid Anthropic model: ${modelName}`)
  }

  const anthropic = createAnthropic({
    apiKey
  })

  const model = anthropic(modelName)

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt
  })

  return text
}

async function handleOpenAIModelResponse({
  apiKey,
  modelName,
  userPrompt,
  systemPrompt
}: HandleModelResponseParams) {
  if (
    !AI_MODELS.openai.includes(modelName as (typeof AI_MODELS.openai)[number])
  ) {
    throw new Error(`Invalid OpenAI model: ${modelName}`)
  }

  const openai = createOpenAI({
    apiKey
  })

  const model = openai(modelName)

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt
  })

  return text
}

async function handleOpenRouterModelResponse({
  apiKey,
  modelName,
  userPrompt,
  systemPrompt
}: HandleModelResponseParams) {
  const openrouter = createOpenRouter({
    apiKey
  })

  const model = openrouter(modelName)

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt
  })

  return text
}
