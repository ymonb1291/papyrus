// Default export
import { Papyrus } from "./papyrus.ts";
export default Papyrus;

// Named exports
export { Level } from "./level.enum.ts";
export { Papyrus } from "./papyrus.ts";
export { PapyrusConsole } from "./console.transport.ts";

// Type exports
export type { ChildOptions } from "./child_options.interface.ts";
export type { Log, LogWithError, LogWithMessage } from "./log.interface.ts";
export type { PapyrusOptions } from "./papyrus_options.interface.ts";