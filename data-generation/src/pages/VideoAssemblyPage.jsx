import Swal from "sweetalert2";

const VideoAssemblyPage = () => {
    const getJSONOutput = () => {
        const scriptsData = localStorage.getItem("scripts-storage")
        const actorsData = localStorage.getItem("actors-storage")
        const imagesData = localStorage.getItem("image-styling-storage")

        const output = {
            selectedScripts: JSON.parse(scriptsData)?.state?.selectedScripts || [],
            generatedNarrations: JSON.parse(actorsData)?.state?.generatedNarrations || [],
            generatedImages: JSON.parse(imagesData)?.state?.generatedImages || [],
        }

        Swal.fire({
            title: 'Generated JSON Output',
            html: `
                <div style="
                    text-align: left;
                    max-height: 400px;
                    overflow-y: auto;
                    background: #f9fafb;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    font-family: 'Fira Code', 'Courier New', Courier, monospace;
                    font-size: 0.85rem;
                    white-space: pre-wrap;
                ">
                    ${JSON.stringify(output, null, 2)}
                </div>
            `,
            width: '60%',
            confirmButtonText: 'Close',
            customClass: {
                popup: 'text-sm',
            }
        })
    }

    return (
        <div className="flex flex-col gap-y-6">
            <p className="text-gray-600 text-sm mb-2">Do the following:</p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Click Get Output to get the JSON output</li>
                <li>Copy and pate the JSON output to video assembler script</li>
                <li>Make sure to put videos named 'intro' and 'outro' for the video assembler</li>
            </ul>
            <button
                onClick={getJSONOutput}
                className="mt-6 w-fit px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition"
            >
                Get Output JSON
            </button>
        </div>
    )
}

export default VideoAssemblyPage