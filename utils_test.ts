import { Rhum } from "./deps_test.ts";
import { Level } from "./level.enum.ts";
import { filterKeys, levelToNum, numToLevel } from "./utils.ts";

Rhum.testPlan("utils_test.ts", () => {

  Rhum.testSuite("filterKeys()", () => {
    const object = {a: "A", b: "B", c: "C"};
    const expect = {a: "A"};
    const lookIn1 = {b: "B"};
    const lookIn2 = {c: "C"};

    Rhum.testCase("Returns an un-filtered object when condition is false", () => {
      const res = filterKeys(false, object, lookIn1, lookIn2);
      Rhum.asserts.assertEquals(res, object);
    });

    Rhum.testCase("Returns a filtered object when condition is true", () => {
      const res = filterKeys(true, object, lookIn1, lookIn2);
      Rhum.asserts.assertEquals(res, expect);
    });

  });

  Rhum.testSuite("levelToNum()", () => {

    const testCases: [string, number | void][] = [
      ["trace", 0],
      ["debug", 1],
      ["info", 2],
      ["warn", 3],
      ["error", 4],
      ["xyz", void 0],
    ];

    testCases.forEach(testCase => {
      Rhum.testCase(`Using '${testCase[0]}' as argument returns ${testCase[1]}`, () => {
        Rhum.asserts.assertEquals(levelToNum(testCase[0] as keyof typeof Level), testCase[1]);
      });
    });

  });

  Rhum.testSuite("numToLevel()", () => {

    const testCases: [number, keyof typeof Level | void][] = [
      [-1, void 0],
      [0, "trace"],
      [1, "debug"],
      [2, "info"],
      [3, "warn"],
      [4, "error"],
      [5, void 0],
    ];

    testCases.forEach(testCase => {
      Rhum.testCase(`Using '${testCase[0]}' as argument returns ${testCase[1]}`, () => {
        Rhum.asserts.assertEquals(numToLevel(testCase[0]), testCase[1]);
      });
    });

  });

});

Rhum.run();