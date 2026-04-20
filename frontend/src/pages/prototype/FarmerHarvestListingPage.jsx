
import PrototypePageFrame from "@/components/PrototypePageFrame";
import FarmerShell from "@/components/FarmerShell";
import { useNavigate } from "react-router-dom";
import VoiceInput from "../../components/VoiceInput";
import { useState } from "react";
import { createHarvestListing } from "../../lib/harvestApi";

const styles = [
  `.ai-note {
    background: rgba(250, 249, 246, 0.7);
    backdrop-filter: blur(8px);
    border-left: 4px solid #4a6741;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
  }`
];

const themeStyle = {
  "--color-primary": "#4a6741",
  "--color-primary-container": "#4a6741",
  "--color-on-primary": "#fff",
  "--color-surface": "#faf9f6",
  "--color-surface-container": "#efeeeb",
  "--color-outline-variant": "#c3c8bd",
  "--font-headline": "Manrope",
  "--font-body": "Inter"
};


export default function FarmerHarvestListingPage() {
  const navigate = useNavigate();
  // Form state
  const [voiceText, setVoiceText] = useState("");
  const [form, setForm] = useState({
    title: "",
    crop: "",
    estimatedVolume: "",
    price: "",
    harvestWindow: "",
    region: "",
    imageUrl: "",
  });
  const [aiNotes, setAiNotes] = useState([]);
  const [manualNote, setManualNote] = useState("");
  const [aiError, setAiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simulate AI extraction and backend call
  async function handleVoiceTranscript(transcript) {
    setVoiceText(transcript);
    setAiError(null);
    setAiNotes([]);
    setSuccess(false);
    setSubmitting(true);
    try {
      // Simulate backend AI extraction (replace with real API call)
      // Here, we just mock the result for demo
      const aiResult = {
        title: "Elite Paddy - Plot #04",
        crop: "Paddy",
        estimatedVolume: "500kg",
        price: "2400",
        harvestWindow: "Jan 2026",
        region: "Kedah South",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlLkvVJn16qvv6YbG7HviHuz3aih0PlvDYxOyxDM7-3PeFtTScoqYUvQjb6RBKuTmrBHowg32d2__lzIObbro67pDRNYenRus7LTOwyHzpGoL2kZU7yk2iXtKT7rkaAf2C6y69cTUeCAT2C5WLKscMR49nYIThJSTI_aZ7cKE7PQu80NBJ6wdZrTE30nkMjimGA4A4zGxuzdj8PKN6C4Q32qGCxLyL5UwVZkJm-6Ofo1dh823OZsiZsL6PypTpGDTGP_mkCHKFW_A",
        aiNotes: [
          "AI: High yield projection based on rainfall and soil data.",
          "AI: 98% reliability score for this window.",
          "AI: Market price expected to rise 14% by Dec."
        ]
      };
      setForm(aiResult);
      setAiNotes(aiResult.aiNotes);
      // Simulate backend listing creation
      await createHarvestListing({ ...aiResult, transcript });
      setSuccess(true);
    } catch (err) {
      setAiError("AI extraction failed. Please enter notes manually.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleManualNoteSubmit(e) {
    e.preventDefault();
    setAiNotes([manualNote]);
    setAiError(null);
  }

  return (
    <PrototypePageFrame
      title="Farmer Harvest Listing"
      htmlClass="light"
      bodyClass="bg-surface text-on-surface font-body min-h-screen pb-32"
      styles={styles}
      themeStyle={themeStyle}
    >
      <FarmerShell activeNav="barter" headerTitle="My Harvest Listing">
        <main className="max-w-md mx-auto px-6 pt-4 space-y-10">
          <section className="mb-8">
            <h2 className="font-headline font-extrabold text-2xl mb-4">Create Harvest Listing (Voice-First)</h2>
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              language="ms-MY"
            />
            {voiceText && (
              <div className="my-2 text-on-surface-variant text-xs">Transcript: <span className="font-mono">{voiceText}</span></div>
            )}
            {submitting && <div className="text-primary font-bold">Processing AI extraction...</div>}
            {success && <div className="text-green-700 font-bold">Listing created and AI notes generated!</div>}
            {aiError && (
              <div className="text-error font-bold mb-2">{aiError}</div>
            )}
            {/* Manual fallback if AI fails */}
            {aiError && (
              <form onSubmit={handleManualNoteSubmit} className="flex flex-col gap-2 mt-2">
                <textarea
                  className="border rounded p-2"
                  rows={2}
                  placeholder="Enter notes manually..."
                  value={manualNote}
                  onChange={e => setManualNote(e.target.value)}
                  required
                />
                <button type="submit" className="bg-primary text-white rounded px-4 py-2 font-bold">Save Note</button>
              </form>
            )}
          </section>

          {/* Show listing preview if available */}
          {form.title && (
            <section className="mb-8">
              <div className="h-48 w-full rounded-xl overflow-hidden shadow border border-outline-variant/20 mb-4">
                <img src={form.imageUrl} alt={form.title} className="w-full h-full object-cover" />
              </div>
              <h2 className="font-headline font-extrabold text-2xl mb-2">{form.title}</h2>
              <div className="flex gap-3 mb-2">
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold">{form.crop}</span>
                <span className="bg-surface-container px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant">{form.region}</span>
                <span className="bg-surface-container px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant">Harvest: {form.harvestWindow}</span>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Est. Volume</div>
                  <div className="font-bold text-lg">{form.estimatedVolume}</div>
                </div>
                <div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Price</div>
                  <div className="font-bold text-lg">RM {form.price}</div>
                </div>
              </div>
              <button
                className="w-full py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all shadow-md"
                onClick={() => navigate(-1)}
                type="button"
              >
                Back to Dashboard
              </button>
            </section>
          )}

          {/* AI Notes Section */}
          {(aiNotes.length > 0) && (
            <section>
              <h3 className="font-headline font-bold text-lg mb-3">AI-Generated Notes</h3>
              {aiNotes.map((note, idx) => (
                <div key={idx} className="ai-note text-sm text-on-surface-variant mb-2">
                  {note}
                </div>
              ))}
            </section>
          )}
        </main>
      </FarmerShell>
    </PrototypePageFrame>
  );
}
