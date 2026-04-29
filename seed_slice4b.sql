-- ============================================================================
-- EngineRoom Network: Slice 4b Vessel Types Seed Data
-- ============================================================================
-- Populates 18 major commercial vessel types with starter editorial content.
--
-- IMPORTANT: All entries are seeded as isPublished=false (DRAFTS).
-- They will not be visible publicly until a domain expert reviews each entry,
-- corrects any inaccuracies, and explicitly publishes via the admin panel.
--
-- The editorial content here is GENERAL INDUSTRY GUIDANCE and may contain
-- inaccuracies. Real vessels of the same type can have substantially different
-- equipment depending on yard, build year, and owner specifications.
-- ============================================================================

INSERT INTO "VesselType" (
  "id", "slug", "name", "shortName", "category", "summary", "description",
  "typicalSize", "propulsionNotes", "auxiliaryNotes", "commonOEMs",
  "engineeringChallenges", "sourcingNotes", "isPublished", "updatedAt"
) VALUES

-- ─── TANKERS ──────────────────────────────────────────────────────────────
('vt_vlcc', 'vlcc-tanker', 'Very Large Crude Carrier (VLCC)', 'VLCC', 'TANKER',
  'VLCCs are deep-sea crude oil tankers in the 200,000 to 320,000 DWT range, used to transport crude oil from major loading ports (the Arabian Gulf, West Africa) to refineries worldwide.',
  'A draft reference for marine engineers working on Very Large Crude Carriers. This guide covers typical equipment configurations, common engineering challenges, and considerations for parts sourcing on these deep-sea crude tankers.

This content is general industry guidance and not vessel-specific specification. Real-world equipment fits vary significantly by yard, build year, and owner preference. Engineers should always refer to vessel-specific documentation and class records for authoritative information.',
  'Approximately 200,000 to 320,000 DWT, 330m LOA, 60m beam, 22m draft when laden',
  'VLCCs are typically powered by a single low-speed two-stroke main engine, with output in the 18,000 to 25,000 kW range, driving a single fixed-pitch propeller. Common engine builders include MAN Energy Solutions and licensees (Hyundai, Doosan, Kawasaki). Engine configurations are commonly six or seven cylinders. Engines are increasingly being delivered as dual-fuel-capable to support LNG bunkering, though the majority of the in-service fleet runs on HFO/VLSFO with MGO for emission control areas.',
  'Auxiliary power is typically provided by three or four medium-speed diesel generator sets, sized to handle the full cargo discharge load (cargo pumps run on steam from boilers in many designs, but electrically-driven cargo pump configurations are increasingly common). Steam generation for cargo heating and the cargo pump turbines is provided by oil-fired auxiliary boilers and exhaust gas economisers.',
  'Engines: MAN B&W, Wärtsilä-licensed builds. Turbochargers: ABB, MHI. Generators: Caterpillar, MAN, Wärtsilä. Cargo pumps and turbines: Shinko, Frank Mohn (Framo), Marflex. Inert gas systems: Smit Gas Systems, Maritime Protection. Cargo control: Emerson, Honeywell, Kongsberg.',
  'Common engineering challenges on VLCCs include managing fuel quality across long voyages, maintaining cargo pump reliability during discharge operations, exhaust gas economiser tube fouling, and increasingly compliance with emissions regulations in load and discharge ports. Tank cleaning operations between cargoes also present a significant engineering workload.',
  'For long-voyage VLCCs, parts strategy typically involves stocking critical spares onboard, using major hub ports (Singapore, Fujairah, Rotterdam) for planned spare deliveries, and maintaining strong relationships with OEM service networks for emergency support. Engine spares lead times are a regular consideration; turbocharger overhauls are often planned around scheduled drydock.',
  false, NOW()),

