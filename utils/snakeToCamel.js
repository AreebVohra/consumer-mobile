export default function snakeToCamel(str) {
  return str.split('_').reduce((r, word, i) => {
    if (i === 0) {
      return word.toLowerCase();
    }
    return r + word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
  }, '');
}
