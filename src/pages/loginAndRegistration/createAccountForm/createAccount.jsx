import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Input,
  Layout,
  Text,
  Spinner,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import { Formik } from 'formik';
import { changeLanguage } from 'reducers/language';
import PrimarySpotiiZipLogo from 'assets/primarySpotiiZipLogo';
import { TERMS_AND_CONDITIONS_URL, mainCountrySelectOptions, LANGUAGES_TEXT, BACK_COUNTRIES } from 'utils/constants';
import handleLogEvent from 'utils/handleLogEvent';
import * as WebBrowser from 'expo-web-browser';
import { setRegistrationFields, loginWithCreatedUser, setCountry } from 'reducers/registration';
import { refreshUserProfile } from 'reducers/application';
import { phoneRegex } from 'utils/regex';
import authApi from 'api/auth';
import * as Yup from 'yup';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import MailCheck from 'react-mailcheck';
import commonStyles from 'utils/commonStyles';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import styles from './styles';

const SmartechSDK = require('smartech-reactnative-module');

const CreateAnAccountForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);

  const {
    phoneNumber,
    country,
  } = useSelector(
    state => state.registration,
  );
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(new IndexPath(0));
  let [
    countrySelectValue,
    countrySelectDisplayValue,
    // eslint-disable-next-line prefer-const
    countrySelectCode,
  ] = mainCountrySelectOptions[selectedCountryIndex.row];

  if (country.length && country === 'SA') {
    // eslint-disable-next-line prefer-destructuring
    [
      countrySelectValue,
      countrySelectDisplayValue,
    ] = mainCountrySelectOptions[1];
  }

  const processFormErrors = (errors) => {
    const formErrors = {};

    // this is deprecated.. right?
    if (typeof errors === 'object' && 'user' in errors) {
      if (errors.user.email) {
        const emailErr = errors.user.email;
        if (Array.isArray(emailErr) && emailErr[0] === 'user with this email already exists.') {
          formErrors.emailError = t('errors.emailAlreadyExists');
        } else {
          formErrors.emailError = t('errors.emailIncorrect');
        }
      }
    }

    if (errors && errors.code === 'user_already_exists') {
      if (errors.value.includes('@')) {
        formErrors.emailError = t('errors.emailAlreadyExists');
      } else if (errors.value.includes('+')) {
        formErrors.phoneNumberError = t('errors.phoneNumberAlreadyExists');
      }
    }

    return formErrors;
  };

  const prepareData = (values) => {
    const number = `${mainCountrySelectOptions[selectedCountryIndex.row][2]}${values.phoneNumber
      .replace(/^0/, '')
      .replace(/(\s|\(|\)|-|\.)/gi, '')}`;

    return {
      ...values,
      phoneNumber: number,
    };
  };

  return (
    <Layout style={styles.layout} level="1">
      <>
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

        <View style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <PrimarySpotiiZipLogo />
          </View>

          <View style={styles.form}>
            <Formik
              initialValues={{
                email: '',
                phoneNumber: phoneNumber.length ? phoneNumber.substring(4, phoneNumber.length) : '',
              }}
              onSubmit={async (values, actions) => {
                try {
                  const { email } = values;
                  const password = null;
                  const data = prepareData(values);
                  await authApi
                    .registrationBegin(
                      email,
                      password,
                      data.phoneNumber,
                      values.fullName,
                    )
                    .then(
                      async registrationObj => {
                        await authApi
                          .registrationValidate()
                          .then(res => {
                            dispatch(
                              setRegistrationFields({
                                email,
                                phoneNumber: data.phoneNumber,
                              }),
                            );
                            dispatch(
                              setCountry({
                                ...values,
                                country: countrySelectValue,
                              }),
                            );
                            navigation.navigate('Verify', { password });
                          })
                          .catch(err => {
                            const { errors } = err || {};
                            actions.setErrors(processFormErrors(errors));
                          });
                      },
                      err => {
                        throw err;
                      },
                    )
                    .catch(e => {
                      const { errors } = e || {};
                      actions.setErrors(processFormErrors(errors));
                    });
                  await handleLogEvent('SpotiiMobileSignUpInitiated', {
                    email,
                  });
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('err', err);
                }
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().trim().email(t('errors.emailIncorrect')).required(),
                phoneNumber: Yup.string().matches(phoneRegex).required(),
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
                setFieldValue,
                submitCount,
              // eslint-disable-next-line arrow-body-style
              }) => {
                const handleClickMailChange = suggestion => {
                  setFieldValue('email', suggestion.full);
                };
                return (
                  <KeyboardAvoidingView>
                    <View style={styles.header}>
                      <Text style={[styles.welcomeText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>
                        {t('common.createAccount')}
                      </Text>
                      <Text
                        style={[commonStyles.subTextColor, styles.descriptionText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}
                      >
                        {t('common.createAccountSubHeader')}
                      </Text>
                    </View>

                    <MailCheck email={values.email}>
                      {suggestion => (
                        <>
                          <Input
                            placeholder={t('common.email')}
                            style={[styles.inputStyles]}
                            textAlign={currLang === 'ar' ? 'right' : 'left'}
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            caption={() => (errors.emailError && submitCount > 0 ? (
                              <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                                {errors.emailError}
                              </Text>
                            ) : null)}
                          />
                          {suggestion ? (
                            <Text style={currLang === 'ar' ? { marginRight: '9%', textAlign: 'right' } : { marginLeft: '5%', textAlign: 'left' }}>
                              <Text style={{ fontSize: 12 }}>
                                {`${t('common.didYouMeanEmail')} `}
                              </Text>
                              <Text
                                style={{
                                  color: 'red', fontSize: 12, paddingLeft: 0, paddingRight: 0,
                                }}
                                onPress={() => handleClickMailChange(suggestion)}
                              >
                                {suggestion.full}
                              </Text>
                              <Text>
                                {currLang === 'ar' ? '؟' : '?'}
                              </Text>
                            </Text>
                          ) : <></>}
                        </>
                      )}
                    </MailCheck>

                    <Input
                      placeholder={t('common.mobileNumber')}
                      style={[styles.inputStyles]}
                      textAlign={currLang === 'ar' ? 'right' : 'left'}
                      keyboardType="phone-pad"
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      caption={() => (errors.phoneNumberError && submitCount > 0 ? (
                        <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                          {errors.phoneNumberError ? errors.phoneNumberError : t('errors.phoneNumberIncorrect')}
                        </Text>
                      ) : null)}
                      accessoryLeft={() => (
                        <Select
                          style={{ alignItems: 'flex-start', width: 105 }}
                          selectedIndex={selectedCountryIndex}
                          onSelect={(index) => setSelectedCountryIndex(index)}
                          value={countrySelectCode}
                          size="medium"
                        >
                          {mainCountrySelectOptions.map(([_, __, code]) => (
                            <SelectItem key={code} title={t(code)} />
                          ))}
                        </Select>
                      )}
                    />

                    <View style={styles.acceptTermsAndConditions}>
                      <Text style={{
                        color: '#717171',
                        fontWeight: '400',
                        fontSize: 12,
                        lineHeight: 15,
                        textAlign: currLang === 'ar' ? 'right' : 'left',
                      }}
                      >
                        {t('common.agreeToTerms')}
                        {' '}
                        <Text
                          onPress={() => WebBrowser.openBrowserAsync(`${TERMS_AND_CONDITIONS_URL}?lang=${currLang}`)}
                          style={{ color: '#353535', fontSize: 12, lineHeight: 15 }}
                        >
                          {t('common.termsAndConditions')}
                        </Text>
                      </Text>
                    </View>

                    <Button
                      style={styles.signInButton}
                      size="large"
                      onPress={handleSubmit}
                      disabled={isSubmitting || !values.email || !values.phoneNumber || !isValid}
                      accessoryLeft={() => (isSubmitting ? <Spinner size="tiny" /> : null)}
                    >
                      {(evaProps) => (
                        <Text {...evaProps} category="p1">
                          {t('common.continue')}
                        </Text>
                      )}
                    </Button>

                    <View style={[styles.acceptTermsAndConditions, { position: 'absolute', bottom: 40, width: '90%' }]}>
                      <Text style={{
                        color: '#1A0826',
                        fontSize: 14,
                        lineHeight: 18,
                        textAlign: 'center',
                      }}
                      >
                        {t('common.alreadyHaveAccount')}
                        {' '}
                        <Text
                          onPress={() => navigation.navigate('ChoosePhoneNumberForm')}
                          style={{
                            color: '#AA8FFF',
                            fontWeight: '600',
                            fontSize: 14,
                            lineHeight: 18,
                          }}
                        >
                          {t('common.signInNow')}
                        </Text>
                      </Text>
                    </View>
                  </KeyboardAvoidingView>
                );
              }}
            </Formik>
          </View>
        </View>
      </>
    </Layout>
  );
};

CreateAnAccountForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

CreateAnAccountForm.defaultProps = {
  navigation: null,
};

export default CreateAnAccountForm;
