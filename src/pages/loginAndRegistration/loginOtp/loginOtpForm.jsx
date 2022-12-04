/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  View,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { changeLanguage } from 'reducers/language';
import {
  Layout,
  Text,
} from '@ui-kitten/components';
import { LANGUAGES_TEXT, BACK_COUNTRIES } from 'utils/constants';
import { successFinalization } from 'reducers/registration';
import { triggerLoginEvent } from 'reducers/application';
import PrimarySpotiiZipLogo from 'assets/primarySpotiiZipLogo';
import OtpNumberForm from 'components/OtpNumberForm';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import authApi from 'api/auth';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import styles from './styles';

const SmartechSDK = require('smartech-reactnative-module');

const LoginOtpForm = ({ route, navigation }) => {
  const { changePhoneNumber, preventBackAction } = route.params;

  const OTP_TIMEOUT_SEC = 15;

  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const { phoneNumber } = useSelector(state => state.registration);
  const { currentUser } = useSelector((state) => state.application);
  const userPhoneNumber = phoneNumber || currentUser?.phoneNumber;
  const [enableOTPResend, setEnableOTPResend] = useState(false);
  const [countdown, setCountdown] = useState(OTP_TIMEOUT_SEC);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => navigation.navigate('ChoosePhoneNumberForm', { changePhoneNumber }));
    if (preventBackAction) {
      navigation.addListener('beforeRemove', (e) => {
        if (changePhoneNumber) {
          e.preventDefault();
        }
      });
    }
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown === 0) {
        setEnableOTPResend(true);
        setCountdown(OTP_TIMEOUT_SEC);
      } else if (!enableOTPResend) {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [countdown, enableOTPResend]);

  const handleSubmit = async (otpNumber) => {
    setLoading(true);
    try {
      const res = await authApi.login(userPhoneNumber, otpNumber);
      const country = alpha3FromISDPhoneNumber(userPhoneNumber);
      if (country === BACK_COUNTRIES[0]) {
        SmartechSDK.setUserIdentity(res.user.email);
      }
      setFormError(false);
      setLoading(false);
      dispatch(successFinalization());

      dispatch(triggerLoginEvent({ email: res.user.email }));
    } catch (e) {
      setFormError(true);
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    navigation.navigate('ChoosePhoneNumberForm', { changePhoneNumber });
  };

  return (
    <Layout style={styles.layout} level="1">
      <KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.topActionsRight}
          onPress={() => dispatch(changeLanguage({ lang: `${isRTL ? 'en' : 'ar'}`, shouldFetchMerchantDetailsList: false }))}
        >
          <View>
            <Text category="h7" style={{ width: 80, textAlign: 'center', backgroundColor: '#f9f9f9', paddingVertical: 6, paddingHorizontal: 4, borderRadius: 4 }}>
              {isRTL ? LANGUAGES_TEXT.ENGLISH : LANGUAGES_TEXT.ARABIC}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <PrimarySpotiiZipLogo />
          </View>

          <OtpNumberForm
            navigation={navigation}
            handleSubmit={handleSubmit}
            loading={loading}
            formError={formError}
            showChangeNumber
            handleChangeNumber={handleChangeNumber}
            userPhoneNumber={userPhoneNumber}
          />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

LoginOtpForm.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      changePhoneNumber: PropTypes.bool,
      preventBackAction: PropTypes.bool,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    addListener: PropTypes.func,
  }),
};

LoginOtpForm.defaultProps = {
  route: { params: { changePhoneNumber: false, preventBackAction: false } },
  navigation: null,
};

export default LoginOtpForm;
