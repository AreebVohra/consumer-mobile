import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUserVerificationUrl, setCurrentUserPhoneNumber, triggerLoginEvent } from 'reducers/application';
import { changeLanguage } from 'reducers/language';
import {
  Button,
  Input,
  Layout,
  Text,
  Spinner,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import authApi from 'api/auth';
import { Formik } from 'formik';
import { LANGUAGES_TEXT, BACK_COUNTRIES } from 'utils/constants';
import { setUserLoginDataAndTriggerEvent } from 'reducers/user';
import handleLogEvent from 'utils/handleLogEvent';
import PrimarySpotiiZipLogo from 'assets/primarySpotiiZipLogo';
import * as Yup from 'yup';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import styles from './styles';

const SmartechSDK = require('smartech-reactnative-module');

const LoginForm = ({ navigation }) => {
  // Do not remove even if not used - triggers re-render on language change
  const currLang = useSelector(state => state.language.language);
  const dispatch = useDispatch();
  return (
    <Layout
      style={styles.layout}
      level="1"
    >
      <KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.topActionsRight}
          onPress={() => dispatch(changeLanguage({ lang: `${currLang === 'ar' ? 'en' : 'ar'}`, shouldFetchMerchantDetailsList: false }))}
        >
          <View>
            <Text category="h7" style={{ width: 80, textAlign: 'center', backgroundColor: '#f9f9f9', paddingVertical: 6, paddingHorizontal: 4, borderRadius: 4 }}>
              {currLang === 'ar' ? LANGUAGES_TEXT.ENGLISH : LANGUAGES_TEXT.ARABIC}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <PrimarySpotiiZipLogo />
        </View>

        <View style={styles.form}>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={async (values, actions) => {
              const { email, password } = values;
              try {
                await handleLogEvent('SpotiiMobileSignInInitiated', {
                  email,
                });
                // On success will trigger onAuthStatusChange and reload the page
                const resp = await authApi.login(email.trim(), password);
                const phoneVerified = resp.user.phone_verified;
                const phoneNumber = resp.user.phone_number;
                // const identitiesUploaded = resp.has_identities_uploaded;
                const country = alpha3FromISDPhoneNumber(phoneNumber);
                if (country === BACK_COUNTRIES[0]) {
                  SmartechSDK.setUserIdentity(email);
                }
                // Remove id step at registration
                // if (!phoneVerified || !identitiesUploaded) {
                if (phoneNumber && !phoneVerified) {
                  dispatch(setCurrentUserVerificationUrl({ url: resp.verification_url }));
                  dispatch(setCurrentUserPhoneNumber({ phoneNumber }));

                  navigation.navigate('Verify', { password });
                  // Remove id step at registration
                  // } else if (!identitiesUploaded) {
                  //   navigation.navigate('UploadId', { password });
                  // }
                } else if (!phoneNumber) {
                  navigation.navigate('ChoosePhoneNumberForm', { changePhoneNumber: true });
                } else {
                  const token = await authApi.getToken();
                  // await SecureStore.setItemAsync('spotii_consumer_login', JSON.stringify({ email, password, token }));
                  dispatch(triggerLoginEvent({ email: resp.user.email }));
                }
              } catch (e) {
                console.error('Login Failed', e);
                await handleLogEvent('SpotiiMobileSignInFailure', {
                  email,
                });
                actions.setErrors({
                  password: 'badLogin',
                });
              }
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().trim().email().required(),
              password: Yup.string().required(),
            })}
          >
            {({
              isValid,
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              submitCount,
            // eslint-disable-next-line arrow-body-style
            }) => {
              return (
                <>
                  <View style={styles.header}>
                    <Text style={[styles.welcomeText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>
                      {t('common.welcomeBack')}
                    </Text>
                    <Text
                      style={[commonStyles.subTextColor, styles.descriptionText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}
                    >
                      {t('common.signIntoYourSpotiiAccount')}
                    </Text>
                  </View>

                  <Input
                    placeholder={t('common.email')}
                    style={[styles.inputStyles]}
                    textAlign={currLang === 'ar' ? 'right' : 'left'}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />

                  <Input
                    placeholder={t('common.password')}
                    textAlign={currLang === 'ar' ? 'right' : 'left'}
                    style={[styles.inputStyles]}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    caption={() => ((errors.password || errors.email) && submitCount > 0 ? (
                      <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                        {t('errors.wrongEmailOrPassword')}
                      </Text>
                    ) : null)}
                    secureTextEntry
                  />
                  <Text
                    onPress={() => navigation.navigate('PasswordRecoveryPhoneForm')}
                    style={[{ textAlign: currLang === 'ar' ? 'left' : 'right' }, styles.forgotPasswordBtn]}
                  >
                    {t('common.forgotPassword')}
                  </Text>

                  <Button
                    style={styles.signInButton}
                    onPress={handleSubmit}
                    disabled={isSubmitting || !values.email || !values.password || !isValid}
                    size="large"
                    accessoryRight={() => (isSubmitting ? <Spinner status="control" size="small" /> : null)}
                  >
                    {evaProps => <Text {...evaProps} category="p1" style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>{t('common.signIn')}</Text>}
                  </Button>
                </>
              );
            }}
          </Formik>

          <View>
            <View style={styles.otherLoginActionsStyles}>
              <Text
                onPress={() => navigation.navigate('ChoosePhoneNumberForm')}
                style={styles.signInOTPBtn}
              >
                {t('common.signInUsingOTP')}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.otherLoginActionsStyles, { position: 'absolute', bottom: 40, width: '90%' }]}>
          <Text style={{
            color: '#1A0826',
            fontSize: 14,
            lineHeight: 18,
            textAlign: 'center',
          }}
          >
            {t('common.dontHaveAccount')}
            {' '}
            <Text
              onPress={() => navigation.navigate('CreateAccount')}
              style={styles.signUpOTPBtn}
            >
              {t('common.signUpNow')}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>

    </Layout>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

LoginForm.defaultProps = {
  navigation: null,
};

export default LoginForm;
