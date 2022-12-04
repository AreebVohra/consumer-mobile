/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Input,
  Layout,
  Text,
  Select,
  SelectItem,
  IndexPath,
  Spinner,
} from '@ui-kitten/components';
import { authStatusChange } from 'reducers/application';
import { t } from 'services/i18n';
import { Formik } from 'formik';
import { countrySelectOptions, LANGUAGES_TEXT } from 'utils/constants';
import { sendOTPForLogin, updateUser } from 'api';
import PrimarySpotiiZipLogo from 'assets/primarySpotiiZipLogo';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { changeLanguage } from 'reducers/language';
import { setPhoneNumber } from 'reducers/registration';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import { phoneRegex } from 'utils/regex';
import * as Yup from 'yup';
import styles from './styles';

const ChoosePhoneNumberForm = ({ route, navigation }) => {
  const { changePhoneNumber } = route.params || false;
  const dispatch = useDispatch();

  const currLang = useSelector((state) => state.language.language);
  const { currentUser } = useSelector((state) => state.application);
  const persistedLoginAttempted = useSelector((state) => state.user.persistedLoginAttempted);

  const [selectedCountryIndex, setSelectedCountryIndex] = useState(new IndexPath(0));
  const [loading, setLoading] = useState(false);
  const [countrySelectValue, countrySelectDisplayValue, countrySelectCode] = countrySelectOptions[selectedCountryIndex.row];

  useEffect(() => {
    // # enable hardwareBackPress in case you see the splash screen on android when you press the back button
    // const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //   if (changePhoneNumber) {
    //     dispatch(authStatusChange());
    //   }
    // });
    navigation.addListener('beforeRemove', (e) => {
      if (changePhoneNumber) {
        e.preventDefault();
      }
    });
    // return () => backHandler.remove();
  }, []);

  const prepareData = (values) => {
    const phoneNumber = `${countrySelectOptions[selectedCountryIndex.row][2]}${values.phoneNumber
      .replace(/^0/, '')
      .replace(/(\s|\(|\)|-|\.)/gi, '')}`;

    return {
      ...values,
      phoneNumber,
      userId: currentUser.userId,
    };
  };

  return (
    <Layout style={styles.layout} level="1">
      <View style={{ flex: 1 }}>
        {persistedLoginAttempted ? (
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
          </>
        ) : (
          <></>
        )}
        <View style={styles.logoContainer}>
          <PrimarySpotiiZipLogo />
        </View>

        {persistedLoginAttempted ? (
          <KeyboardAvoidingView style={styles.form}>
            <Formik
              initialValues={{ phoneNumber: '' }}
              onSubmit={async (values, actions) => {
                const data = prepareData(values);
                setLoading(true);
                try {
                  if (changePhoneNumber) {
                    await updateUser(data);
                  } else {
                    await sendOTPForLogin({ phoneNumber: data.phoneNumber, email: null });
                  }
                  dispatch(setPhoneNumber(data.phoneNumber));
                  actions.setStatus('success');
                  navigation.navigate('LoginOtpForm', { changePhoneNumber });
                } catch (err) {
                  if (changePhoneNumber) {
                    actions.setErrors({
                      phoneNumber: t('errors.phoneNumberAlreadyExists'),
                      phoneNumberCustom: t('errors.phoneNumberAlreadyExists'),
                    });
                  } else {
                    actions.setErrors({
                      phoneNumber: t('errors.phoneNotRegistered'),
                      phoneNumberCustom: t('errors.phoneNotRegistered'),
                    });
                  }
                }
                setLoading(false);
              }}
              validationSchema={Yup.object().shape({
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
                submitCount,
                // eslint-disable-next-line arrow-body-style
              }) => {
                return (
                  <>
                    <View style={styles.header}>
                      <Text style={[styles.welcomeText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>
                        {!changePhoneNumber ? t('common.welcomeToSpotii') : t('common.updatePhoneNumber')}
                      </Text>
                      <Text
                        style={[commonStyles.subTextColor, styles.descriptionText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}
                      >
                        {!changePhoneNumber ? t('common.enterPhoneNumber') : t('common.phoneNumberMissingSubtitle')}
                      </Text>
                    </View>

                    <Input
                      placeholder={t('common.mobileNumber')}
                      style={[styles.inputStyles]}
                      textAlign={currLang === 'ar' ? 'right' : 'left'}
                      keyboardType="phone-pad"
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      caption={() => (errors.phoneNumber && submitCount > 0 ? (
                        <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                          {errors.phoneNumberCustom ? errors.phoneNumberCustom : t('errors.phoneNumberIncorrect')}
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
                          {countrySelectOptions.map(([_, __, code]) => (
                            <SelectItem key={code} title={t(code)} />
                          ))}
                        </Select>
                      )}
                    />

                    <Button
                      style={styles.signInButton}
                      onPress={handleSubmit}
                      disabled={isSubmitting || loading || !values.phoneNumber || !isValid}
                      size="large"
                      accessoryRight={() => (isSubmitting || loading ? <Spinner status="control" size="small" /> : null)}
                    >
                      {(evaProps) => (
                        <Text
                          {...evaProps}
                          category="p1"
                          style={{ fontSize: 16, fontWeight: '700', color: 'white' }}
                        >
                          {t('common.getOtp')}
                        </Text>
                      )}
                    </Button>

                    {!changePhoneNumber && (
                      <View style={{ width: '100%', height: 50 }}>
                        <Text
                          onPress={() => navigation.navigate('LoginForm')}
                          style={{
                            color: '#411351',
                            fontWeight: '700',
                            fontSize: 16,
                            lineHeight: 18,
                            textAlign: 'center',
                            paddingVertical: 5,
                            width: '100%',
                          }}
                        >
                          {t('common.signInUsingPassword')}
                        </Text>
                      </View>
                    )}

                    <View style={[styles.acceptTermsAndConditions, { position: 'absolute', bottom: 40, width: '90%' }]}>
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
                          style={{
                            color: '#AA8FFF',
                            fontWeight: '700',
                            fontSize: 14,
                            lineHeight: 18,
                          }}
                        >
                          {t('common.signUpNow')}
                        </Text>
                      </Text>
                    </View>
                  </>
                );
              }}
            </Formik>
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.spinner}>
            <Spinner status="basic" size="giant" />
          </View>
        )}
      </View>
    </Layout>
  );
};

ChoosePhoneNumberForm.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      changePhoneNumber: PropTypes.bool,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    addListener: PropTypes.func,
  }),
};

ChoosePhoneNumberForm.defaultProps = {
  route: null,
  navigation: null,
};

export default ChoosePhoneNumberForm;
