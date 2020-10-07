export interface Log {
  name?: string;
  message: string;
  [key: string]: unknown;
}