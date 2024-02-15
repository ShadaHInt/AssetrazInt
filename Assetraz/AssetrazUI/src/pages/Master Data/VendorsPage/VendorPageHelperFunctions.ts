export const trimObjectValues = <T extends {}>(obj: T): T => {
  const trimmedObj = {} as T;
  for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === "string") {
              trimmedObj[key] = value.trim() as T[Extract<
                  keyof T,
                  string
              >];
          } else if (typeof value === "object" && value !== null) {
              trimmedObj[key] = trimObjectValues(value);
          } else {
              trimmedObj[key] = value;
          }
      }
  }
  return trimmedObj;
};