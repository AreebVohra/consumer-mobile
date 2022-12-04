import React, { useEffect, useRef, useState } from 'react';
import { View, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import * as WebBrowser from 'expo-web-browser';
import { Button, Text, Spinner } from '@ui-kitten/components';
import { phoneNumberFlipPlusSign } from 'utils/misc';
import { t } from 'services/i18n';
import { sendOTPForLogin } from 'api';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import { TERMS_AND_CONDITIONS_URL } from 'utils/constants';
import styles from './styles';
import OtpInput from './otpInput';

const OtpNumberForm = ({
  navigation,
  loading,
  formError,
  showChangeNumber,
  showTermsAndConditions,
  handleSubmit,
  handleChangeNumber,
  userPhoneNumber,
}) => {
  const OTP_TIMEOUT_SEC = 15;

  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const [enableOTPResend, setEnableOTPResend] = useState(false);
  const [countdown, setCountdown] = useState(OTP_TIMEOUT_SEC);

  const [otpNumber1, setOtpNumber1] = useState('');
  const otpNumberRef1 = useRef(null);

  const [otpNumber2, setOtpNumber2] = useState('');
  const otpNumberRef2 = useRef(null);

  const [otpNumber3, setOtpNumber3] = useState('');
  const otpNumberRef3 = useRef(null);

  const [otpNumber4, setOtpNumber4] = useState('');
  const otpNumberRef4 = useRef(null);

  const resendOTP = async () => {
    setEnableOTPResend(false);
    setOtpNumber1('');
    setOtpNumber2('');
    setOtpNumber3('');
    setOtpNumber4('');
    await sendOTPForLogin({ userPhoneNumber, email: null, resend: true });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => navigation.navigate('ChoosePhoneNumberForm'));
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

  const submit = (lastNumber) => {
    const otpNumber = otpNumber1 + otpNumber2 + otpNumber3 + (otpNumber4 || lastNumber);
    if (otpNumber.length === 4) {
      handleSubmit(otpNumber);
    }
  };

  const setOTPValues = (code) => {
    if (code.length === 4) {
      setOtpNumber1(code[0]);
      setOtpNumber2(code[1]);
      setOtpNumber3(code[2]);
      setOtpNumber4(code[3]);
      otpNumberRef4.current.focus();
      handleSubmit(code);
    }
    if (code.length === 1) {
      setOtpNumber1(code[0]);
      otpNumberRef2.current.focus();
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('common.enterOTP')}
        </Text>
        <Text style={[commonStyles.subTextColor, styles.descriptionText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {`${t('common.verifySubHeader')} `}
          <Text style={{ color: '#1A0826' }}>{isRTL ? phoneNumberFlipPlusSign(userPhoneNumber) : userPhoneNumber}</Text>
        </Text>
      </View>

      <View style={{ marginHorizontal: 18, marginTop: 12, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row' }}>
            <OtpInput
              otpInputRef={otpNumberRef1}
              nextInputRef={null}
              value={otpNumber1}
              setValue={setOTPValues}
              maxLength={4}
              handleSubmit={() => { }}
              prevOtpInputRef={null}
              setPrevValue={null}
            />

            <OtpInput
              otpInputRef={otpNumberRef2}
              nextInputRef={otpNumberRef3}
              value={otpNumber2}
              setValue={setOtpNumber2}
              handleSubmit={() => { }}
              prevOtpInputRef={otpNumberRef1}
              setPrevValue={setOtpNumber1}
            />

            <OtpInput
              otpInputRef={otpNumberRef3}
              nextInputRef={otpNumberRef4}
              value={otpNumber3}
              setValue={setOtpNumber3}
              handleSubmit={() => { }}
              prevOtpInputRef={otpNumberRef2}
              setPrevValue={setOtpNumber2}
            />

            <OtpInput
              otpInputRef={otpNumberRef4}
              nextInputRef={null}
              value={otpNumber4}
              setValue={setOtpNumber4}
              handleSubmit={submit}
              prevOtpInputRef={otpNumberRef3}
              setPrevValue={setOtpNumber3}
            />
          </View>

          <Button
            size="small"
            onPress={() => {
              resendOTP();
            }}
            disabled={!enableOTPResend}
            appearance="ghost"
            status="resendOTP"
          >
            {(evaProps) => (
              <>
                {enableOTPResend ? (
                  <Text {...evaProps}>{t('common.resendOTP')}</Text>
                ) : (
                  <>
                    <Text {...evaProps}>{t('common.resendOTPCountDown', { seconds: countdown })}</Text>
                  </>
                )}
              </>
            )}
          </Button>
        </View>
        {/* keep the condition as is */}
        <Text status="danger" style={[styles.caption, { textAlign: isRTL ? 'right' : 'left' }]} category="p1">
          {formError && t('errors.otpIncorrect')}
        </Text>
      </View>

      {showChangeNumber ? (
        <View style={[styles.acceptTermsAndConditions, { marginTop: 0, marginBottom: 32 }]}>
          <Text
            onPress={handleChangeNumber}
            style={{
              color: '#1A0826',
              fontSize: 12,
              fontWeight: '400',
              lineHeight: 15,
              textDecorationLine: 'underline',
            }}
          >
            {t('common.changeNumber')}
          </Text>
        </View>
      ) : <></>}

      <Button
        style={styles.signInButton}
        onPress={() => submit(otpNumber4)}
        size="large"
        disabled={!otpNumber1 || !otpNumber2 || !otpNumber3 || !otpNumber4 || loading}
        accessoryLeft={() => (loading ? <Spinner status="control" size="small" /> : null)}
      >
        {(evaProps) => (
          <Text {...evaProps} category="p1">
            {t(`common.${!otpNumber1 || !otpNumber2 || !otpNumber3 || !otpNumber4 || loading ? 'verify' : 'verifying'}`)}
          </Text>
        )}
      </Button>

      {showTermsAndConditions ? (
        <View style={styles.acceptTermsAndConditions}>
          <Text style={{
            color: '#717171',
            fontWeight: '300',
            fontSize: 12,
            lineHeight: 35,
            textAlign: isRTL ? 'right' : 'left',
          }}
          >
            {t('common.agreeToTerms')}
            {' '}
            <Text
              onPress={() => WebBrowser.openBrowserAsync(`${TERMS_AND_CONDITIONS_URL}?lang=${currLang}`)}
              style={{ color: '#353535', fontSize: 13 }}
            >
              {t('common.termsAndConditions')}
            </Text>
          </Text>
        </View>
      ) : <></>}
    </View>
  );
};

OtpNumberForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  formError: PropTypes.bool,
  showChangeNumber: PropTypes.bool,
  showTermsAndConditions: PropTypes.bool,
  handleChangeNumber: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  userPhoneNumber: PropTypes.string.isRequired,
};

OtpNumberForm.defaultProps = {
  navigation: null,
  loading: false,
  formError: false,
  showChangeNumber: false,
  showTermsAndConditions: false,
  handleChangeNumber: () => { },
};

export default OtpNumberForm;
