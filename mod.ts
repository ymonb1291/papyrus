// Default export
import { Papyrus } from "./papyrus.ts";
export default Papyrus;

// Named exports
export { Level } from "./level.enum.ts";
export { Papyrus } from "./papyrus.ts";

// Type exports
export type { ChildOptions } from "./childoptions.interface.ts";
export type { Log, LogWithError, LogWithMessage } from "./log.interface.ts";
export type { PapyrusOptions } from "./papyrusoptions.interface.ts";