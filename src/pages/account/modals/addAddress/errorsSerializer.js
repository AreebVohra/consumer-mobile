const errorsSerializer = data => {
  if (typeof data !== 'object') {
    return null;
  }

  const result = Object.keys(data).reduce((res, field) => {
    const fieldErr = data[field];
    const fieldName = field === 'postal_code' ? 'zip' : field;
    if (Array.isArray(fieldErr)) {
      res[fieldName] = fieldErr.pop();
    } else {
      res[fieldName] = fieldErr;
    }
    return res;
  }, {});

  return Object.keys(result).length ? result : null;
};

export default errorsSerializer;
