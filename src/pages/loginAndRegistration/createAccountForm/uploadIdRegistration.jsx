/* eslint-disable max-len */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { View, Image, Linking, TouchableOpacity, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import theme from 'themes/light/theme.json';
import {
  Button,
  Layout,
  Text,
  Spinner,
  CheckBox,
  Divider,
} from '@ui-kitten/components';
import Constants from 'expo-constants';
import {
  FRONT_COUNTRIES,
  NFC_ENROLLMENT_ERRORS,
  NFC_ENROLLMENT_RISK_ERRORS,
  BACK_COUNTRIES,
  LANGUAGES_TEXT,
} from 'utils/constants';
import { t } from 'services/i18n';
import handleLogEvent from 'utils/handleLogEvent';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import {
  AccordionList,
} from 'accordion-collapse-react-native';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import { changeLanguage } from 'reducers/language';
import { getNfcHardwareStatus } from 'reducers/nfcId';
import { resolveHasIdentitiesAndExpired } from 'reducers/application';
import { handleNfcScan } from 'utils/uqudo';
import snakeToCamel from 'utils/snakeToCamel';
import commonStyles from 'utils/commonStyles';
import UploadId from 'pages/account/modals/uploadId';
import idAsset from 'assets/gamifiedID.png';
import PrimarySpotiiZipLogo from 'assets/primarySpotiiZipLogo';
import styles from './styles';

const UploadIdRegistration = ({ route, navigation }) => {
  const { password } = route.params || {};
  const dispatch = useDispatch();
  const [uploadEmId, setUploadEmId] = useState(false);
  const [identitiesLoader, setIdentitiesLoader] = useState(false);
  const [idSide, setIdSide] = useState(null);
  const currLang = useSelector(state => state.language.language);
  const {
    nfcHardwareStatusResolved,
    nfcSupported,
    nfcScanBlocked,
  } = useSelector(state => state.nfcId);
  const appState = useSelector(state => state.application);
  const { currentUser } = appState;
  const { phoneNumber, userId } = currentUser;
  const registration = useSelector(state => state.registration);
  const [currSessionPhoneNumber, setCurrentSessionPhoneNumber] = useState(phoneNumber);
  const [userCountry, setUserCountry] = useState('');
  const [nfcEnrollmentLoading, setNfcEnrollmentLoading] = useState(false);
  const [nfcErrorMessage, setNfcErrorMessage] = useState(null);
  const [nfcUqudoFailed, setNfcUqudoFailed] = useState(false);
  const [userCancelUqudo, setUserCancelUqudo] = useState(0);
  const [sesssionExpiredUqudo, setSesssionExpiredUqudo] = useState(0);

  const isRTL = currLang === 'ar';

  const handleUploadPress = () => {
    setIdentitiesLoader(true);
    setUploadEmId(true);
  };

  const handleNfcEnrollment = async () => {
    setNfcEnrollmentLoading(true);
    const resp = await handleNfcScan(userId);

    if (!resp.success) {
      let message = t('errors.somethingWrongContactSupport');
      if (resp.error && Object.values(NFC_ENROLLMENT_ERRORS).includes(resp.error)) {
        message = t(`errors.${snakeToCamel(resp.error)}NfcError`);

        if (resp.error === NFC_ENROLLMENT_ERRORS.USER_CANCEL && userCancelUqudo < 2) {
          setUserCancelUqudo(userCancelUqudo + 1);
        } else if (resp.error === NFC_ENROLLMENT_ERRORS.SESSION_EXPIRED && sesssionExpiredUqudo < 2) {
          setSesssionExpiredUqudo(sesssionExpiredUqudo + 1);
        } else {
          showMessage({
            message: t('errors.nfcFailedRedirectNid'),
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
          setNfcUqudoFailed(true);
        }
      } if (resp.error && Object.values(NFC_ENROLLMENT_RISK_ERRORS).includes(resp.error)) {
        message = (
          <Text style={styles.scannerDisclaimer}>
            {`${t('common.blockedMobEmlDesc')} `}
            <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
      }
      setNfcErrorMessage(message);
      setNfcEnrollmentLoading(false);
    } else {
      dispatch(resolveHasIdentitiesAndExpired(true));
      setNfcEnrollmentLoading(false);
      navigation.navigate('Welcome', { password });
    }
  };

  useEffect(() => {
    if (registration.phoneNumber && phoneNumber !== registration.phoneNumber) {
      setCurrentSessionPhoneNumber(registration.phoneNumber);
    } else {
      setCurrentSessionPhoneNumber(phoneNumber);
    }
  }, [phoneNumber, registration.phoneNumber]);

  useEffect(() => {
    if (currSessionPhoneNumber) {
      const country = alpha3FromISDPhoneNumber(currSessionPhoneNumber);
      setUserCountry(country);
      const showBack = BACK_COUNTRIES.includes(country);
      setIdSide(showBack ? 'back' : 'front');
    }
  }, [currSessionPhoneNumber]);

  useEffect(() => {
    if (userCountry === 'UAE' && !nfcHardwareStatusResolved) {
      dispatch(getNfcHardwareStatus(userCountry));
    }
  }, [userCountry, nfcHardwareStatusResolved]);

  useEffect(() => {
    const trigger = async () => {
      await handleLogEvent('SpotiiMobileOTPSuccess', {
        email: currentUser.email,
      });
    };

    if (currentUser.email) {
      trigger();
    }
  }, [currentUser.email]);

  const renderNFC = () => {
    if (nfcEnrollmentLoading) {
      return (
        <View style={styles.loaderContainer}>
          <Spinner size="giant" />
        </View>
      );
    }

    return (
      <View style={styles.nfcContainer}>
        {nfcErrorMessage || nfcScanBlocked ? (
          <>
            <Text category="h4" style={styles.text}>{t('common.nfcScanRequired')}</Text>
            <Text style={styles.text}>
              {nfcErrorMessage || t('errors.somethingWrongContactSupport')}
            </Text>
          </>
        ) : (
          <>
            <Text category="h4" style={styles.text}>{t('common.nfcScanRequired')}</Text>
            <Text style={styles.text}>
              {t('common.nfcScanRequiredRegistrationDesc')}
            </Text>

          </>
        )}
        <View style={styles.bottomActions}>
          {nfcScanBlocked
            ? (
              <Button
                style={styles.nfcScanButton}
                onPress={() => navigation.navigate('Welcome', { password })}
                size="large"
              >
                {t('common.continue')}
              </Button>
            )
            : (
              <Button
                style={styles.nfcScanButton}
                onPress={handleNfcEnrollment}
                size="large"
              >
                {t('common.startScan')}
              </Button>
            ) }
        </View>
      </View>
    );
  };

  const renderDefaultIdUpload = () => (
    <>
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
        <View style={[styles.logoContainer, { marginBottom: 20 }]}>
          <PrimarySpotiiZipLogo />
        </View>
        <View style={{ paddingTop: Constants.statusBarHeight }}>
          <View style={styles.header}>
            <Text style={[styles.text, { textAlign: isRTL ? 'right' : 'left', marginBottom: 5, fontWeight: '400', fontSize: 28 }]}>{t('common.identityVerification')}</Text>
            <Text style={[styles.text, { textAlign: isRTL ? 'right' : 'left', marginTop: '1%', color: '#717171' }]} category="h6">
              <Text style={{ color: '#717171' }}>
                {t('common.idTextUpload1')}
                {' '}
                <Text category="s1">{t(`common.${FRONT_COUNTRIES.includes(userCountry) ? 'frontSide' : 'backSide'}`)}</Text>
                {' '}
                {t('common.idTextUpload2')}
                {' '}
                <Text category="s1">{`${t(`common.idText${userCountry}`)}. `}</Text>
                {FRONT_COUNTRIES.includes(userCountry) ? t('common.notStoredIDText') : t('common.storedIDText')}
              </Text>
            </Text>
          </View>
          <View style={styles.idAssetContainer}>
            <Image
              source={idAsset}
            />
          </View>
        </View>
        <View style={[styles.bottomActions, styles.accordionContainer, { marginTop: 20 }]}>
          <Button
            size="large"
            onPress={() => handleUploadPress()}
            style={styles.uploadButton}
            accessoryRight={props => (
              Icon({
                ...props, ...styles.uploadIcon,
              }, 'upload-outline')
            )}
            accessoryLeft={() => (identitiesLoader ? <Spinner status="basic" size="tiny" /> : null)}
          >
            {evaProps => <Text {...evaProps}>{t('common.picOrUpload')}</Text>}
          </Button>
        </View>
        <View style={styles.centerContainer}>
          <AccordionList
            style={styles.accordion}
            list={[{ title: t('common.idTipsTitle') }]}
            header={(item, index, isExpanded) => (
              <Text style={styles.accordionHeaderTextIconContainer}>
                <Text
                  style={styles.tipsHeaderText}
                  category="p1"
                >
                  {t('common.idTipsTitle')}
                </Text>
              </Text>

            )}
            body={() => (
              <View>
                <Divider />
                <View style={styles.accordionBodyList}>
                  <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                    <Text style={[{ fontSize: 12 }, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} category="p1">{`* ${t('common.idUploadTip1')}`}</Text>
                  </View>
                  <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                    <Text style={[{ fontSize: 12 }, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} category="p1">{`* ${t('common.idUploadTip2')}`}</Text>
                  </View>
                  <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                    <Text style={[{ fontSize: 12 }, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} category="p1">{`* ${t('common.idUploadTip3')}`}</Text>
                  </View>
                  <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                    <Text style={[{ fontSize: 12 }, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} category="p1">{`* ${t('common.idUploadTip4')}`}</Text>
                  </View>
                  <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                    <Text style={[{ fontSize: 12 }, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} category="p1">{`* ${t('common.idUploadTip5')}`}</Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => `${item.id}`}
          />
        </View>
        <UploadId
          visible={uploadEmId}
          setVisible={setUploadEmId}
          setIdentitiesLoader={setIdentitiesLoader}
          hasFormCheck={false}
          side={idSide}
          customNavigation={navigation}
          password={password}
        />
      </View>
    </>
  );
  return (
    <Layout
      style={styles.form}
      level="1"
    >
      <KeyboardAvoidingView>
        {userCountry === 'UAE' && nfcSupported && !nfcUqudoFailed ? renderNFC() : renderDefaultIdUpload()}
      </KeyboardAvoidingView>
    </Layout>
  );
};

UploadIdRegistration.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      password: PropTypes.string,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

UploadIdRegistration.defaultProps = {
  route: null,
  navigation: null,
};

export default UploadIdRegistration;
