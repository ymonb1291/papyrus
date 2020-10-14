import { Rhum } from "./deps_test.ts";
import { Configuration } from "./configuration.ts";
import { DEFAULT_LEVEL } from "./constants.ts";
import { Level, Papyrus } from "./mod.ts";
import { Transport } from "./transport.ts";
import { Log } from "./log.interface.ts";
import { Formatter } from "./formatter.ts";

Rhum.testPlan("configuration.ts", () => {

  Rhum.testSuite("Naming", () => {

    Rhum.testCase("Can create multiple configurations without names", () => {
      try {
        new Configuration({});
        new Configuration({});
        Rhum.asserts.assert(true);
      } catch (error) {
        Rhum.asserts.assert(false);
      }

    });

    Rhum.testCase("Can't create two configurations with the same name", () => {
      const name = "CONFIGURATION_SAME_NAME";

      Rhum.asserts.assertThrows((): void => {
        new Configuration({name});
        new Configuration({name});
      },
      Error,
      `Only one logger can be named ${name}`);
    });

  });

  Rhum.testSuite("Default options", () => {

    const configuration = new Configuration({});

    Rhum.testCase("'bindings' getter returns an empty object", () => {
      Rhum.asserts.assertEquals(configuration.bindings, {});
    });

    Rhum.testCase("'enabled' getter returns true", () => {
      Rhum.asserts.assertEquals(configuration.enabled, true);
    });

    Rhum.testCase("'formatter' getter returns undefined", () => {
      Rhum.asserts.assertEquals(configuration.formatter, undefined);
    });

    Rhum.testCase("'json' getter returns true", () => {
      Rhum.asserts.assertEquals(configuration.json, true);
    });

    Rhum.testCase("'level' getter returns the default level", () => {
      Rhum.asserts.assertEquals(configuration.level, DEFAULT_LEVEL);
    });

    Rhum.testCase("'mergeBindings' getter returns true", () => {
      Rhum.asserts.assertEquals(configuration.mergeBindings, true);
    });

    Rhum.testCase("'mergePayload' getter returns true", () => {
      Rhum.asserts.assertEquals(configuration.mergePayload, true);
    });

    Rhum.testCase("'name' getter is undefined", () => {
      Rhum.asserts.assertEquals(configuration.name, undefined);
    });

    Rhum.testCase("'useLabels' getter returns false", () => {
      Rhum.asserts.assertEquals(configuration.useLabels, false);
    });

    Rhum.testCase("'time' getter returns true", () => {
      Rhum.asserts.assertEquals(configuration.time, true);
    });

    Rhum.testCase("'transport' getter returns an empty array", () => {
      Rhum.asserts.assertEquals(configuration.transport, []);
    });

  });

  Rhum.testSuite("Custom options", () => {

    const configuration = new Configuration({
      enabled: false,
      json: false,
      level: Level.error,
      mergeBindings: false,
      mergePayload: false,
      name: "CONFIGURATION_CUSTOM_NAME",
      time: false,
      useLabels: true,
    });

    Rhum.testCase("'enabled' getter returns false", () => {
      Rhum.asserts.assertEquals(configuration.enabled, false);
    });

    Rhum.testCase("'json' getter returns false", () => {
      Rhum.asserts.assertEquals(configuration.json, false);
    });

    Rhum.testCase("'level' getter returns the default level", () => {
      Rhum.asserts.assertEquals(configuration.level, Level.error);
    });

    Rhum.testCase("'mergeBindings' getter returns false", () => {
      Rhum.asserts.assertEquals(configuration.mergeBindings, false);
    });

    Rhum.testCase("'mergePayload' getter returns false", () => {
      Rhum.asserts.assertEquals(configuration.mergePayload, false);
    });

    Rhum.testCase("'name' getter is not undefined", () => {
      Rhum.asserts.assertEquals(configuration.name, "CONFIGURATION_CUSTOM_NAME");
    });

    Rhum.testCase("'useLabels' getter returns true", () => {
      Rhum.asserts.assertEquals(configuration.useLabels, true);
    });

    Rhum.testCase("'time' getter returns false", () => {
      Rhum.asserts.assertEquals(configuration.time, false);
    });

  });

  Rhum.testSuite("Bindings", () => {
    const bindingsParent = {a: "A"};
    const bindingsChild1 = {b: "B"};
    const bindingsChild2 = {c: "C"};
    const parent = new Papyrus({bindings: bindingsParent});
    const child = parent.child({
      bindings: bindingsChild1,
      name: "CONFIGURATION_BINDINGS_CHILD1",
    });

    Rhum.testCase("Bindings are merged with parent's", () => {
      const configuration = new Configuration({
        bindings: bindingsChild2,
        name: "CONFIGURATION_BINDINGS_CHILD2",
      }, child);
      
      Rhum.asserts.assertEquals(configuration.bindings, Object.assign({}, bindingsParent, bindingsChild1, bindingsChild2));
    });

  });

  Rhum.testSuite("Transport", () => {

    class TestTransport implements Transport {
      public log(data: Log |string) {}
    }

    class TestFormatter implements Formatter {
      public format(data: Log |string): Log |string {
        return data;
      }
    }
    const configuration = new Configuration({
      transport: {
        use: new TestTransport,
        formatter: new TestFormatter,
        json: true
      },
    });

    Rhum.testCase("'transport[0].use' property is a transport", () => {
      Rhum.asserts.assert(configuration.transport[0].use instanceof TestTransport);
    });

    Rhum.testCase("'transport[0].formatter' property is a formatter", () => {
      Rhum.asserts.assert(configuration.transport[0].formatter instanceof TestFormatter);
    });

    Rhum.testCase("'transport[0].json' property is true", () => {
      Rhum.asserts.assert(configuration.transport[0].json);
    });
    
  });

  Rhum.testSuite("Formatter", () => {

    class TestFormatter implements Formatter {
      public format(data: Log |string): Log |string {
        return data;
      }
    }
    const configuration = new Configuration({
      formatter: new TestFormatter,
    });

    Rhum.testCase("'formatter' getter returns a formatter", () => {
      Rhum.asserts.assert(configuration.formatter instanceof TestFormatter);
    });
    
  });

});

Rhum.run();