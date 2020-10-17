import { Rhum } from "./deps_test.ts";
import { PapyrusConsole } from "./mod.ts";

Rhum.testPlan("papyrus_console.transport_test.ts", () => {

  Rhum.testSuite("Test output", () => {

    let output: unknown;
    let alternateConsole = function(data: unknown) {
      output = data;
    }
    let originalConsole = console.log;
    
    Rhum.testCase("Outputs a string to console.log", () => {
      const message = "MESSAGE";
      const transport = new PapyrusConsole;
      console.log = alternateConsole;
      transport.log(message);
      Rhum.asserts.assertEquals(output, message);
      console.log = originalConsole;
    });

  });

});

Rhum.run();