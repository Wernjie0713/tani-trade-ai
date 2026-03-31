import { useState } from "react"

import { ITEM_OPTIONS, UNIT_OPTIONS, findItemOption } from "@/lib/intakeCatalog"

function buildInitialForm(summary) {
  return {
    cropDisplayLabel: summary?.crop_display_label || "",
    timelineLabel: summary?.timeline_label || "Next Week",
    timelineDays: String(summary?.timeline_days ?? 7),
    radiusKm: String(summary?.radius_km ?? 5),
    haveItem: {
      normalizedName: summary?.have_item?.normalized_name || ITEM_OPTIONS[0].normalizedName,
      displayName: summary?.have_item?.display_name || ITEM_OPTIONS[0].displayName,
      quantity: String(summary?.have_item?.quantity ?? 1),
      unit: summary?.have_item?.unit || ITEM_OPTIONS[0].defaultUnit,
    },
    needItem: {
      normalizedName: summary?.need_item?.normalized_name || ITEM_OPTIONS[1].normalizedName,
      displayName: summary?.need_item?.display_name || ITEM_OPTIONS[1].displayName,
      quantity: String(summary?.need_item?.quantity ?? 1),
      unit: summary?.need_item?.unit || ITEM_OPTIONS[1].defaultUnit,
    },
  }
}

function InputRow({ children, hint, label }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="shrink-0 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.14em] text-primary">
          {label}
        </span>
        {hint ? (
          <span className="min-w-0 text-right text-[10px] font-semibold italic leading-tight text-on-surface-variant">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </label>
  )
}

function fieldClasses() {
  return "w-full rounded-[1.4rem] border border-outline-variant/30 bg-surface-container-lowest px-4 py-3.5 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary/40"
}

function SelectField({ children, className = "", ...props }) {
  return (
    <div className="relative">
      <select
        className={`${fieldClasses()} appearance-none pr-12 ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-primary/80">
        expand_more
      </span>
    </div>
  )
}

function IntakeSummaryEditSheet({ onClose, onSave, open, saveState, summary }) {
  const [form, setForm] = useState(() => buildInitialForm(summary))

  if (!open) {
    return null
  }

  function updateTopLevel(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateItem(role, field, value) {
    setForm((current) => {
      const nextItem = {
        ...current[role],
        [field]: value,
      }

      if (field === "normalizedName") {
        const option = findItemOption(value)
        if (option) {
          nextItem.displayName = option.displayName
          nextItem.unit = option.defaultUnit
        }
      }

      return {
        ...current,
        [role]: nextItem,
      }
    })
  }

  function handleSave() {
    onSave({
      crop_display_label: form.cropDisplayLabel.trim() || null,
      timeline_label: form.timelineLabel.trim(),
      timeline_days: Number(form.timelineDays),
      radius_km: Number(form.radiusKm),
      have_item: {
        normalized_name: form.haveItem.normalizedName,
        display_name: form.haveItem.displayName,
        quantity: Number(form.haveItem.quantity),
        unit: form.haveItem.unit,
      },
      need_item: {
        normalized_name: form.needItem.normalizedName,
        display_name: form.needItem.displayName,
        quantity: Number(form.needItem.quantity),
        unit: form.needItem.unit,
      },
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/35 px-4 pb-6 pt-16 backdrop-blur-sm">
      <button
        aria-label="Close editor"
        className="absolute inset-0"
        onClick={saveState.status === "loading" ? undefined : onClose}
        type="button"
      />

      <section className="relative z-10 w-full max-w-lg rounded-[2rem] border border-primary/10 bg-background shadow-2xl shadow-black/15">
        <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/60">
              Refine Parsed Intake
            </p>
            <h3 className="font-headline text-xl font-extrabold text-primary">Update Request Details</h3>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-5">
          <InputRow hint="Leave blank if not specified" label="Crop Context">
            <input
              className={fieldClasses()}
              onChange={(event) => updateTopLevel("cropDisplayLabel", event.target.value)}
              placeholder="e.g., Paddy (MR269) or Sweet Corn"
              type="text"
              value={form.cropDisplayLabel}
            />
          </InputRow>

          <div className="space-y-4 rounded-[1.6rem] border border-primary/10 bg-surface-container-low/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary/60">I Have</p>
                <h4 className="font-headline text-base font-bold text-primary">Available Trade Item</h4>
              </div>
            </div>

            <InputRow label="Item">
              <SelectField
                onChange={(event) => updateItem("haveItem", "normalizedName", event.target.value)}
                value={form.haveItem.normalizedName}
              >
                {ITEM_OPTIONS.map((item) => (
                  <option key={item.normalizedName} value={item.normalizedName}>
                    {item.displayName}
                  </option>
                ))}
              </SelectField>
            </InputRow>

            <div className="grid grid-cols-2 gap-3">
              <InputRow label="Quantity">
                <input
                  className={fieldClasses()}
                  min="0.1"
                  onChange={(event) => updateItem("haveItem", "quantity", event.target.value)}
                  step="0.1"
                  type="number"
                  value={form.haveItem.quantity}
                />
              </InputRow>
              <InputRow label="Unit">
                <SelectField onChange={(event) => updateItem("haveItem", "unit", event.target.value)} value={form.haveItem.unit}>
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </SelectField>
              </InputRow>
            </div>
          </div>

          <div className="space-y-4 rounded-[1.6rem] border border-primary/10 bg-surface-container-low/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                <span className="material-symbols-outlined">shopping_bag</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary/60">I Need</p>
                <h4 className="font-headline text-base font-bold text-primary">Requested Item</h4>
              </div>
            </div>

            <InputRow label="Item">
              <SelectField
                onChange={(event) => updateItem("needItem", "normalizedName", event.target.value)}
                value={form.needItem.normalizedName}
              >
                {ITEM_OPTIONS.map((item) => (
                  <option key={item.normalizedName} value={item.normalizedName}>
                    {item.displayName}
                  </option>
                ))}
              </SelectField>
            </InputRow>

            <div className="grid grid-cols-2 gap-3">
              <InputRow label="Quantity">
                <input
                  className={fieldClasses()}
                  min="0.1"
                  onChange={(event) => updateItem("needItem", "quantity", event.target.value)}
                  step="0.1"
                  type="number"
                  value={form.needItem.quantity}
                />
              </InputRow>
              <InputRow label="Unit">
                <SelectField onChange={(event) => updateItem("needItem", "unit", event.target.value)} value={form.needItem.unit}>
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </SelectField>
              </InputRow>
            </div>
          </div>

          {saveState.error ? (
            <div className="rounded-[1.4rem] border border-error/20 bg-error-container/70 px-4 py-3 text-sm font-semibold text-on-error-container">
              {saveState.error}
            </div>
          ) : null}
        </div>

        <div className="flex gap-3 border-t border-primary/10 px-5 py-4">
          <button
            className="flex-1 rounded-full bg-surface-container-highest px-5 py-4 font-bold text-on-surface transition-colors hover:bg-surface-container-high"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-full bg-primary px-5 py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95 disabled:opacity-70"
            disabled={saveState.status === "loading"}
            onClick={handleSave}
            type="button"
          >
            {saveState.status === "loading" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>
    </div>
  )
}

export default IntakeSummaryEditSheet
