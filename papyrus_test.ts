import { Rhum } from "./deps_test.ts";
import { Log } from "./log.interface.ts";
import { Papyrus } from "./mod.ts";

let output: string = "";
let alternateConsole = function(data: string) {
  output = data;
}
let originalConsole = console.log;

Rhum.testPlan("papyrus_test.ts", () => {

  Rhum.testSuite("Getters", () => {

    Rhum.testCase("'enable' getter working", () => {
      const logger1 = new Papyrus({enabled: true});
      const logger2 = new Papyrus({enabled: false});
      Rhum.asserts.assert(logger1.enabled);
      Rhum.asserts.assert(!logger2.enabled);
    });

    Rhum.testCase("'bindings' getter working", () => {
      const logger1 = new Papyrus();
      const logger2 = new Papyrus({bindings: {a: "A"}});
      const logger3 = logger2.child({name: "PAPYRUS_GETTERS_BINDINGS1", bindings: {b: "B"}});
      
      Rhum.asserts.assertEquals(logger1.bindings, {});
      Rhum.asserts.assertEquals(logger2.bindings, {a: "A"});
      Rhum.asserts.assertEquals(logger3.bindings, {a: "A", b: "B"});
    });

  });

  Rhum.testSuite("Logging methods", () => {
    
    Rhum.testCase("'trace' outputs to level 0", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.trace("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.level, 0);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'trace' doesn't output when level is set to 1", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({level: 1});
      logger.trace("MESSAGE");
      Rhum.asserts.assert(!output);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'trace' outputs messages with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.trace("MESSAGE", {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, "MESSAGE");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'trace' outputs payloads without message", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.trace({a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'trace' outputs errors with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      const e = new Error("ERROR_MSG");
      e.name = "ERROR_NAME";
      logger.trace(e, {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.error?.message, "ERROR_MSG");
      Rhum.asserts.assertEquals(log.error?.name, "ERROR_NAME");
      Rhum.asserts.assertEquals(typeof log.error?.stack, "string");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'trace' accept no argument", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.trace();
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'debug' outputs to level 1", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.debug("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.level, 1);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'debug' doesn't output when level is set to 2", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({level: 2});
      logger.debug("MESSAGE");
      Rhum.asserts.assert(!output);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'debug' outputs messages with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.debug("MESSAGE", {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, "MESSAGE");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'debug' outputs payloads without message", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.debug({a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'debug' outputs errors with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      const e = new Error("ERROR_MSG");
      e.name = "ERROR_NAME";
      logger.debug(e, {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.error?.message, "ERROR_MSG");
      Rhum.asserts.assertEquals(log.error?.name, "ERROR_NAME");
      Rhum.asserts.assertEquals(typeof log.error?.stack, "string");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'debug' accept no argument", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.debug();
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'info' outputs to level 2", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.info("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.level, 2);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'info' doesn't output when level is set to 3", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({level: 3});
      logger.info("MESSAGE");
      Rhum.asserts.assert(!output);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'info' outputs messages with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.info("MESSAGE", {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, "MESSAGE");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'info' outputs payloads without message", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.info({a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'info' outputs errors with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      const e = new Error("ERROR_MSG");
      e.name = "ERROR_NAME";
      logger.info(e, {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.error?.message, "ERROR_MSG");
      Rhum.asserts.assertEquals(log.error?.name, "ERROR_NAME");
      Rhum.asserts.assertEquals(typeof log.error?.stack, "string");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'info' accept no argument", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.info();
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'warn' outputs to level 3", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.warn("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.level, 3);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'warn' doesn't output when level is set to 4", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({level: 4});
      logger.warn("MESSAGE");
      Rhum.asserts.assert(!output);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'warn' outputs messages with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.warn("MESSAGE", {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, "MESSAGE");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'warn' outputs payloads without message", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.warn({a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'warn' outputs errors with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      const e = new Error("ERROR_MSG");
      e.name = "ERROR_NAME";
      logger.warn(e, {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.error?.message, "ERROR_MSG");
      Rhum.asserts.assertEquals(log.error?.name, "ERROR_NAME");
      Rhum.asserts.assertEquals(typeof log.error?.stack, "string");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'warn' accept no argument", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.warn();
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'error' outputs to level 4", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.error("MESSAGE");
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.level, 4);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'error' outputs when level is set to 5", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({level: 5});
      logger.error("MESSAGE");
      Rhum.asserts.assert(output);
      console.log = originalConsole;
    });
    
    Rhum.testCase("'error' outputs messages with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.error("MESSAGE", {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, "MESSAGE");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'error' outputs payloads without message", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.error({a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'error' outputs errors with payloads", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      const e = new Error("ERROR_MSG");
      e.name = "ERROR_NAME";
      logger.error(e, {a: "A"}, {b: "B"});
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      Rhum.asserts.assertEquals(log.error?.message, "ERROR_MSG");
      Rhum.asserts.assertEquals(log.error?.name, "ERROR_NAME");
      Rhum.asserts.assertEquals(typeof log.error?.stack, "string");
      Rhum.asserts.assertEquals(log.a, "A");
      Rhum.asserts.assertEquals(log.b, "B");
      console.log = originalConsole;
    });
    
    Rhum.testCase("'error' accept no argument", () => {
      console.log = alternateConsole;
      output = "";
      const logger = new Papyrus({});
      logger.error();
      const log: Log = JSON.parse(output);
      Rhum.asserts.assertEquals(log.message, void 0);
      console.log = originalConsole;
    });

  });

});

Rhum.run();