('vt_suezmax', 'suezmax-tanker', 'Suezmax Crude Tanker', 'Suezmax', 'TANKER',
  'Suezmax tankers are mid-size crude oil carriers, typically 120,000 to 200,000 DWT, sized to transit the Suez Canal fully laden. Common on Mediterranean, Atlantic, and West African crude trades.',
  'A draft reference for marine engineers working on Suezmax-class crude tankers. This guide covers typical equipment configurations, common engineering challenges, and considerations for parts sourcing.

This content is general industry guidance and not vessel-specific specification. Real-world equipment fits vary significantly by yard, build year, and owner preference.',
  'Approximately 120,000 to 200,000 DWT, 270m LOA, 50m beam, 17m maximum draft (limited by Suez Canal)',
  'Suezmax tankers are typically powered by a single low-speed two-stroke main engine in the 12,000 to 18,000 kW range, six or seven cylinders, driving a single fixed-pitch propeller. Common builders are MAN Energy Solutions and licensed manufacturers.',
  'Auxiliary power is provided by three or four medium-speed diesel generator sets. Cargo discharge typically uses electrically-driven or steam turbine-driven centrifugal cargo pumps, with the pump room located between the cargo block and engine room.',
  'Engines: MAN B&W. Turbochargers: ABB, MHI, Napier. Cargo pumps: Shinko, Framo. Inert gas: Smit Gas Systems. Separators: Alfa Laval.',
  'Engineers on Suezmax tankers commonly deal with cargo pump bearing wear, fuel injection equipment fouling on lower-grade fuels, and compliance challenges in ECA waters. Cargo heating coil maintenance is a recurring focus during heavy crude discharges.',
  'Major service hubs include Singapore, Rotterdam, Fujairah, and Houston. Greek-managed Suezmaxes often plan major maintenance around Piraeus or Mediterranean drydocks.',
  false, NOW()),

('vt_aframax', 'aframax-tanker', 'Aframax Tanker', 'Aframax', 'TANKER',
  'Aframax tankers are mid-size crude and product tankers, typically 80,000 to 120,000 DWT. Originally named for the Average Freight Rate Assessment system, they are common on shorter-haul and regional crude trades.',
  'A draft reference for marine engineers working on Aframax-class tankers. Covers typical equipment, common challenges, and parts sourcing.

This content is general industry guidance, not vessel-specific specification.',
  'Approximately 80,000 to 120,000 DWT, 245m LOA, 42m beam',
  'Aframax tankers are typically powered by a single low-speed two-stroke main engine in the 10,000 to 14,000 kW range, six cylinders, driving a fixed-pitch propeller.',
  'Three diesel generator sets are common. Cargo systems use electrically-driven or steam turbine-driven centrifugal cargo pumps.',
  'Engines: MAN B&W, Wärtsilä. Turbochargers: ABB, MHI. Cargo pumps: Shinko, Framo.',
  'Aframax engineering work commonly focuses on cargo pump reliability during back-to-back discharge operations and maintenance scheduling around busy regional trade routes.',
  'Common parts hubs vary by trade route. Pacific-traded Aframaxes use Singapore and Busan; North Sea-traded vessels rely on Rotterdam and Antwerp.',
  false, NOW()),

('vt_mr2', 'mr2-product-tanker', 'MR2 Product Tanker', 'MR2', 'TANKER',
  'MR2 (Medium Range) product tankers are 40,000 to 55,000 DWT vessels designed to carry refined petroleum products such as gasoline, diesel, jet fuel, and naphtha. They are the workhorses of the global products trade.',
  'A draft reference for marine engineers working on MR2 product tankers. Covers typical equipment, common challenges, and parts sourcing.

This content is general industry guidance, not vessel-specific specification.',
  'Approximately 40,000 to 55,000 DWT, 180m LOA, 32m beam',
  'MR2 product tankers are typically powered by a single low-speed two-stroke main engine in the 7,000 to 9,000 kW range, six cylinders, driving a fixed-pitch propeller.',
  'Three diesel generator sets are common. Cargo systems must accommodate multiple grades simultaneously, with multiple deepwell pumps (often Framo) and dedicated piping systems for product segregation.',
  'Engines: MAN B&W, Wärtsilä. Turbochargers: ABB, MHI. Cargo pumps: Framo (deepwell), Shinko. Cargo control: Emerson, Saab.',
  'Multi-grade cargo discharge presents the primary engineering challenge: maintaining segregation, managing line cleaning between products, and preventing cross-contamination. Tank coating maintenance is critical for clean-product operations.',
  'Singapore is the dominant hub for MR2 maintenance and parts due to the Asian products trade. Rotterdam and Houston serve their respective regions.',
  false, NOW()),

