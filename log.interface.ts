import type { Level } from "./level.enum.ts";

export interface Log {
  level: Level;
  message: string;
  name?: string;
  timestamp?: number;
  [key: string]: unknown;
}