import type { Transport } from "./transport.interface.ts";
import type { Log } from "./log.interface.ts";

export class PapyrusConsole implements Transport {
  public log(data: string) {
    console.log(data);
  }
}