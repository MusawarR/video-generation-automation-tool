import { Runware } from "@runware/sdk-js";
import { useConfigStore, useScriptsStore } from "../store/store";
import toast from "react-hot-toast"

let runwareClient = null
let currentApiKey = null

const getRunwareClient = () => {
    const runwareAPIKey = useConfigStore.getState().runwareKey

    if (!runwareAPIKey) {
        toast.error("Runware API Key is not set, please set it first")
        return
    }

    if (!runwareClient || runwareAPIKey !== currentApiKey) {
        runwareClient = new Runware({
            apiKey: runwareAPIKey
        })
        currentApiKey = runwareAPIKey
    }

    return runwareClient
}

export const generateImageSets = async (baseImage, styles, customPrompt = "") => {
    const client = getRunwareClient()

    if(!client) {
        toast.error("Looks like Runware API Key is not set, please set it first")
        throw new Error("Looks like Runware API Key is not set, please set it first")
    }

    try {
        const idea = useScriptsStore.getState().videoIdea
        
        const imageSets = await Promise.all(
            styles.map(async (style) => {
                const prompt = `${idea}. ${style.prompt}. ${customPrompt}`.trim()

                // For now we have 2 images per visual style
                const runwareResponse = await client.requestImages({
                    model: "rundiffusion:130@100",
                    positivePrompt: prompt,
                    width: 512,
                    height: 512,
                    numberResults: 2,
                    seedImage: baseImage,
                    strength: 0.8,
                    CFGScale: 0.8
                })

                return runwareResponse
            })
        )

        const generatedImages = imageSets.flat()
        console.log(generatedImages)
        return generatedImages
    }
    catch(err) {
        console.error("Runware API Error: ", err)
        toast.error("Error occurred while getting Runware response, please try again")
    }
}