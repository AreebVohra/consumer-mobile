import snakeToCamel from 'utils/snakeToCamel';

export default function normalizeAll(source) {
  if (Array.isArray(source)) {
    // Normilize each element of array
    return source.map(val => normalizeAll(val));
  }

  if (typeof source === 'object' && source !== null) {
    // Normilize properties of the object
    return Object.keys(source).reduce((res, prop) => {
      res[snakeToCamel(prop)] = normalizeAll(source[prop]);
      return res;
    }, {});
  }
  // Primitive value
  return source;
}
