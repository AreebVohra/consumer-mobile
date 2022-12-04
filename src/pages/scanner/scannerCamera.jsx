/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, StatusBar } from 'react-native';
import { setScanData, setCurrentDraftStatus, reset, requestMerchantInfo } from 'reducers/scanner';
import { resolveHasIdentitiesAndExpired, retrieveConsumerScore } from 'reducers/application';
import {
  DRAFT_STATUS_PENDING_MERCHANT,
  BLOCKING_CODES,
  COUNTRIES,
  NFC_ENROLLMENT_ERRORS,
  NFC_ENROLLMENT_RISK_ERRORS,
  BACK_COUNTRIES,
} from 'utils/constants';

import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import { handleNfcScan } from 'utils/uqudo';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import snakeToCamel from 'utils/snakeToCamel';
import commonStyles from 'utils/commonStyles';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import UploadId from 'pages/account/modals/uploadId';
import * as Linking from 'expo-linking';

import {
  Layout,
  Text,
  Spinner,
  Card,
  Button,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useSelector, useDispatch } from 'react-redux';
import { setScreen } from 'utils/handleLogEvent';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';

import 'moment/locale/ar';
import PropTypes from 'prop-types';
import genericIDAsset from 'assets/nationalIdImage.png';
import idAsset from 'assets/gamifiedID.png';
import styles from './styles';

import { resetScanner } from '../../../reducers/scanner';

