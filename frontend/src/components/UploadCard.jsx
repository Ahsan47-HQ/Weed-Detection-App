import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function UploadCard({ darkMode, setPrediction, setLoading, setError }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    function handleImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    function handleDrag(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === "dragenter" || event.type === "dragover") {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);

        const file = event.dataTransfer.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    async function handlePredict() {
        if (!image) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", image);
            console.log("API URL:", API_URL);
            const response = await fetch(`${API_URL}/predict`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Prediction failed.");
            }

            const data = await response.json();

            setPrediction({
                ...data,
                originalImage: preview,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className={`rounded-3xl p-8 max-w-3xl mx-auto shadow-xl border transition-colors duration-300 ${darkMode
                ? "bg-[#1B211B] border-[#394436]"
                : "bg-[#FCFBF7] border-[#D7D0C2]"
                }`}
        >
            <h2 className="text-3xl font-semibold text-center mb-2">
                Upload Image
            </h2>

            <p className={`text-center mb-8 ${darkMode ? "text-[#AEB5A5]" : "text-[#6F6A5E]"}`}>
                Select or drag an image to begin weed detection.
            </p>

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                    transition-all duration-300
                    rounded-2xl
                    border-2
                    border-dashed
                    p-12
                    text-center
                    cursor-pointer
                    ${dragActive
                        ? "border-green-500 bg-green-500/10 scale-[1.02]"
                        : darkMode
                            ? "border-[#3B4537] hover:border-green-500"
                            : "border-[#D8D2C4] hover:border-green-500"
                    }
                `}
            >
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                />

                <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="space-y-3">
                        <h3 className="text-xl font-medium">
                            Drag & Drop Image
                        </h3>

                        <p className={darkMode ? "text-[#AEB5A5]" : "text-[#6F6A5E]"}>
                            or click here to browse
                        </p>
                    </div>
                </label>
            </div>

            {preview && (
                <div className="mt-8 animate-fade">
                    <img
                        src={preview}
                        alt="Preview"
                        className="rounded-2xl shadow-xl max-h-[450px] mx-auto"
                    />

                    <div className={`mt-4 text-center ${darkMode ? "text-[#B7BEB2]" : "text-[#6F6A5E]"}`}>
                        <p className="font-medium">{image.name}</p>
                        <p className="text-sm">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={handlePredict}
                disabled={!image}
                className={`
                    mt-8
                    w-full
                    rounded-xl
                    py-4
                    text-lg
                    font-semibold
                    transition-all
                    duration-300
                    ${image
                        ? "bg-green-600 hover:bg-green-500 hover:scale-[1.02] text-white"
                        : darkMode
                            ? "bg-[#2A322A] text-[#6F776A] cursor-not-allowed"
                            : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    }
                `}
            >
                Run Inference
            </button>
        </div>
    );
}

export default UploadCard;