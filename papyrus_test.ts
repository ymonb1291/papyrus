import { Rhum } from "./deps_test.ts";
import { Papyrus as ExportedPapyrus } from "./mod.ts";
import { Papyrus } from "./papyrus.ts";

Rhum.testPlan("papyrus_test.ts", () => {

  Rhum.testSuite("Papyrus", () => {

    Rhum.testCase("Dummy test", () => {
      Rhum.asserts.assert(ExportedPapyrus === Papyrus);;
    });

  });

});

Rhum.run();