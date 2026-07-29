import { useState } from "react";

import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";
import Legend from "./components/Legend";
import SpeciesInfo from "./components/SpeciesInfo";

import heroImage from "./assets/agro_image.jpg";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // shared color tokens so every section pulls from the same palette
  const c = darkMode
    ? {
      bg: "bg-[#101410]",
      surface: "bg-[#181D18]",
      border: "border-[#2C332B]",
      heading: "text-[#DCE3D6]",
      accentHeading: "text-[#9FC28A]",
      label: "text-[#8FA085]",
      body: "text-[#B4BCAC]",
      text: "text-stone-100",
    }
    : {
      bg: "bg-[#F7F4EC]",
      surface: "bg-[#FCFBF7]",
      border: "border-[#DCD5C4]",
      heading: "text-[#2F4F2F]",
      accentHeading: "text-[#2F4F2F]",
      label: "text-[#6F6A5E]",
      body: "text-[#6F6A5E]",
      text: "text-stone-900",
    };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${c.bg} ${c.text}`}>
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-8 pt-20">
        <div className="flex justify-between items-start">
          <div>
            <p className={`uppercase tracking-[0.4em] text-sm ${c.label}`}>
              Agricultural Vision
            </p>

            <h1 className={`mt-6 max-w-5xl font-serif text-6xl md:text-7xl leading-tight ${c.heading}`}>
              Precision Weed Detection
              <br />
              for Sustainable Agriculture
            </h1>

            <p className={`mt-8 max-w-2xl text-lg leading-8 ${c.body}`}>
              Upload field imagery to perform semantic segmentation using a
              fine-tuned YOLOv8-Seg model.
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`rounded-full px-4 py-2 border transition-all duration-300 shadow-sm hover:shadow-md ${c.surface} ${c.border}`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </section>

      {/* ================= HERO IMAGE ================= */}
      <section className="max-w-7xl mx-auto px-8 pt-16">
        <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-[#CBBF9A]/40">
          <img
            src={heroImage}
            alt="Agricultural field"
            className="h-[520px] w-full object-cover transition duration-700 hover:scale-[1.03]"
          />
        </div>
      </section>

      {/* ================= MODEL INFO ================= */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["Model", "YOLOv8-Seg"],
            ["Dataset", "DeepWeeds"],
            ["Task", "Segmentation"],
            ["Framework", "FastAPI + React"],
          ].map(([title, value]) => (
            <div
              key={title}
              className={`rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 ${c.surface} ${c.border}`}
            >
              <div className="h-1 w-12 rounded-full bg-[#718355] mb-4"></div>
              <p className={`text-xs uppercase tracking-widest ${c.label}`}>{title}</p>
              <h3 className="mt-3 text-xl font-semibold">{value}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= UPLOAD ================= */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="mb-10 max-w-2xl">
          <p className={`uppercase tracking-[0.3em] text-sm ${c.label}`}>
            Field Analysis
          </p>

          <h2 className={`mt-3 text-4xl font-serif ${c.accentHeading}`}>
            Analyze a Field Sample
          </h2>

          <p className={`mt-4 leading-7 ${c.body}`}>
            Upload an image captured in the field. The system performs semantic
            segmentation to identify weed regions and generate a visual
            analysis.
          </p>
        </div>

        <UploadCard
          darkMode={darkMode}
          setPrediction={setPrediction}
          setLoading={setLoading}
          setError={setError}
        />
      </section>

      {/* ================= LOADING ================= */}
      {loading && (
        <section className="pb-20 text-center">
          <div
            className={`inline-flex items-center gap-3 rounded-full px-6 py-3 shadow-sm border ${c.surface} ${c.border}`}
          >
            <div className="h-3 w-3 rounded-full bg-[#718355] animate-pulse"></div>
            <p>Running model inference...</p>
          </div>
        </section>
      )}

      {/* ================= ERROR ================= */}
      {error && (
        <section className="max-w-7xl mx-auto px-8 pb-20">
          <div
            className={`rounded-2xl border p-6 ${darkMode ? "border-red-900 bg-red-950/40" : "border-red-300 bg-red-50"}`}
          >
            <p className={darkMode ? "text-red-300" : "text-red-700"}>{error}</p>
          </div>
        </section>
      )}

      {/* ================= RESULTS ================= */}
      {prediction && (
        <section className="max-w-7xl mx-auto px-8 pb-24">
          <div className="mb-10 max-w-2xl">
            <p className={`uppercase tracking-[0.3em] text-sm ${c.label}`}>
              Results
            </p>

            <h2 className={`mt-3 text-4xl font-serif ${c.accentHeading}`}>
              Field Analysis Report
            </h2>
          </div>

          <ResultCard darkMode={darkMode} prediction={prediction} />

          <div className="mt-12">
            <Legend darkMode={darkMode} legend={prediction.legend} />
          </div>

          <SpeciesInfo darkMode={darkMode} predictedClass={prediction.predicted_class} />
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className={`mt-24 border-t ${c.border}`}>
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className={`font-serif text-2xl ${c.accentHeading}`}>
              Agricultural Vision
            </h3>
            <p className={`mt-1 ${c.label}`}>
              Precision Weed Detection System
            </p>
          </div>

          <p className={`text-sm ${c.label}`}>
            Built using React · FastAPI · YOLOv8-Seg
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;