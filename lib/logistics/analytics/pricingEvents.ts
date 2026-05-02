import fs from "fs";
import path from "path";
import type { PricingEvent } from "@/lib/logistics/types";

const EVENTS_FILE = path.join(process.cwd(), "tmp", "pricing-events.jsonl");

export async function logPricingEvent(event: PricingEvent) {
  await fs.promises.mkdir(path.dirname(EVENTS_FILE), { recursive: true });
  await fs.promises.appendFile(EVENTS_FILE, `${JSON.stringify(event)}\n`, "utf8");
}
