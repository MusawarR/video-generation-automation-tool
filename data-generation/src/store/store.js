import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useConfigStore = create(
    persist(
        (set) => ({
            openAIKey: "",
            elevenLabsKey: "",
            runwareKey: "",

            setOpenAIKey: (key) => set({ openAIKey: key }),
            
            setElevenLabsKey: (key) => set({ elevenLabsKey: key }),
            
            setRunwareKey: (key) => set({ runwareKey: key }),

            setAllKeys: (openAIKey, elevenLabsKey, runwareKey) => {
                set({ openAIKey, elevenLabsKey, runwareKey })
            },

            clearKeys: () => {
                set({ openAIKey: "", elevenLabsKey: "", runwareKey: "" })
            },
        }),
        {
            name: "config-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export const useScriptsStore = create(
    persist(
        (set) => ({
            videoIdea: "",
            userScript: "",
            numberOfScripts: 2,
            generatedScripts: [],
            selectedScripts: [],

            setVideoIdea: (idea) => set({ videoIdea: idea }),

            setUserScript: (script) => set({ userScript: script }),

            setNumberOfScripts: (num) => {
                if (typeof num === "number" && num > 0) {
                    set({ numberOfScripts: num });
                }
            },

            setGeneratedScripts: (scripts) => {
                if (Array.isArray(scripts)) {
                    set({ generatedScripts: scripts });
                }
            },

            clearScripts: () =>
                set({
                    videoIdea: "",
                    userScript: "",
                    generatedScripts: [],
                    selectedScripts: [],
                }),

            addSelectedScript: (s) =>
                set((state) => ({
                    selectedScripts: [...state.selectedScripts, s],
                })),

            removeSelectedScript: (scriptToRemove) =>
                set((state) => ({
                    selectedScripts: state.selectedScripts.filter(
                        (script) => script.id !== scriptToRemove.id
                    ),
                })),

            clearSelectedScripts: () => set({ selectedScripts: [] }),
        }),
        {
            name: "scripts-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useActorsStore = create(
    persist(
        (set) => ({
            selectedActors: [],
            generatedNarrations: [],

            addActor: (actor) => 
                set((state) => ({
                    selectedActors: [...state.selectedActors, actor]
                })),

            removeActor: (actorToRemove) => {
                set((state) => ({
                    selectedActors: state.selectedActors.filter(
                        (actor) => actor.voice_id !== actorToRemove.voice_id
                    ),
                }))
            },

            clearActors: () => {
                set({ selectedActors: [] })
            },

            setGeneratedNarrations: (narrations) => set({ generatedNarrations: narrations }),

            clearNarrations: () => set({ generatedNarrations: [] })
        }),
        {
            name: "actors-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export const useImageStylingStore = create(
    persist(
        (set) => ({
            baseImage: null,
            customPrompt: "",
            generatedImages: [],
            selectedStyles: [],

            setBaseImage: (image) => {
                set({ baseImage: image })
            },

            setCustomPrompt: (prompt) => {
                if (typeof prompt === "string") {
                    set({ customPrompt: prompt })
                }
            },

            clearImageStyling: () => {
                set({
                    baseImage: null,
                    numberOfVisualStyles: 5,
                    customPrompt: "",
                })
            },

            setGeneratedImages: (images) => set({ generatedImages: images }),

            clearGeneratedImages: () => set({ generatedImages: [] }),

            setSelectedStyles: (styles) => set({ selectedStyles: styles }),
        }),
        {
            name: "image-styling-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export const useOutputStore = create(
    persist(
        (set, get) => ({
            introVideo: null,
            outroVideo: null,
            generatedVideos: [],

            setIntroVideo: (video) => set({ introVideo: video }),

            setOutroVideo: (video) => set({ outroVideo: video }),

            addGeneratedVideo: (video) => {
                const { generatedVideos } = get()
                set({ generatedVideos: [...generatedVideos, video] })
            },

            setGeneratedVideos: (videos) => {
                if (Array.isArray(videos)) {
                    set({ generatedVideos: videos })
                }
            },

            removeGeneratedVideo: (videoUrl) => {
                set((state) => ({
                    generatedVideos: state.generatedVideos.filter((v) => v.videoUrl !== videoUrl),
                }))
            },

            clearOutput: () => {
                set({
                    introVideo: null,
                    outroVideo: null,
                    generatedVideos: [],
                })
            },
        }),
        {
            name: "output-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)