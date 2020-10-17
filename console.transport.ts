import type { Transport } from "./transport.interface.ts";

export class PapyrusConsole implements Transport {
  public log(data: string) {
    console.log(data);
  }
}