import { Rhum } from "./deps_test.ts";
import { PapyrusConsole } from "./mod.ts";

import type { Log } from "./mod.ts";

Rhum.testPlan("papyrus_console.transport_test.ts", () => {

  Rhum.testSuite("Test output", () => {

    let output: unknown;
    let alternateConsole = function(data: unknown) {
      output = data;
    }
    let originalConsole = console.log;
    

    Rhum.testCase("Outputs a string to console.log when a string is provided", () => {
      const message = "MESSAGE";
      const transport = new PapyrusConsole;
      console.log = alternateConsole;
      transport.log(message);
      Rhum.asserts.assertEquals(output, message);
      console.log = originalConsole;
    });
    

    Rhum.testCase("Outputs a string to console.log when a Log is provided", () => {
      const log: Log = {_v: 1, level: 1};
      const transport = new PapyrusConsole;
      console.log = alternateConsole;
      transport.log(log);
      Rhum.asserts.assertEquals(output, JSON.stringify(log));
      console.log = originalConsole;
    });

    
    

  });

});

Rhum.run();