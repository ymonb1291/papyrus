import { Transport } from "../papyrus-file/deps.ts";
import { Rhum } from "./deps_test.ts";
import { Formatter } from "./formatter.interface.ts";
import { Log } from "./log.interface.ts";
import { Logger } from "./logger.ts";
import { Papyrus } from "./mod.ts";

let output: string = "";
let alternateConsole = function(data: string) {
  output += data;
}
let originalConsole = console.log;

Rhum.testPlan("logger_test.ts", () => {

  Rhum.testSuite("Labels", () => {

    Rhum.testCase("'useLabels=false' outputs a log with label=0", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        useLabels: false
      });
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.level, 0);
      console.log = originalConsole;
    });

    Rhum.testCase("'useLabels=true' outputs a log with label='trace'", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        useLabels: true
      });
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.level, "trace");
      console.log = originalConsole;
    });

  });

  Rhum.testSuite("Name", () => {

    Rhum.testCase("'name=String' adds a name property to the log", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        name: "LOGGER_NAME"
      });
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.name, "LOGGER_NAME");
      console.log = originalConsole;
    });

  });

  Rhum.testSuite("Bindings", () => {

    Rhum.testCase("'mergeBindings=false' nests bindings under a 'bindings' property in the log", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        bindings: {a: "A"},
        mergeBindings: false,
      });
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.bindings, {a: "A"});
      console.log = originalConsole;
    });

    Rhum.testCase("'mergeBindings=true' merges bindings with the log", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        bindings: {a: "A"},
        mergeBindings: true,
      });
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.a, "A");
      console.log = originalConsole;
    });

    Rhum.testCase("bindings with the same key as a property of log are lost", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        bindings: {time: "TIME"},
        time: true,
        mergeBindings: true,
      });
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(typeof log.time, "number");
      console.log = originalConsole;
    });

    Rhum.testCase("absent properties of log are not restrictive for bindings", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        bindings: {time: "TIME"},
        time: false,
        mergeBindings: true,
      });
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(typeof log.time, "string");
      console.log = originalConsole;
    });

  });

  Rhum.testSuite("Payload", () => {

    Rhum.testCase("'mergePayload=false' nests payload under a 'payload' property in the log", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        mergePayload: false,
      });
      logger.trace("MESSAGE", {a: "A"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.payload, {a: "A"});
      console.log = originalConsole;
    });

    Rhum.testCase("'mergePayload=true' merges payload with the log", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        mergePayload: true,
      });
      logger.trace("MESSAGE", {a: "A"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.a, "A");
      console.log = originalConsole;
    });

    Rhum.testCase("payloads with the same key as a property of log are lost", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        time: true,
        mergePayload: true,
      });
      logger.trace("MESSAGE", {time: "TIME"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(typeof log.time, "number");
      console.log = originalConsole;
    });

    Rhum.testCase("absent properties of log are not restrictive for payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        time: false,
        mergePayload: true,
      });
      logger.trace("MESSAGE", {time: "TIME"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(typeof log.time, "string");
      console.log = originalConsole;
    });

  });

  Rhum.testSuite("Formatters", () => {

    Rhum.testCase("Formatters returning a Log are working", () => {
      class TestFormatter implements Formatter {
        public format(log: Log | string): Log {
          let obj: any = typeof log === "string" ? JSON.parse(log) : log;
          obj.formatted = true;
          return obj;
        }
      }

      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        formatter: new TestFormatter
      });
      logger.trace();
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.formatted, true);
      console.log = originalConsole;
    });

    Rhum.testCase("Formatters returning a string are working", () => {
      class TestFormatter implements Formatter {
        public format(log: Log | string): string {
          let obj: any = typeof log === "string" ? JSON.parse(log) : log;
          obj.formatted = true;
          return JSON.stringify(obj);
        }
      }

      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        formatter: new TestFormatter
      });
      logger.trace();
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.formatted, true);
      console.log = originalConsole;
    });

  });

  Rhum.testSuite("Transports", () => {

    Rhum.testCase("Single transport working", () => {
      class TestTransport implements Transport {
        public log(data: string): void {
          console.log("FromTestTransport")
        }
      }

      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        transport: {
          use: new TestTransport
        }
      });
      logger.trace();
      Rhum.asserts.assertEquals(output, "FromTestTransport");
      console.log = originalConsole;
    });

    Rhum.testCase("Multiple transports working", () => {
      class TestTransport1 implements Transport {
        public log(data: string): void {
          console.log("FromTestTransport1")
        }
      }
      class TestTransport2 implements Transport {
        public log(data: string): void {
          console.log("FromTestTransport2")
        }
      }

      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        transport: [
          {
            use: new TestTransport1
          },
          {
            use: new TestTransport2
          }
        ]
      });
      logger.trace();
      Rhum.asserts.assert(output.includes("FromTestTransport1"));
      Rhum.asserts.assert(output.includes("FromTestTransport2"));
      console.log = originalConsole;
    });

    Rhum.testCase("Multiple transports with formatters are working", () => {
      class TestFormatter implements Formatter {
        public format(log: Log | string): string {
          let obj: any = typeof log === "string" ? JSON.parse(log) : log;
          obj.formatted = true;
          return JSON.stringify(obj);
        }
      }
      class TestTransport1 implements Transport {
        public log(data: string): void {
          let obj: any = JSON.parse(data);
          obj.transporter = true;
          console.log(JSON.stringify(obj));
        }
      }

      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({
        transport: [
          {
            use: new TestTransport1,
            formatter: new TestFormatter
          }
        ]
      });
      logger.trace();
      console.error(output)
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.formatted, true);
      Rhum.asserts.assertEquals(log.transporter, true);
      console.log = originalConsole;
    });

  });

});

Rhum.run();