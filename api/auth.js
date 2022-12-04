import spotiiAuth from '@spotii-me/auth';
import config from 'utils/config';

const authApi = spotiiAuth.consumer({
  oauth: {
    client_id: config('oauth_client_id'),
    client_secret: config('oauth_client_secret'),
    authorizationBasic: config('oauth_authorization_basic'),
    baseUrl: config('oauth_base_url'),
  },
  verification: {
    baseUrl: config('verification_base_url'),
  },
  profile: {
    baseUrl: config('profile_base_url'),
  },
  registration: {
    baseUrl: config('registration_base_url'),
  },
  recovery: {
    baseUrl: config('recovery_base_url'),
  },
});

export default authApi;

export const IDENTITY_UPLOAD_URL = `${authApi.options.profile.baseUrl}/consumer/upload-identity/upload/`;

export const AVATAR_UPLOAD_URL = `${authApi.options.profile.baseUrl}/user/avatar/`;

export const NFC_SERVICE_AUTH_URL = `${authApi.options.profile.baseUrl}/consumer/upload-identity/get_nfc_auth_token/`;
export const NFC_SERVICE_RISK_STATUS_URL = `${authApi.options.profile.baseUrl}/consumer/upload-identity/get_risk_nfc_status/`;
export const NFC_SERVICE_RISK_PROCESSING_URL = `${authApi.options.profile.baseUrl}/consumer/upload-identity/process_nfc_data/`;
export const SEND_OTP_LOGIN = `${authApi.options.profile.baseUrl}/user/otp_login/`;
