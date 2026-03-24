/**
 * Meridian Trade Rules Database
 * Country-level restrictions, bans, and requirements for common goods categories.
 */

// ─── GOODS CATEGORIES ────────────────────────────────────────────────────────
export const GOODS_CATEGORIES = [
    { id: "confectionery",   label: "Confectionery & Sweets",     icon: "🍬" },
    { id: "fresh_produce",   label: "Fresh Produce & Vegetables", icon: "🥦" },
    { id: "electronics",     label: "Electronics & Batteries",    icon: "📱" },
    { id: "pharmaceuticals", label: "Pharmaceuticals & Medicine", icon: "💊" },
    { id: "alcohol",         label: "Alcohol & Beverages",        icon: "🍷" },
    { id: "textiles",        label: "Textiles & Apparel",         icon: "👗" },
    { id: "chemicals",       label: "Industrial Chemicals",       icon: "⚗️" },
    { id: "firearms",        label: "Arms & Defence Equipment",   icon: "🔫" },
    { id: "vehicles",        label: "Vehicles & Auto Parts",      icon: "🚗" },
    { id: "livestock",       label: "Livestock & Animal Products",icon: "🐄" },
  ];
  
  // ─── QUANTITY UNITS ───────────────────────────────────────────────────────────
  export const QUANTITY_UNITS = ["kg", "tonnes", "units", "pallets", "containers (20ft)", "containers (40ft)"];
  
  // ─── COUNTRY DATABASE ─────────────────────────────────────────────────────────
  export const COUNTRIES = {
    // ── Europe ──
    ES: { name: "Spain",        continent: "Europe",        lat: 40.4168,  lng: -3.7038,   tradeHub: false },
    DE: { name: "Germany",      continent: "Europe",        lat: 52.5200,  lng: 13.4050,   tradeHub: true  },
    FR: { name: "France",       continent: "Europe",        lat: 48.8566,  lng: 2.3522,    tradeHub: false },
    IT: { name: "Italy",        continent: "Europe",        lat: 41.9028,  lng: 12.4964,   tradeHub: false },
    NL: { name: "Netherlands",  continent: "Europe",        lat: 52.3676,  lng: 4.9041,    tradeHub: true  },
    PL: { name: "Poland",       continent: "Europe",        lat: 52.2297,  lng: 21.0122,   tradeHub: false },
    GR: { name: "Greece",       continent: "Europe",        lat: 37.9838,  lng: 23.7275,   tradeHub: false },
    PT: { name: "Portugal",     continent: "Europe",        lat: 38.7223,  lng: -9.1393,   tradeHub: false },
    BE: { name: "Belgium",      continent: "Europe",        lat: 50.8503,  lng: 4.3517,    tradeHub: true  },
    SE: { name: "Sweden",       continent: "Europe",        lat: 59.3293,  lng: 18.0686,   tradeHub: false },
    CH: { name: "Switzerland",  continent: "Europe",        lat: 47.3769,  lng: 8.5417,    tradeHub: false },
    TR: { name: "Turkey",       continent: "Europe/Asia",   lat: 41.0082,  lng: 28.9784,   tradeHub: true  },
    UA: { name: "Ukraine",      continent: "Europe",        lat: 50.4501,  lng: 30.5234,   tradeHub: false },
    RU: { name: "Russia",       continent: "Europe/Asia",   lat: 55.7558,  lng: 37.6173,   tradeHub: false },
    GB: { name: "United Kingdom", continent: "Europe",      lat: 51.5074,  lng: -0.1278,   tradeHub: true  },
  
    // ── Asia ──
    CN: { name: "China",        continent: "Asia",          lat: 31.2304,  lng: 121.4737,  tradeHub: true  },
    JP: { name: "Japan",        continent: "Asia",          lat: 35.6762,  lng: 139.6503,  tradeHub: false },
    KR: { name: "South Korea",  continent: "Asia",          lat: 37.5665,  lng: 126.9780,  tradeHub: false },
    SG: { name: "Singapore",    continent: "Asia",          lat: 1.3521,   lng: 103.8198,  tradeHub: true  },
    VN: { name: "Vietnam",      continent: "Asia",          lat: 21.0285,  lng: 105.8542,  tradeHub: false },
    TH: { name: "Thailand",     continent: "Asia",          lat: 13.7563,  lng: 100.5018,  tradeHub: false },
    MY: { name: "Malaysia",     continent: "Asia",          lat: 3.1390,   lng: 101.6869,  tradeHub: true  },
    ID: { name: "Indonesia",    continent: "Asia",          lat: -6.2088,  lng: 106.8456,  tradeHub: false },
    IN: { name: "India",        continent: "Asia",          lat: 19.0760,  lng: 72.8777,   tradeHub: true  },
    PK: { name: "Pakistan",     continent: "Asia",          lat: 24.8607,  lng: 67.0011,   tradeHub: false },
    BD: { name: "Bangladesh",   continent: "Asia",          lat: 23.8103,  lng: 90.4125,   tradeHub: false },
    PH: { name: "Philippines",  continent: "Asia",          lat: 14.5995,  lng: 120.9842,  tradeHub: false },
    HK: { name: "Hong Kong",    continent: "Asia",          lat: 22.3193,  lng: 114.1694,  tradeHub: true  },
  
    // ── Middle East ──
    AE: { name: "UAE",          continent: "Middle East",   lat: 25.2048,  lng: 55.2708,   tradeHub: true  },
    SA: { name: "Saudi Arabia", continent: "Middle East",   lat: 24.6877,  lng: 46.7219,   tradeHub: false },
    QA: { name: "Qatar",        continent: "Middle East",   lat: 25.2854,  lng: 51.5310,   tradeHub: false },
    KW: { name: "Kuwait",       continent: "Middle East",   lat: 29.3759,  lng: 47.9774,   tradeHub: false },
    IL: { name: "Israel",       continent: "Middle East",   lat: 31.7683,  lng: 35.2137,   tradeHub: false },
    IR: { name: "Iran",         continent: "Middle East",   lat: 35.6892,  lng: 51.3890,   tradeHub: false },
  
    // ── Africa ──
    NG: { name: "Nigeria",      continent: "Africa",        lat: 6.5244,   lng: 3.3792,    tradeHub: false },
    ZA: { name: "South Africa", continent: "Africa",        lat: -33.9249, lng: 18.4241,   tradeHub: true  },
    EG: { name: "Egypt",        continent: "Africa",        lat: 30.0444,  lng: 31.2357,   tradeHub: true  },
    KE: { name: "Kenya",        continent: "Africa",        lat: -1.2921,  lng: 36.8219,   tradeHub: false },
    ET: { name: "Ethiopia",     continent: "Africa",        lat: 9.0320,   lng: 38.7469,   tradeHub: false },
    MA: { name: "Morocco",      continent: "Africa",        lat: 33.9716,  lng: -6.8498,   tradeHub: false },
    TZ: { name: "Tanzania",     continent: "Africa",        lat: -6.7924,  lng: 39.2083,   tradeHub: false },
  
    // ── Americas ──
    US: { name: "United States", continent: "Americas",     lat: 40.7128,  lng: -74.0060,  tradeHub: true  },
    CA: { name: "Canada",        continent: "Americas",     lat: 43.6532,  lng: -79.3832,  tradeHub: false },
    MX: { name: "Mexico",        continent: "Americas",     lat: 19.4326,  lng: -99.1332,  tradeHub: false },
    BR: { name: "Brazil",        continent: "Americas",     lat: -23.5505, lng: -46.6333,  tradeHub: true  },
    AR: { name: "Argentina",     continent: "Americas",     lat: -34.6037, lng: -58.3816,  tradeHub: false },
    CO: { name: "Colombia",      continent: "Americas",     lat: 4.7110,   lng: -74.0721,  tradeHub: false },
    CL: { name: "Chile",         continent: "Americas",     lat: -33.4489, lng: -70.6693,  tradeHub: false },
    PE: { name: "Peru",          continent: "Americas",     lat: -12.0464, lng: -77.0428,  tradeHub: false },
  
    // ── Oceania ──
    AU: { name: "Australia",    continent: "Oceania",       lat: -33.8688, lng: 151.2093,  tradeHub: true  },
    NZ: { name: "New Zealand",  continent: "Oceania",       lat: -36.8485, lng: 174.7633,  tradeHub: false },
  };
  
  // ─── TRADE RESTRICTIONS DATABASE ─────────────────────────────────────────────
  export const TRADE_RESTRICTIONS = {
    GR: {
      confectionery: {
        banned: true,
        notes: "Greece enforces strict import restrictions on confectionery not meeting EU additive standards.",
      },
    },
    IN: {
      confectionery: {
        restricted: true,
        notes: "India requires FSSAI certification and mandatory pre-import inspection.",
        requiresCertification: ["FSSAI approval", "Health certificate from origin country"],
      },
      alcohol: { banned: true, notes: "Several Indian states have total prohibition." },
      vehicles: {
        restricted: true,
        notes: "India imposes 100–125% import duty on vehicles. Right-hand drive only.",
        requiresCertification: ["BIS compliance", "CMVR type approval"],
      },
    },
    SA: {
      confectionery: {
        restricted: true,
        notes: "Must carry Halal certification from a Saudi-approved body.",
        requiresCertification: ["Halal certificate (SFDA approved)", "Arabic labelling"],
      },
      alcohol: { banned: true, notes: "Saudi Arabia prohibits import, transit, and possession of alcohol." },
    },
    IR: {
      confectionery: { banned: true, notes: "Iran is under comprehensive international sanctions." },
      alcohol:       { banned: true, notes: "Alcohol is strictly prohibited under Iranian law." },
      electronics:   { banned: true, notes: "OFAC/EU comprehensive sanctions apply. Trade prohibited." },
      pharmaceuticals: { banned: true, notes: "Comprehensive sanctions restrict all trade." },
      chemicals:     { banned: true, notes: "Comprehensive sanctions restrict all trade." },
      firearms:      { banned: true, notes: "Comprehensive sanctions and UN arms embargo." },
      vehicles:      { banned: true, notes: "Comprehensive sanctions restrict all trade." },
      textiles:      { banned: true, notes: "Comprehensive sanctions restrict all trade." },
    },
    RU: {
      electronics:   { banned: true, notes: "EU/US/UK sanctions (2022–) ban export of dual-use electronics." },
      vehicles:      { banned: true, notes: "EU/US sanctions prohibit export of vehicles." },
      chemicals:     { banned: true, notes: "Export controls on dual-use chemicals." },
      firearms:      { banned: true, notes: "EU/US/UK arms embargo on Russia." },
    },
    QA: {
      alcohol: { banned: true, notes: "Qatar strictly controls alcohol. Import for commercial resale banned." },
    },
    KW: {
      alcohol: { banned: true, notes: "Kuwait has a complete ban on alcohol imports." },
    },
    NZ: {
      fresh_produce: {
        restricted: true,
        notes: "New Zealand MPI biosecurity restrictions are extremely strict.",
        requiresCertification: ["MPI import health standard", "Phytosanitary certificate"],
      },
      livestock: { banned: true, notes: "Import of most live animals to New Zealand is prohibited." },
    },
    BR: {
      electronics: {
        restricted: true,
        notes: "ANATEL certification mandatory.",
        requiresCertification: ["ANATEL homologation certificate"],
      },
      pharmaceuticals: {
        restricted: true,
        notes: "ANVISA registration required before import.",
        requiresCertification: ["ANVISA registration", "GMP certificate"],
      },
      vehicles: {
        restricted: true,
        notes: "Very high import tariffs. Used vehicles cannot be imported.",
        requiresCertification: ["DENATRAN registration", "INMETRO safety compliance"],
      },
    },
    PK: {
      alcohol: { banned: true, notes: "Pakistan prohibits alcohol import and sale." },
    },
    BD: {
      alcohol: { banned: true, notes: "Bangladesh prohibits alcohol import and sale." },
    },
    NG: {
      alcohol: { restricted: true, notes: "High import duties make alcohol import commercially difficult." },
      fresh_produce: {
        restricted: true,
        notes: "NAFDAC approval required for food imports.",
        requiresCertification: ["NAFDAC registration"],
      },
    },
    CN: {
      pharmaceuticals: {
        restricted: true,
        notes: "NMPA registration required.",
        requiresCertification: ["NMPA drug registration certificate", "GMP certificate"],
      },
      firearms: { banned: true, notes: "Import of firearms strictly prohibited." },
    },
    JP: {
      pharmaceuticals: {
        restricted: true,
        notes: "PMDA approval required.",
        requiresCertification: ["PMDA marketing authorisation"],
      },
      fresh_produce: {
        restricted: true,
        notes: "Japan's Plant Protection Act restricts many fresh produce imports.",
        requiresCertification: ["Phytosanitary certificate"],
      },
      firearms: { banned: true, notes: "Japan prohibits civilian import of firearms." },
    },
    DE: {
      chemicals: {
        restricted: true,
        notes: "EU REACH regulation requires registration for chemicals.",
        requiresCertification: ["REACH registration", "Safety Data Sheet (SDS)"],
      },
    },
    US: {
      electronics: {
        restricted: true,
        notes: "FCC compliance required. CHIPS Act restricts certain semiconductor exports.",
        requiresCertification: ["FCC Declaration of Conformity"],
      },
      firearms: {
        restricted: true,
        notes: "ATF import licence required.",
        requiresCertification: ["ATF Form 6 import permit"],
      },
      chemicals: {
        restricted: true,
        notes: "EPA TSCA notification required.",
        requiresCertification: ["EPA TSCA notice", "SDS", "DOT hazmat compliance"],
      },
      fresh_produce: {
        restricted: true,
        notes: "USDA APHIS phytosanitary inspection required.",
        requiresCertification: ["USDA APHIS import permit", "Phytosanitary certificate"],
      },
    },
    AU: {
      electronics: {
        restricted: true,
        notes: "ACMA compliance marking required.",
        requiresCertification: ["RCM mark", "ACMA compliance"],
      },
      fresh_produce: {
        restricted: true,
        notes: "Australia's biosecurity laws are strict.",
        requiresCertification: ["DAFF import permit", "Phytosanitary certificate"],
      },
      livestock: {
        restricted: true,
        notes: "Strict biosecurity. Most live animals require extended quarantine.",
        requiresCertification: ["DAFF import permit", "Veterinary health certificate"],
      },
      firearms: {
        restricted: true,
        notes: "Strict firearms import control.",
        requiresCertification: ["Federal firearms import licence", "End-user certificate"],
      },
    },
    CA: {
      firearms: {
        restricted: true,
        notes: "CBSA firearms import permit required.",
        requiresCertification: ["CBSA B15 form", "ATT for restricted firearms"],
      },
    },
    KR: {
      fresh_produce: {
        restricted: true,
        notes: "Korean Ministry of Agriculture phytosanitary certificate required.",
        requiresCertification: ["Phytosanitary certificate", "Fumigation certificate"],
      },
    },
    EU_GENERIC: {
      livestock: {
        restricted: true,
        notes: "EU requires veterinary health certificates and pre-listing. TRACES notification required.",
        requiresCertification: ["EU veterinary health certificate", "TRACES notification"],
      },
    },
  };
  
  // ─── ROUTE NETWORK ────────────────────────────────────────────────────────────
  export const ROUTE_CORRIDORS = [
    // ── Inter-Region Corridors ──
    { from: "Asia",        to: "Europe",        viaOptions: [
      { transit: ["SG", "AE"],  mode: "Ocean",  days: [25, 32], costIdx: 1.0, label: "Suez Canal via Singapore & Dubai" },
      { transit: ["SG"],        mode: "Ocean",  days: [28, 35], costIdx: 0.9, label: "Cape of Good Hope via Singapore"  },
      { transit: ["CN"],        mode: "Rail",   days: [18, 25], costIdx: 1.4, label: "Trans-Siberian / China Railway Express" },
    ]},
    { from: "Asia",        to: "Americas",      viaOptions: [
      { transit: ["SG", "HK"],  mode: "Ocean",  days: [18, 25], costIdx: 1.0, label: "Trans-Pacific via Singapore/HK" },
      { transit: ["SG"],        mode: "Ocean",  days: [20, 28], costIdx: 0.95, label: "Trans-Pacific direct" },
    ]},
    { from: "Asia",        to: "Middle East",   viaOptions: [
      { transit: ["SG"],        mode: "Ocean",  days: [12, 18], costIdx: 0.8, label: "Indian Ocean via Singapore"  },
      { transit: [],            mode: "Ocean",  days: [10, 16], costIdx: 0.75, label: "Indian Ocean direct"        },
    ]},
    { from: "Asia",        to: "Africa",        viaOptions: [
      { transit: ["SG", "AE"],  mode: "Ocean",  days: [20, 30], costIdx: 1.1, label: "Indian Ocean via Singapore & UAE" },
      { transit: ["SG"],        mode: "Ocean",  days: [22, 30], costIdx: 0.95, label: "Indian Ocean via Singapore"      },
    ]},
    { from: "Asia",        to: "Oceania",       viaOptions: [
      { transit: ["SG"],        mode: "Ocean",  days: [10, 18], costIdx: 0.85, label: "South-East Asia via Singapore" },
      { transit: [],            mode: "Air",    days: [2,  4],  costIdx: 4.5,  label: "Air freight (express)"         },
    ]},
    { from: "Europe",      to: "Americas",      viaOptions: [
      { transit: ["NL"],        mode: "Ocean",  days: [10, 18], costIdx: 0.9, label: "North Atlantic via Rotterdam" },
      { transit: ["GB"],        mode: "Ocean",  days: [12, 20], costIdx: 0.95, label: "North Atlantic via Felixstowe" },
      { transit: [],            mode: "Air",    days: [1,  3],  costIdx: 5.0, label: "Air freight (express)"         },
    ]},
    { from: "Europe",      to: "Africa",        viaOptions: [
      { transit: ["NL"],        mode: "Ocean",  days: [12, 22], costIdx: 1.0, label: "West African coast via Rotterdam" },
      { transit: ["EG"],        mode: "Ocean",  days: [14, 22], costIdx: 0.9, label: "East African coast via Suez"      },
    ]},
    { from: "Europe",      to: "Middle East",   viaOptions: [
      { transit: ["EG"],        mode: "Ocean",  days: [12, 18], costIdx: 0.9, label: "Suez Canal via Egypt"     },
      { transit: ["TR"],        mode: "Road",   days: [8,  14], costIdx: 1.1, label: "Overland via Turkey"      },
      { transit: ["AE"],        mode: "Ocean",  days: [15, 22], costIdx: 1.0, label: "Gulf via UAE hub"         },
    ]},
    { from: "Middle East", to: "Americas",      viaOptions: [
      { transit: ["AE", "NL"],  mode: "Ocean",  days: [22, 32], costIdx: 1.2, label: "Via UAE + Rotterdam"       },
      { transit: ["AE"],        mode: "Air",    days: [2,  4],  costIdx: 4.5, label: "Air freight via Dubai hub" },
    ]},
    { from: "Americas",    to: "Oceania",       viaOptions: [
      { transit: [],            mode: "Ocean",  days: [18, 28], costIdx: 1.1, label: "South Pacific direct"         },
      { transit: ["SG"],        mode: "Ocean",  days: [22, 32], costIdx: 1.3, label: "Trans-Pacific via Singapore"  },
    ]},
    { from: "Africa",      to: "Americas",      viaOptions: [
      { transit: [],            mode: "Ocean",  days: [15, 25], costIdx: 1.0, label: "South Atlantic direct" },
      { transit: ["NL"],        mode: "Ocean",  days: [18, 28], costIdx: 1.1, label: "Via Rotterdam hub"     },
    ]},
    
    // ── Intra-Region Corridors ──
    { from: "Europe",      to: "Europe",        viaOptions: [
      { transit: [],            mode: "Road",   days: [1,  5],  costIdx: 0.6, label: "Road freight (intra-EU)" },
      { transit: ["NL"],        mode: "Ocean",  days: [3,  8],  costIdx: 0.7, label: "Short-sea via Rotterdam" },
      { transit: [],            mode: "Rail",   days: [2,  6],  costIdx: 0.65, label: "Rail freight (intra-EU)" },
    ]},
    { from: "Asia",        to: "Asia",          viaOptions: [
      { transit: ["SG"],        mode: "Ocean",  days: [5,  14], costIdx: 0.7, label: "Intra-Asian ocean via Singapore" },
      { transit: [],            mode: "Road",   days: [4,  12], costIdx: 0.8, label: "Cross-border road"               },
      { transit: [],            mode: "Air",    days: [1,  3],  costIdx: 3.5, label: "Regional air freight"            },
    ]},
    { from: "Americas",    to: "Americas",      viaOptions: [
      { transit: ["US"],        mode: "Ocean",  days: [5,  18], costIdx: 0.8, label: "Intra-Americas ocean via US hub" },
      { transit: [],            mode: "Road",   days: [3,  10], costIdx: 0.7, label: "Overland road"                  },
      { transit: [],            mode: "Air",    days: [1,  3],  costIdx: 3.8, label: "Regional air freight"           },
    ]},
    { from: "Africa",      to: "Africa",        viaOptions: [
      { transit: [],            mode: "Road",   days: [5,  20], costIdx: 0.9, label: "Overland road (Pan-African)" },
      { transit: [],            mode: "Air",    days: [1,  4],  costIdx: 4.2, label: "Regional air freight" },
    ]},
    { from: "Middle East", to: "Middle East",   viaOptions: [
      { transit: [],            mode: "Road",   days: [2,  7],  costIdx: 0.7, label: "Cross-border road" },
      { transit: ["AE"],        mode: "Ocean",  days: [3,  9],  costIdx: 0.8, label: "Regional sea via UAE" },
    ]},
    { from: "Oceania",     to: "Oceania",       viaOptions: [
      { transit: [],            mode: "Ocean",  days: [4,  10], costIdx: 0.9, label: "Tasman Sea direct" },
      { transit: [],            mode: "Air",    days: [1,  2],  costIdx: 3.5, label: "Regional air freight" },
    ]},
  ];
  
  // ─── ROUTE CALCULATOR ─────────────────────────────────────────────────────────
  
  export function checkCountryRestriction(countryCode, goodsCategory) {
    let rule = null;
  
    // Check for specific rules first
    if (TRADE_RESTRICTIONS[countryCode] && TRADE_RESTRICTIONS[countryCode][goodsCategory]) {
      rule = TRADE_RESTRICTIONS[countryCode][goodsCategory];
    } 
    // Fallback to EU generic rules if the country is European
    else if (COUNTRIES[countryCode] && COUNTRIES[countryCode].continent.includes("Europe")) {
      if (TRADE_RESTRICTIONS["EU_GENERIC"] && TRADE_RESTRICTIONS["EU_GENERIC"][goodsCategory]) {
        rule = TRADE_RESTRICTIONS["EU_GENERIC"][goodsCategory];
      }
    }
  
    if (!rule) return { blocked: false, type: "ok" };
    if (rule.banned) return { blocked: true, type: "ban", reason: rule.notes };
    if (rule.restricted) return { blocked: false, type: "restriction", reason: rule.notes, requirements: rule.requiresCertification || [] };
    
    return { blocked: false, type: "ok" };
  }
  
  export function getContinent(countryCode) {
    return COUNTRIES[countryCode]?.continent || "Unknown";
  }
  
  function normaliseContinent(c) {
    if (c === "Europe/Asia") return "Europe"; 
    if (c === "Middle East") return "Middle East";
    return c;
  }
  
  export function calculateRoutes(originCode, destCode, goodsCategory, quantityKg) {
    const origin = COUNTRIES[originCode];
    const dest   = COUNTRIES[destCode];
    
    if (!origin || !dest) return { routes: [], blockedCountries: [], warnings: ["Unknown country code."] };
  
    const originContinent = normaliseContinent(origin.continent);
    const destContinent   = normaliseContinent(dest.continent);
  
    const destCheck = checkCountryRestriction(destCode, goodsCategory);
    const warnings  = [];
    const blockedCountries = [];
  
    if (destCheck.blocked) {
      return {
        routes: [],
        blockedCountries: [destCode],
        warnings: [`⚠️ ${dest.name} bans import of ${goodsCategory.replace("_", " ")}: ${destCheck.reason}`],
      };
    }
    if (destCheck.type === "restriction") {
      warnings.push(`⚠️ ${dest.name} has import restrictions: ${destCheck.reason}`);
    }
  
    // Find exact corridor OR fallback to bidirectional equivalent
    let corridor = ROUTE_CORRIDORS.find(
      (r) => r.from === originContinent && r.to === destContinent
    );
  
    if (!corridor) {
      const reverseCorridor = ROUTE_CORRIDORS.find(
        (r) => r.from === destContinent && r.to === originContinent
      );
      if (reverseCorridor) corridor = reverseCorridor;
    }
  
    if (!corridor) {
      warnings.push("No standard corridor found — air freight only.");
      return {
        routes: [{
          id: 1,
          label: "Air freight (emergency routing)",
          mode: "Air",
          transit: [],
          days: [3, 7],
          costIndex: 6.0,
          score: 55,
          blocked: false,
          warnings: [],
          requirements: destCheck.requirements || [],
        }],
        blockedCountries,
        warnings,
      };
    }
  
    const routes = [];
    let routeId = 1;
  
    for (const option of corridor.viaOptions) {
      let routeBlocked = false;
      const routeWarnings = [...(destCheck.type === "restriction" ? [destCheck.reason] : [])];
      const routeRequirements = [...(destCheck.requirements || [])];
  
      for (const tCode of option.transit) {
        const check = checkCountryRestriction(tCode, goodsCategory);
        if (check.blocked) {
          routeBlocked = true;
          blockedCountries.push(tCode);
          break;
        }
        if (check.type === "restriction") {
          routeWarnings.push(`Transit via ${COUNTRIES[tCode]?.name}: ${check.reason}`);
          routeRequirements.push(...(check.requirements || []));
        }
      }
  
      if (routeBlocked) continue;
  
      const costPenalty    = Math.round((option.costIdx - 0.6) * 30);
      const timePenalty    = Math.round(option.days[0] / 2);
      const warningPenalty = routeWarnings.length * 5;
      const score          = Math.max(30, 100 - costPenalty - timePenalty - warningPenalty);
  
      const baseCostPerTonne = 120; // USD
      const estimatedCostUSD = Math.round((quantityKg / 1000) * baseCostPerTonne * option.costIdx * 100) / 100;
  
      routes.push({
        id: routeId++,
        label: option.label,
        mode: option.mode,
        transit: option.transit,
        days: option.days,
        costIndex: option.costIdx,
        estimatedCostUSD,
        score,
        blocked: false,
        warnings: routeWarnings,
        requirements: [...new Set(routeRequirements)],
      });
    }
  
    routes.sort((a, b) => b.score - a.score);
  
    if (routes.length === 0) {
      routes.push({
        id: 1,
        label: "Air freight (only available route)",
        mode: "Air",
        transit: [],
        days: [2, 5],
        costIndex: 5.0,
        estimatedCostUSD: Math.round((quantityKg / 1000) * 1800),
        score: 50,
        blocked: false,
        warnings: ["All standard routes restricted for this goods category."],
        requirements: destCheck.requirements || [],
      });
    }
  
    return { routes, blockedCountries: [...new Set(blockedCountries)], warnings };
  }