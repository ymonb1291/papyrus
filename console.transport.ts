import type { Transport } from "./transport.interface.ts";
import type { Log } from "./log.interface.ts";

export class PapyrusConsole implements Transport {
  public log(data: Log | string) {
    console.log(typeof data === "string" ? data : JSON.stringify(data));
  }
}