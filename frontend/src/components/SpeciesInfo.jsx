import { weedInfo } from "../data/weedInfo";

export default function SpeciesInfo({ darkMode, predictedClass }) {
    const info = weedInfo[predictedClass];

    if (!info) {
        return (
            <div
                className={`mt-12 rounded-3xl border p-8 ${darkMode
                    ? "border-green-900 bg-green-950/30"
                    : "border-green-200 bg-green-50"
                    }`}
            >
                <h2 className="font-serif text-3xl">No Target Weed Detected</h2>

                <p className={`mt-4 leading-7 ${darkMode ? "text-[#B7BEB2]" : "text-stone-700"}`}>
                    No weed species from the DeepWeeds dataset were detected in
                    the uploaded image. The image may contain healthy vegetation,
                    background plants, or non-target species.
                </p>
            </div>
        );
    }

    const riskColor = darkMode
        ? {
            High: "bg-red-950/50 text-red-300",
            Moderate: "bg-amber-950/50 text-amber-300",
            Low: "bg-green-950/50 text-green-300",
        }
        : {
            High: "bg-red-100 text-red-700",
            Moderate: "bg-amber-100 text-amber-700",
            Low: "bg-green-100 text-green-700",
        };

    return (
        <section
            className={`mt-12 rounded-3xl border p-8 shadow-sm ${darkMode
                ? "bg-[#1B211B] border-[#394436]"
                : "bg-white border-stone-200"
                }`}
        >
            <h2 className="font-serif text-3xl mb-8">Species Information</h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <p className={`text-sm uppercase tracking-widest ${darkMode ? "text-[#AEB5A5]" : "text-stone-500"}`}>
                        Common Name
                    </p>
                    <h3 className="text-2xl font-semibold mt-2">{info.commonName}</h3>
                </div>

                <div>
                    <p className={`text-sm uppercase tracking-widest ${darkMode ? "text-[#AEB5A5]" : "text-stone-500"}`}>
                        Scientific Name
                    </p>
                    <h3 className="italic text-xl mt-2">{info.scientificName}</h3>
                </div>
            </div>

            <div className="mt-8">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${riskColor[info.risk]}`}>
                    Risk Level: {info.risk}
                </span>
            </div>

            <div className="mt-10 space-y-8">
                <div>
                    <h4 className="font-semibold text-lg">Description</h4>
                    <p className={`mt-2 leading-7 ${darkMode ? "text-[#B7BEB2]" : "text-stone-600"}`}>
                        {info.description}
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-lg">Agricultural Impact</h4>
                    <p className={`mt-2 leading-7 ${darkMode ? "text-[#B7BEB2]" : "text-stone-600"}`}>
                        {info.impact}
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-lg">Recommended Management</h4>
                    <p className={`mt-2 leading-7 ${darkMode ? "text-[#B7BEB2]" : "text-stone-600"}`}>
                        {info.management}
                    </p>
                </div>
            </div>
        </section>
    );
}