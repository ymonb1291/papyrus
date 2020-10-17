import type { KeyValuePair } from "./utils.ts";

export interface Bindings extends KeyValuePair {
  bindings?: KeyValuePair;
};

export interface BaseLog extends Bindings {
  level: number | string;
  name?: string;
  time?: number | string;
};

export interface LogPayload extends KeyValuePair {
  payload?: KeyValuePair;
};

interface LogMessage extends LogPayload {
  message?: string | number | boolean;
};

interface LogError extends LogPayload {
  error: {
    message: string;
    name: string;
    stack?: string;
  }
};

export type LogBody = Partial<LogMessage> & Partial<LogError>;

export interface LogWithMessage extends BaseLog, LogMessage, LogPayload {};
export interface LogWithError extends BaseLog, LogError, LogPayload {};
export interface Log extends BaseLog, LogBody, LogPayload {};
