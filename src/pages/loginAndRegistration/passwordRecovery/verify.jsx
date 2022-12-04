/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Layout,
  Text,
} from '@ui-kitten/components';
import { verifyPasswordRecovery } from 'reducers/recovery';
import { t } from 'services/i18n';
import authApi from 'api/auth';
import OtpNumberForm from 'components/OtpNumberForm';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import styles from './styles';

const Verify = ({ navigation }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const { phoneNumber, isFinalized, isPopulated } = useSelector(state => state.recovery);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleSubmit = async (otpNumber) => {
    let success = true;
    setLoading(true);
    try {
      const resp = await authApi.recoveryConfirm(otpNumber);
      setLoading(false);
      setFormError(false);
      dispatch(verifyPasswordRecovery());
    } catch (e) {
      setFormError(true);
      setLoading(false);
      success = false;
    }

    setLoading(false);

    if (success) {
      navigation.navigate('newPasswordForm');
    }
  };

  return (
    <Layout
      style={styles.layout}
      level="1"
    >
      <KeyboardAvoidingView>
        <View style={styles.form}>
          <>
            <TouchableOpacity style={{ marginHorizontal: 10, marginTop: 50 }} onPress={() => navigation.navigate('PasswordRecoveryPhoneForm')}>
              {Icon(
                {
                  fill: '#353535',
                  width: '10%',
                  height: 50,
                },
                'arrow-back-outline',
              )}
            </TouchableOpacity>
            <View>
              <OtpNumberForm
                navigation={navigation}
                handleSubmit={handleSubmit}
                loading={loading}
                formError={formError}
                showChangeNumber
                handleChangeNumber={() => navigation.goBack()}
                userPhoneNumber={phoneNumber}
              />

            </View>
          </>
        </View>
      </KeyboardAvoidingView>

    </Layout>
  );
};

Verify.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

Verify.defaultProps = {
  navigation: null,
};

export default Verify;
