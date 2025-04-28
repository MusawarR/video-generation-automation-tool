import OpenAI from "openai";
import { useConfigStore } from "../store/store";
import toast from "react-hot-toast";
import { getScriptGenerationTemplate } from "../prompts/script_generation"

let openAIClient = null
let currentApiKey = null

const getOpenAIClient = () => {
    const openAIKey = useConfigStore.getState().openAIKey

    if (!openAIKey) {
        toast.error("OpenAI API Key is not set, please set it first.")
        return
    }

    if (!openAIClient || openAIKey !== currentApiKey) {
        openAIClient = new OpenAI({
            apiKey: openAIKey,
            dangerouslyAllowBrowser: true
        })
        currentApiKey = openAIKey
    }

    return openAIClient
}

export const generateScripts = async (idea, numberOfScripts) => {
    const client = getOpenAIClient()

    if (!client) {
        toast.error("Looks like OpenAI API Key is not set, please set it first")
        throw new Error("Looks like OpenAI API Key is not set, please set it first")
    }

    try {
        const response = await client.responses.create({
            model: "gpt-4.1-mini-2025-04-14",
            input: getScriptGenerationTemplate(idea, numberOfScripts)
        })

        return JSON.parse(response?.output_text)
    }
    catch (err) {
        console.error("OpenAI API Error: ", err)
        toast.error("Error occurred while getting OpenAI response, please try again")
    }
}