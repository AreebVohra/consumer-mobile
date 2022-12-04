import { Dimensions } from 'react-native';
import config from 'utils/config';
import { t } from 'services/i18n';

export const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;

export const TERMS_AND_CONDITIONS_URL = 'https://www.spotii.com/terms-and-conditions.html';
export const SPOTII_URL = 'https://www.spotii.com';

export const DEFAULT_PHONE_AREA_CODE = '+971';

export const ORDER_STATUS_OPENED = 'OPENED';
export const ORDER_STATUS_COMPLETE = 'COMPLETED';
export const ORDER_STATUS_REFUNDED = 'REFUNDED';

export const INSTALLMENTS_STATUS_ACTIVE = 'ACTIVE';
export const INSTALLMENTS_STATUS_COMPLETE = 'COMPLETE';
export const INSTALLMENTS_STATUS_REFUNDED = 'REFUNDED';

export const INSTALLMENT_STATUS_PAID = 'PAID';
export const INSTALLMENT_STATUS_MISSED = 'MISSED';
export const INSTALLMENT_STATUS_SCHEDULED = 'SCHEDULED';
export const INSTALLMENT_STATUS_VOIDED = 'VOIDED';
export const INSTALLMENT_STATUS_REFUNDED = 'REFUNDED';
export const INSTALLMENT_STATUS_AUTHORIZED = 'AUTHORIZED';
export const INSTALLMENT_STATUS_DRAFT = 'DRAFT';

export const DATA_MISMATCH = 'dataMismatch';
export const EXPIRED_EID = 'expiredEmid';
export const WRONG_SIDE = 'wrongSide';
export const DUPLICATE_ID = 'duplicateId';
export const BAD_IMG = 'badImg';

export const DRAFT_STATUS_REJECTED = 'REJECTED';
export const DRAFT_STATUS_COMPLETED = 'COMPLETED';
export const DRAFT_STATUS_PENDING_MERCHANT = 'PENDING_MERCHANT';
export const DRAFT_STATUS_CANCELLED = 'CANCELLED';
export const DRAFT_STATUS_IN_PROGRESS = 'IN_PROGRESS';
export const DRAFT_STATUS_PENDING_PAYMENT = 'PENDING_PAYMENT';

export const FAILED_CHECKOUT_STATUS = 'FAILED';

export const LINK_TO_TERMS = '/terms-and-conditions.html';
export const LINK_TO_PRIVACY_POLICY = '/privacy-policy.html';

export const PLAN_SLUGS = {
  BI_WEEKLY: 'bi-weekly',
  ZERO_DOWN_BI_WEEKLY: 'zero-downpayment-bi-weekly',
  MONTHLY: 'monthly',
  PAY_NOW: 'pay-now',
  MONTHLY_10_SPLITS: 'monthly-10-splits',
  MONTHLY_6_SPLITS: 'monthly-6-splits',
  FULL_IN_1_MONTH: 'pay-full-in-1-month',
  MONTHLY_12_DAY7: 'monthly-12-day7',
  MONTHLY_3: 'monthly-3',
  BI_WEEKLY_5: 'bi-weekly-5',
  PAY_NOW_40_MONTHLY_20: 'pay-now-40-monthly-20',
  PAY_NOW_50_MONTHLY_25: 'pay-now-50-monthly-25',
};

export const IN_STORE_PLANS = [
  PLAN_SLUGS.BI_WEEKLY,
  PLAN_SLUGS.MONTHLY,
  PLAN_SLUGS.MONTHLY_10_SPLITS,
  PLAN_SLUGS.PAY_NOW,
  PLAN_SLUGS.MONTHLY_3,
  PLAN_SLUGS.PAY_NOW_40_MONTHLY_20,
  PLAN_SLUGS.MONTHLY_6_SPLITS,
  PLAN_SLUGS.PAY_NOW_50_MONTHLY_25,
];

export const PAYMENT_TYPES = {
  PAYTABS_2: 'paytabs2',
  HYPER_PAY: 'hyper_pay',
  LEAN: 'lean',
};

export const PLAN_TYPES = {
  INSTALMENTS: 'instalments',
  NO_PAY_TODAY: 'no-pay-today',
};

