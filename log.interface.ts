import type { Level } from "./level.enum.ts";
import { KeyValuePair } from "./utils.ts";

export interface BaseLog extends KeyValuePair {
  level: Level | string;
  name?: string;
  time?: number;
}

export interface DefaultLogPayload {
  message?: string;
  payload?: KeyValuePair;
}

export interface ErrorLogPayload {
  type: "error";
  errorName: string;
  message: string;
  stack: string;
}

export type LogPayload = DefaultLogPayload | ErrorLogPayload | KeyValuePair;

export type DefaultLog = BaseLog & DefaultLogPayload;
export type ErrorLog = BaseLog & ErrorLogPayload;
export type Log = DefaultLog | BaseLog & Partial<ErrorLogPayload>;