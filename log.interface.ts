import type { Level } from "./level.enum.ts";
import { KeyValuePair } from "./utils.ts";

export interface VersionLog {
  _v: number;
}

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
  errorName: string;
  message: string;
  stack: string;
  type: "error";
}

export type LogPayload = DefaultLogPayload | ErrorLogPayload | KeyValuePair;

export type DefaultLog = VersionLog & BaseLog & DefaultLogPayload;
export type ErrorLog = VersionLog & BaseLog & ErrorLogPayload;
export type Log = DefaultLog | (VersionLog & BaseLog & Partial<ErrorLogPayload>);