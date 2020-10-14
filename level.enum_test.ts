import { Rhum } from "./deps_test.ts";
import { Level, Papyrus } from "./mod.ts";

Rhum.testPlan("level.enum.ts", () => {

  Rhum.testSuite("Level", () => {
    const numbers: string[] = [];
    const strings: string[] = [];

    Rhum.testCase("Enum values are numbers", () => {

      Object
        .keys(Level)
        .forEach(key => {
          if(isNaN(parseInt(key))) {
            strings.push(key);
          } else {
            numbers.push(key);
          }
        });
        
      Rhum.asserts.assertEquals(numbers.length, strings.length)
    });

    Rhum.testCase("Enum keys correspond to a method of Papyrus", () => {
      const logger = new Papyrus;
      
      const res = strings
        .map(key => {
          return !!logger[key as keyof Papyrus];
        })
        .every(el => el);

      Rhum.asserts.assert(res);
    });

  });

});

Rhum.run();