export const ZERO_DOWN_PLANS = [
  PLAN_SLUGS.FULL_IN_1_MONTH,
  PLAN_SLUGS.ZERO_DOWN_BI_WEEKLY,
  PLAN_SLUGS.MONTHLY_12_DAY7,
];

export const mainCountrySelectOptions = [
  ['UAE', 'common.uae', '+971'],
  ['KSA', 'common.saudiArabia', '+966'],
];

export const countrySelectOptions = [
  ['AE', 'common.uae', '+971'],
  ['SU', 'common.saudiArabia', '+966'],
  ['BR', 'common.bahrain', '+973'],
  ['ON', 'common.oman', '+968'],
];

export const countrySelectOptionsAlpha3 = [
  ['ARE', 'common.uae', '+971'],
  ['SAU', 'common.saudiArabia', '+966'],
  ['BHR', 'common.bahrain', '+973'],
  ['OMN', 'common.oman', '+968'],
];

export const FRONT_COUNTRIES = ['SAU'];
export const BACK_COUNTRIES = ['UAE', 'KWT', 'BHR', 'OMN'];
export const FRONT_AND_BACK_COUNTRIES = [];
export const BASE_CURRENCY = 'AED';

export const SCORE_DATA_UPLOADED = 'uploaded';
export const SCORE_DATA_VERIFIED = 'verified';
export const SCORE_DATA_REJECTED = 'rejected';

export const CONSUMER_RISK_DATA_UPLOAD_URL = `${config(
  'public_api_base_url',
)}/consumer-risk-data-upload/`;

export const REJECTIONS = {
  PAYMENT_CANCELLED: 'payment_cancelled',
  CVV: 'cvv',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  EXPIRED_CARD: 'expired_card',
  STOLEN_OR_LOST_CARD: 'stolen_or_lost_card',
};
export const PT2_INSUFFICIENT_FUNDS = 'Insufficient funds';

export const declineCodes = [
  'unpaid_installments',
  'identities_lock',
  'credit_limit',
  'order_min_amount',
  'order_approval',
  'currency_unsupported',
  'spotii_bl',
  'spotii_ib',
  'spotii_gtl',
  'spotii_tr',
  'spotii_lf',
  'spotii_tabs',
  'contact_bank',
  'spotii_exp',
  'spotii_sbm',
  'spotii_min',
  'spotii_02',
  'spotii_03',
  'spotii_fl',
  'spotii_app_version',
  'mob_crd',
  'address_verification_fail',
  'invalid_cvv',
  'insufficient_funds',
  'u_c',
  'unregistered_phone',
  'invalid_country',
];
export const DECLINE_MESSAGES = {};
declineCodes.forEach(key => {
  DECLINE_MESSAGES[key.toUpperCase()] = key;
});

export const DECLINE_REASONS = {
  SPOTII_02_DL: 'dl',
  SPOTII_03_SC: 'sc',
  SPOTII_02_SPU: 'shared_pcard_uu',
  SPOTII_02_PPU: 'prepaid_pcard_uu',
};

const blockingCodes = [
  'sal_rqd',
  'sal_prg',
  'sal_rej',
  'mob_crd',
  'mob_eml',
  'mob_oom',
  'mob_err',
  'blk',
  'def',
];

export const BLOCKING_CODES = {};
blockingCodes.forEach(key => {
  BLOCKING_CODES[key.toUpperCase()] = key;
});

export const USER_DETAILS = {
  NAME: 'name',
  ID_NUMBER: 'id_number',
  CARD_NUMBER: 'card_number',
  DOB: 'dob',
  CARD_EXPIRY: 'expiry_date',
};

export const passportDeclineCodes = [
  'no_mrz', // no machine readable zone
  'bad_score', // bad image
  'duplicate_passport', // passport exists in other acct
];

export const PASSPORT_DECLINE_MESSAGES = {};
passportDeclineCodes.forEach(key => {
  PASSPORT_DECLINE_MESSAGES[key.toUpperCase()] = key;
});

const countries = [
  'uae',
  'sau',
];

