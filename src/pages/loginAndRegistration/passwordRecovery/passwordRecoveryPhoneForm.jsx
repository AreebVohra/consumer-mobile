import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
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
import { t } from 'services/i18n';
import { Formik } from 'formik';
import { countrySelectOptions } from 'utils/constants';
import authApi from 'api/auth';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { setRecoveryFields } from 'reducers/recovery';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import Icon from 'components/Icon';
import styles from './styles';

const PasswordRecoveryPhoneForm = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const dispatch = useDispatch();

  const [selectedCountryIndex, setSelectedCountryIndex] = useState(new IndexPath(0));
  const [loading, setLoading] = useState(false);
  const [
    countrySelectValue,
    countrySelectDisplayValue,
    countrySelectCode,
  ] = countrySelectOptions[selectedCountryIndex.row];

  const processFormErrors = err => {
    const { errors } = err;
    const formErrors = {};

    if (errors.code === 'user_does_not_exists') {
      formErrors.phoneNumber = t('errors.phoneNotRegistered');
      formErrors.phoneNumberCustom = t('errors.phoneNotRegistered');
    }

    return formErrors;
  };

  const prepareData = values => {
    const phoneNumber = `${countrySelectOptions[selectedCountryIndex.row][2]}${values.phoneNumber.replace(/^0/, '').replace(/(\s|\(|\)|-|\.)/gi, '')}`;

    return {
      ...values,
      phoneNumber,
    };
  };

  return (
    <Layout
      style={styles.layout}
      level="1"
    >
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <Formik
            initialValues={{ phoneNumber: '' }}
            onSubmit={async (values, actions) => {
              const data = prepareData(values);
              setLoading(true);
              let success = true;
              try {
              // Send a request for password recovery
                await authApi.recoveryInit(data.phoneNumber);
                dispatch(setRecoveryFields(data));
                actions.setStatus('success');
              } catch (err) {
                actions.setErrors(processFormErrors(err));
                success = false;
                setLoading(false);
              }
              setLoading(false);
              if (success) {
                navigation.navigate('RecoveryVerify');
              }
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
              submitCount,
            // eslint-disable-next-line arrow-body-style
            }) => {
              return (
                <>
                  <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('ChoosePhoneNumberForm')}>
                    {Icon(
                      {
                        fill: '#353535',
                        width: '10%',
                        height: 80,
                      },
                      'arrow-back-outline',
                    )}
                  </TouchableOpacity>
                  <View style={styles.header}>
                    <Text style={styles.text}>{t('common.passwordRecovery')}</Text>
                    <Text style={[commonStyles.subTextColor, { color: '#717171' }]}>{t('common.passwordRecoverySub')}</Text>
                  </View>

                  <Input
                    placeholder={t('common.mobileNumber')}
                    style={[styles.inputStyles]}
                    textAlign={isRTL ? 'right' : 'left'}
                    keyboardType="phone-pad"
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    caption={() => (errors.phoneNumber && submitCount > 0 ? (
                      <Text status="danger" style={[styles.caption, { textAlign: isRTL ? 'right' : 'left' }]} category="p1">
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
                    disabled={isSubmitting || loading || !values.phoneNumber || !isValid}
                    onPress={handleSubmit}
                    size="large"
                    accessoryRight={() => (isSubmitting || loading ? <Spinner status="control" size="small" /> : null)}
                  >
                    {evaProps => <Text {...evaProps} category="p1" style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>{t('common.continue')}</Text>}
                  </Button>
                </>
              );
            }}
          </Formik>
        </View>
      </KeyboardAvoidingView>

    </Layout>
  );
};

PasswordRecoveryPhoneForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

PasswordRecoveryPhoneForm.defaultProps = {
  navigation: null,
};

export default PasswordRecoveryPhoneForm;
