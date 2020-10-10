import { assert } from "./deps_test.ts";
import { Papyrus as ExportedPapyrus } from "./mod.ts";
import { Papyrus } from "./papyrus.ts";

Deno.test("Papyrus", () => {
  assert(ExportedPapyrus === Papyrus);
});