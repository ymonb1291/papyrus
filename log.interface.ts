import type { Level } from "./level.enum.ts";

export interface BaseLog {
  level: Level | string;
  name?: string;
  timestamp?: number;
}

export interface Log extends BaseLog {
  message: string;
  [key: string]: unknown;
}