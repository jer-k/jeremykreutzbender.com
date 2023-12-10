import { camelCase } from "lodash";

import { DatabaseError } from "@planetscale/database";

export type ParseDatabaseErrorResult<TFields> = {
  base: string[];
  // Mapped type - https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
  formFields: {
    [K in keyof TFields]?: TFields[K];
  };
};

type ParseDatabaseErrorProps<TFields> = {
  fields: TFields;
  error: DatabaseError;
};

export function parseDatabaseError<TFields extends Record<string, unknown>>({
  fields,
  error,
}: ParseDatabaseErrorProps<TFields>): ParseDatabaseErrorResult<TFields> {
  const messageHash = convertMessageToHash(error.message);

  return Object.keys(messageHash).reduce<ParseDatabaseErrorResult<TFields>>(
    (memo, key) => {
      const camelKey = camelCase(key);
      const message = messageHash[key];
      const presentFieldKey = presentKey(fields, camelKey);
      if (presentFieldKey) {
        // Can't quite figure this one out at the moment. Tried a few different iterations
        // but it could be the way I've defined the formFields types isn't easy to work
        // with or what I'm trying to do to coerce camelKey into a key that matches what
        // is in TFields. My lack of Typescript knowledge is holding me back here
        //@ts-ignore
        memo.formFields[presentFieldKey] = message;
      } else {
        memo.base.push(message);
      }

      return memo;
    },
    { base: [], formFields: {} } as ParseDatabaseErrorResult<TFields>,
  );
}

// See parse-error.test.ts for an example of the full string PlanetScale / Mysql was returning
function convertMessageToHash(message: string) {
  const fieldResult = /error:.*desc = Field (?<field>'.*?)\(/.exec(message);
  const field = fieldResult?.groups?.field;
  if (field) {
    const keyResult = /'(?<key>.*?)'/.exec(field);
    const key = keyResult?.groups?.key;
    if (key) {
      return {
        [key]: field.trim(),
      };
    }
  }

  return {};
}

// Narrowing / Type Guard - https://www.typescriptlang.org/docs/handbook/2/narrowing.html
function presentKey<TFields extends Record<string, unknown>>(
  object: TFields,
  key: string,
): Extract<keyof TFields, string> | undefined {
  if (key in object) {
    return key as Extract<keyof TFields, string>;
  } else {
    return undefined;
  }
}
