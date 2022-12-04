import React, { useEffect, useState } from 'react';
import { View, BackHandler, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Text } from '@ui-kitten/components';
import { LANGUAGES_TEXT, BACK_COUNTRIES } from 'utils/constants';
import { changeLanguage } from 'reducers/language';
import PrimarySpotiiZipLogo from 'assets/primarySpotiiZipLogo';
import { successFinalization, loginWithCreatedUser } from 'reducers/registration';
import OtpNumberForm from 'components/OtpNumberForm';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import PropTypes from 'prop-types';
import authApi from 'api/auth';
import styles from './styles';

const SmartechSDK = require('smartech-reactnative-module');

const Verify = ({ route, navigation }) => {
  const { password } = route.params || '';
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.application);
  const { email, phoneNumber } = useSelector((state) => state.registration);

  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const handleSubmit = async (otpNumber) => {
    setLoading(true);
    await authApi
      .registrationVerification(otpNumber)
      .then(async res => {
        await dispatch(loginWithCreatedUser(res));
        const country = alpha3FromISDPhoneNumber(phoneNumber);
        if (country === BACK_COUNTRIES[0]) {
          SmartechSDK.setUserIdentity(email);
        }
        setLoading(false);
        setFormError(false);
        dispatch(successFinalization());
        navigation.navigate('UploadId', { password });
      }).catch(err => {
        setFormError(true);
        setLoading(false);
      });
  };

  const handleChangeNumber = () => {
    navigation.navigate('PersonalProfile', { password });
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

          <View style={styles.form}>
            <OtpNumberForm
              navigation={navigation}
              handleSubmit={handleSubmit}
              loading={loading}
              formError={formError}
              showChangeNumber
              handleChangeNumber={handleChangeNumber}
              showTermsAndConditions={false}
              userPhoneNumber={phoneNumber}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

Verify.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      password: PropTypes.string,
    }),
  }),
};

Verify.defaultProps = {
  navigation: null,
  route: null,
};

export default Verify;