const ScannerCamera = ({ navigation }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { nfcSupported } = useSelector(state => state.nfcId);

  const { isScanned, merchantScanData, isMerchantInfoPosted, merchantInfo } = useSelector(state => state.scanner);
  const { currentUserScore, currentUser } = useSelector(state => state.application);
  const {
    phoneNumber,
    userId,
    hasIdentitiesUploaded,
    isIdExpired,
  } = currentUser;
  const { reason } = currentUserScore;
  const [hasPermission, setHasPermission] = useState(null);
  // do not remove currLang even if not used
  const currLang = useSelector(state => state.language.language);
  const [nfcEnrollmentLoading, setNfcEnrollmentLoading] = useState(false);
  const [hideNfcSubmitButton, setHideNfcSubmitButton] = useState(false);
  const [nfcErrorMessage, setNfcErrorMessage] = useState(null);
  const [shortDynamicLink, setShortDynamicLink] = useState('');
  const [identitiesLoader, setIdentitiesLoader] = useState(false);
  const [uploadEmId, setUploadEmId] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [nfcUqudoFailed, setNfcUqudoFailed] = useState(false);
  const [userCancelUqudo, setUserCancelUqudo] = useState(0);
  const [sesssionExpiredUqudo, setSesssionExpiredUqudo] = useState(0);
  const country = alpha3FromISDPhoneNumber(phoneNumber);
  const showBack = BACK_COUNTRIES.includes(country);

  const backAction = () => {
    dispatch(reset());
    setScanCompleted(false);
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    dispatch(resetScanner());
  }, []);

  useEffect(() => {
    if (merchantScanData && merchantScanData.id) {
      dispatch(requestMerchantInfo(merchantScanData.id));
    }
  }, [merchantScanData]);

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
        setHideNfcSubmitButton(true);
      }
      setNfcErrorMessage(message);
      setNfcEnrollmentLoading(false);
    } else {
      showMessage({
        message: t('success.nfcScanSuccess'),
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
      dispatch(resolveHasIdentitiesAndExpired(true));
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    if (scanCompleted && (hasIdentitiesUploaded || !isIdExpired)) {
      navigation.navigate('PaymentForm');
    }
  }, [hasIdentitiesUploaded, isIdExpired]);

  useEffect(() => {
    if (!reason && hasPermission === null) {
      requestCameraPermission();
    }
  }, [hasPermission]);

  useEffect(() => {
    if (isFocused) {
      setScreen('InStore');
    }
  }, [isFocused]);

  useEffect(async () => {
    // handle the payment link qr code scanning, which is a shortened firebase dynamic link
    if (shortDynamicLink) {
      const link = await dynamicLinks().resolveLink(shortDynamicLink);

      const { queryParams } = Linking.parse(link.url);

      if (queryParams.tag === 'spotii-payment-link-qr') {
        const scanData = {
          tag: queryParams.tag,
          id: queryParams.id,
          userId: queryParams.userId,
          employeeName: queryParams.employeeName,
          // currency: queryParams.currency,
          // amount: queryParams.amount,
          checkoutToken: queryParams.token,
        };
        dispatch(setScanData({ scanData }));
        navigation.navigate('DeepLinkPaymentForm');
      }
      // TODO: add other dynamic link tag cases here
    }
  }, [shortDynamicLink]);

  const showScanError = () => {
    showMessage({
      message: t('errors.qrCodeInvalidDesc'),
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
  };

  const handleBarCodeScanned = ({ type, data }) => {
    let dataObject = {};

    // dataObject includes tag, id, currency, address, employeeId, employeeName in case of spotii-merchant-qr
    // in case of spotii-page.link, it is a shortened firebase dynamic link, we need to resolve it to get the long url which has the required query params
    if (data.includes('spotii-merchant-qr')) {
      try {
        dataObject = JSON.parse(data);

        dispatch(setScanData({ scanData: dataObject }));
        dispatch(setCurrentDraftStatus(DRAFT_STATUS_PENDING_MERCHANT));
        if (!hasIdentitiesUploaded || isIdExpired) {
          setScanCompleted(true);
        } else {
          navigation.navigate('PaymentForm');
        }
      } catch (e) {
        console.error('QR parse error', e);
        showScanError();
      }
    } else if (data.includes('spotii.page.link')) {
      setShortDynamicLink(data);
    } else {
      console.error('The tag in qr has to be either spotii-merchant-qr or spotii-payment-link-qr');
      showScanError();
    }
  };

  const getBlockingCodeMessage = () => {
    switch (reason) {
      case BLOCKING_CODES.SAL_RQD:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.verificationRequired')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedSalReqDescAlt')} ${country === COUNTRIES.UAE ? t('common.blockedSalReqDescBUAE') : country === COUNTRIES.SAU ? t('common.blockedSalReqDescBSAU') : t('common.blockedSalReqDescB')}\n\n${t('common.pleaseAllow48HrsAndMakeSureRecent')}`}
            </Text>
          </>
        );
      case BLOCKING_CODES.SAL_PRG:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.validationPending')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedSalPrgDesc')} ${country === COUNTRIES.UAE ? t('common.blockedSalPrgDescBUAE') : country === COUNTRIES.SAU ? t('common.blockedSalPrgDescBSAU') : ''}\n\n${t('common.pleaseAllow48Hrs')}`}
            </Text>
          </>
        );
      case BLOCKING_CODES.SAL_REJ:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.salaryRejected')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedSalRejDesc')} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          </>
        );
      case BLOCKING_CODES.MOB_CRD:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.unusualDetails')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedMobCrdDesc')} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          </>
        );
      case BLOCKING_CODES.MOB_EML:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.unusualDetails')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedMobEmlDesc')} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          </>
        );
      case BLOCKING_CODES.DEF:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.unpaidInstallments')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedDefLtrDesc')} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          </>
        );
      case BLOCKING_CODES.BLK:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.accountSuspended')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedBlkLstDesc')} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          </>
        );
      case BLOCKING_CODES.MOB_ERR:
      default:
        return (
          <>
            <Text category="h4" style={styles.scannerDisclaimerHeader}>{t('common.unusualDetails')}</Text>
            <Text style={styles.scannerDisclaimer}>
              {`${t('common.blockedDefaultDesc')} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          </>
        );
    }
  };

  const renderIDUpload = () => (
    <Card style={styles.card}>
      <UploadId visible={uploadEmId} setVisible={setUploadEmId} setIdentitiesLoader={setIdentitiesLoader} side={showBack ? 'back' : 'front'} />
      <View style={styles.scannerCameraIdUploadView}>
        <Text style={styles.idUploadHeader}>
          {isIdExpired && hasIdentitiesUploaded ? t('common.nationalIdExpired') : t('common.identityVerification')}
        </Text>
        <Text style={styles.idTextContainer}>
          <Text style={styles.subText}>
            {t('common.idTextUpload1')}
            {' '}
            <Text category="s1">{t(`common.${!showBack ? 'frontSide' : 'backSide'}`)}</Text>
            {' '}
            {t('common.idTextUpload2')}
            {' '}
            <Text category="s1">{`${t(`common.idText${country}`)}. `}</Text>
          </Text>
        </Text>
        <View style={styles.idAssetContainer}>
          <Image
            source={country !== 'UAE' ? genericIDAsset : idAsset}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button
            style={styles.idUploadButton}
            onPress={() => {
              setUploadEmId(true);
              setIdentitiesLoader(true);
            }}
            disabled={identitiesLoader}
            accessoryRight={() => (identitiesLoader ? <Spinner status="basic" size="tiny" /> : <></>)}
            size="small"
          >
            <Text category="s1" style={styles.subTextWhite}>{t('common.upload')}</Text>
            {' '}
            <Text category="s1" style={styles.subTextWhite}>{`${t(`common.idText${country}`)}`}</Text>
            {' '}
            <Text category="s1" style={styles.subTextWhite}>{`(${t(`common.${!showBack ? 'frontSide' : 'backSide'}`)})`}</Text>
          </Button>
        </View>
      </View>
    </Card>
  );

  const renderNFC = () => {
    if (nfcEnrollmentLoading) {
      return (
        <Card style={styles.card}>
          <View style={styles.scannerCameraMessageView}>
            <Spinner size="giant" />
          </View>
        </Card>
      );
    }

    return (
      <Card style={styles.card}>
        <View style={styles.scannerCameraMessageView}>
          {nfcErrorMessage ? (
            <>
              <Text style={styles.scannerDisclaimer}>
                {nfcErrorMessage}
              </Text>
            </>
          ) : (
            <>
              <Text category="h4" style={styles.scannerDisclaimerHeader}>{ t('common.nfcScanRequired')}</Text>
              <Text style={styles.scannerDisclaimer}>
                {t('common.nfcScanRequiredDesc')}
              </Text>

            </>
          )}
          {hideNfcSubmitButton
            ? <></>
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
      </Card>
    );
  };

  const getIDUploadStatus = () => {
    return phoneNumber && phoneNumber.substring(0, 4) === '+971' && nfcSupported && merchantInfo.requires_nfc && !nfcUqudoFailed ? <>{renderNFC()}</> : <>{renderIDUpload()}</>;
  };

  const renderScanner = () => {
    if (reason) {
      return (
        <Card style={styles.card}>
          <View style={styles.scannerCameraMessageView}>
            {getBlockingCodeMessage()}
          </View>
        </Card>
      );
    }

    if (scanCompleted && (!hasIdentitiesUploaded || isIdExpired)) {
      if (isMerchantInfoPosted) {
        return getIDUploadStatus();
      } else {
        return (
          <Card style={styles.card}>
            <View style={styles.scannerCameraMessageView}>
              <Spinner size="giant" />
            </View>
          </Card>
        );
      }
    }

    if (hasPermission === null) {
      return (
        <Card style={styles.card}>
          <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Text category="h6" style={{ textAlign: 'center' }}>{t('errors.requestingCameraPermission')}</Text>
            <Text category="h6" style={{ textAlign: 'center', marginTop: '2%' }} appearance="hint">{t('errors.pleaseAllowCameraAccess')}</Text>
            <View style={{ marginTop: '4%' }}>
              <Spinner />
            </View>
          </View>
        </Card>
      );
    }

    if (hasPermission === false) {
      return (
        <Card style={styles.card}>

          <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Text category="h6" style={{ textAlign: 'center' }}>{t('common.mustAllowCameraAccess')}</Text>
            <Text category="h6" style={{ textAlign: 'center', marginTop: '2%' }} appearance="hint">{t('errors.pleaseAllowCameraAccess')}</Text>
            <Button onPress={() => requestCameraPermission()} style={{ marginTop: '4%' }}>{t('common.allow')}</Button>
          </View>
        </Card>
      );
    }

    if (isScanned || !isFocused) {
      return null;
    }

    return (
      <View
        style={styles.scannerView}
      >

        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={[StyleSheet.absoluteFill, styles.scannerContainer]}
        >
          <View style={styles.layerTop}>
            <Text category="h6" style={{ color: 'white', textAlign: 'center' }}>{t('common.toCompletePleaseScan')}</Text>
          </View>
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerBottom} />
        </BarCodeScanner>

      </View>
    );
  };

  return (
    <>
      <Layout style={styles.scannerLayout} level="2">
        <KeyboardAvoidingView>
          {renderScanner()}
        </KeyboardAvoidingView>
      </Layout>
    </>
  );
};

ScannerCamera.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

ScannerCamera.defaultProps = {
  navigation: null,
};

export default ScannerCamera;
