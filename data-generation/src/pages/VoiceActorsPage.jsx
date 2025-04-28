import { useState } from "react";
import voices from "../data/voices.data";
import { MoonLoader } from "react-spinners";
import { useActorsStore, useScriptsStore } from "../store/store";
import toast from "react-hot-toast";
import { createNarrations } from "../services/elevenlabs.service";

const VoiceActorsPage = () => {
    const [generatingNarrations, setGeneratingNarrations] = useState(false)

    const selectedActors = useActorsStore((st) => st.selectedActors)
    const generatedNarrations = useActorsStore((st) => st.generatedNarrations)
    const addActor = useActorsStore((st) => st.addActor)
    const removeActor = useActorsStore((st) => st.removeActor)

    const selectedScripts = useScriptsStore((st) => st.selectedScripts)

    const setGeneratedNarrations = useActorsStore((st) => st.setGeneratedNarrations)

    const handleNarrateScripts = async () => {
        if (selectedActors.length === 0) {
            toast.error("Please select at least one voice actor")
            return
        }

        try {
            setGeneratingNarrations(true)
            const res = await createNarrations(selectedScripts, selectedActors)

            console.log(res)
            setGeneratedNarrations(res)
        }
        catch (err) {
            console.error(err)
            toast.success("Narrations generated successfully")
        }
        finally {
            setGeneratingNarrations(false)
        }
    }

    return (
        <div className="w-full flex gap-x-6 h-full">
            <div className="flex-1 flex flex-col gap-y-8">
                <p className="font-semibold text-gray-700 text-lg">Select Voice Actors</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {voices.map((voice, index) => (
                        <div
                            key={voice.voice_id}
                            className="flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition"
                        >
                            <div className="flex items-center justify-between w-full">
                                <label className="flex items-center gap-x-2 cursor-pointer text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        className="accent-rose-500 w-4 h-4"
                                        checked={selectedActors.some(actor => actor.voice_id == voice.voice_id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                addActor(voice)
                                            }
                                            else {
                                                removeActor(voice)
                                            }
                                        }}
                                    />
                                    {voice.name}
                                </label>
                                <button
                                    onClick={() => {
                                        const audio = document.getElementById(`audio-${index}`)
                                        audio.play()
                                    }}
                                    className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 hover:cursor-pointer flex items-center justify-center shadow-sm transition"
                                >
                                    <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 4l10 6-10 6V4z" />
                                    </svg>
                                </button>
                            </div>
                            <audio id={`audio-${index}`} src={voice.preview} preload="none" />
                        </div>
                    ))}
                </div>
                <button
                    className="w-64 mt-6 px-5 py-2 bg-rose-500 text-white font-medium rounded-lg shadow hover:bg-rose-600 hover:cursor-pointer transition"
                    onClick={handleNarrateScripts}
                >
                    Narrate Scripts
                </button>
            </div>
            <div className={`flex-1 bg-white/80 border border-gray-200 rounded-xl shadow p-4 overflow-y-auto max-h-[600px] flex flex-col`}>
                {generatingNarrations ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <p className="text-sm text-gray-500 text-center italic">Generating Narrations, please wait</p>
                        <MoonLoader color="#f43f5e" loading={true} size={60} className="mt-5 mx-auto" />
                    </div>
                ) : generatedNarrations?.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-y-4">
                        {generatedNarrations?.map((narration, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-white/80 border-[1px] border-gray-200 rounded-md shadow flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Actor: <span className="text-gray-800">{narration.actor}</span></p>
                                    <p className="text-xs text-gray-400">Script ID: {narration.scriptId}</p>
                                </div>
                                <audio
                                    controls
                                    className="w-64"
                                    src={narration.fileURL}
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center italic">Generated narrations will appear here...</p>
                )}
            </div>
        </div>
    )
}

export default VoiceActorsPage