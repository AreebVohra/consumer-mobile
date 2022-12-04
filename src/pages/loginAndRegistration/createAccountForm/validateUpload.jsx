/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Button,
  Layout,
  Text,
  Spinner,
  Input,
} from '@ui-kitten/components';
import {
  USER_DETAILS,
} from 'utils/constants';
import { t } from 'services/i18n';
import { Formik } from 'formik';
import handleLogEvent from 'utils/handleLogEvent';
import * as Yup from 'yup';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/ar-dz';
import commonStyles from 'utils/commonStyles';
import { updateUser } from 'api';
import styles from './styles';

const ValidateUpload = ({ route, navigation }) => {
  const { password } = route.params;

  const currLang = useSelector(state => state.language.language);

  const {
    idNumber,
    cardNumber,
    fullName,
    nationality,
    sex,
    dateOfBirth,
    cardExpiryDate,
    editableFields,
    showFields,
  } = useSelector(state => state.registration);

  const { userId } = useSelector(state => state.application.currentUser);

  const processErrors = (err, t) => {
    const result = {};
    const { code } = err;
    if (code) {
      if (code === 'registration_session_age_validate_exception') {
        result.dateOfBirth = t('errors.ageRequirements');
      }
      if (code === 'details_not_valid') {
        result.fullName = t('errors.nameNotValid');
      }
    }
    return result;
  };

  const prepareData = values => {
    values.fullName = values.fullName.trim();
    const [day, month, year] = values.dateOfBirth.split('/');

    // Date constructor takes in 0-indexed month
    const dateOfBirth = year
      ? moment(new Date(year, Number(month) - 1, day)).format('YYYY-MM-DD')
      : null;

    return {
      userId,
      fullName: values.fullName,
      dateOfBirth,
      cardExpiryDate,
      idNumber: values.idNumber,
      cardNumber: values.cardNumber,
    };
  };

  return (
    <Layout
      style={styles.form}
      level="1"
    >
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <Formik
            initialValues={{
              dateOfBirth,
              idNumber,
              cardNumber,
              fullName,
              nationality,
              sex,
              cardExpiryDate,
            }}
            onSubmit={async (values, actions) => {
              try {
                const data = prepareData(values);
                await updateUser(data);
                actions.setStatus('success');
                navigation.navigate('Welcome', { password });
                // import handleLogEvent from 'utils/handleLogEvent';
                await handleLogEvent('SpotiiMobileIDVerified');
              } catch (err) {
                const { errors = {} } = err || {};
                actions.setErrors(processErrors(errors, t));
              }
            }}
            validationSchema={Yup.object().shape({
              fullName: editableFields.includes(USER_DETAILS.NAME)
                ? Yup.string()
                  .min(2, t('errors.nameMin'))
                  .matches(/^([^0-9\u0660-\u0669]*)$/, {
                    message: t('errors.numbersNotAllowedInName'),
                    excludeEmptyString: false,
                  })
                  .matches(/^([^\u0621-\u064A]*)$/, {
                    message: t('errors.englishNamesOnly'),
                    excludeEmptyString: false,
                  })
                  .matches(/^[a-z\u00c0-\u017f-' ]*$/i, {
                    message: t('errors.validName'),
                    excludeEmptyString: false,
                  })
                  .required(t('errors.nameRequired'))
                : Yup.string(),
              dateOfBirth: editableFields.includes(USER_DETAILS.DOB)
                ? Yup.string().required(t('errors.dobRequired'))
                : Yup.string(),
              idNumber: editableFields.includes(USER_DETAILS.ID_NUMBER)
                ? Yup.string()
                  .matches(/^[0-9]{8,15}$/, {
                    message: t('errors.validIdNumber'),
                    excludeEmptyString: false,
                  })
                  .required(t('errors.idNumberRequired'))
                : Yup.string(),
              cardNumber: editableFields.includes(USER_DETAILS.CARD_NUMBER)
                ? Yup.string()
                  .matches(/^[0-9]{8,15}$/, {
                    message: t('errors.validCardNumber'),
                    excludeEmptyString: false,
                  })
                  .required(t('errors.cardNumberRequired'))
                : Yup.string(),
              cardExpiryDate: editableFields.includes(USER_DETAILS.CARD_EXPIRY)
                ? Yup.string().required(t('errors.cardExpiryDateRequired'))
                : Yup.string(),
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
              return (
                <>
                  <View style={styles.header}>
                    <Text style={styles.text} category="h2">{t('common.personalDetails')}</Text>
                    <Text style={[styles.subText, { textAlign: 'center', marginTop: '2%' }]}>{t('common.personalDetailsSub')}</Text>
                  </View>
                  {showFields.includes(USER_DETAILS.NAME) ? (
                    <Input
                      placeholder={t('common.fullName')}
                      style={[styles.inputStyles]}
                      textAlign={currLang === 'ar' ? 'right' : 'left'}
                      value={values.fullName}
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      caption={() => (errors.fullName && submitCount > 0 ? (
                        <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                          {errors.fullName}
                        </Text>
                      ) : null)}
                      disabled={!editableFields.includes(USER_DETAILS.NAME)}
                    />
                  ) : null}

                  {showFields.includes(USER_DETAILS.ID_NUMBER) ? (
                    <Input
                      placeholder={t('common.idNumber')}
                      style={[styles.inputStyles]}
                      textAlign={currLang === 'ar' ? 'right' : 'left'}
                      value={values.idNumber}
                      onChangeText={handleChange('idNumber')}
                      onBlur={handleBlur('idNumber')}
                      caption={() => (errors.idNumber && submitCount > 0 ? (
                        <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                          {errors.idNumber}
                        </Text>
                      ) : null)}
                      disabled={!editableFields.includes(USER_DETAILS.ID_NUMBER)}
                    />
                  ) : null}

                  {showFields.includes(USER_DETAILS.CARD_NUMBER) ? (
                    <Input
                      placeholder={t('common.cardNumber')}
                      style={[styles.inputStyles]}
                      textAlign={currLang === 'ar' ? 'right' : 'left'}
                      value={values.cardNumber}
                      onChangeText={handleChange('cardNumber')}
                      onBlur={handleBlur('cardNumber')}
                      caption={() => (errors.cardNumber && submitCount > 0 ? (
                        <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                          {errors.cardNumber}
                        </Text>
                      ) : null)}
                      disabled={!editableFields.includes(USER_DETAILS.CARD_NUMBER)}
                    />
                  ) : null}

                  {showFields.includes(USER_DETAILS.CARD_EXPIRY) ? (
                    <Input
                      placeholder={t('common.cardExpiryDate')}
                      style={[styles.inputStyles]}
                      textAlign={currLang === 'ar' ? 'right' : 'left'}
                      value={values.cardExpiryDate}
                      onChangeText={handleChange('cardExpiryDate')}
                      onBlur={handleBlur('cardExpiryDate')}
                      caption={() => (errors.cardExpiryDate && submitCount > 0 ? (
                        <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                          {errors.cardExpiryDate}
                        </Text>
                      ) : null)}
                      disabled={!editableFields.includes(USER_DETAILS.CARD_EXPIRY)}
                    />
                  ) : null}

                  {showFields.includes(USER_DETAILS.DOB) ? (
                    <Input
                      placeholder="DD/MM/YYYY"
                      style={[styles.inputStyles]}
                      textAlign={currLang === 'ar' ? 'right' : 'left'}
                      value={values.dateOfBirth}
                      onChangeText={handleChange('dateOfBirth')}
                      onBlur={handleBlur('dateOfBirth')}
                      caption={() => (errors.dateOfBirth && submitCount > 0 ? (
                        <Text status="danger" style={[styles.caption, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="p1">
                          {errors.dateOfBirth}
                        </Text>
                      ) : null)}
                      disabled={!editableFields.includes(USER_DETAILS.DOB)}
                    />
                  ) : null}

                  <Button
                    style={styles.signInButton}
                    size="large"
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    accessoryRight={() => (isSubmitting ? <Spinner size="tiny" /> : null)}
                  >
                    {evaProps => <Text {...evaProps} category="p1" style={{ fontSize: 16, color: 'white' }}>{t('common.continue')}</Text>}
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

ValidateUpload.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      password: PropTypes.string,
    }),
  }),
};

ValidateUpload.defaultProps = {
  navigation: null,
  route: null,
};

export default ValidateUpload;
