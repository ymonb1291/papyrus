export interface KeyValuePair {
  [key: string]: unknown;
}

export function filterKeys(
  condition: boolean,
  object: KeyValuePair,
  ...lookIn: KeyValuePair[]
  ): KeyValuePair {
    const res: KeyValuePair = {};

    Object
      .keys(object)
      .forEach(key => {
        if(condition) {
          const hasKey = lookIn
            .map(obj => {
              return obj.hasOwnProperty(key) ? true : false;
            })
            .some(el => el);
          if(!hasKey) {
            res[key] = object[key];
          }
        } else {
          res[key] = object[key];
        }
      });
    return res;
}