-- ─── GAS CARRIERS ─────────────────────────────────────────────────────────
('vt_lng_carrier', 'lng-carrier', 'LNG Carrier', 'LNG Carrier', 'GAS_CARRIER',
  'LNG carriers transport liquefied natural gas at minus 162°C in heavily insulated cargo containment systems. Modern LNG carriers are typically 174,000 cubic metres capacity and use the boil-off gas as fuel for propulsion.',
  'A draft reference for marine engineers working on LNG carriers. These are among the most technically sophisticated commercial vessels in service, with cryogenic cargo systems, dual-fuel propulsion, and complex automation.

This content is general industry guidance, not vessel-specific specification. LNG carrier equipment varies significantly between containment systems (Mark III, NO96, GTT) and propulsion choices (steam turbine, dual-fuel diesel-electric, ME-GI, X-DF).',
  'Typically 174,000 cubic metres cargo capacity, 295m LOA, 46m beam',
  'Modern LNG carriers commonly use one of three propulsion configurations: dual-fuel diesel-electric (DFDE) with four medium-speed engines driving generators that power electric motors; mechanical dual-fuel (ME-GI from MAN, or X-DF from WinGD) with a single dual-fuel two-stroke engine; or, in older vessels, a steam turbine plant burning boil-off gas.',
  'Auxiliary power on DFDE configurations comes from the same engines that drive propulsion, sized for both modes. Cargo handling is supported by electric cargo pumps in each cargo tank, gas combustion units (GCUs) for excess boil-off, and reliquefaction plants on some designs.',
  'Engines: MAN Energy Solutions (ME-GI), Wärtsilä (DF), WinGD (X-DF). Cargo systems: GTT (containment), Cryostar, ITT Goulds. Reliquefaction: Hamworthy, Wärtsilä Hamworthy, Cryostar. Turbochargers: ABB.',
  'LNG engineering presents unique challenges: managing boil-off gas across changing weather conditions, dual-fuel changeover procedures, cryogenic equipment integrity, and complex cargo handling sequences during loading and discharge. Compressor reliability and gas detection systems are critical safety items.',
  'Specialist gas-carrier service providers concentrate around major LNG hubs (Singapore, Qatar, Yokohama, Rotterdam). LNG carriers often have OEM service contracts in place due to the complexity of equipment.',
  false, NOW()),

('vt_lpg_carrier', 'lpg-carrier', 'LPG Carrier', 'LPG Carrier', 'GAS_CARRIER',
  'LPG carriers transport liquefied petroleum gas (propane, butane) and ammonia under pressure, refrigeration, or both. Sizes range from small 5,000 cubic metre coastal vessels to 84,000 cubic metre Very Large Gas Carriers (VLGCs).',
  'A draft reference for marine engineers working on LPG carriers. Coverage spans pressurised, semi-refrigerated, and fully-refrigerated configurations.

This content is general industry guidance, not vessel-specific specification.',
  'Variable: 5,000 to 84,000 cubic metres cargo capacity',
  'VLGCs (the largest LPG carriers) are typically powered by single low-speed two-stroke engines in the 10,000 to 15,000 kW range. Mid-size and small LPG carriers commonly use medium-speed engine configurations. Increasingly, LPG carriers themselves use cargo as fuel via LPG dual-fuel engines.',
  'Cargo systems include cargo pumps, cargo compressors for vapour handling, and refrigeration plants for fully-refrigerated tanks. Booster pumps on deck are common for discharge operations.',
  'Engines: MAN B&W, Wärtsilä. Cargo compressors: Burckhardt, Mitsui. Refrigeration: TGE, Wärtsilä Hamworthy.',
  'LPG carrier engineers work extensively with cargo compressors and refrigeration plants. Compressor reliability, valve seat wear, and refrigeration plant tuning are common focus areas.',
  'Houston, Antwerp, Singapore, and Yokohama are major hubs for LPG carrier service.',
  false, NOW()),

