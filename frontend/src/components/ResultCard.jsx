function ResultCard({ darkMode, prediction }) {
    const segmentedImage = `data:image/png;base64,${prediction.image}`;

    const cardClass = `rounded-3xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 ${darkMode
        ? "bg-[#1B211B] border-[#394436]"
        : "bg-[#FCFBF7] border-[#D7D0C2]"
        }`;

    return (
        <section className="space-y-8 mt-12">
            {/* Images */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className={cardClass}>
                    <div className={`px-6 py-4 border-b ${darkMode ? "border-[#394436]" : "border-[#D7D0C2]"}`}>
                        <h2 className="text-xl font-semibold">Original Image</h2>
                    </div>

                    <div className="p-6">
                        <img
                            src={prediction.originalImage}
                            alt="Original"
                            className="rounded-2xl w-full object-contain transition duration-500 hover:scale-[1.02]"
                        />
                    </div>
                </div>

                <div className={cardClass}>
                    <div className={`px-6 py-4 border-b ${darkMode ? "border-[#394436]" : "border-[#D7D0C2]"}`}>
                        <h2 className="text-xl font-semibold">Segmentation Result</h2>
                    </div>

                    <div className="p-6">
                        <img
                            src={segmentedImage}
                            alt="Prediction"
                            className="rounded-2xl w-full object-contain transition duration-500 hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className={`rounded-3xl p-8 border shadow-sm ${darkMode ? "bg-[#1B211B] border-[#394436]" : "bg-[#FCFBF7] border-[#D7D0C2]"}`}>
                <h2 className="text-2xl font-semibold mb-8">Prediction Summary</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className={`rounded-2xl border p-6 ${darkMode ? "bg-white/5 border-[#394436]" : "bg-black/5 border-[#D7D0C2]"}`}>
                        <p className={`text-sm uppercase tracking-widest ${darkMode ? "text-[#AEB5A5]" : "text-[#6F6A5E]"}`}>
                            Estimated Weed Count
                        </p>
                        <h3 className="text-5xl font-light mt-3 text-green-500">
                            {prediction.weed_count}
                        </h3>
                    </div>

                    <div className={`rounded-2xl border p-6 ${darkMode ? "bg-white/5 border-[#394436]" : "bg-black/5 border-[#D7D0C2]"}`}>
                        <p className={`text-sm uppercase tracking-widest ${darkMode ? "text-[#AEB5A5]" : "text-[#6F6A5E]"}`}>
                            Inference Time
                        </p>
                        <h3 className="text-4xl font-light mt-3">
                            {prediction.inference_time_ms.toFixed(2)}
                            <span className={`text-xl ml-2 ${darkMode ? "text-[#AEB5A5]" : "text-[#6F6A5E]"}`}>ms</span>
                        </h3>
                    </div>

                    <div className={`rounded-2xl border p-6 ${darkMode ? "bg-white/5 border-[#394436]" : "bg-black/5 border-[#D7D0C2]"}`}>
                        <p className={`text-sm uppercase tracking-widest ${darkMode ? "text-[#AEB5A5]" : "text-[#6F6A5E]"}`}>
                            Model
                        </p>
                        <h3 className="text-3xl font-light mt-3">YOLOv8-Seg</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ResultCard;