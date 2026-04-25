/**
 * Curated global logistics nodes based on widely used UN/LOCODE + IATA hubs.
 * Intended as a deterministic offline fallback when live provider APIs are unavailable.
 */
export const PORTS = [
  // Europe
  { id: "NLRTM", unlocode: "NLRTM", name: "Port of Rotterdam", country: "Netherlands", countryCode: "NL", lat: 51.955, lon: 4.14, type: "sea", region: "Europe", annualTeuM: 13.4 },
  { id: "BEANR", unlocode: "BEANR", name: "Port of Antwerp-Bruges", country: "Belgium", countryCode: "BE", lat: 51.263, lon: 4.4, type: "sea", region: "Europe", annualTeuM: 13.5 },
  { id: "DEHAM", unlocode: "DEHAM", name: "Port of Hamburg", country: "Germany", countryCode: "DE", lat: 53.546, lon: 9.966, type: "sea", region: "Europe", annualTeuM: 7.7 },
  { id: "ESALG", unlocode: "ESALG", name: "Port of Algeciras", country: "Spain", countryCode: "ES", lat: 36.128, lon: -5.447, type: "sea", region: "Europe", annualTeuM: 4.7 },
  { id: "TRIST", unlocode: "TRIST", name: "Port of Istanbul (Ambarli)", country: "Turkey", countryCode: "TR", lat: 40.966, lon: 28.675, type: "sea", region: "Europe", annualTeuM: 4.5 },

  // Middle East + chokepoint-adjacent
  { id: "EGSUZ", unlocode: "EGSUZ", name: "Suez", country: "Egypt", countryCode: "EG", lat: 29.9667, lon: 32.55, type: "sea", region: "Middle East", annualTeuM: null },
  { id: "AEDXB", unlocode: "AEDXB", name: "Jebel Ali (Dubai)", country: "United Arab Emirates", countryCode: "AE", lat: 25.013, lon: 55.061, type: "sea", region: "Middle East", annualTeuM: 14.5 },
  { id: "OMSLL", unlocode: "OMSLL", name: "Port of Salalah", country: "Oman", countryCode: "OM", lat: 16.95, lon: 54.001, type: "sea", region: "Middle East", annualTeuM: 4.3 },

  // Asia
  { id: "CNSHA", unlocode: "CNSHA", name: "Port of Shanghai", country: "China", countryCode: "CN", lat: 31.23, lon: 121.491, type: "sea", region: "Asia", annualTeuM: 49.0 },
  { id: "CNNGB", unlocode: "CNNGB", name: "Port of Ningbo-Zhoushan", country: "China", countryCode: "CN", lat: 29.94, lon: 121.885, type: "sea", region: "Asia", annualTeuM: 35.0 },
  { id: "HKHKG", unlocode: "HKHKG", name: "Port of Hong Kong", country: "Hong Kong", countryCode: "HK", lat: 22.319, lon: 114.169, type: "sea", region: "Asia", annualTeuM: 14.3 },
  { id: "SGSIN", unlocode: "SGSIN", name: "Port of Singapore", country: "Singapore", countryCode: "SG", lat: 1.264, lon: 103.84, type: "sea", region: "Asia", annualTeuM: 39.0 },
  { id: "INNSA", unlocode: "INNSA", name: "Nhava Sheva (JNPA)", country: "India", countryCode: "IN", lat: 18.95, lon: 72.95, type: "sea", region: "Asia", annualTeuM: 6.0 },

  // Africa
  { id: "ZADUR", unlocode: "ZADUR", name: "Port of Durban", country: "South Africa", countryCode: "ZA", lat: -29.871, lon: 31.046, type: "sea", region: "Africa", annualTeuM: 2.7 },
  { id: "MAPTM", unlocode: "MAPTM", name: "Port of Tangier Med", country: "Morocco", countryCode: "MA", lat: 35.893, lon: -5.502, type: "sea", region: "Africa", annualTeuM: 8.6 },
  { id: "NGAPP", unlocode: "NGAPP", name: "Port of Apapa (Lagos)", country: "Nigeria", countryCode: "NG", lat: 6.45, lon: 3.39, type: "sea", region: "Africa", annualTeuM: 1.6 },

  // Americas
  { id: "USLAX", unlocode: "USLAX", name: "Port of Los Angeles", country: "United States", countryCode: "US", lat: 33.736, lon: -118.262, type: "sea", region: "Americas", annualTeuM: 8.6 },
  { id: "USLGB", unlocode: "USLGB", name: "Port of Long Beach", country: "United States", countryCode: "US", lat: 33.754, lon: -118.216, type: "sea", region: "Americas", annualTeuM: 8.1 },
  { id: "USNYC", unlocode: "USNYC", name: "Port of New York and New Jersey", country: "United States", countryCode: "US", lat: 40.684, lon: -74.041, type: "sea", region: "Americas", annualTeuM: 9.5 },
  { id: "USSAV", unlocode: "USSAV", name: "Port of Savannah", country: "United States", countryCode: "US", lat: 32.08, lon: -81.091, type: "sea", region: "Americas", annualTeuM: 5.6 },
  { id: "BRSSZ", unlocode: "BRSSZ", name: "Port of Santos", country: "Brazil", countryCode: "BR", lat: -23.96, lon: -46.32, type: "sea", region: "Americas", annualTeuM: 5.0 },
  { id: "MXVER", unlocode: "MXVER", name: "Port of Veracruz", country: "Mexico", countryCode: "MX", lat: 19.2, lon: -96.13, type: "sea", region: "Americas", annualTeuM: 1.2 },

  // Oceania
  { id: "AUSYD", unlocode: "AUSYD", name: "Port Botany (Sydney)", country: "Australia", countryCode: "AU", lat: -33.962, lon: 151.227, type: "sea", region: "Oceania", annualTeuM: 2.7 },
  { id: "AUMEL", unlocode: "AUMEL", name: "Port of Melbourne", country: "Australia", countryCode: "AU", lat: -37.814, lon: 144.946, type: "sea", region: "Oceania", annualTeuM: 3.3 },
];

export const AIRPORTS = [
  { id: "DXB", iata: "DXB", name: "Dubai International Airport", countryCode: "AE", lat: 25.2532, lon: 55.3657, type: "air", region: "Middle East" },
  { id: "SIN", iata: "SIN", name: "Singapore Changi Airport", countryCode: "SG", lat: 1.3644, lon: 103.9915, type: "air", region: "Asia" },
  { id: "PVG", iata: "PVG", name: "Shanghai Pudong Airport", countryCode: "CN", lat: 31.1434, lon: 121.8052, type: "air", region: "Asia" },
  { id: "AMS", iata: "AMS", name: "Amsterdam Schiphol Airport", countryCode: "NL", lat: 52.3105, lon: 4.7683, type: "air", region: "Europe" },
  { id: "LAX", iata: "LAX", name: "Los Angeles International Airport", countryCode: "US", lat: 33.9416, lon: -118.4085, type: "air", region: "Americas" },
  { id: "FRA", iata: "FRA", name: "Frankfurt Airport", countryCode: "DE", lat: 50.0379, lon: 8.5622, type: "air", region: "Europe" },
];