-- ─── CONTAINER ─────────────────────────────────────────────────────────────
('vt_ulcv', 'ulcv-container-ship', 'Ultra Large Container Vessel (ULCV)', 'ULCV', 'CONTAINER',
  'Ultra Large Container Vessels are the largest container ships afloat, typically 18,000 TEU and above. Used on major Asia-Europe and trans-Pacific trade lanes, they require specialist port infrastructure for cargo handling.',
  'A draft reference for marine engineers working on ultra large container vessels. These are among the most powerful merchant ships at sea, with main engine outputs commonly exceeding 60,000 kW.

This content is general industry guidance, not vessel-specific specification.',
  'Typically 18,000 to 24,000+ TEU, 400m LOA, 61m beam',
  'ULCVs are powered by single low-speed two-stroke main engines, commonly in the 60,000 to 80,000 kW range, with eleven or twelve cylinders. MAN Energy Solutions ME-C and ME-GI engines dominate. Increasingly, newbuild ULCVs are dual-fuel LNG-capable.',
  'Auxiliary power is provided by multiple medium-speed generator sets, often four or five units, due to the substantial reefer container load (electrically-powered refrigerated containers can demand multiple megawatts).',
  'Engines: MAN B&W (ME-C, ME-GI). Turbochargers: ABB (TPL series), MHI. Generators: MAN, Caterpillar, Wärtsilä.',
  'Reefer container power management, exhaust gas treatment system performance (scrubbers and SCR are common on newbuilds), and the sheer scale of the propulsion plant are characteristic challenges. Drydock cycles are demanding due to vessel size.',
  'Major hubs are Singapore, Rotterdam, and Busan. Drydocks for ULCVs are limited globally, with major Chinese and Korean yards handling most large container vessel maintenance.',
  false, NOW()),

('vt_panamax_container', 'panamax-container-ship', 'Panamax / Neopanamax Container Ship', 'Panamax Container', 'CONTAINER',
  'Panamax and Neopanamax container ships are sized to transit the Panama Canal''s original locks (Panamax, ~5,000 TEU) or the new locks (Neopanamax, up to ~14,000 TEU). They serve a mix of trans-Pacific, intra-Asia, and Latin American routes.',
  'A draft reference for marine engineers working on Panamax and Neopanamax container ships.

This content is general industry guidance, not vessel-specific specification.',
  'Panamax: ~5,000 TEU, 294m LOA, 32m beam. Neopanamax: ~10,000-14,000 TEU, 366m LOA, 49m beam',
  'Single low-speed two-stroke main engine, commonly 35,000 to 55,000 kW, eight to ten cylinders.',
  'Three or four medium-speed generator sets, sized for reefer load and hotel requirements.',
  'Engines: MAN B&W, Wärtsilä. Turbochargers: ABB, MHI.',
  'Schedule reliability pressures drive engineering work, with main engine and turbocharger overhauls planned tightly around port rotations.',
  'Panama, Singapore, Long Beach, and Busan are common service hubs.',
  false, NOW()),

('vt_feeder_container', 'feeder-container-ship', 'Feeder Container Ship', 'Feeder', 'CONTAINER',
  'Feeder container ships are smaller container vessels, typically 1,000 to 3,000 TEU, that connect smaller regional ports to the main trunk routes served by larger container ships.',
  'A draft reference for marine engineers working on feeder container ships.

This content is general industry guidance, not vessel-specific specification.',
  '1,000 to 3,000 TEU, 150-200m LOA',
  'Single medium-speed or low-speed main engine, commonly in the 8,000 to 15,000 kW range.',
  'Two to three diesel generator sets.',
  'Engines: MAN, Wärtsilä, MaK. Turbochargers: ABB, Napier.',
  'Tight port-to-port schedules and frequent manoeuvring drive engineering priorities. Bow thruster and steering gear maintenance are often more prominent than on deep-sea vessels.',
  'Regional hubs serve feeders, e.g. Felixstowe and Hamburg for North European feeders, Singapore for Asian feeder networks.',
  false, NOW()),

