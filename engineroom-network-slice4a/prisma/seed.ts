// Seed data for the supplier directory.
// Run with: npx tsx prisma/seed.ts (or npm run db:seed)
//
// This populates Locations, Part Categories, and OEMs with research-grade data.
// Suppliers are added separately via the admin panel as research progresses.
//
// All data should be reviewed by a domain expert (Adam) before going live.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// LOCATIONS: 30 maritime hubs/ports
// ─────────────────────────────────────────────────────────────────────────────

const LOCATIONS = [
  // Asia-Pacific
  { slug: "singapore", name: "Singapore", country: "Singapore", region: "ASIA_PACIFIC", isMajorHub: true,
    description: "Singapore is the world's busiest transhipment port and a primary hub for marine engineering services in Asia. Engineers sourcing parts here benefit from extensive supplier coverage, fast turnaround times, and proximity to the Strait of Malacca shipping lanes." },
  { slug: "shanghai", name: "Shanghai", country: "China", region: "ASIA_PACIFIC", isMajorHub: true,
    description: "Shanghai is the world's largest container port and a major centre for shipbuilding, repair, and parts supply. Strong manufacturing base and extensive aftermarket support for Chinese-built vessels." },
  { slug: "busan", name: "Busan", country: "South Korea", region: "ASIA_PACIFIC", isMajorHub: true,
    description: "Busan is a major hub for ship repair and parts supply in northeast Asia, particularly strong for Korean-built vessels and offshore equipment." },
  { slug: "hong-kong", name: "Hong Kong", country: "Hong Kong", region: "ASIA_PACIFIC", isMajorHub: true,
    description: "A long-established marine services hub with strong technical and chandlery networks serving regional shipping." },
  { slug: "tokyo-yokohama", name: "Tokyo / Yokohama", country: "Japan", region: "ASIA_PACIFIC", isMajorHub: true,
    description: "Primary hub for Japanese-OEM parts and high-precision marine equipment, with strong technical support networks." },
  { slug: "manila", name: "Manila", country: "Philippines", region: "ASIA_PACIFIC", isMajorHub: false,
    description: "Major crewing centre and growing parts supply hub in the Philippines." },
  { slug: "mumbai", name: "Mumbai", country: "India", region: "ASIA_PACIFIC", isMajorHub: true,
    description: "India's largest port and a major centre for ship repair, drydocking, and parts supply." },

  // Europe
  { slug: "rotterdam", name: "Rotterdam", country: "Netherlands", region: "EUROPE", isMajorHub: true,
    description: "Europe's largest port and a critical hub for marine engineering services. Excellent supplier coverage across all major OEM ranges, strong logistics infrastructure for fast parts delivery." },
  { slug: "antwerp", name: "Antwerp", country: "Belgium", region: "EUROPE", isMajorHub: true,
    description: "Major European port with strong chemical and bulk shipping focus. Comprehensive marine services and parts network." },
  { slug: "hamburg", name: "Hamburg", country: "Germany", region: "EUROPE", isMajorHub: true,
    description: "Northern Europe's gateway port and a major centre for German-OEM marine equipment, particularly MAN B&W and MTU." },
  { slug: "piraeus", name: "Piraeus", country: "Greece", region: "EUROPE", isMajorHub: true,
    description: "Greece's largest port and a hub for the global Greek shipping community. Strong technical and parts supply networks." },
  { slug: "marseille", name: "Marseille", country: "France", region: "EUROPE", isMajorHub: false,
    description: "Major Mediterranean hub with comprehensive marine services and connections to French and West African shipping routes." },
  { slug: "felixstowe", name: "Felixstowe", country: "United Kingdom", region: "EUROPE", isMajorHub: false,
    description: "UK's largest container port. Marine services hub for the Thames Estuary region with broad supplier networks." },
  { slug: "aberdeen", name: "Aberdeen", country: "United Kingdom", region: "EUROPE", isMajorHub: false,
    description: "Primary North Sea offshore hub. Specialised in offshore vessels, OSVs, and oil-and-gas marine equipment." },
  { slug: "gdansk", name: "Gdańsk", country: "Poland", region: "EUROPE", isMajorHub: false,
    description: "Major Baltic Sea hub with strong shipbuilding heritage and growing parts supply infrastructure." },

  // Middle East
  { slug: "dubai", name: "Dubai", country: "United Arab Emirates", region: "MIDDLE_EAST", isMajorHub: true,
    description: "The Middle East's primary marine services hub. Jebel Ali handles the regional flow of parts and offers fast supplier coverage for vessels transiting the Gulf." },
  { slug: "fujairah", name: "Fujairah", country: "United Arab Emirates", region: "MIDDLE_EAST", isMajorHub: true,
    description: "A major bunkering hub on the Gulf of Oman, increasingly important for parts supply to vessels avoiding Strait of Hormuz transits." },
  { slug: "jeddah", name: "Jeddah", country: "Saudi Arabia", region: "MIDDLE_EAST", isMajorHub: false,
    description: "Saudi Arabia's primary Red Sea port and a key transit hub for vessels through the Suez Canal." },

  // North America
  { slug: "houston-tx", name: "Houston, TX", country: "United States", region: "NORTH_AMERICA", isMajorHub: true,
    description: "Major Gulf Coast port and the centre of the US energy shipping sector. Strong supplier networks for tankers, offshore vessels, and US-flag commercial fleet." },
  { slug: "new-york-new-jersey", name: "New York / New Jersey", country: "United States", region: "NORTH_AMERICA", isMajorHub: true,
    description: "The largest port complex on the US East Coast. Comprehensive marine services and parts supply." },
  { slug: "los-angeles-long-beach", name: "Los Angeles / Long Beach", country: "United States", region: "NORTH_AMERICA", isMajorHub: true,
    description: "The busiest port complex in the Western Hemisphere, primary gateway for trans-Pacific trade." },
  { slug: "vancouver", name: "Vancouver", country: "Canada", region: "NORTH_AMERICA", isMajorHub: false,
    description: "Canada's largest port and a major Pacific hub for bulk carriers and container vessels." },
  { slug: "panama", name: "Panama (Balboa / Cristobal)", country: "Panama", region: "NORTH_AMERICA", isMajorHub: true,
    description: "Critical transit hub at both ends of the Panama Canal, with growing parts supply infrastructure for vessels in transit." },

  // South America
  { slug: "santos", name: "Santos", country: "Brazil", region: "SOUTH_AMERICA", isMajorHub: true,
    description: "Latin America's largest port and Brazil's primary marine services hub." },
  { slug: "valparaiso", name: "Valparaíso", country: "Chile", region: "SOUTH_AMERICA", isMajorHub: false,
    description: "Chile's main port and a key hub for South Pacific shipping routes." },

  // Africa
  { slug: "durban", name: "Durban", country: "South Africa", region: "AFRICA", isMajorHub: true,
    description: "Southern Africa's largest port and the primary marine services hub for vessels rounding the Cape of Good Hope." },
  { slug: "lagos", name: "Lagos", country: "Nigeria", region: "AFRICA", isMajorHub: false,
    description: "West Africa's largest port. Important for the regional offshore oil and gas sector." },
  { slug: "alexandria", name: "Alexandria", country: "Egypt", region: "AFRICA", isMajorHub: false,
    description: "A historic Mediterranean port and a key hub for vessels approaching the Suez Canal." },

  // Oceania
  { slug: "sydney", name: "Sydney", country: "Australia", region: "OCEANIA", isMajorHub: false,
    description: "Australia's largest container port and a marine services hub for the Asia-Pacific region." },
  { slug: "auckland", name: "Auckland", country: "New Zealand", region: "OCEANIA", isMajorHub: false,
    description: "New Zealand's largest port and primary marine services centre." },
];

