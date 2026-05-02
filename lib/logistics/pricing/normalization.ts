import type { ShipmentRequest } from "@/lib/logistics/types";

export interface NormalizedCargo {
  weightKg: number;
  volumeM3: number;
  palletCount: number;
  teuEquivalent: number;
  isContainerized: boolean;
}

const PALLET_M3 = 1.5;
const PALLET_KG = 500;
const TEU_M3 = 33;
const FEU_M3 = 67;

export function normalizeCargo(req: ShipmentRequest & { quantity?: number; quantityUnit?: string }): NormalizedCargo {
  const qty = Math.max(0, Number(req.quantity ?? req.weightKg ?? 0));
  const unit = (req.quantityUnit || "kg").toLowerCase();

  if (unit === "kg") return { weightKg: qty, volumeM3: qty / 167, palletCount: qty / PALLET_KG, teuEquivalent: qty / 10000, isContainerized: false };
  if (unit === "tonnes") return { weightKg: qty * 1000, volumeM3: (qty * 1000) / 167, palletCount: (qty * 1000) / PALLET_KG, teuEquivalent: qty / 10, isContainerized: false };
  if (unit === "litres") return { weightKg: qty * 0.9, volumeM3: qty / 1000, palletCount: (qty / 1000) / PALLET_M3, teuEquivalent: (qty / 1000) / TEU_M3, isContainerized: false };
  if (unit === "cbm") return { weightKg: qty * 167, volumeM3: qty, palletCount: qty / PALLET_M3, teuEquivalent: qty / TEU_M3, isContainerized: false };
  if (unit === "pallets") return { weightKg: qty * PALLET_KG, volumeM3: qty * PALLET_M3, palletCount: qty, teuEquivalent: (qty * PALLET_M3) / TEU_M3, isContainerized: false };
  if (unit.includes("20ft")) return { weightKg: qty * 21600, volumeM3: qty * TEU_M3, palletCount: qty * 10, teuEquivalent: qty, isContainerized: true };
  if (unit.includes("40ft")) return { weightKg: qty * 26700, volumeM3: qty * FEU_M3, palletCount: qty * 21, teuEquivalent: qty * 2, isContainerized: true };

  return { weightKg: qty, volumeM3: qty / 167, palletCount: qty / PALLET_KG, teuEquivalent: qty / 10000, isContainerized: false };
}