-- ─── BULK CARRIERS ─────────────────────────────────────────────────────────
('vt_capesize', 'capesize-bulk-carrier', 'Capesize Bulk Carrier', 'Capesize', 'BULK_CARRIER',
  'Capesize bulk carriers are large dry bulk ships, typically 150,000 to 200,000 DWT, used for iron ore and coal trades. Too large to transit the Panama Canal, hence "cape" routing around the Cape of Good Hope or Cape Horn.',
  'A draft reference for marine engineers working on Capesize bulk carriers.

This content is general industry guidance, not vessel-specific specification.',
  'Typically 150,000 to 200,000 DWT, 290m LOA, 45m beam',
  'Single low-speed two-stroke main engine in the 12,000 to 18,000 kW range, six cylinders, driving a fixed-pitch propeller.',
  'Three diesel generator sets are typical. Bulk carriers do not have large electrical loads from cargo handling (cargo is gravity-discharged or shore-cranes are used).',
  'Engines: MAN B&W, Wärtsilä. Turbochargers: ABB, MHI. Cargo gear (where fitted): MacGregor.',
  'Hatch cover maintenance is a recurring theme on bulk carriers, particularly around watertight integrity. Hold cleaning between dirty and clean cargoes is engineering-intensive.',
  'Singapore, Shanghai, Rotterdam, and Durban are major service hubs. Drydocks in China and Singapore handle most Capesize maintenance.',
  false, NOW()),

('vt_panamax_bulk', 'panamax-bulk-carrier', 'Panamax Bulk Carrier', 'Panamax Bulk', 'BULK_CARRIER',
  'Panamax bulk carriers are 60,000 to 80,000 DWT ships sized to fit the original Panama Canal locks. Common on grain, coal, and minor bulk trades.',
  'A draft reference for marine engineers working on Panamax bulk carriers.

This content is general industry guidance, not vessel-specific specification.',
  'Typically 60,000 to 80,000 DWT, 230m LOA, 32m beam',
  'Single low-speed two-stroke main engine in the 8,000 to 12,000 kW range.',
  'Three diesel generator sets.',
  'Engines: MAN B&W, Wärtsilä. Turbochargers: ABB, MHI.',
  'Hatch cover seal maintenance and cargo hold cleaning are common engineering activities. Self-unloading variants add cargo gear maintenance to the workload.',
  'Common service hubs include Singapore, Shanghai, and Rotterdam.',
  false, NOW()),

('vt_handysize', 'handysize-bulk-carrier', 'Handysize Bulk Carrier', 'Handysize', 'BULK_CARRIER',
  'Handysize bulk carriers are smaller, geared (with onboard cargo cranes) bulk carriers, typically 25,000 to 40,000 DWT. They serve smaller ports without dedicated bulk cargo infrastructure.',
  'A draft reference for marine engineers working on Handysize bulk carriers.

This content is general industry guidance, not vessel-specific specification.',
  'Typically 25,000 to 40,000 DWT, 180m LOA, 28m beam',
  'Single medium-speed or low-speed main engine, commonly 6,000 to 9,000 kW.',
  'Two to three diesel generator sets.',
  'Engines: MAN, Wärtsilä, MaK. Cargo cranes: MacGregor, Liebherr, IHI.',
  'Cargo crane maintenance is a primary engineering focus, including hydraulic system upkeep and wire rope inspection.',
  'Smaller ports worldwide; service is often arranged through regional supplier networks rather than major hubs.',
  false, NOW()),

