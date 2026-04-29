import Link from "next/link";

interface SupplierCardProps {
  name: string;
  slug: string;
  servicesSummary: string | null;
  headquarters: string | null;
  website: string | null;
  locationName?: string;
}

export function SupplierCard({
  name,
  slug,
  servicesSummary,
  headquarters,
  website,
}: SupplierCardProps) {
  return (
    <article className="border border-mist rounded-sm p-6 bg-white hover:border-signal transition-colors">
      <h3 className="font-display font-bold text-xl text-hull mb-2">
        <Link href={`/supplier/${slug}`} className="hover:text-signal">
          {name}
        </Link>
      </h3>
      {headquarters && (
        <p className="text-sm text-steel mb-3 font-mono uppercase tracking-wide">
          {headquarters}
        </p>
      )}
      {servicesSummary && (
        <p className="text-steel mb-4 leading-relaxed">{servicesSummary}</p>
      )}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-signal text-sm font-semibold hover:underline"
        >
          Visit website →
        </a>
      )}
    </article>
  );
}

interface DirectoryEmptyStateProps {
  pageType: "location" | "category" | "oem" | "combination";
  pageName: string;
}

export function DirectoryEmptyState({ pageType, pageName }: DirectoryEmptyStateProps) {
  const messages = {
    location: `Suppliers in ${pageName} are being researched. We are curating this list manually to ensure quality.`,
    category: `Suppliers specialising in ${pageName} are being researched. We are curating this list manually to ensure quality.`,
    oem: `Suppliers for ${pageName} parts and service are being researched. We are curating this list manually to ensure quality.`,
    combination: `${pageName} suppliers are being researched. We are curating this list manually to ensure quality.`,
  };

  return (
    <div className="border border-mist rounded-sm p-8 bg-mist/20 text-center">
      <p className="text-steel mb-4">{messages[pageType]}</p>
      <p className="text-sm text-steel">
        Are you a supplier in this category?{" "}
        <Link href="/contact" className="text-signal font-semibold hover:underline">
          Get in touch
        </Link>{" "}
        to be considered for inclusion.
      </p>
    </div>
  );
}