// ─────────────────────────────────────────────────────────────────────────────
// PART CATEGORIES: 25 categories aligned to how marine engineers think
// ─────────────────────────────────────────────────────────────────────────────

const PART_CATEGORIES = [
  // Propulsion & Power
  { slug: "main-engines", name: "Main Engines", sortOrder: 1,
    description: "Two-stroke and four-stroke main engine parts, services, and overhauls. Includes pistons, liners, bearings, valves, and complete engine assemblies." },
  { slug: "auxiliary-engines", name: "Auxiliary Engines", sortOrder: 2,
    description: "Generator sets, emergency generators, and auxiliary power equipment. Parts and service for major OEMs including Caterpillar, Cummins, MAN, MTU, and Volvo Penta." },
  { slug: "turbochargers", name: "Turbochargers", sortOrder: 3,
    description: "Turbocharger parts, overhauls, balancing, and exchange units. Coverage for ABB, MHI, Napier, KBB, and other major turbocharger OEMs." },
  { slug: "fuel-injectors", name: "Fuel Injection Equipment", sortOrder: 4,
    description: "Fuel injectors, fuel pumps, fuel valves, and high-pressure fuel system components for two-stroke and four-stroke marine engines." },
  { slug: "lubrication-systems", name: "Lubrication Systems", sortOrder: 5,
    description: "Lube oil pumps, separators, coolers, filters, and lubrication system components." },
  { slug: "cooling-systems", name: "Cooling Systems", sortOrder: 6,
    description: "Heat exchangers, central cooler systems, sea water and fresh water cooling components, and HVAC for engine room applications." },
  { slug: "exhaust-systems", name: "Exhaust Systems & Emissions", sortOrder: 7,
    description: "Exhaust gas piping, silencers, SCR systems, scrubbers, and IMO Tier III compliance equipment." },
  { slug: "shafting-propellers", name: "Shafting & Propellers", sortOrder: 8,
    description: "Propeller shafts, intermediate shafts, stern tubes, controllable pitch propellers, and fixed pitch propellers." },

  // Electrical & Control
  { slug: "electrical-equipment", name: "Electrical Equipment", sortOrder: 9,
    description: "Switchboards, motors, generators, transformers, batteries, and electrical distribution equipment." },
  { slug: "automation-control", name: "Automation & Control Systems", sortOrder: 10,
    description: "Engine control systems, alarm and monitoring systems, integrated automation systems (IAS), and PLCs for marine applications." },
  { slug: "navigation-bridge", name: "Navigation & Bridge Equipment", sortOrder: 11,
    description: "ECDIS, radar, autopilot, gyrocompass, and integrated bridge systems." },
  { slug: "communication-equipment", name: "Communication Equipment", sortOrder: 12,
    description: "GMDSS, satellite communications, internal communications, and radio equipment." },

  // Pumps & Piping
  { slug: "pumps", name: "Pumps", sortOrder: 13,
    description: "Centrifugal, positive displacement, screw, and gear pumps for cargo, ballast, fire, bilge, and engine room services." },
  { slug: "valves-piping", name: "Valves & Piping", sortOrder: 14,
    description: "Marine valves, piping systems, fittings, and flow control equipment for all shipboard services." },
  { slug: "compressors", name: "Compressors", sortOrder: 15,
    description: "Air compressors, refrigeration compressors, starting air systems, and compressed air components." },

  // Cargo & Deck
  { slug: "cargo-handling", name: "Cargo Handling Equipment", sortOrder: 16,
    description: "Cranes, hatch covers, cargo pumps, hose-handling equipment, and cargo system specialists." },
  { slug: "deck-machinery", name: "Deck Machinery", sortOrder: 17,
    description: "Windlasses, capstans, mooring winches, anchor handling equipment, and steering gear." },
  { slug: "lifting-equipment", name: "Lifting Equipment", sortOrder: 18,
    description: "Engine room cranes, provision cranes, lifeboat davits, and lifting gear inspection." },

  // Safety & Compliance
  { slug: "safety-equipment", name: "Safety Equipment", sortOrder: 19,
    description: "Lifeboats, life rafts, fire-fighting equipment, breathing apparatus, and SOLAS compliance items." },
  { slug: "fire-safety-systems", name: "Fire Safety Systems", sortOrder: 20,
    description: "Fixed firefighting systems (CO2, water mist, foam), fire detection, and gas detection systems." },

  // Auxiliary Systems
  { slug: "fresh-water-systems", name: "Fresh Water Systems", sortOrder: 21,
    description: "Reverse osmosis plants, evaporators, fresh water generators, and potable water systems." },
  { slug: "sewage-treatment", name: "Sewage Treatment & Waste", sortOrder: 22,
    description: "Sewage treatment plants, oily water separators, garbage compactors, and MARPOL compliance equipment." },
  { slug: "ballast-water-treatment", name: "Ballast Water Treatment", sortOrder: 23,
    description: "BWTS systems, UV and electrochlorination treatment, and ballast water compliance." },
  { slug: "lubricants-chemicals", name: "Lubricants & Chemicals", sortOrder: 24,
    description: "Marine lubricants, fuel additives, water treatment chemicals, and cleaning products." },
  { slug: "gaskets-seals", name: "Gaskets, Seals & Fasteners", sortOrder: 25,
    description: "O-rings, gaskets, mechanical seals, fasteners, and sealing solutions for marine applications." },
];