-- ─── PASSENGER ─────────────────────────────────────────────────────────────
('vt_cruise_ship', 'cruise-ship', 'Cruise Ship', 'Cruise Ship', 'PASSENGER',
  'Cruise ships are large passenger vessels designed for multi-day leisure voyages. Sizes vary widely, from boutique 200-passenger ships to large cruise ships carrying 6,000+ passengers and crew.',
  'A draft reference for marine engineers working on cruise ships. Cruise ships present unique engineering environments due to extensive hotel loads, complex passenger systems, and high reliability requirements.

This content is general industry guidance, not vessel-specific specification.',
  'Variable: 100m to 360m LOA, passenger capacity 200 to 6,500+',
  'Modern cruise ships almost universally use diesel-electric propulsion, with multiple medium-speed diesel engines (or increasingly, dual-fuel LNG engines) driving generators that power azimuth thrusters or shaft-mounted electric motors.',
  'Auxiliary power and propulsion are integrated in diesel-electric configurations. Total installed power can exceed 100 MW on the largest vessels. Hotel load (HVAC, galleys, lighting, water-making) is a substantial portion of total power demand.',
  'Engines: Wärtsilä, MAN, Caterpillar (medium-speed). Propulsion: ABB Azipod, Rolls-Royce/Kongsberg Mermaid, Schottel SRP. Hotel systems: too varied to summarise.',
  'Cruise engineering is dominated by reliability and redundancy. Loss of HVAC, fresh water, or sewage handling causes immediate guest impact. Engineers manage extensive systems with little tolerance for downtime.',
  'Major cruise homeports (Miami, Barcelona, Civitavecchia, Singapore) and dedicated cruise drydocks (Bahamas, Marseille, Bremerhaven) handle most service work.',
  false, NOW()),

('vt_ferry', 'roro-passenger-ferry', 'RoPax Ferry', 'RoPax', 'PASSENGER',
  'RoPax ferries combine passenger and rolling cargo (cars, trucks) on the same vessel. Common on short-sea trades such as the English Channel, the Baltic, the Mediterranean, and Japanese coastal services.',
  'A draft reference for marine engineers working on RoPax ferries.

This content is general industry guidance, not vessel-specific specification.',
  'Variable: 100m to 240m LOA',
  'Multiple medium-speed main engines, driving fixed or controllable-pitch propellers, sometimes via reduction gearboxes. Increasingly, hybrid and battery-electric configurations on shorter routes.',
  'Multiple generator sets. Bow thrusters are heavily used due to frequent berthing manoeuvres.',
  'Engines: Wärtsilä, MAN, MaK. Propellers: Rolls-Royce/Kongsberg, Wärtsilä. Bow thrusters: Brunvoll, Schottel.',
  'High port-call frequency drives wear on main engines, gearboxes, and steering gear. Bow thruster reliability is critical for berthing schedules.',
  'Regional service hubs, particularly North Sea (Felixstowe, Hamburg), Baltic, and Mediterranean ports.',
  false, NOW()),

-- ─── OFFSHORE ──────────────────────────────────────────────────────────────
('vt_psv', 'platform-supply-vessel', 'Platform Supply Vessel (PSV)', 'PSV', 'OFFSHORE',
  'Platform Supply Vessels deliver cargo, fuel, water, drilling fluids, and supplies to offshore oil and gas installations. They are characterised by long aft cargo decks and dynamic positioning capability.',
  'A draft reference for marine engineers working on platform supply vessels.

This content is general industry guidance, not vessel-specific specification.',
  'Typically 70m to 90m LOA, deck area 700 to 1,000 square metres',
  'Modern PSVs typically use diesel-electric propulsion with multiple medium-speed engines driving generators that power azimuth thrusters and bow thrusters. Some smaller PSVs use mechanical propulsion with controllable-pitch propellers.',
  'Multiple generator sets. Dynamic positioning systems require redundant power.',
  'Engines: Wärtsilä, MAN, Caterpillar, Cummins. Propulsion: Schottel, Rolls-Royce/Kongsberg, Wärtsilä. DP systems: Kongsberg, Marine Technologies.',
  'DP system reliability is a defining engineering concern. Engine room redundancy and rapid response to thruster faults are critical.',
  'Aberdeen, Houston, Stavanger, and Singapore serve as primary offshore hubs.',
  false, NOW()),

