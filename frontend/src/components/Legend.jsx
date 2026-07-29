function Legend({ darkMode, legend }) {
    return (
        <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? "bg-[#1B211B] border-[#394436]" : "bg-[#FCFBF7] border-[#D7D0C2]"}`}>
            <h2 className="text-2xl font-semibold mb-4">Legend</h2>

            <div className="flex flex-wrap gap-6">
                {Object.entries(legend).map(([label, color]) => (
                    <div key={label} className="flex items-center gap-3">
                        <div
                            className={`w-5 h-5 rounded-full border ${darkMode ? "border-white/40" : "border-black/20"}`}
                            style={{ backgroundColor: color }}
                        />
                        <span className="capitalize">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Legend;