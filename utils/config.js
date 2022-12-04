import getEnvVars from '../environment';

const config = (name) => {
  const normalizedName = name.toUpperCase();
  return getEnvVars()[`REACT_NATIVE_APP_${normalizedName}`];
};

export default config;
