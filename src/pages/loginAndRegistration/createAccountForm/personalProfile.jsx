/* eslint-disable no-shadow */
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
import { changeLanguage } from 'reducers/language';
import { setRegistrationFields, setCountry } from 'reducers/registration';
import { setCurrentUserVerificationUrl } from 'reducers/application';
import { t } from 'services/i18n';
import { Formik } from 'formik';
import { updateUser } from 'api';
import snakeToCamel from 'utils/snakeToCamel';
import { phoneRegex, dateRegex } from 'utils/regex';
import * as WebBrowser from 'expo-web-browser';
import authApi from 'api/auth';
import * as Yup from 'yup';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { TERMS_AND_CONDITIONS_URL, mainCountrySelectOptions, LANGUAGES_TEXT } from 'utils/constants';
import PrimarySpotiiZipLogo from 'assets/primarySpotiiZipLogo';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/ar-dz';
import commonStyles from 'utils/commonStyles';
import styles from './styles';

const CreateAnAccountForm = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { password } = route.params;
  const { country = 'AE', phoneNumber, isFinalized } = useSelector(state => state.registration);
  const { currentUser, isAuthenticated } = useSelector(state => state.application);
  const currLang = useSelector(state => state.language.language);

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

  const processErrors = (err, t) => {
    let result = {};
    const { errors } = err;
    const processFields = obj => Object.keys(obj).reduce((res, key) => {
      // Process profile as set of own errors
      if (key === 'profile') {
        return {
          ...res,
          ...processFields(obj[key]),
        };
      }

      res[snakeToCamel(key)] = Array.isArray(obj[key]) ? obj[key][0] : obj[key];
      return res;
    }, {});

    if (errors) {
      result = processFields(errors);
      if (errors.code === 'user_already_exists') {
        result.phoneNumber = t('errors.phoneNumberAlreadyExists');
        result.phoneNumberCustom = t('errors.phoneNumberAlreadyExists');
      }
    }

    return result;
  };

  const prepareData = values => {
    const phoneNumber = `${mainCountrySelectOptions[selectedCountryIndex.row][2]}${values.phoneNumber.replace(/^0/, '').replace(/(\s|\(|\)|-|\.)/gi, '')}`;
    return {
      ...values,
      phoneNumber,
      userId: currentUser.userId,
    };
  };

  return (
    <Layout style={styles.layout} level="1">
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

        <View style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <PrimarySpotiiZipLogo />
          </View>

          <View style={styles.form}>
            <Formik
              initialValues={{
                phoneNumber: phoneNumber.length ? phoneNumber.substring(4, phoneNumber.length) : '',
              }}
              onSubmit={async (values, actions) => {
                try {
                  const data = prepareData(values);
                  const dataDeepCopy = { ...data };
                  if (isFinalized) {
                    delete dataDeepCopy.phoneNumber;
                  }
                  if (!isAuthenticated) {
                    await authApi.registrationUpdate({ phoneNumber: data.phoneNumber }).then(async () => {
                      await authApi.registrationValidate();
                    }).catch(err => {
                      console.warn(err);
                      throw err;
                    });
                  } else {
                    await updateUser(data).then(res => {
                      dispatch(setCurrentUserVerificationUrl({ url: res.data.verification_url }));
                    });
                  }

                  // Save current fields in the memory. Phone number in international format
                  dispatch(
                    setRegistrationFields({
                      ...values,
                      phoneNumber: data.phoneNumber,
                      country: countrySelectValue,
                    }),
                  );
                  dispatch(
                    setCountry({
                      ...values,
                      country: countrySelectValue,
                    }),
                  );
                  actions.setStatus('success');
                  navigation.navigate('Verify', { password });
                } catch (err) {
                  console.warn(err);
                  actions.setErrors(processErrors(err, t));
                }
              }}
              validationSchema={Yup.object().shape({
                phoneNumber: Yup.string()
                  .matches(phoneRegex)
                  .required(),
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
                setFieldValue,
              // eslint-disable-next-line arrow-body-style
              }) => {
                return (
                  <>
                    <View style={styles.header}>
                      <Text category="s1" style={[styles.welcomeText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>
                        {t('common.newPhoneNumber')}
                      </Text>
                      <Text
                        style={[commonStyles.subTextColor, styles.descriptionText, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}
                      >
                        {t('common.enterYourNewPhoneNumber')}
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
                          {errors.phoneNumber ? errors.phoneNumber : t('errors.phoneNumberIncorrect')}
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
                      onPress={handleSubmit}
                      size="giant"
                      disabled={isSubmitting}
                      accessoryLeft={() => (isSubmitting ? <Spinner status="control" size="small" /> : null)}
                    >
                      {(evaProps) => (
                        <Text {...evaProps} category="p1">
                          {t('common.submit')}
                        </Text>
                      )}
                    </Button>
                  </>
                );
              }}
            </Formik>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

CreateAnAccountForm.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      password: PropTypes.string,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

CreateAnAccountForm.defaultProps = {
  route: null,
  navigation: null,
};

export default CreateAnAccountForm;