('vt_ahts', 'ahts-vessel', 'Anchor Handling Tug Supply (AHTS)', 'AHTS', 'OFFSHORE',
  'Anchor Handling Tug Supply vessels are powerful offshore tugs designed to anchor mobile drilling units, tow rigs, and provide supply functions. They are characterised by high bollard pull and robust deck equipment.',
  'A draft reference for marine engineers working on AHTS vessels.

This content is general industry guidance, not vessel-specific specification.',
  'Typically 60m to 90m LOA, 150 to 300+ tonnes bollard pull',
  'Multiple medium-speed engines, often four units in two engine rooms for redundancy. Mechanical propulsion via controllable-pitch propellers and reduction gearboxes is common.',
  'Multiple generator sets. Heavy-duty winches are powered by dedicated hydraulic or electric drives.',
  'Engines: Wärtsilä, MAN, Caterpillar. Propellers: Rolls-Royce, Wärtsilä. Anchor handling winches: MacGregor, Rolls-Royce, IHC, Brattvaag.',
  'Winch maintenance, particularly under heavy operational loads, dominates AHTS engineering work. Engine room redundancy management during demanding tow operations is a continuous focus.',
  'Aberdeen, Stavanger, Singapore, and offshore Brazil are common service centres.',
  false, NOW()),

-- ─── WORKBOAT ─────────────────────────────────────────────────────────────
('vt_harbor_tug', 'harbor-tug', 'Harbour Tug', 'Harbour Tug', 'WORKBOAT',
  'Harbour tugs assist with berthing and unberthing of merchant ships in ports. Modern designs use azimuth or Voith-Schneider propulsion for omnidirectional manoeuvring and high bollard pull relative to size.',
  'A draft reference for marine engineers working on harbour tugs.

This content is general industry guidance, not vessel-specific specification.',
  'Typically 25m to 35m LOA, 50 to 80 tonnes bollard pull',
  'Two medium-speed or high-speed engines driving azimuth thrusters (Z-drive or ASD), or controllable-pitch propellers in conventional designs. Hybrid and battery-electric harbour tugs are increasingly common.',
  'Two generator sets typically.',
  'Engines: Caterpillar, MTU, MAN, Cummins. Azimuth thrusters: Schottel, Rolls-Royce, Wärtsilä, Voith.',
  'Engine and thruster reliability is paramount for harbour tug operations. Frequent high-load manoeuvres drive engine wear patterns.',
  'Major ports have local marine engineering networks specialising in tug fleets.',
  false, NOW()),

('vt_fishing_trawler', 'fishing-trawler', 'Stern Trawler', 'Stern Trawler', 'WORKBOAT',
  'Stern trawlers are commercial fishing vessels that haul nets from the stern. Sizes vary from 25m coastal vessels to 100m+ deep-sea factory trawlers.',
  'A draft reference for marine engineers working on stern trawlers.

This content is general industry guidance, not vessel-specific specification.',
  'Variable: 25m to 100m+ LOA',
  'Single or twin medium-speed engines, often with controllable-pitch propellers and reduction gearboxes. Diesel-electric propulsion increasingly common on larger factory trawlers.',
  'Multiple generator sets, sized to handle refrigeration loads on factory trawlers.',
  'Engines: Wärtsilä, MAN, Caterpillar, Cummins, Yanmar. Refrigeration: TGE, Wärtsilä Hamworthy.',
  'Refrigeration plant maintenance is dominant on factory trawlers. Trawl winch and net-handling equipment add to the engineering workload.',
  'Regional fishing ports serve their fleets directly; specialist trawler maintenance is concentrated in the North Atlantic, North Pacific, and Southern Ocean fishing nations.',
  false, NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "summary" = EXCLUDED."summary",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

-- All entries seeded as DRAFTS (isPublished = false).
-- Domain expert (Adam) must review and explicitly publish each entry
-- before it appears on the public site.

-- Verification:
-- SELECT COUNT(*) FROM "VesselType";              -- should be 18
-- SELECT COUNT(*) FROM "VesselType" WHERE "isPublished" = true;  -- should be 0
