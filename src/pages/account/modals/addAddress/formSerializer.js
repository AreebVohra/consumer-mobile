const normProp = prop => prop.trim().replace(/[.,]$/, '');

const formSerializer = values => ({
  name: 'Default address name', // This is doesn't really have any sense
  company: '',
  email: '',
  phone: '',
  address1: normProp(values.address1),
  address2: normProp(values.address2),
  city: normProp(values.city),
  state: '',
  country: normProp(values.country),
  postal_code: normProp(values.zip),
});

export default formSerializer;
