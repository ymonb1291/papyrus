import type { KeyValuePair } from "./utils.ts";

export interface LogMetaData extends KeyValuePair {
  _v: number;
}

export interface Bindings extends KeyValuePair {
  bindings?: KeyValuePair;
}

export interface BaseLog extends Bindings {
  level: number | string;
  name?: string;
  time?: number | string;
}

export interface LogPayload extends KeyValuePair {
  payload?: KeyValuePair;
}

interface LogMessage extends LogPayload {
  message?: string;
};

interface LogError extends LogPayload {
  errorName: string;
  message: string;
  stack?: string;
  type: "error";
};

export type LogBody = Partial<LogMessage> & Partial<LogError>;

export interface LogWithMessage extends LogMetaData, BaseLog, LogMessage, LogPayload {}
export interface LogWithError extends LogMetaData, BaseLog, LogError, LogPayload {}
export interface Log extends LogMetaData, BaseLog, LogBody, LogPayload {}