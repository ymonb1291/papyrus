/** Generic interface for plain objects */
export interface KeyValuePair {
  [key: string]: unknown;
}

/**
 * Iterates through the props of an object, and removes any that
 * can be found in other "lookIn" objects.
 * @param condition Enable filtering when true
 * @param object Object who's props have to be filtered
 * @param lookIn Object(s) who's keys will be filtered in object
 */
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