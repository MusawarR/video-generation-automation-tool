import { useConfigStore } from "../store/store";
import toast from "react-hot-toast";

const APIKeysConfigPage = () => {
    const openAIKey = useConfigStore((st) => st.openAIKey)
    const elevenLabsKey = useConfigStore((st) => st.elevenLabsKey)
    const runwareKey = useConfigStore((st) => st.runwareKey)

    const setOpenAIKey = useConfigStore((st) => st.setOpenAIKey)
    const setElevenLabsKey = useConfigStore((st) => st.setElevenLabsKey)
    const setRunwareKey = useConfigStore((st) => st.setRunwareKey)
    const clearKeys = useConfigStore((st) => st.clearKeys)

    const handleSaveKeys = () => {
        toast.success("API Keys saved!")
    }

    const handleResetKeys = () => {
        clearKeys()
        toast.success("API Keys cleared!")
    }

    return (
        <div className="bg-white/80 border border-gray-200 shadow h-full w-96 rounded flex flex-col p-7">
            <p className="font-bold text-2xl">API Keys</p>
            <div className="mt-7 flex flex-col gap-y-2">
                <p className="text-gray-500 text-sm font-semibold">OpenAI API Key</p>
                <input type="password" value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} className="px-3 border border-gray-300 rounded shadow-xs h-12 outline-none" />
            </div>
            <div className="mt-7 flex flex-col gap-y-2">
                <p className="text-gray-500 text-sm font-semibold">Eleven Labs API Key</p>
                <input type="password" value={elevenLabsKey} onChange={(e) => setElevenLabsKey(e.target.value)} className="px-3 border border-gray-300 rounded shadow-xs h-12 outline-none" />
            </div>
            <div className="mt-7 flex flex-col gap-y-2">
                <p className="text-gray-500 text-sm font-semibold">Runware API Key</p>
                <input type="password" value={runwareKey} onChange={(e) => setRunwareKey(e.target.value)} className="px-3 border border-gray-300 rounded shadow-xs h-12 outline-none" />
            </div>
            <div className="w-full flex mt-7 gap-x-5">
                <button onClick={handleResetKeys} className="flex-1 text-white bg-rose-500 rounded-md h-12 hover:cursor-pointer hover:bg-rose-600">Reset</button>
                <button onClick={handleSaveKeys} className="flex-1 text-white bg-rose-500 rounded-md h-12 hover:cursor-pointer hover:bg-rose-600">Save</button>
            </div>
        </div>
    )
}

export default APIKeysConfigPage