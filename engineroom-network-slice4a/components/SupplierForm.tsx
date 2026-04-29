"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  name: string;
  country?: string;
}

interface SupplierFormProps {
  locations: Option[];
  categories: Option[];
  oems: Option[];
}

export function SupplierForm({ locations, categories, oems }: SupplierFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      servicesSummary: formData.get("servicesSummary"),
      website: formData.get("website") || null,
      email: formData.get("email") || null,
      phone: formData.get("phone") || null,
      headquarters: formData.get("headquarters") || null,
      founded: formData.get("founded") ? Number(formData.get("founded")) : null,
      isPublished: formData.get("isPublished") === "on",
      locationIds: formData.getAll("locationIds"),
      categoryIds: formData.getAll("categoryIds"),
      oemIds: formData.getAll("oemIds"),
    };

    try {
      const res = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create supplier");
      }
      router.push("/admin/suppliers");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm">
          {error}
        </div>
      )}

      {/* Basic info */}
      <Section title="Basic information">
        <Field label="Supplier name *" name="name" required />
        <Field
          label="URL slug *"
          name="slug"
          required
          hint="lowercase, hyphens only, e.g. wilhelmsen-ship-management"
          pattern="[a-z0-9-]+"
        />
        <TextareaField
          label="Services summary *"
          name="servicesSummary"
          required
          hint="1-2 sentences shown on directory listing cards"
        />
        <TextareaField
          label="Full description *"
          name="description"
          required
          rows={6}
          hint="Editorial profile of the supplier (paragraph or two)"
        />
      </Section>

      {/* Contact */}
      <Section title="Contact details">
        <Field label="Website" name="website" type="url" placeholder="https://..." />
        <Field label="Email" name="email" type="email" />
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Headquarters" name="headquarters" placeholder="e.g. Singapore" />
        <Field label="Founded (year)" name="founded" type="number" min="1800" max="2030" />
      </Section>

      {/* Relationships */}
      <Section title="Locations served">
        <CheckboxGroup name="locationIds" options={locations} columns={3} />
      </Section>

      <Section title="Part categories">
        <CheckboxGroup name="categoryIds" options={categories} columns={2} />
      </Section>

      <Section title="OEMs covered">
        <CheckboxGroup name="oemIds" options={oems} columns={2} />
      </Section>

      {/* Publish */}
      <Section title="Publication">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="isPublished" className="mt-1" />
          <div>
            <span className="font-semibold text-hull">Publish immediately</span>
            <p className="text-sm text-steel">
              When unchecked, supplier is saved as draft and not visible publicly.
            </p>
          </div>
        </label>
      </Section>

      <button
        type="submit"
        disabled={submitting}
        className="bg-signal text-sail font-semibold px-6 py-3 rounded-sm hover:bg-signal/90 transition-colors disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Supplier"}
      </button>
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
      <input
        id={name}
        name={name}
        className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
        {...props}
      />
      {hint && <p className="text-xs text-steel mt-1">{hint}</p>}
    </div>
  );
}

function TextareaField({
  label,
  name,
  hint,
  rows = 3,
  ...props
}: {
  label: string;
  name: string;
  hint?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-hull mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="w-full border border-mist rounded-sm px-3 py-2 text-hull"
        {...props}
      />
      {hint && <p className="text-xs text-steel mt-1">{hint}</p>}
    </div>
  );
}

function CheckboxGroup({
  name,
  options,
  columns = 2,
}: {
  name: string;
  options: Option[];
  columns?: number;
}) {
  const colClass = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-2`}>
      {options.map((o) => (
        <label key={o.id} className="flex items-center gap-2 text-sm text-hull">
          <input type="checkbox" name={name} value={o.id} />
          <span>
            {o.name}
            {o.country && o.country !== o.name && (
              <span className="text-steel"> · {o.country}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
