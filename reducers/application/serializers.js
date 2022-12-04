import snakeToCamel from 'utils/snakeToCamel';
import { isDateStringExpired } from 'utils/misc';

const normalizeFields = source => (res, prop) => {
  res[snakeToCamel(prop)] = source[prop];
  return res;
};

export const userScoreSerializer = data => {
  if (!data) {
    return {};
  }

  const userScore = [
    'consumer_rating',
    'reason',
    'consumer_spend_limit_ceiling',
    'consumer_spend_limit_floor',
    'mobile_limit',
    'currency',
    'sm_tagged',
    'strong_phistory',
    'uploaded_id',
    'uploaded_linkedin',
    'uploaded_passport',
    'uploaded_salary_cert',
    'uploaded_linkedin_status',
    'uploaded_passport_status',
    'uploaded_salary_status',
    'lean_customer_id',
    'lean',
  ].reduce(normalizeFields(data), {});

  return userScore;
};

export const userCashbackSerializer = data => {
  if (!data) {
    return [];
  }

  const normalizeCashback = cashback => [
    'amount',
    'currency',
    'cashback_id',
    'remarks',
    'created_at',
    'order_date',
    'credit_date',
    'valid',
  ].reduce(normalizeFields(cashback), {});

  const allCashbacks = {
    cashbacks: data.cashbacks.map(cashback => normalizeCashback(cashback)),
    total: parseFloat(data.total),
    bankWithdrawalTotal: parseFloat(data.bank_withdrawal_total),
  };
  return allCashbacks;
};

const userSerializer = data => {
  if (!data) {
    return {};
  }

  const user = [
    'email',
    'user_id',
    'first_name',
    'last_name',
    'date_of_birth',
    'phone_number',
    'email_verifyed_at',
    'created_at',
    'phone_verified',
  ].reduce(normalizeFields(data.user), {});

  const userPics = data.user.user_avatar;
  const currentUser = {
    ...user,
    userPics: userPics ? Object.keys(userPics).reduce(normalizeFields(userPics), {}) : {},
    isEmailVerified: !!data.user.email_verifyed_at,
    isIdExpired: isDateStringExpired(data.consumer_identity.expiry_date),
    ...[
      'has_identities_uploaded',
      'has_front_identities_uploaded',
      'has_back_identities_uploaded',
      'is_identities_valid',
      'verification_url',
    ].reduce(normalizeFields(data), {}),
    fullName: [user.firstName ? `${user.firstName} ` : '', user.lastName].join(''),
  };

  return currentUser;
};

export default userSerializer;

export const isValidIBANNumber = input => {
  const CODE_LENGTHS = {
    AD: 24,
    AE: 23,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BR: 29,
    CH: 21,
    CR: 21,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    ES: 24,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    TN: 24,
    TR: 26,
  };
  const iban = String(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ''); // keep only alphanumeric characters
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest

  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
    return false;
  }
  // rearrange country code and check digits, and convert chars to ints
  const digits = (code[3] + code[1] + code[2]).replace(
    /[A-Z]/g,
    letter => letter.charCodeAt(0) - 55,
  );

  function mod97(string) {
    let checksum = string.slice(0, 2);
    let fragment;
    for (let offset = 2; offset < string.length; offset += 7) {
      fragment = String(checksum) + string.substring(offset, offset + 7);
      checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
  }

  // final check
  return mod97(digits);
};

const fields = ['bank', 'iban', 'swift', 'country'];

const normProp = prop => prop && prop.trim();

export const formSerializer = values => ({
  request_details: {
    ...fields.reduce(
      (res, key) => ({
        ...res,
        [key]: normProp(values[key]),
      }),
      {},
    ),
    currency: values.currency,
    iban: normProp(values.iban && values.iban.replace(/\s/g, '')),
    account_number: normProp(values.accountNumber),
    account_title: normProp(values.accountTitle),
  },
});

export const errorsSerializer = data => {
  if (typeof data !== 'object') {
    return null;
  }

  const result = Object.keys(data).reduce((res, field) => {
    const fieldErr = data[field];
    const fieldName = snakeToCamel(field);
    if (Array.isArray(fieldErr)) {
      res[fieldName] = fieldErr.pop();
    } else {
      res[fieldName] = fieldErr;
    }
    return res;
  }, {});

  return Object.keys(result).length ? result : null;
};
