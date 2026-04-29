"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface VesselTypeFormData {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  description: string;
  typicalSize: string | null;
  propulsionNotes: string | null;
  auxiliaryNotes: string | null;
  cargoSystemNotes: string | null;
  commonOEMs: string | null;
  engineeringChallenges: string | null;
  sourcingNotes: string | null;
  isPublished: boolean;
  reviewedBy: string | null;
}

export function VesselTypeForm({ vesselType }: { vesselType: VesselTypeFormData }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const payload = {
      summary: formData.get("summary"),
      description: formData.get("description"),
      typicalSize: formData.get("typicalSize") || null,
      propulsionNotes: formData.get("propulsionNotes") || null,
      auxiliaryNotes: formData.get("auxiliaryNotes") || null,
      cargoSystemNotes: formData.get("cargoSystemNotes") || null,
      commonOEMs: formData.get("commonOEMs") || null,
      engineeringChallenges: formData.get("engineeringChallenges") || null,
      sourcingNotes: formData.get("sourcingNotes") || null,
      isPublished: formData.get("isPublished") === "on",
      reviewedBy: formData.get("reviewedBy") || null,
    };

    try {
      const res = await fetch(`/api/admin/vessels/${vesselType.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-sm">
          Saved successfully.
        </div>
      )}

      <Section title="Summary & description">
        <Textarea
          label="Summary (shown on listings)"
          name="summary"
          defaultValue={vesselType.summary}
          rows={3}
          required
        />
        <Textarea
          label="Full description"
          name="description"
          defaultValue={vesselType.description}
          rows={6}
          required
        />
      </Section>

      <Section title="Editorial sections">
        <p className="text-sm text-steel mb-4">
          Each section appears as a heading on the public page. Leave blank to omit a section.
        </p>
        <Textarea label="Typical size" name="typicalSize" defaultValue={vesselType.typicalSize ?? ""} rows={2} />
        <Textarea label="Propulsion" name="propulsionNotes" defaultValue={vesselType.propulsionNotes ?? ""} rows={5} />
        <Textarea label="Auxiliary plant" name="auxiliaryNotes" defaultValue={vesselType.auxiliaryNotes ?? ""} rows={4} />
        <Textarea label="Cargo systems" name="cargoSystemNotes" defaultValue={vesselType.cargoSystemNotes ?? ""} rows={4} />
        <Textarea label="Commonly seen OEMs" name="commonOEMs" defaultValue={vesselType.commonOEMs ?? ""} rows={3} />
        <Textarea label="Engineering challenges" name="engineeringChallenges" defaultValue={vesselType.engineeringChallenges ?? ""} rows={4} />
        <Textarea label="Sourcing considerations" name="sourcingNotes" defaultValue={vesselType.sourcingNotes ?? ""} rows={3} />
      </Section>

      <Section title="Review & publish">
        <Field
          label="Reviewed by (name and credential)"
          name="reviewedBy"
          defaultValue={vesselType.reviewedBy ?? ""}
          placeholder="e.g. Adam Surname, Chief Engineer (15+ years)"
        />
        <p className="text-xs text-steel">
          Adding your name as reviewer is recommended once content is verified accurate.
        </p>

        <label className="flex items-start gap-3 mt-4">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={vesselType.isPublished}
            className="mt-1"
          />
          <div>
            <span className="font-semibold text-hull">Publish (make visible publicly)</span>
            <p className="text-sm text-steel">
              Only tick this once content has been reviewed and corrected by a domain expert.
            </p>
          </div>
        </label>
      </Section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-signal text-sail font-semibold px-6 py-3 rounded-sm hover:bg-signal/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
        {vesselType.isPublished && (
          <a
            href={`/vessels/${vesselType.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-mist text-hull font-semibold px-6 py-3 rounded-sm hover:border-signal transition-colors"
          >
            View public page →
          </a>
        )}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border border-mist rounded-sm p-6 bg-white">
      <legend className="font-display font-bold text-lg text-hull px-2">{title}</legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  hint,
  ...props
}: { label: string; name: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-hull mb-1">
        {label}
      </label>
      <input id={name} name={name} className="w-full border border-mist rounded-sm px-3 py-2 text-hull" {...props} />
      {hint && <p className="text-xs text-steel mt-1">{hint}</p>}
    </div>
  );
}

function Textarea({
  label,
  name,
  rows = 3,
  ...props
}: { label: string; name: string; rows?: number } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-hull mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="w-full border border-mist rounded-sm px-3 py-2 text-hull text-sm"
        {...props}
      />
    </div>
  );
}
