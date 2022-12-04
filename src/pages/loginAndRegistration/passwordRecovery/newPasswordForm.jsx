/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import {
  Button,
  Input,
  Layout,
  Text,
  Spinner,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import { Formik } from 'formik';
import authApi from 'api/auth';
import * as Yup from 'yup';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import Icon from 'components/Icon';
import styles from './styles';

const NewPasswordForm = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const [loading, setLoading] = useState(false);

  const processFormErrors = (err, t) => {
    const { errors } = err;
    const formErrors = {};

    if (typeof errors === 'object') {
      if (errors.new_password) {
        formErrors.password = errors.new_password[0];
        // Overwrite the known message
        if (formErrors.password === 'This value does not match the required pattern.') {
          formErrors.password = t('errors.passwordRequirements');
        }
      }
      if (errors.confirm_new_password) {
        formErrors.confirmPassword = t('errors.passwordsShouldMatch');
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
    <Layout
      style={styles.layout}
      level="1"
    >
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={Yup.object().shape({
              password: Yup.string()
                .min(8)
                .required(),
              confirmPassword: Yup.string()
                .min(8)
                .required(),
            })}
            onSubmit={async (values, actions) => {
              const { password, confirmPassword } = values;
              let success = true;
              setLoading(true);
              try {
              // Send a request for password recovery
                await authApi.recoveryNewPassword(password, confirmPassword);
                actions.setStatus('success');
              } catch (err) {
                actions.setErrors(processFormErrors(err, t));
                success = false;
                setLoading(false);
              }
              setLoading(false);
              if (success) {
                navigation.navigate('RecoveryDone');
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
                  <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('PasswordRecoveryPhoneForm')}>
                    {Icon(
                      {
                        fill: '#353535',
                        width: '10%',
                        height: 100,
                      },
                      'arrow-back-outline',
                    )}
                  </TouchableOpacity>
                  <View style={[styles.header, { marginBottom: '10%' }]}>
                    <Text style={styles.text}>{t('common.createNewPassword')}</Text>
                    <Text style={[commonStyles.subTextColor, { color: '#717171' }]}>{t('common.createNewPasswordSub')}</Text>
                  </View>

                  <Input
                    placeholder={t('common.newPassword')}
                    textAlign={isRTL ? 'right' : 'left'}
                    style={[styles.inputStyles]}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    caption={() => (errors.password && submitCount > 0 ? (
                      <Text status="danger" style={[styles.caption, { textAlign: isRTL ? 'right' : 'left' }]} category="p1">
                        {t('errors.passwordRequirements')}
                      </Text>
                    ) : null)}
                    secureTextEntry
                  />

                  <Input
                    placeholder={t('common.confirmNewPassword')}
                    textAlign={isRTL ? 'right' : 'left'}
                    style={[styles.inputStyles]}
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    caption={() => (errors.confirmPassword && submitCount > 0 ? (
                      <Text status="danger" style={[styles.caption, { textAlign: isRTL ? 'right' : 'left' }]} category="p1">
                        {t('errors.passwordsShouldMatch')}
                      </Text>
                    ) : null)}
                    secureTextEntry
                  />

                  <Button
                    style={styles.signInButton}
                    disabled={isSubmitting || loading || !values.password || !values.confirmPassword || !isValid}
                    onPress={handleSubmit}
                    size="large"
                    accessoryRight={() => (isSubmitting || loading ? <Spinner size="small" status="control" style={{ color: 'white' }} /> : null)}
                  >
                    <Text category="p1" style={{ fontSize: 16, color: 'white' }}>{t('common.setNewPassword')}</Text>
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

NewPasswordForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

NewPasswordForm.defaultProps = {
  navigation: null,
};

export default NewPasswordForm;
