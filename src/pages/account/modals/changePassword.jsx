/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StatusBar } from 'react-native';
import { phoneNumberFlipPlusSign } from 'utils/misc';
import {
  Text,
  Card,
  Modal,
  Button,
  Input,
  Spinner,
} from '@ui-kitten/components';
import { showMessage } from 'react-native-flash-message';
import PropTypes from 'prop-types';
import { t } from 'services/i18n';
import authApi from 'api/auth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './styles';

const ChangePassword = ({ visible, setVisible }) => {
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationUrl, setConfirmationUrl] = useState();

  const phoneNumber = useSelector(state => state.application.currentUser.phoneNumber);

  const HandleCancel = () => {
    setVisible(false);
    setShowOTP(false);
  };

  const processFormErrors = (err, t) => {
    const { errors } = err;
    const formErrors = {};

    if (Array.isArray(errors)) {
      const firstError = errors[0];
      if (firstError === 'Cannot set the same password as it was before') {
        formErrors.password = t('samePasswordAsBefore');
      }
    } else if (typeof errors === 'object') {
      if (errors.new_password) {
        // eslint-disable-next-line prefer-destructuring
        formErrors.password = errors.new_password[0];
        // Overwrite the known message
        if (formErrors.password === 'This value does not match the required pattern.') {
          formErrors.password = t('error.passwordRequirements');
        }
        if (formErrors.password === 'This password is too common.') {
          formErrors.password = t('error.weakPassword');
        }
      }
      if (errors.confirm_new_password) {
        if (errors.confirm_new_password[0] !== 'This password is too common.') {
          formErrors.confirmPassword = t('errors.passwordsShouldMatch');
        }
      }
      if (errors.non_field_errors && errors.non_field_errors.length) {
        errors.non_field_errors.forEach(err => {
          if (err === 'new_password not equal to confirm_new_password') {
            formErrors.confirmPassword = t('errors.passwordsShouldMatch');
          }
        });
      }
    } else {
      console.error('Something went wrong during changing of the password.');
    }

    return formErrors;
  };

  return (
    <>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
        style={styles.modal}
      >
        <Card disabled>
          {
            showOTP
              ? (
                <Formik
                  initialValues={{
                    otpNumber: '',
                  }}
                  onSubmit={async (values, actions) => {
                    const success = true;
                    setLoading(true);
                    try {
                      try {
                        setLoading(true);
                        await authApi.confirmEmailChange(confirmationUrl, values.otpNumber);
                        setLoading(false);
                        setShowOTP(false);
                        showMessage({
                          message: t('success.yourPasswordHasBeenReset'),
                          backgroundColor: '#FFFFFF',
                          color: '#0EBD8F',
                          statusBarHeight: StatusBar.currentHeight,
                          style: {
                            borderColor: '#0EBD8F',
                            width: '100%',
                            alignItems: `flex-${isRTL ? 'end' : 'start'}`,
                            textAlign: isRTL ? 'right' : 'left',
                            borderLeftWidth: isRTL ? 0 : 2,
                            borderRightWidth: isRTL ? 2 : 0,
                          },
                        });
                        setShowOTP(false);
                        setVisible(false);
                      } catch (e) {
                        console.error('otp error', e);
                        setLoading(false);
                      }
                    } catch (e) {
                      setLoading(false);
                      console.error('otp error', e);
                    }

                    setLoading(false);
                  }}
                  validationSchema={Yup.object().shape({
                    otpNumber: Yup.string()
                      .min(4)
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
                    // eslint-disable-next-line arrow-body-style
                  }) => {
                    return (
                      <>
                        <Text style={[styles.heading, { textAlign: isRTL ? 'right' : 'left' }]} category="h6">{t('common.verifyHeader')}</Text>
                        <Text style={{ textAlign: isRTL ? 'right' : 'left' }} appearance="hint" category="s1">
                          {`${t('common.verifySubHeader')} `}
                          <Text style={{ color: '#1A0826' }}>{isRTL ? phoneNumberFlipPlusSign(phoneNumber) : phoneNumber}</Text>
                        </Text>

                        <Input
                          textAlign={isRTL ? 'right' : 'left'}
                          style={styles.input}
                          placeholder="0000"
                          value={values.otpNumber}
                          onChangeText={handleChange('otpNumber')}
                          onBlur={handleBlur('otpNumber')}
                          caption={() => (errors.otpNumber && submitCount > 0 ? <Text category="c2" status="danger">{t('errors.otpIncorrect')}</Text> : null)}
                        />
                        <View style={[styles.actions, { justifyContent: isRTL ? 'flex-end' : 'flex-start' }]}>
                          <Button
                            onPress={handleSubmit}
                            size="small"
                            accessoryRight={() => (isSubmitting || loading ? <Spinner status="basic" size="tiny" /> : null)}
                            disabled={isSubmitting || loading}
                          >
                            {t('common.submit')}
                          </Button>
                          <Button status="basic" style={styles.enSecondaryAction} onPress={HandleCancel} size="small">
                            {t('common.cancel')}
                          </Button>
                        </View>
                      </>
                    );
                  }}
                </Formik>
              )
              : (
                <Formik
                  initialValues={{ password: '', confirmPassword: '' }}
                  onSubmit={async (values, actions) => {
                    const { password, confirmPassword } = values;
                    try {
                      setLoading(true);
                      const result = await authApi.requestPasswordChange(password, confirmPassword);
                      setLoading(false);
                      setConfirmationUrl(result.url);
                      setShowOTP(true);
                    } catch (e) {
                      actions.setErrors(processFormErrors(e, t));
                      console.error('error', e);
                      setLoading(false);
                    }
                  }}
                  validationSchema={Yup.object().shape({
                    password: Yup.string()
                      .min(8)
                      .required(),
                    confirmPassword: Yup.string()
                      .min(8)
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
                    // eslint-disable-next-line arrow-body-style
                  }) => {
                    return (
                      <>
                        <Text style={[styles.heading, { textAlign: isRTL ? 'right' : 'left' }]} category="h6">{t('common.createNewPassword')}</Text>
                        <Text style={{ textAlign: isRTL ? 'right' : 'left' }} appearance="hint" category="s1">{t('common.createNewPasswordSub')}</Text>

                        <Input
                          textAlign={isRTL ? 'right' : 'left'}
                          style={styles.input}
                          value={values.password}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          label={() => <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]} category="c1">{t('common.newPassword')}</Text>}
                          caption={() => (errors.password && submitCount > 0 ? <Text status="danger" category="c2">{t('errors.passwordRequirements')}</Text> : null)}
                          secureTextEntry
                        />
                        <Input
                          textAlign={isRTL ? 'right' : 'left'}
                          style={styles.input}
                          value={values.confirmPassword}
                          onChangeText={handleChange('confirmPassword')}
                          onBlur={handleBlur('confirmPassword')}
                          label={() => <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]} category="c1">{t('common.confirmNewPassword')}</Text>}
                          caption={() => (errors.confirmPassword && submitCount > 0 ? <Text status="danger" category="c2">{t('errors.passwordsShouldMatch')}</Text> : null)}
                          secureTextEntry
                        />
                        <View style={[styles.actions, { justifyContent: isRTL ? 'flex-end' : 'flex-start' }]}>
                          <Button
                            onPress={handleSubmit}
                            size="small"
                            accessoryRight={() => (isSubmitting || loading ? <Spinner status="basic" size="tiny" /> : null)}
                            disabled={isSubmitting || loading}
                          >
                            {t('common.submit')}
                          </Button>
                          <Button status="basic" style={styles.enSecondaryAction} onPress={HandleCancel} size="small">
                            {t('common.cancel')}
                          </Button>
                        </View>
                      </>
                    );
                  }}
                </Formik>
              )
          }
        </Card>
      </Modal>

    </>

  );
};

ChangePassword.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

ChangePassword.defaultProps = {
};

export default ChangePassword;