// ─────────────────────────────────────────────────────────────────────────────
// OEMS: 20 major marine engine and equipment manufacturers
// ─────────────────────────────────────────────────────────────────────────────

const OEMS = [
  { slug: "man-energy-solutions", name: "MAN Energy Solutions", headquarters: "Augsburg, Germany",
    description: "Major manufacturer of two-stroke and four-stroke marine engines (formerly MAN B&W). Powers a substantial share of the world's commercial fleet." },
  { slug: "wartsila", name: "Wärtsilä", headquarters: "Helsinki, Finland",
    description: "Finnish multinational that designs and manufactures medium-speed marine engines, propulsion systems, and integrated marine solutions." },
  { slug: "caterpillar-marine", name: "Caterpillar Marine", headquarters: "Texas, USA",
    description: "Major manufacturer of marine engines and power systems, including the MaK and Cat engine ranges." },
  { slug: "cummins-marine", name: "Cummins Marine", headquarters: "Indiana, USA",
    description: "Manufacturer of high-speed marine engines for commercial and recreational vessels." },
  { slug: "yanmar", name: "Yanmar", headquarters: "Osaka, Japan",
    description: "Japanese manufacturer of marine engines, particularly strong in commercial workboats, fishing vessels, and pleasure craft." },
  { slug: "mtu", name: "Rolls-Royce MTU", headquarters: "Friedrichshafen, Germany",
    description: "Manufacturer of high-speed marine engines (Series 2000, 4000, 8000) widely used in fast ferries, naval vessels, and yachts." },
  { slug: "volvo-penta", name: "Volvo Penta", headquarters: "Gothenburg, Sweden",
    description: "Swedish manufacturer of marine propulsion and power systems, well-established in commercial workboats and recreational marine." },
  { slug: "scania-marine", name: "Scania Marine", headquarters: "Södertälje, Sweden",
    description: "Manufacturer of marine engines for commercial vessels, work boats, and auxiliary applications." },
  { slug: "hyundai-himsen", name: "Hyundai Heavy Industries (HiMSEN)", headquarters: "Ulsan, South Korea",
    description: "Korean manufacturer of medium-speed marine engines (HiMSEN range) for commercial vessels." },
  { slug: "doosan-engine", name: "Doosan Engine", headquarters: "Changwon, South Korea",
    description: "Korean licensee manufacturer of MAN and Wärtsilä marine engines, with significant presence in newbuild fleet." },
  { slug: "abb-turbocharging", name: "ABB Turbocharging", headquarters: "Baden, Switzerland",
    description: "Major manufacturer of turbochargers for two-stroke and four-stroke marine engines (TPL, A100, A200 series)." },
  { slug: "mhi-turbocharger", name: "Mitsubishi Heavy Industries Turbocharger", headquarters: "Sagamihara, Japan",
    description: "Manufacturer of marine turbochargers (MET series), particularly common on Japanese-built vessels." },
  { slug: "napier-turbochargers", name: "Napier Turbochargers", headquarters: "Lincoln, United Kingdom",
    description: "Manufacturer of turbochargers (NA, NT, NP series) for medium and large marine engines." },
  { slug: "kongsberg-maritime", name: "Kongsberg Maritime", headquarters: "Kongsberg, Norway",
    description: "Major supplier of marine automation, navigation, dynamic positioning, and propulsion systems." },
  { slug: "alfa-laval", name: "Alfa Laval", headquarters: "Lund, Sweden",
    description: "Manufacturer of marine separators, heat exchangers, fresh water generators, ballast water treatment, and exhaust gas cleaning systems." },
  { slug: "schottel", name: "SCHOTTEL", headquarters: "Spay, Germany",
    description: "German manufacturer of azimuth thrusters, rudderpropellers, and propulsion systems for tugs, ferries, and offshore vessels." },
  { slug: "kawasaki-heavy-industries", name: "Kawasaki Heavy Industries", headquarters: "Kobe, Japan",
    description: "Japanese manufacturer of marine engines, propulsion systems, and LNG carrier equipment." },
  { slug: "siemens-energy", name: "Siemens Energy Marine", headquarters: "Munich, Germany",
    description: "Manufacturer of marine electrical systems, generators, and electric propulsion solutions." },
  { slug: "rolls-royce-marine", name: "Rolls-Royce Marine", headquarters: "Bergen, Norway",
    description: "Now Kongsberg Maritime following acquisition. Historic supplier of medium-speed engines and propulsion systems." },
  { slug: "abb-marine", name: "ABB Marine & Ports", headquarters: "Helsinki, Finland",
    description: "Manufacturer of marine electric propulsion (Azipod), automation, and power systems." },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...");

  // Locations
  console.log(`📍 Seeding ${LOCATIONS.length} locations...`);
  for (const loc of LOCATIONS) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: loc as any,
      create: loc as any,
    });
  }

  // Part categories
  console.log(`🔧 Seeding ${PART_CATEGORIES.length} part categories...`);
  for (const cat of PART_CATEGORIES) {
    await prisma.partCategory.upsert({
      where: { slug: cat.slug },
      update: cat as any,
      create: cat as any,
    });
  }

  // OEMs
  console.log(`🏭 Seeding ${OEMS.length} OEMs...`);
  for (const oem of OEMS) {
    await prisma.oEM.upsert({
      where: { slug: oem.slug },
      update: oem as any,
      create: oem as any,
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
