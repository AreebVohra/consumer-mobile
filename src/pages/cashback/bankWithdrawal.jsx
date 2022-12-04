/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import { View } from 'react-native';
import { t } from 'services/i18n';
import {
  Card,
  Button,
  Text,
  Spinner,
  Layout,
  Select,
  SelectItem,
  IndexPath, Input,
  TopNavigationAction,
} from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import convertCurrency from 'utils/convertCurrency';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import styles from './styles';
import Icon from 'components/Icon';
import { sendBankWithdrawRequest } from '../../../api';
import { countrySelectOptions, NO_IBAN_COUNTRIES, CASHBACK } from '../../../utils/constants';
import { errorsSerializer, formSerializer, isValidIBANNumber } from '../../../reducers/application/serializers';

const BankWithdrawalForm = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const { currentUser, conversions } = useSelector(state => state.application);
  const { currentUserCashback } = useSelector(state => state.user);

  const [selectedCountryIndex, setSelectedCountryIndex] = useState(new IndexPath(0));

  const [formStatus, setFormStatus] = useState(false);

  let [
    countrySelectValue,
    countrySelectDisplayValue,
  ] = countrySelectOptions[selectedCountryIndex.row];

  useEffect(() => {
    [
      countrySelectValue,
      countrySelectDisplayValue,
    ] = countrySelectOptions[selectedCountryIndex.row];
  }, [selectedCountryIndex]);

  let userCurrency = 'AED';

  if (currentUser && currentUser.phoneNumber) {
    const phoneNumberPrefix = currentUser.phoneNumber.substring(0, 4);
    switch (phoneNumberPrefix) {
      case '+971': {
        break;
      }
      case '+966': {
        userCurrency = 'SAR';
        break;
      }
      case '+973': {
        userCurrency = 'BHD';
        break;
      }
      case '+968': {
        userCurrency = 'OMR';
        break;
      }
      default:
        break;
    }
  }

  const bankWithdrawalAmount = convertCurrency(userCurrency, parseFloat((currentUserCashback || {}).bankWithdrawalTotal || 0).toFixed(3), 'AED', true, conversions)[1];
  const isSufficientCashback = parseFloat(bankWithdrawalAmount).toFixed(2) >= CASHBACK.MIN_TOTAL_REDEEMABLE_CASHBACK;

  const requestOverlay = () => (
    <View style={[styles.filterOverlay, { backgroundColor: 'black', opacity: 0.9 }]}>
      <Card style={styles.bankReqOverlay}>
        <Text style={[styles.filterOptions, { fontSize: 22 }]}>
          {formStatus === 'success' ? t('common.withdrawRequestSuccessMsg') : formStatus === 'active_request' ? t('common.withdrawRequestActiveReqMsg') : t('common.withdrawRequestFailedMsg')}
        </Text>
        <Button
          style={styles.signInButton}
          size="small"
          onPress={() => { setFormStatus(false); navigation.navigate('Cashbacks'); }}
        >
          {evaProps => <Text {...evaProps} category="p1" style={{ fontSize: 15, color: 'white' }}>{t('common.ok')}</Text>}
        </Button>
      </Card>
    </View>
  );

  return (
    <>
      {formStatus ? requestOverlay()
        : (
          <ScrollView>
            <Layout
              style={styles.form}
              level="1"
            >
            <TopNavigationAction
              icon={(props) => Icon(
                {
                  ...props,
                  fill: '#353535',
                  width: 20,
                  height: 20,
                },
                'arrow-back-outline',
              )}
              onPress={() => {
                navigation.navigate('Cashbacks');
              }}
            />
              <KeyboardAvoidingView enableOnAndroid={false}>
                <View style={styles.form}>

                  <Formik
                    initialValues={{
                      bank: '',
                      accountNumber: '',
                      accountTitle: '',
                      iban: '',
                      swift: '',
                      country: '',
                    }}
                    onSubmit={async (values, actions) => {
                      // eslint-disable-next-line no-param-reassign
                      values.currency = userCurrency;
                      values.country = countrySelectValue;
                      const data = formSerializer(values);
                      let cashbackTotal = convertCurrency(
                        userCurrency,
                        parseFloat(currentUserCashback.bankWithdrawalTotal).toFixed(3),
                        'AED',
                        true,
                        conversions,
                      )[1];
                      cashbackTotal = parseFloat(cashbackTotal).toFixed(2);
                      data.amount = cashbackTotal;
                      actions.setStatus();
                      try {
                        const res = await sendBankWithdrawRequest(data);
                        actions.setStatus('success');
                        setFormStatus('success');
                      } catch (e) {
                        console.warn(e);
                        const errorsForm = errorsSerializer(e.errors);
                        if (errorsForm && errorsForm.detail.includes('active bank withdrawal')) {
                          actions.setErrors(errorsForm);
                          setFormStatus('active_request');
                        } else {
                          actions.setStatus('error');
                          setFormStatus('error');
                        }
                      }
                    }}
                    validate={values => {
                      const errors = {};
                      const swiftRegEx = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i;
                      const requiredFields = {
                        bank: t('common.bankNameRequired'),
                        accountNumber: t('common.accountNumberRequired'),
                        accountTitle: t('common.accountTitleRequired'),
                        swift: t('common.swiftRequired'),
                      };

                      if (!NO_IBAN_COUNTRIES.includes(countrySelectValue)) {
                        requiredFields.iban = t('common.ibanRequired');
                      }

                      Object.keys(requiredFields).forEach(key => {
                        if (!values[key]) {
                          errors[key] = requiredFields[key];
                        }
                      });

                      if (
                        !NO_IBAN_COUNTRIES.includes(countrySelectValue)
                        && !errors.iban
                        && isValidIBANNumber(values.iban) !== 1
                      ) {
                        errors.iban = t('common.ibanNotValid');
                      }

                      if (!errors.swift && !swiftRegEx.test(values.swift)) {
                        errors.swift = t('common.swiftNotValid');
                      }
                      return errors;
                    }}
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
                      status,
                      // eslint-disable-next-line arrow-body-style
                    }) => {
                      return (
                        <>
                          <View style={styles.header}>
                            <Text style={styles.text}>{t('common.withdrawReqHead')}</Text>
                            <Text style={[styles.subText, { textAlign: 'center', marginTop: '2%' }]}>{t('common.withdrawReqSub')}</Text>
                          </View>
                          <View>
                          <Text style={[styles.label,styles.input, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.country')}</Text>
                          <Select
                            selectedIndex={selectedCountryIndex}
                            onSelect={index => setSelectedCountryIndex(index)}
                            size="large"
                            textStyle="right"
                            style={[styles.input, {flex: 1, borderWidth: 1, borderColor: '#CCCCCC'}]}
                            value={t(countrySelectDisplayValue)}
                            // label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.country')}</Text>}
                          >
                            <SelectItem title={t('common.uae')} />
                            <SelectItem title={t('common.saudiArabia')} />
                          </Select>
                          </View>
                          <Input
                            textAlign={currLang === 'ar' ? 'right' : 'left'}
                            style={[styles.input, commonStyles.loginRegistrationInputFieldColor]}
                            textStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}
                            value={values.bank}
                            onChangeText={handleChange('bank')}
                            onBlur={handleBlur('bank')}
                            label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.bankName')}</Text>}
                            caption={() => (errors.bank && submitCount > 0 ? <Text status="danger" style={styles.caption} category="p1">{errors.bankName}</Text> : null)}
                          />
                          <Input
                            textAlign={currLang === 'ar' ? 'right' : 'left'}
                            style={[styles.input, commonStyles.loginRegistrationInputFieldColor]}
                            textStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}
                            value={values.accountNumber}
                            onChangeText={handleChange('accountNumber')}
                            onBlur={handleBlur('accountNumber')}
                            label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.accountNumber')}</Text>}
                            caption={() => (errors.bank && submitCount > 0 ? <Text status="danger" style={styles.caption} category="p1">{errors.accountNumber}</Text> : null)}
                          />
                          <Input
                            textAlign={currLang === 'ar' ? 'right' : 'left'}
                            style={[styles.input, commonStyles.loginRegistrationInputFieldColor]}
                            textStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}
                            value={values.accountTitle}
                            onChangeText={handleChange('accountTitle')}
                            onBlur={handleBlur('accountTitle')}
                            label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.accountTitle')}</Text>}
                            caption={() => (errors.bank && submitCount > 0 ? <Text status="danger" style={styles.caption} category="p1">{errors.accountTitle}</Text> : null)}
                          />
                          {!NO_IBAN_COUNTRIES.includes(countrySelectValue) && (
                          <Input
                            textAlign={currLang === 'ar' ? 'right' : 'left'}
                            style={[styles.input, commonStyles.loginRegistrationInputFieldColor]}
                            textStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}
                            value={values.iban}
                            onChangeText={handleChange('iban')}
                            onBlur={handleBlur('iban')}
                            label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.iban')}</Text>}
                            caption={() => (errors.iban && submitCount > 0 ? <Text status="danger" style={styles.caption} category="p1">{errors.iban}</Text> : null)}
                          />
                          )}
                          <Input
                            textAlign={currLang === 'ar' ? 'right' : 'left'}
                            style={[styles.input, commonStyles.loginRegistrationInputFieldColor]}
                            textStyle={{ paddingHorizontal: 14, paddingVertical: 10 }}
                            value={values.swift}
                            onChangeText={handleChange('swift')}
                            onBlur={handleBlur('swift')}
                            label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.swift')}</Text>}
                            caption={() => (errors.swift && submitCount > 0 ? <Text status="danger" style={styles.caption} category="p1">{errors.swift}</Text> : null)}
                          />
                          {!isSufficientCashback ? (
                            <Text style={styles.cashbackScarcityText}>
                              {`*${t('common.cashbackScarcity')}`}
                            </Text>
                          ) : null}
                          <Button
                            style={{ marginHorizontal: '3%', marginTop: 10, marginBottom: 20 }}
                            size="small"
                            onPress={handleSubmit}
                            disabled={isSubmitting || !isSufficientCashback}
                            accessoryRight={() => (isSubmitting ? <Spinner size="tiny" /> : null)}
                          >
                            {evaProps => <Text {...evaProps} category="p1" style={styles.bankWithdrawalSubmitText}>{t('common.submit')}</Text>}
                          </Button>
                        </>
                      );
                    }}
                  </Formik>
                </View>
              </KeyboardAvoidingView>
            </Layout>
          </ScrollView>
        )}
    </>
  );
};

BankWithdrawalForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

BankWithdrawalForm.defaultProps = {
  navigation: null,
};
export default BankWithdrawalForm;
