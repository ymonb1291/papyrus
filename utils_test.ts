import { Rhum } from "./deps_test.ts";
import { filterKeys } from "./utils.ts";

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

});

Rhum.run();