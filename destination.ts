export interface DestinationOptions {
  use?: Destination;
}

export interface Destination {
  log: (data: string) => void
}

