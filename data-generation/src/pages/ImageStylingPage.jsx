import { MoonLoader } from "react-spinners"
import { useImageStylingStore } from "../store/store"
import { useState } from "react"
import { convertToBase64 } from "../services/image.service"
import imageStyles from "../data/image_style.data"
import toast from "react-hot-toast"
import { generateImageSets } from "../services/runware.service"

const ImageStylingPage = () => {
    const [generatingImages, setGeneratingImages] = useState(false)

    const baseImage = useImageStylingStore((st) => st.baseImage)
    const numberOfVisualStyles = useImageStylingStore((st) => st.numberOfVisualStyles)
    const customPrompt = useImageStylingStore((st) => st.customPrompt)
    const generatedImages = useImageStylingStore((st) => st.generatedImages)
    const selectedStyles = useImageStylingStore((st) => st.selectedStyles)

    const setBaseImage = useImageStylingStore((st) => st.setBaseImage)
    const setCustomPrompt = useImageStylingStore((st) => st.setCustomPrompt)
    const setGeneratedImages = useImageStylingStore((st) => st.setGeneratedImages)
    const clearGeneratedImages = useImageStylingStore((st) => st.clearGeneratedImages)
    const setSelectedStyles = useImageStylingStore((st) => st.setSelectedStyles)

    const handleGenerateImages = async () => {
        if(!baseImage && selectedStyles.length === 0) {
            toast.error("Please select a base image and some styles")
            return
        }

        try {
            setGeneratingImages(true)
            const res = await generateImageSets(baseImage, selectedStyles, customPrompt)
            setGeneratedImages(res)
        }
        catch(err) {
            console.error(err)
            toast.error("Failed to generate images")
        }
        finally {
            setGeneratingImages(false)
        }
    }

    return (
        <div className="w-full flex gap-x-6 h-full">
            <div className="flex-1 flex flex-col gap-y-6">
                <div>
                    <p className="font-semibold text-gray-600 mb-1">Base image for visuals</p>
                    <div className="relative w-fit">
                        <input
                            id="upload-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const selectedImageFile = e.target.files[0]
                                
                                if(!selectedImageFile) {
                                    toast.error("Please select an image file")
                                    return
                                }

                                const imageBase64 = await convertToBase64(selectedImageFile)
                                setBaseImage(imageBase64)
                            }}
                        />
                        <label
                            htmlFor="upload-image"
                            className="flex items-center gap-2 px-5 h-12 bg-white border border-rose-500 text-rose-600 font-medium rounded-xl shadow hover:bg-rose-50 hover:shadow-md transition-all cursor-pointer"
                        >
                            <svg
                                className="w-5 h-5 text-rose-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3M12 3v9" />
                            </svg>
                            Upload Image
                        </label>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-gray-600 mb-1">Select visual styles</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto border-[1px] border-gray-300 p-3 rounded">
                        {imageStyles.map((style, idx) => {
                            const isSelected = selectedStyles.some(s => s.label === style.label);
                            const disabled = !isSelected && selectedStyles.length >= numberOfVisualStyles;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (isSelected) {
                                            setSelectedStyles(selectedStyles.filter(s => s.label !== style.label));
                                        } else if (!disabled) {
                                            setSelectedStyles([...selectedStyles, style]);
                                        }
                                    }}
                                    disabled={disabled}
                                    className={`p-3 rounded-lg border-[1px] border-gray-400 text-sm text-left transition-all
                                                ${isSelected ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-800 hover:bg-gray-100'} 
                                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {style.label}
                                    <div className="text-xs mt-1 opacity-70">{style.prompt.slice(0, 40)}...</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4">
                    <p className="font-semibold text-gray-600 mb-1">Optional custom prompt (appended to each style)</p>
                    <input
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g. sunset, dreamy vibe"
                        className="w-full p-3 border border-gray-300 rounded shadow-sm"
                    />
                </div>
                <button
                    className="w-64 mt-6 px-5 py-2 bg-rose-500 text-white font-medium rounded-lg shadow hover:bg-rose-600 hover:cursor-pointer transition"
                    onClick={handleGenerateImages}
                >
                    Generate Images
                </button>
            </div>
            <div className={`flex-1 bg-white/80 border border-gray-200 rounded-xl shadow p-4 overflow-y-auto max-h-[600px] flex flex-col`}>
                {generatingImages ? (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500 text-center italic">Generating Images, please wait</p>
                        <MoonLoader color="#f43f5e" loading={true} size={60} className="mt-5 mx-auto" />
                    </div>
                ) : generatedImages?.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-y-4">
                        {generatedImages?.map((image, idx) => (
                            <div key={idx} className="p-4 bg-gray-100 rounded-lg text-sm text-gray-700 whitespace-pre-wrap flex items-center justify-center gap-x-2">
                                <img src={image?.imageURL} alt={image?.imageUUID} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center italic">Generated images will appear here...</p>
                )}
            </div>
        </div>
    )
}

export default ImageStylingPage