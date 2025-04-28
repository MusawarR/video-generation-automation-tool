import { useState } from "react";
import { MoonLoader } from "react-spinners";
import { generateScripts } from "../services/openai.service";
import { useScriptsStore } from "../store/store";
import toast from "react-hot-toast";

const ScriptGenerationPage = () => {
    const [loadingScripts, setLoadingScripts] = useState(false)

    // NOTE_TO_SELF: refactor with object selector and shallow
    const selectedScripts = useScriptsStore((s) => s.selectedScripts)
    const addSelectedScript = useScriptsStore((s) => s.addSelectedScript)
    const removeSelectedScript = useScriptsStore((s) => s.removeSelectedScript)
    const setGeneratedScripts = useScriptsStore((s) => s.setGeneratedScripts)
    const generatedScripts = useScriptsStore((s) => s.generatedScripts)
    const setVideoIdea = useScriptsStore((s) => s.setVideoIdea)
    const setUserScript = useScriptsStore((s) => s.setUserScript)
    const videoIdea = useScriptsStore((s) => s.videoIdea)
    const userScript = useScriptsStore((s) => s.userScript)
    const numberOfScripts = useScriptsStore((s) => s.numberOfScripts)
    const setNumberOfScripts = useScriptsStore((s) => s.setNumberOfScripts)

    const handleGenerateScripts = async () => {
        if (!videoIdea && !userScript) {
            toast.error("Please provide a video idea or a direct script.")
            return
        }

        try {
            setLoadingScripts(true)

            const promptToUse = userScript || videoIdea
            const res = await generateScripts(promptToUse, numberOfScripts)

            setGeneratedScripts(res)
        } catch (err) {
            console.error(err)
            toast.error("Failed to generate scripts.")
        } finally {
            setLoadingScripts(false)
        }
    }

    return (
        <div className="w-full flex gap-x-6 h-full">
            <div className="flex-[1.2] flex flex-col gap-y-6 p-6 bg-white/80 border border-gray-200 rounded-xl shadow">
                <div>
                    <p className="font-semibold text-gray-600 mb-1">Video Idea</p>
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm h-28 resize-none focus:ring-2 focus:ring-rose-300 outline-none"
                        placeholder="e.g. A promotional ad for new jack tool that makes changing tires easy"
                        value={videoIdea}
                        onChange={(e) => setVideoIdea(e.target.value)}
                    />
                </div>

                <div>
                    <p className="font-semibold text-gray-600 mb-1">Or provide a script directly</p>
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm h-28 resize-none focus:ring-2 focus:ring-rose-300 outline-none"
                        placeholder="Paste your script content here..."
                        value={userScript}
                        onChange={(e) => setUserScript(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-x-4">
                    <div className="flex-1">
                        <p className="font-semibold text-gray-600 mb-1">Scripts to generate</p>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-center focus:ring-2 focus:ring-rose-300 outline-none"
                            min={1}
                            max={10}
                            value={numberOfScripts}
                            onChange={(e) => setNumberOfScripts(Number(e.target.value))}
                        />
                    </div>

                    <button
                        className="flex-1 mt-6 px-5 py-2 bg-rose-500 text-white font-medium rounded-lg shadow hover:bg-rose-600 hover:cursor-pointer transition"
                        onClick={handleGenerateScripts}
                    >
                        Generate Scripts
                    </button>
                </div>
            </div>
            <div className={`flex-1 bg-white/80 border border-gray-200 rounded-xl shadow p-4 overflow-y-auto max-h-[600px] flex flex-col tems-center`}>
                {loadingScripts ? (
                    <>
                        <p className="text-sm text-gray-500 text-center italic">Generating Scripts, please wait</p>
                        <MoonLoader color="#f43f5e" loading={true} size={60} className="mt-5 mx-auto" />
                    </>
                ) : generatedScripts?.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-y-4">
                        {generatedScripts?.map((script, idx) => (
                            <div key={idx} className="p-4 bg-gray-100 rounded-lg text-sm text-gray-700 whitespace-pre-wrap flex items-start gap-x-2">
                                <input
                                    type="checkbox"
                                    className="mt-1 accent-rose-500"
                                    checked={selectedScripts.some(script => script.id === idx)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            addSelectedScript({ id: idx, scriptContent: Object.values(script)[0] });
                                        } else {
                                            removeSelectedScript({ id: idx, scriptContent: Object.values(script)[0] });
                                        }
                                    }}
                                />
                                <div>{Object.values(script)[0]}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center italic">Generated scripts will appear here...</p>
                )}
            </div>
        </div>
    )
}

export default ScriptGenerationPage