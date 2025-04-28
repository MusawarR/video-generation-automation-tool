import { ElevenLabsClient } from "elevenlabs";
import { useConfigStore } from "../store/store";
import toast from "react-hot-toast";
import { Buffer } from "buffer";
import { uploadToCloudinary } from "./cloudinary.service"

let elevenLabsClient = null
let currentApiKey = null

const getElevenLabsClient = () => {
    const elevenLabsKey = useConfigStore.getState().elevenLabsKey

    if (!elevenLabsKey) {
        toast.error("ElevenLabs API Key is not set, please set it first")
        return
    }

    if (!elevenLabsClient || elevenLabsKey !== currentApiKey) {
        elevenLabsClient = new ElevenLabsClient({
            apiKey: elevenLabsKey
        })
        currentApiKey = elevenLabsKey
    }

    return elevenLabsClient
}

export const createNarrations = async (scripts, actors) => {
    const client = getElevenLabsClient()

    if (!client) {
        toast.error("Looks like ElevenLabs API Key is not set, please set it first")
        throw new Error("Looks like ElevenLabs API Key is not set, please set it first")
    }

    try {
        const narrationPromises = actors?.flatMap(actor =>
            scripts.map(async (script) => {
                const audioStream = await client.textToSpeech.convertAsStream(actor.voice_id, {
                    text: script.scriptContent,
                    model_id: "eleven_multilingual_v2",
                    output_format: "mp3_44100_128",
                    voice_settings: {
                        speed: 1.2,
                    }
                })

                const audioChunks = []
                for await (const chunk of audioStream) {
                    audioChunks.push(chunk)
                }

                const audioBuffer = Buffer.concat(audioChunks)
                const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
                const cloudURL = await uploadToCloudinary(audioBlob)

                return {
                    actor: actor.name,
                    scriptId: script.id,
                    fileURL: cloudURL,
                }
            })
        )

        const narrations = await Promise.all(narrationPromises)
        console.log(narrations)
        
        return narrations
    }
    catch (err) {
        console.error("ElevenLabs API Error: ", err)
        toast.error("Error occurred while generating response, please try again")
    }
}