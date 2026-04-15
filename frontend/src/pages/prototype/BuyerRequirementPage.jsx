import PrototypePageFrame from "@/components/PrototypePageFrame";
import BuyerShell from "@/components/BuyerShell";
import { useState } from "react";
import { postBuyerRequirement } from "../../lib/harvestApi";

const styles = [];
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

export default function BuyerRequirementPage() {
  const [form, setForm] = useState({
    crop: "",
    quantity: "",
    region: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await postBuyerRequirement(form);
      setSuccess(true);
      setForm({ crop: "", quantity: "", region: "", notes: "" });
    } catch (err) {
      setError("Failed to post requirement.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <PrototypePageFrame
      title="Post Buyer Requirement"
      htmlClass="light"
      bodyClass="bg-surface text-on-surface font-body min-h-screen pb-32"
      styles={styles}
      themeStyle={themeStyle}
    >
      <BuyerShell activeNav="requirements" headerTitle="Post Requirement">
        <main className="max-w-md mx-auto px-6 pt-8">
          <h2 className="font-headline font-extrabold text-2xl mb-6">Post a Requirement</h2>
          <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl shadow p-6 border border-outline-variant/20">
            <div>
              <label className="block text-xs font-bold mb-1">Crop</label>
              <input
                className="w-full border rounded px-3 py-2"
                name="crop"
                value={form.crop}
                onChange={handleChange}
                required
                placeholder="e.g. Paddy, Corn"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Quantity (kg)</label>
              <input
                className="w-full border rounded px-3 py-2"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
                min={1}
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Region</label>
              <input
                className="w-full border rounded px-3 py-2"
                name="region"
                value={form.region}
                onChange={handleChange}
                required
                placeholder="e.g. Kedah, Perak"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Notes (optional)</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Special requirements, delivery, etc."
              />
            </div>
            {error && <div className="text-error text-xs">{error}</div>}
            {success && <div className="text-green-700 text-xs font-bold">Requirement posted!</div>}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all shadow-md"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Requirement"}
            </button>
          </form>
        </main>
      </BuyerShell>
    </PrototypePageFrame>
  );
}
