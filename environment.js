/* eslint-disable arrow-body-style */
/* global __DEV__ */
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';

const localhost = Platform.OS === 'ios' ? 'localhost' : '127.0.0.1';

const ENV = {
  dev: {
    REACT_NATIVE_APP_CURRENT_ENV: 'DEV',

    // In case the app is located not in root of the URL.
    REACT_NATIVE_APP_ROOT_PATH: '/account',

    // Auth
    REACT_NATIVE_APP_OAUTH_CLIENT_ID: 'spotii-test',
    REACT_NATIVE_APP_OAUTH_CLIENT_SECRET: '62YwVVaAMbFtfb3TmnnYaxHGrH7t4E3u',
    REACT_NATIVE_APP_OAUTH_AUTHORIZATION_BASIC: 'c3BvdGlpLXRlc3Q6NjJZd1ZWYUFNYkZ0ZmIzVG1ubllheEhHckg3dDRFM3U=',
    REACT_NATIVE_APP_OAUTH_BASE_URL: 'https://proxy.dev.spotii.me',
    REACT_NATIVE_APP_VERIFICATION_BASE_URL: 'https://auth.dev.spotii.me/api/v1.0',
    REACT_NATIVE_APP_PROFILE_BASE_URL: 'https://auth.dev.spotii.me/api/v1.0',
    REACT_NATIVE_APP_REGISTRATION_BASE_URL: 'https://auth.dev.spotii.me/api/v1.0',
    REACT_NATIVE_APP_RECOVERY_BASE_URL: 'https://auth.dev.spotii.me/api/v1.0',

    // Paytabs
    REACT_NATIVE_APP_PAYTABS_CALLBACK_URL: 'https://api.dev.spotii.me/api/v1.0/paytabs/callback/',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_EMAIL: 'akash@spotii.me',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_UAE: '10056163',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_UAE: 'urm2XOiKbjEGjz0UtpkZfKWKITPHkigOKCRHq9rBt6hMGiG9H18XL4IuYxciQs7A4Yhv8J6BQoowG4Fo6OmRT4mRCy9s0h25fkAn',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_SA: '10060590',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_SA: 'FEiT4qrckhx7qipe4hvxqxf6PZMPRctwQMqVcS7x9EEAX3P1lkzLSPSIPExGR1dINDD0wLxGpcgnf6oBqYmjNf1CTzjLAwtoa7oG',
    REACT_NATIVE_APP_PAYTABS_PRE_AUTH: true,

    // Paytabs 2
    REACT_NATIVE_APP_PAYTABS_CALLBACK_PATH: 'paytabs2/callback/',
    REACT_NATIVE_APP_PAYTABS_REDIRECT_PATH: 'paytabs2/redirect/',

    // API base URL
    REACT_NATIVE_APP_PUBLIC_API_BASE_URL: 'https://api.dev.spotii.me/api/v1.0',

    // Checkout base URL
    REACT_NATIVE_APP_PUBLIC_CHECKOUT_BASE_URL: 'https://dev.spotii.me',

    // geolocation-db
    REACT_NATIVE_APP_GEOLOCATION_DB_KEY: '697de680-a737-11ea-9820-af05f4014d91',

    // lean
    REACT_NATIVE_APP_LEAN_APP_TOKEN: 'b1c8b7b3-bf53-4732-9093-b15dd3f27f6b',

    // TM
    REACT_NATIVE_APP_TM_ORG_ID: '9mex4t45',

    // Google Maps
    REACT_NATIVE_APP_GOOGLE_API_KEY: 'AIzaSyAHG1qQE6CG_aMe3kYZDayZ50jNzwzgXrc',

    // VGS
    REACT_NATIVE_APP_VGS_VAULT_ID: 'tnttfu6diry',
    REACT_NATIVE_APP_VGS_ENVIRONMENT: 'sandbox',
  },
  sandbox: {
    REACT_NATIVE_APP_CURRENT_ENV: 'SANDBOX',

    // In case the app is located not in root of the URL.
    REACT_NATIVE_APP_ROOT_PATH: '/account',

    // Auth
    REACT_NATIVE_APP_OAUTH_CLIENT_ID: 'spotii-test',
    REACT_NATIVE_APP_OAUTH_CLIENT_SECRET: '62YwVVaAMbFtfb3TmnnYaxHGrH7t4E3u',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_EMAIL: 'akash@spotii.me',
    REACT_NATIVE_APP_OAUTH_AUTHORIZATION_BASIC: 'c3BvdGlpLXRlc3Q6NjJZd1ZWYUFNYkZ0ZmIzVG1ubllheEhHckg3dDRFM3U=',
    REACT_NATIVE_APP_OAUTH_BASE_URL: 'https://proxy.sandbox.spotii.me',
    REACT_NATIVE_APP_VERIFICATION_BASE_URL: 'https://auth.sandbox.spotii.me/api/v1.0',
    REACT_NATIVE_APP_PROFILE_BASE_URL: 'https://auth.sandbox.spotii.me/api/v1.0',
    REACT_NATIVE_APP_REGISTRATION_BASE_URL: 'https://auth.sandbox.spotii.me/api/v1.0',
    REACT_NATIVE_APP_RECOVERY_BASE_URL: 'https://auth.sandbox.spotii.me/api/v1.0',

    // Paytabs
    REACT_NATIVE_APP_PAYTABS_CALLBACK_URL: 'https://api.sandbox.spotii.me/api/v1.0/paytabs/callback/',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_UAE: '10056163',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_UAE: 'urm2XOiKbjEGjz0UtpkZfKWKITPHkigOKCRHq9rBt6hMGiG9H18XL4IuYxciQs7A4Yhv8J6BQoowG4Fo6OmRT4mRCy9s0h25fkAn',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_SA: '10060590',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_SA: 'FEiT4qrckhx7qipe4hvxqxf6PZMPRctwQMqVcS7x9EEAX3P1lkzLSPSIPExGR1dINDD0wLxGpcgnf6oBqYmjNf1CTzjLAwtoa7oG',
    REACT_NATIVE_APP_PAYTABS_PRE_AUTH: true,

    // Paytabs 2
    REACT_NATIVE_APP_PAYTABS_CALLBACK_PATH: 'paytabs2/callback/',
    REACT_NATIVE_APP_PAYTABS_REDIRECT_PATH: 'paytabs2/redirect/',

    // API base URL
    REACT_NATIVE_APP_PUBLIC_API_BASE_URL: 'https://api.sandbox.spotii.me/api/v1.0',

    // Checkout base URL
    REACT_NATIVE_APP_PUBLIC_CHECKOUT_BASE_URL: 'https://sandbox.spotii.me',

    // geolocation-db
    REACT_NATIVE_APP_GEOLOCATION_DB_KEY: '697de680-a737-11ea-9820-af05f4014d91',

    // lean
    REACT_NATIVE_APP_LEAN_APP_TOKEN: 'b1c8b7b3-bf53-4732-9093-b15dd3f27f6b',

    // TM
    REACT_NATIVE_APP_TM_ORG_ID: '9mex4t45',

    // Google Maps
    REACT_NATIVE_APP_GOOGLE_API_KEY: 'AIzaSyAHG1qQE6CG_aMe3kYZDayZ50jNzwzgXrc',

    // VGS
    REACT_NATIVE_APP_VGS_VAULT_ID: 'tnttfu6diry',
    REACT_NATIVE_APP_VGS_ENVIRONMENT: 'sandbox',
  },
  local: {
    REACT_NATIVE_APP_CURRENT_ENV: 'LOCAL',

    HTTPS: false,
    // PORT: 5556,
    // In case the app is located not in root of the URL.
    REACT_NATIVE_APP_ROOT_PATH: '/account',

    // Auth
    REACT_NATIVE_APP_OAUTH_CLIENT_ID: 'spotii-test',
    REACT_NATIVE_APP_OAUTH_CLIENT_SECRET: '62YwVVaAMbFtfb3TmnnYaxHGrH7t4E3u',
    REACT_NATIVE_APP_OAUTH_AUTHORIZATION_BASIC: 'c3BvdGlpLXRlc3Q6NjJZd1ZWYUFNYkZ0ZmIzVG1ubllheEhHckg3dDRFM3U=',
    REACT_NATIVE_APP_OAUTH_BASE_URL: 'https://proxy.dev.spotii.me',
    REACT_NATIVE_APP_VERIFICATION_BASE_URL: 'http://localhost:8003/api/v1.0',
    REACT_NATIVE_APP_PROFILE_BASE_URL: 'http://localhost:8003/api/v1.0',
    REACT_NATIVE_APP_REGISTRATION_BASE_URL: 'http://localhost:8003/api/v1.0',
    REACT_NATIVE_APP_RECOVERY_BASE_URL: 'http://localhost:8003/api/v1.0',

    // Paytabs
    REACT_NATIVE_APP_PAYTABS_CALLBACK_URL: 'http://localhost:8000/api/v1.0/paytabs/callback/',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_EMAIL: 'akash@spotii.me',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_UAE: '10056163',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_UAE: 'urm2XOiKbjEGjz0UtpkZfKWKITPHkigOKCRHq9rBt6hMGiG9H18XL4IuYxciQs7A4Yhv8J6BQoowG4Fo6OmRT4mRCy9s0h25fkAn',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_SA: '10060590',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_SA: 'FEiT4qrckhx7qipe4hvxqxf6PZMPRctwQMqVcS7x9EEAX3P1lkzLSPSIPExGR1dINDD0wLxGpcgnf6oBqYmjNf1CTzjLAwtoa7oG',
    REACT_NATIVE_APP_PAYTABS_PRE_AUTH: true,

    // Paytabs 2
    REACT_NATIVE_APP_PAYTABS_CALLBACK_PATH: 'paytabs2/callback/',
    REACT_NATIVE_APP_PAYTABS_REDIRECT_PATH: 'paytabs2/redirect/',

    // API base URL
    REACT_NATIVE_APP_PUBLIC_API_BASE_URL: 'http://localhost:8000/api/v1.0',

    // Checkout base URL
    REACT_NATIVE_APP_PUBLIC_CHECKOUT_BASE_URL: 'https://dev.spotii.me',

    // geolocation-db
    REACT_NATIVE_APP_GEOLOCATION_DB_KEY: '697de680-a737-11ea-9820-af05f4014d91',

    // lean
    REACT_NATIVE_APP_LEAN_APP_TOKEN: 'b1c8b7b3-bf53-4732-9093-b15dd3f27f6b',

    // TM
    REACT_NATIVE_APP_TM_ORG_ID: '9mex4t45',

    // Google Maps
    REACT_NATIVE_APP_GOOGLE_API_KEY: 'AIzaSyAHG1qQE6CG_aMe3kYZDayZ50jNzwzgXrc',

    // VGS
    REACT_NATIVE_APP_VGS_VAULT_ID: 'tnttfu6diry',
    REACT_NATIVE_APP_VGS_ENVIRONMENT: 'sandbox',
  },
  staging: {
    // apiUrl: 'https://your-staging-api-url-here.com/',
  },
  prod: {
    REACT_NATIVE_APP_CURRENT_ENV: 'PROD',

    REACT_NATIVE_APP_ROOT_PATH: '/account',

    // Auth
    REACT_NATIVE_APP_OAUTH_CLIENT_ID: 'spotii-test',
    REACT_NATIVE_APP_OAUTH_CLIENT_SECRET: '62YwVVaAMbFtfb3TmnnYaxHGrH7t4E3u',
    REACT_NATIVE_APP_OAUTH_AUTHORIZATION_BASIC: 'c3BvdGlpLXRlc3Q6NjJZd1ZWYUFNYkZ0ZmIzVG1ubllheEhHckg3dDRFM3U=',
    REACT_NATIVE_APP_OAUTH_BASE_URL: 'https://proxy.spotii.com',
    REACT_NATIVE_APP_VERIFICATION_BASE_URL: 'https://auth.spotii.com/api/v1.0',
    REACT_NATIVE_APP_PROFILE_BASE_URL: 'https://auth.spotii.com/api/v1.0',
    REACT_NATIVE_APP_REGISTRATION_BASE_URL: 'https://auth.spotii.com/api/v1.0',
    REACT_NATIVE_APP_RECOVERY_BASE_URL: 'https://auth.spotii.com/api/v1.0',

    // Paytabs
    REACT_NATIVE_APP_PAYTABS_CALLBACK_URL: 'https://api.spotii.com/api/v1.0/paytabs/callback/',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_EMAIL: 'ziyaad@spotii.me',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_UAE: '10057242',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_UAE: 'BUGK32MZcEIB5Tfl13eG3dcxLKgqwAB8uiSylFyxjh9paoKbrZRvd42YOiplS1tnjmWF1vclMlLXKv8cv0HI4JHT16eU7Iir4f66',
    REACT_NATIVE_APP_PAYTABS_MERCHANT_ID_SA: '10057242',
    REACT_NATIVE_APP_PAYTABS_SECRET_KEY_SA: 'BUGK32MZcEIB5Tfl13eG3dcxLKgqwAB8uiSylFyxjh9paoKbrZRvd42YOiplS1tnjmWF1vclMlLXKv8cv0HI4JHT16eU7Iir4f66',
    REACT_NATIVE_APP_PAYTABS_PRE_AUTH: true,

    // Paytabs 2
    REACT_NATIVE_APP_PAYTABS_CALLBACK_PATH: 'paytabs2/callback/',
    REACT_NATIVE_APP_PAYTABS_REDIRECT_PATH: 'paytabs2/redirect/',

    // API base URL
    REACT_NATIVE_APP_PUBLIC_API_BASE_URL: 'https://api.spotii.com/api/v1.0',

    // Checkout base URL
    REACT_NATIVE_APP_PUBLIC_CHECKOUT_BASE_URL: 'https://www.spotii.com',

    // geolocation-db
    REACT_NATIVE_APP_GEOLOCATION_DB_KEY: '697de680-a737-11ea-9820-af05f4014d91',

    // lean
    REACT_NATIVE_APP_LEAN_APP_TOKEN: 'd00b20e5-0ae7-4087-bbdc-a87cce722fe0',

    // TM
    REACT_NATIVE_APP_TM_ORG_ID: '6220eh0u',

    // Google Maps
    REACT_NATIVE_APP_GOOGLE_API_KEY: 'AIzaSyAHG1qQE6CG_aMe3kYZDayZ50jNzwzgXrc',

    // VGS
    REACT_NATIVE_APP_VGS_VAULT_ID: 'tntyrbnnmib',
    REACT_NATIVE_APP_VGS_ENVIRONMENT: 'live',
  },
};

const getEnvVars = () => {
  const constantsManifestChannel = Constants.manifest && Constants.manifest.channel;
  const constantsManifest2Channel = Constants.manifest2 && Constants.manifest2.channel;
  const updatesChannel = Updates.channel;

  if ([updatesChannel, constantsManifestChannel, constantsManifest2Channel].includes('sandbox')) {
    return ENV.sandbox;
  }

  if ([updatesChannel, constantsManifestChannel, constantsManifest2Channel].includes('development')) {
    return ENV.dev;
  }

  if ([constantsManifestChannel, constantsManifest2Channel].includes('local')) {
    return ENV.local;
  }

  return ENV.prod;
};
export default getEnvVars;
