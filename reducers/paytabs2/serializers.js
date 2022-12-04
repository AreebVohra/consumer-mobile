import snakeToCamel from 'utils/snakeToCamel';

const pt2RequestSerializer = payload => {
  return Object.keys(payload).reduce((o, prop) => {
    // eslint-disable-next-line no-param-reassign
    o[snakeToCamel(prop)] = payload[prop];
    return o;
  }, {});
};

export default pt2RequestSerializer;
