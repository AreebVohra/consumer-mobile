/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Text,
  Card,
  Modal,
  Button,
  Input,
  Spinner,
} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { t } from 'services/i18n';
import authApi from 'api/auth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './styles';

const ChangeEmail = ({ visible, setVisible }) => {
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';

  const [loading, setLoading] = useState(false);

  const processFormErrors = (errors, t) => {
    const formErrors = {};

    if (typeof errors === 'object' && 'user' in errors) {
      if (errors.user.email) {
        const emailErr = errors.user.email;
        if (Array.isArray(emailErr) && emailErr[0] === 'user with this email already exists.') {
          formErrors.email = t('errors.emailAlreadyExists');
        } else {
          formErrors.email = t('errors.emailIncorrect');
        }
      }
    } else {
      formErrors.password = t('errors.somethingWentWrongDuringRegister');
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
        <Card style={{ paddingHorizontal: 8 }} disabled>
          <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values, actions) => {
              try {
                const { email, password } = values;
                setLoading(true);
                const result = await authApi.requestEmailChange(values.email);
              } catch (err) {
                setLoading(false);
                const { errors } = err;
                actions.setErrors(processFormErrors(errors, t));
              }
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email().required(),
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
                  <Text style={styles.heading} category="h6">Change Email</Text>
                  <Text style={{ marginBottom: 12 }} appearance="hint" category="s1">We’ll send you a verification link on your new email. Changes will apply after you follow the link.</Text>

                  <Input
                    style={styles.input}
                    placeholder="Your new email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    caption={() => (errors.email && submitCount > 0 ? <Text category="c2">{errors.email}</Text> : null)}
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                  <View style={styles.actions}>
                    <Button
                      onPress={handleSubmit}
                      size="small"
                      accessoryRight={() => (isSubmitting || loading ? <Spinner status="basic" size="tiny" /> : null)}
                      disabled={isSubmitting || loading}
                    >
                      Save changes
                    </Button>
                    <Button status="basic" style={styles.enSecondaryAction} onPress={() => setVisible(false)} size="small">
                      Cancel
                    </Button>
                  </View>
                </>
              );
            }}
          </Formik>
        </Card>
      </Modal>

    </>

  );
};

ChangeEmail.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

ChangeEmail.defaultProps = {
};

export default ChangeEmail;
