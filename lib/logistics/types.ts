export type TransportMode = "ocean" | "air" | "truck" | "rail" | "multimodal";
export type Priority = "economy" | "standard" | "express";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface PortNode {
  id: string;
  name: string;
  countryCode: string;
  region: string;
  lat: number;
  lon: number;
  type: "port" | "airport" | "rail_hub" | "truck_hub";
  handlingFeeUSD: number;
  congestionIndex: number;
  customsComplexity: number;
  geopoliticalRisk: number;
}

export interface RouteEdge {
  id: string;
  from: string;
  to: string;
  mode: TransportMode;
  distanceKm: number;
  baselineTransitDays: number;
  reliability: number;
  chokepoints: string[];
}

export interface ShipmentRequest {
  origin: string;
  destination: string;
  cargoType: string;
  containerSize?: "20ft" | "40ft";
  weightKg: number;
  quantity?: number;
  quantityUnit?: "kg"|"tonnes"|"litres"|"pallets"|"cbm"|"containers (20ft)"|"containers (40ft)";
  priority: Priority;
  transportMode?: TransportMode | "auto";
  insurance?: boolean;
  urgency?: number;
}

export interface PricingBreakdown {
  transport: number;
  fuel: number;
  handling: number;
  tariffs: number;
  congestion: number;
  seasonal: number;
  riskPremium: number;
  insurance: number;
  lastMile: number;
  delayRisk: number;
}

export interface RiskProfile { score: number; level: RiskLevel; drivers: string[]; }

export interface RouteEstimate {
  routeId: string;
  label: string;
  mode: TransportMode;
  totalCost: number;
  currency: "USD";
  estimatedTransitDays: number;
  confidence: number;
  volatility: "low" | "medium" | "high";
  congestionIndicator: "low" | "moderate" | "high";
  breakdown: PricingBreakdown;
  risk: RiskProfile;
  feasibilityScore: number;
  scores: Record<string, number>;
  waypoints: Array<{id:string; name:string; lat:number; lng:number; nodeType:string}>;
}

export interface PricingEvent {
  id: string;
  timestamp: string;
  engineVersion: string;
  shipmentRequest: ShipmentRequest;
  selectedRouteId?: string;
  estimates: RouteEstimate[];
  confidence: number;
  actualFinalCost?: number;
  actualTransitDays?: number;
  estimateDelta?: number;
}
