/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StatusBar } from 'react-native';
import {
  Text,
  Card,
  Modal,
  Button,
  Input,
  Spinner,
  IndexPath,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import { showMessage } from 'react-native-flash-message';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import { t } from 'services/i18n';
import { countrySelectOptionsAlpha3 } from 'utils/constants';
import authApi from 'api/auth';
import { Formik } from 'formik';
import { addBillingAddress } from 'api';
import { unresolvedBillingAddresses, fetchBillingAddresses } from 'reducers/billingAddresses';
import * as Yup from 'yup';
import styles from '../styles';
import formSerializer from './formSerializer';
import errorsSerializer from './errorsSerializer';

const AddAddress = ({ visible, setVisible }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const [loading, setLoading] = useState(false);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(new IndexPath(0));
  const [
    countrySelectValue,
    countrySelectDisplayValue,
  ] = countrySelectOptionsAlpha3[selectedCountryIndex.row];

  // eslint-disable-next-line no-shadow
  const validationSchema = t => Yup.object().shape({
    address1: Yup.string().required(t('errors.addressRequired')),
    address2: Yup.string(),
    city: Yup.string().required(t('errors.cityRequired')),
    country: Yup.string().required(t('countryRequired')),
    zip: Yup.string().required(t('errors.postalCodeRequired')),
  });

  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setVisible(false)}
      style={styles.modal}
    >
      <KeyboardAvoidingView>

        <Card disabled>
          <Formik
            initialValues={{
              address1: '',
              address2: '',
              country: 'ARE',
              city: '',
              zip: '',
            }}
            onSubmit={async (values, actions) => {
              const data = formSerializer(values);
              actions.setStatus();

              try {
                await addBillingAddress(data);
                dispatch(unresolvedBillingAddresses());
                showMessage({
                  message: t('success.addBillingAddressSuccess'),
                  backgroundColor: '#FFFFFF',
                  color: '#0EBD8F',
                  statusBarHeight: StatusBar.currentHeight,
                  style: {
                    borderColor: '#0EBD8F',
                    alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
                    textAlign: currLang === 'ar' ? 'right' : 'left',
                    borderLeftWidth: currLang === 'ar' ? 0 : 2,
                    borderRightWidth: currLang === 'ar' ? 2 : 0,
                  },
                });
                dispatch(fetchBillingAddresses());
                setVisible(false);
              } catch (e) {
                const errors = errorsSerializer(e.errors);
                if (errors) {
                  actions.setErrors(errors);
                } else {
                  showMessage({
                    message: t('errors.somethingWrongContactSupport'),
                    backgroundColor: '#FFFFFF',
                    color: '#FF4D4A',
                    statusBarHeight: StatusBar.currentHeight,
                    style: {
                      borderColor: '#FF4D4A',
                      alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
                      textAlign: currLang === 'ar' ? 'right' : 'left',
                      borderLeftWidth: currLang === 'ar' ? 0 : 2,
                      borderRightWidth: currLang === 'ar' ? 2 : 0,
                    },
                  });
                  actions.setStatus('error');
                }
              }
            }}
            validationSchema={validationSchema(t)}
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
              const handleCountrySelect = index => {
                setSelectedCountryIndex(index);
                setFieldValue('country', countrySelectOptionsAlpha3[index.row][0]);
              };

              return (
                <>
                  <Text style={[{ textAlign: currLang === 'ar' ? 'right' : 'left' }, styles.heading]} category="h5">{t('common.addNewAddress')}</Text>
                  <Text style={{ textAlign: currLang === 'ar' ? 'right' : 'left' }} appearance="hint" category="s6">{t('common.addNewAddressDesc')}</Text>

                  <Input
                    textAlign={currLang === 'ar' ? 'right' : 'left'}
                    style={styles.input}
                    label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="s1">{t(t('common.address1'))}</Text>}
                    value={values.address1}
                    onChangeText={handleChange('address1')}
                    onBlur={handleBlur('address1')}
                    caption={() => (errors.address1 && submitCount > 0 ? <Text category="c2">{errors.address1}</Text> : null)}
                  />
                  <Input
                    textAlign={currLang === 'ar' ? 'right' : 'left'}
                    style={styles.input}
                    label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="s1">{t('common.address2')}</Text>}
                    value={values.address2}
                    onChangeText={handleChange('address2')}
                    onBlur={handleBlur('address2')}
                    caption={() => (errors.address2 && submitCount > 0 ? <Text category="c2">{errors.address2}</Text> : null)}
                  />
                  <Select
                    label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="s1">{t('common.country')}</Text>}
                    selectedIndex={selectedCountryIndex}
                    onSelect={index => handleCountrySelect(index)}
                    style={styles.input}
                    value={t(countrySelectDisplayValue)}
                  >
                    {countrySelectOptionsAlpha3.map(
                      option => <SelectItem key={option[2]} title={t(option[1])} />,
                    )}
                  </Select>
                  <Input
                    style={styles.input}
                    label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="s1">{t('common.city')}</Text>}
                    value={values.city}
                    onChangeText={handleChange('city')}
                    onBlur={handleBlur('city')}
                    caption={() => (errors.city && submitCount > 0 ? <Text category="c2">{errors.city}</Text> : null)}
                    textAlign={currLang === 'ar' ? 'right' : 'left'}
                  />
                  <Input
                    textAlign={currLang === 'ar' ? 'right' : 'left'}
                    style={styles.input}
                    label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="s1">{t('common.postalCode')}</Text>}
                    value={values.zip}
                    onChangeText={handleChange('zip')}
                    onBlur={handleBlur('zip')}
                    caption={() => (errors.zip && submitCount > 0 ? <Text category="c2">{errors.zip}</Text> : null)}
                  />
                  <View style={[styles.actions, { justifyContent: currLang === 'ar' ? 'flex-end' : 'flex-start' }]}>
                    <Button
                      onPress={handleSubmit}
                      size="small"
                      accessoryRight={() => (isSubmitting || loading ? <Spinner status="basic" size="tiny" /> : null)}
                      disabled={isSubmitting || loading}
                    >
                      {t('common.submit')}
                    </Button>
                    <Button status="basic" style={styles.enSecondaryAction} onPress={() => setVisible(false)} size="small">
                      {t('common.cancel')}
                    </Button>
                  </View>
                </>
              );
            }}
          </Formik>
        </Card>
      </KeyboardAvoidingView>

    </Modal>

  );
};

AddAddress.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

AddAddress.defaultProps = {
};

export default AddAddress;
