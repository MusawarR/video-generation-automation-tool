import { useState } from "react";
import { Toaster } from "react-hot-toast";
import ScriptGenerationPage from "./pages/ScriptGenerationPage";
import APIKeysConfigPage from "./pages/APIKeysConfigPage";
import VoiceActorsPage from "./pages/VoiceActorsPage";
import ImageStylingPage from "./pages/ImageStylingPage";
import VideoAssemblyPage from "./pages/VideoAssemblyPage";

const steps = ["Script Generation", "Voice Actors", "Image Styling", "Video Assembly"]

const App = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)
    const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1)

    const handleResetAll = () => { }

    return (
        <>
            <Toaster position="top-center" />
            <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50 text-gray-800 font-sans overflow-hidden">
                <div className="w-full flex justify-between items-center px-6 h-20 border-b border-gray-200 shadow-md bg-white/80 backdrop-blur-sm z-10">
                    <p className="font-extrabold text-3xl text-rose-600 tracking-tight">VGAT!</p>
                </div>

                <div className="flex-1 flex p-7 gap-x-5 overflow-hidden">
                    <APIKeysConfigPage />

                    <div className="flex flex-col bg-white/80 border border-gray-200 shadow h-full flex-1 rounded overflow-hidden">
                        { /* TODO: separate it into its own component file */}
                        <div className="flex justify-between items-center px-7 pt-7 relative">
                            {steps.map((label, index) => {
                                const isActive = index === currentStep
                                const isCompleted = index < currentStep

                                return (
                                    <div key={index} className="flex flex-col items-center flex-1 relative">
                                        <div
                                            className={`w-7 h-7 flex items-center justify-center rounded-full z-10 transition-all duration-300
                                        ${isCompleted ? 'bg-rose-500 text-white' : isActive ? 'bg-white border-2 border-rose-500 text-rose-500' : 'bg-gray-200 text-gray-400'}`}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs font-medium text-gray-600">{label}</p>
                                        {index !== steps.length - 1 && (
                                            <div className="absolute top-3 left-1/2 w-full h-0.5 bg-gray-300 z-0">
                                                <div className={`h-full transition-all duration-500 ${isCompleted ? 'bg-rose-500 w-full' : isActive ? 'bg-rose-200 w-1/2' : 'w-0'}`}></div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex-1 px-7 py-6 overflow-y-auto">
                            {currentStep === 0 && (
                                <ScriptGenerationPage />
                            )}
                            {currentStep === 1 && (
                                <VoiceActorsPage />
                            )}
                            {currentStep === 2 && (
                                <ImageStylingPage />
                            )}
                            {currentStep === 3 && (
                                <VideoAssemblyPage />
                            )}
                        </div>
                        <div className="flex justify-between px-7 py-6 border-t border-gray-100 bg-white">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className={`px-4 py-2 rounded-md transition shadow 
                            ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                            >
                                Back
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={currentStep === steps.length - 1}
                                className={`px-4 py-2 rounded-md transition shadow 
                            ${currentStep === steps.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App