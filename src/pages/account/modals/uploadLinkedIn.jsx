/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StatusBar } from 'react-native';
import {
  Text,
  Card,
  Modal,
  Button,
  Input,
  Spinner,
} from '@ui-kitten/components';
import { retrieveConsumerScore } from 'reducers/application';
import { postLinkedIn } from 'api';
import { showMessage } from 'react-native-flash-message';
import PropTypes from 'prop-types';
import { t } from 'services/i18n';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './styles';

const uploadLinkedIn = ({ visible, setVisible }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
        style={styles.modal}
      >
        <Card disabled>
          <Formik
            initialValues={{ linkedIn: '' }}
            onSubmit={async (values, actions) => {
              const { linkedIn } = values;
              try {
                setLoading(true);
                const formData = new FormData();
                formData.append('linkedin_url', linkedIn);
                await postLinkedIn(formData);
                showMessage({
                  message: t('success.submitLinkedInSuccess'),
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
                dispatch(retrieveConsumerScore());
                setLoading(false);
                setVisible(false);
              } catch (e) {
                console.error('error', e);
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
                setLoading(false);
              }
            }}
            validationSchema={Yup.object().shape({
              linkedIn: Yup.string().url(t('errors.urlErr')).required(t('errors.linkedInRequired')),
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
                  <Text style={[styles.heading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="h6">{t('common.submitLinkedIn')}</Text>

                  <Input
                    textAlign={currLang === 'ar' ? 'right' : 'left'}
                    style={styles.input}
                    value={values.linkedIn}
                    onChangeText={handleChange('linkedIn')}
                    onBlur={handleBlur('linkedIn')}
                    label={() => <Text style={[styles.label, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="c1">{t('common.linkedInID')}</Text>}
                    caption={() => (errors.linkedIn && submitCount > 0 ? <Text status="danger" category="c2">{errors.linkedIn}</Text> : null)}
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
      </Modal>
    </>
  );
};

uploadLinkedIn.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

uploadLinkedIn.defaultProps = {
};

export default uploadLinkedIn;