export const COUNTRIES = {};
countries.forEach(key => {
  COUNTRIES[key.toUpperCase()] = key.toUpperCase();
});
export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
};

export const NO_IBAN_COUNTRIES = ['OMN'];

export const AFFILIATE_SLUG = 'affiliate';

export const AFFILIATE_AGENT_ID_PARAM = {
  ADMITAD: 'subid',
  AMAZON: 'ascsubtag',
  ARABCLICKS: 'aff_sub',
  PARTNERIZE: 'ar',
  OPTIMIZEMEDIA: 'UID',
};

// List of affiliate agents that require URL extensions over query parameters for sub IDs
export const AFFILIATE_AGENT_URL_EXTENSION = ['PARTNERIZE'];

export const SMART_MERCHANT_TYPES = {
  PROMOTED: 'PROMOTED',
  RECOMMENDED: 'RECOMMENDED',
};

export const RECOMMENDED_CATEGORY = {
  slug: SMART_MERCHANT_TYPES.RECOMMENDED,
  displayName: t('common.recommended'),
  isParent: true,
  subCategories: Array(0),
  showOnHome: true,
};

export const DIRECTORY_EN_PATH = 'https://storage.googleapis.com/cdn-spotii-me/shop-directory/abis-en-v11.json';
// export const DIRECTORY_EN_PATH = 'https://storage.googleapis.com/cdn-spotii-me/shop-directory/complete-merchants-with-countries.json';
export const DIRECTORY_AR_PATH = 'https://storage.googleapis.com/cdn-spotii-me/shop-directory/abis-ar-v11.json';
// export const DIRECTORY_AR_PATH = 'https://storage.googleapis.com/cdn-spotii-me/shop-directory/complete-merchants-with-countries-ar.json';

export const NFC_ENROLLMENT_ERRORS = {
  USER_CANCEL: 'USER_CANCEL',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  SESSION_INVALIDATED_CHIP_VALIDATION_FAILED: 'SESSION_INVALIDATED_CHIP_VALIDATION_FAILED',
  SESSION_INVALIDATED_READING_NOT_SUPPORTED: 'SESSION_INVALIDATED_READING_NOT_SUPPORTED',
  SESSION_INVALIDATED_FACE_RECOGNITION_TOO_MANY_ATTEMPTS: 'SESSION_INVALIDATED_FACE_RECOGNITION_TOO_MANY_ATTEMPTS',
};

export const NFC_ENROLLMENT_RISK_ERRORS = {
  DUPLICATE_ID: 'duplicate_id',
  DATA_MISMATCH: 'data_mismatch',
  EXPIRED: 'expired_emid',
  NFC_NOT_SUPPORTED: 'NFC_NOT_SUPPORTED',
};

export const IS_CASHBACK_ENABLED = true;

export const VGS_SUPPORTED_CURRENCIES = ['SAR'];
export const VGS_PAYMENT_TYPES = {
  PAY_PENDING: ['all', 'next'],
  ADD_CARD: 'add_card',
};

export const PROFILE_LANGUAGES_TEXT = {
  ENGLISH: 'English',
  ARABIC: 'العربية',
};

export const LANGUAGES_TEXT = {
  ENGLISH: 'English',
  ARABIC: 'عربي',
};

export const CASHBACK = {
  MIN_TOTAL_REDEEMABLE_CASHBACK: 100,
};

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const MAF_ASSETS = {
  BANNER: 'https://storage.googleapis.com/cdn-spotii-me/shop-directory/maf-banner-app-sd',
  HERO: 'https://storage.googleapis.com/cdn-spotii-me/shop-directory/maf-app-hero-image',
};

export const LEC_BANNER = 'https://storage.googleapis.com/cdn-spotii-me/shop-directory/lec-banner.png';

export const MAF_MERCHANT_ID = 'a100af68-6639-420e-a697-57a25e7461db';

export const LEC_MERCHANT_ID = 'a336520f-4769-48be-bf99-ca64f62fc7af';

export const STACK_STEPS = {
  ID_UPLOAD: 'id_upload',
};

export const GIFT_CARDS = {
  LEC: 'LEC',
  MAF: 'MAF',
};
