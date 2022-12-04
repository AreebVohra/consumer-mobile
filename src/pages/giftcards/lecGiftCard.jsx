/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import { View, ImageBackground, Linking, Image, StatusBar } from 'react-native';
import { Divider } from 'react-native-elements';
import { t } from 'services/i18n';
import {
  Card,
  Button,
  Text,
  Spinner,
  Layout,
  Modal,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/core';
import { Slider } from '@miblanchard/react-native-slider';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { handleNfcScan } from 'utils/uqudo';
import { setScreen } from 'utils/handleLogEvent';
import { resolveHasIdentitiesAndExpired } from 'reducers/application';
import { reset } from 'reducers/checkout';
import { showMessage } from 'react-native-flash-message';
import snakeToCamel from 'utils/snakeToCamel';
import UploadId from 'pages/account/modals/uploadId';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import genericIDAsset from 'assets/nationalIdImage.png';
import idAsset from 'assets/gamifiedID.png';
import styles from './styles';
import QuestionMark from '../../../assets/questionMark';
import LocationMark from '../../../assets/locationMark';
import { createGiftCardCheckout, retrieveInitConsumerSpendLimit } from '../../../reducers/application';
import {
  BLOCKING_CODES, NFC_ENROLLMENT_ERRORS, NFC_ENROLLMENT_RISK_ERRORS, SCORE_DATA_VERIFIED, BACK_COUNTRIES, MAF_ASSETS, LEC_BANNER, GIFT_CARDS,
} from '../../../utils/constants';
import HowToQualify from '../../components/HowToQualify';
import WhereItWorks from './whereItWorks';

const LecGiftCard = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const {
    currentUser, giftCardCheckout: { checkoutUrl, isResolved },
    currentUserScore, isConsumerMerchantSpendLimitLecResolved, isMAFQualifiedLoading,
    shouldApplyDiscount, discountValidity, consumerMinimumSpendLimit,
  } = useSelector(state => state.application);
  const { nfcSupported } = useSelector((state) => state.nfcId);
  const nextPayments = useSelector(state => state.nextPayments);

  const {
    uploadedSalaryStatus, uploadedSalaryCert,
    consumerMerchantSpendLimit, giftCardStepCount,
    lean, mobileLimit, merchantSpendLimitLecReason, requiresNfcMAF,
  } = currentUserScore || {};
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [gcValue, setGcValue] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHIW, setShowHIW] = useState(false);
  const [error, setError] = useState(false);
  const [nfcErrorMessage, setNfcErrorMessage] = useState(null);
  const [nfcEnrollmentLoading, setNfcEnrollmentLoading] = useState(false);
  const [hideNfcSubmitButton, setHideNfcSubmitButton] = useState(false);
  const [preloadedNfc, setPreloadedNfc] = useState(false);
  const [startNFCFlow, setStartNFCFlow] = useState(false);
  const [leanIsLinked, setLeanIsLinked] = useState(false);
  const [identitiesLoader, setIdentitiesLoader] = useState(false);
  const [uploadEmId, setUploadEmId] = useState(false);
  const [nfcUqudoFailed, setNfcUqudoFailed] = useState(false);
  const [userCancelUqudo, setUserCancelUqudo] = useState(0);
  const [sesssionExpiredUqudo, setSesssionExpiredUqudo] = useState(0);

  const country = alpha3FromISDPhoneNumber(currentUser.phoneNumber);
  const showBack = BACK_COUNTRIES.includes(country);

  const uaeCustomer = currentUser && (currentUser.phoneNumber || '').includes('+971');
  const isRTL = currLang === 'ar';

  const bgImage = { uri: LEC_BANNER };

  const whereItWorksBottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '90%'], []);

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    setLeanIsLinked(lean && lean.entities && lean.entities.length);
  }, [lean]);

  useEffect(() => {
    if (consumerMerchantSpendLimit) {
      setGcValue(Math.min(1000, consumerMerchantSpendLimit));
    }
  }, [consumerMerchantSpendLimit]);

  useEffect(() => {
    if (isFocused) {
      setScreen('LecGiftCard');
      dispatch(retrieveInitConsumerSpendLimit(GIFT_CARDS.LEC));
    }
  }, [isFocused]);

  useEffect(() => {
    if ((!currentUser.hasIdentitiesUploaded || currentUser.isIdExpired) && isConsumerMerchantSpendLimitLecResolved && consumerMerchantSpendLimit >= consumerMinimumSpendLimit) {
      if (nfcSupported && requiresNfcMAF && !preloadedNfc) {
        handleNfcEnrollment();
        setPreloadedNfc(true);
        setStartNFCFlow(false);
      } else {
        setStartNFCFlow(true);
      }
    }
  }, [
    nfcSupported, consumerMerchantSpendLimit, isConsumerMerchantSpendLimitLecResolved, startNFCFlow,
  ]);

  useEffect(() => {
    if (checkoutUrl && isSubmitting) {
      setError(false);
      setIsSubmitting(false);
      navigation.navigate('DeepLinkPaymentForm');
    }
  }, [checkoutUrl, isSubmitting]);

  useEffect(() => {
    if (isResolved && !checkoutUrl) {
      setError(true);
      setIsSubmitting(false);
    }
  }, [isResolved]);

  const startGcCheckout = () => {
    const checkoutData = {
      total: parseFloat(gcValue),
      gc_type: GIFT_CARDS.LEC,
    };
    setIsSubmitting(true);
    dispatch(createGiftCardCheckout(checkoutData));
  };

  const gcHowItWorks = () => (
    <Modal
      visible={showHIW}
      onBackdropPress={() => setShowHIW(false)}
      backdropStyle={styles.backdrop}
      style={styles.modal}
    >
      <KeyboardAvoidingView>

        <Layout style={{ borderRadius: 25 }} level="2">
          <View style={{ padding: 15 }}>
            <Text category="h6" style={[{ textAlign: isRTL ? 'right' : 'left' }]}>{t('common.howGcWorks')}</Text>
            <View style={[styles.rowFlex, styles.marginTop3]}>
              <View style={[styles.columnFlex, styles.marginTop1]}>

                {[1, 2, 3, 4].map(i => (
                  <View style={[styles.howItWorksRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={styles.roundedNumber}>
                      <Text style={[styles.infoText, styles.centerAlign]}>{i}</Text>
                    </View>
                    <View style={[styles.marginLeft2, styles.marginTop1, styles.maxWidth90, styles.paddingHorizontal5]}><Text style={{ textAlign: isRTL ? 'right' : 'left' }}>{t(`common.howLecWorks${i}`)}</Text></View>
                  </View>
                ))}
                <Text style={[styles.margin2, styles.mediumSubText, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('common.howGCWorksNote')}
                </Text>
              </View>
            </View>
          </View>
        </Layout>
      </KeyboardAvoidingView>

    </Modal>
  );

  const gcHero = () => (
    <View style={[styles.fullWidth]}>
      <>
        <ImageBackground
          style={{
            flex: 1,
            width: '100%',
            height: 180,
            resizeMode: 'contain',
          }}
          source={bgImage}
        />
      </>
    </View>
  );

  const gcGiftCard = () => (
    <View style={styles.margin3}>
      <View style={[styles.columnFlex]}>
        {shouldApplyDiscount && (
          <>
            <Text style={[styles.centerAlign, styles.greenBoldText]}>
              {t('common.gcLimitedTimeOffer')}
            </Text>
            <Text style={[styles.centerAlign, styles.greenRegularText, styles.marginTop2]}>
              {t('common.gcOfferAvailableFor', { days: discountValidity })}
            </Text>
          </>
        )}
        <View style={[styles.rowFlex, styles.alignItemsCenter, styles.justifySpaceBtw, styles.fullWidth, styles.marginTop2]}>
          <View style={[styles.columnFlex, styles.allCenter, styles.width95, styles.marginTop2]}>
            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '400', lineHeight: 15, color: '#717171', marginBottom: 8 }}>
              {t('common.lecGiftCardValue')}
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 28, fontWeight: '400', lineHeight: 35, color: '#1A0826' }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#1A0826' }}>AED</Text>
              {` ${gcValue}.00`}
            </Text>
          </View>
        </View>
      </View>
      <Divider orientation="horizontal" color="#EDE6FF" style={{ marginHorizontal: 13, marginTop: 8, marginBottom: 24, flexGrow: 0 }} width={1} />
      <View style={[styles.flex, styles.justifySpaceBtw, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.rowFlex, styles.alignItemsCenter]}>
          <QuestionMark />
          <Text
            onPress={setShowHIW}
            style={[{ marginBottom: 1, marginLeft: 5, fontSize: 12, fontWeight: '400', lineHeight: 15, color: '#411351', textDecorationLine: showHIW ? 'underline' : 'none' }]}
          >
            {t('common.howGcWorks')}
          </Text>
        </View>
        <View style={[styles.rowFlex, styles.alignItemsCenter]}>
          <LocationMark />
          <Text
            onPress={() => { whereItWorksBottomSheetRef.current.present(); }}
            // onPress={() => { navigation.navigate('WhereItWorks'); }}
            style={[{ marginBottom: 1, marginLeft: 5, fontSize: 12, fontWeight: '400', lineHeight: 15, color: '#411351' }]}
          >
            {t('common.whereGcWorks')}
          </Text>
        </View>
      </View>
    </View>
  );

  const gcSlider = () => {
    if (consumerMerchantSpendLimit && consumerMerchantSpendLimit === consumerMinimumSpendLimit) {
      return <></>;
    }
    return (
      <View style={styles.margin3}>
        <Slider
          containerStyle={styles.sliderContainer}
          trackStyle={styles.sliderTrack}
          minimumValue={consumerMinimumSpendLimit}
          maximumValue={consumerMerchantSpendLimit}
          minimumTrackTintColor="#AA8FFF"
          maximumTrackTintColor="#c6c7c2"
          thumbTintColor="#AA8FFF"
          step={giftCardStepCount}
          tapToSeek={false}
          value={gcValue}
          onSlidingComplete={setGcValue}
          onValueChange={setGcValue}
        />
        <View style={[styles.rowFlex, styles.justifySpaceBtw, styles.marginHorizontal15]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 20, color: '#353535' }}>AED</Text>
            <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 20, color: '#353535' }}>{`${consumerMinimumSpendLimit}.00`}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 20, color: '#353535' }}>AED</Text>
            <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 20, color: '#353535' }}>{`${consumerMerchantSpendLimit}.00`}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleNfcEnrollment = async () => {
    setNfcEnrollmentLoading(true);
    const resp = await handleNfcScan();

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
      }
      if (resp.error && Object.values(NFC_ENROLLMENT_RISK_ERRORS).includes(resp.error)) {
        message = (
          <Text style={styles.scannerDisclaimer}>
            {`${t('common.blockedMobEmlDesc')} `}
            <Text
              style={[commonStyles.link, { fontSize: 18 }]}
              category="p1"
              onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}
            >
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
        setHideNfcSubmitButton(true);
      }
      setNfcErrorMessage(message);
      dispatch(retrieveInitConsumerSpendLimit(GIFT_CARDS.LEC));
      setNfcEnrollmentLoading(false);
    } else {
      // handle great success here
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

  const renderNFC = () => (
    <>
      <Layout style={styles.layout} level="1">
        {nfcEnrollmentLoading ? (
          <Card style={styles.card}>
            <View style={styles.scannerCameraMessageView}>
              <Spinner size="giant" />
            </View>
          </Card>
        ) : (
          <Card style={styles.card}>
            <View style={styles.scannerCameraMessageView}>
              {nfcErrorMessage ? (
                <>
                  <Text style={styles.scannerDisclaimer}>{nfcErrorMessage}</Text>
                </>
              ) : (
                <>
                  <Text category="h4" style={styles.scannerDisclaimerHeader}>
                    {t('common.nfcScanRequired')}
                  </Text>
                  <Text style={styles.scannerDisclaimer}>
                    {t('common.nfcScanRequiredDesc')}
                  </Text>
                </>
              )}
              {hideNfcSubmitButton ? (
                <></>
              ) : (
                <Button style={styles.nfcScanButton} onPress={handleNfcEnrollment} size="large">
                  {t('common.startScan')}
                </Button>
              )}
            </View>
          </Card>
        )}
      </Layout>
    </>
  );

  const renderIDUpload = () => (
    <>
      <Layout style={styles.layout} level="1">
        <Card style={styles.card}>
          <UploadId visible={uploadEmId} setVisible={setUploadEmId} setIdentitiesLoader={setIdentitiesLoader} side={showBack ? 'back' : 'front'} />
          <View style={styles.scannerCameraIdUploadView}>
            <Text style={styles.idUploadHeader}>
              {currentUser.isIdExpired && currentUser.hasIdentitiesUploaded ? t('common.nationalIdExpired') : t('common.identityVerification')}
            </Text>
            <Text style={styles.idTextContainer} category="h6">
              <Text style={styles.subTextGray}>
                {t('common.idTextUpload1')}
                {' '}
                <Text category="s1">{t(`common.${!showBack ? 'frontSide' : 'backSide'}`)}</Text>
                {' '}
                {t('common.idTextUpload2')}
                {' '}
                <Text category="s1">{`${t('common.idTextUAE')}. `}</Text>
              </Text>
            </Text>
            <View style={styles.idAssetContainer}>
              <Image
                source={country !== 'UAE' ? genericIDAsset : idAsset}
          />
            </View>
            <Button
              style={styles.idUploadButton}
              onPress={() => {
                setUploadEmId(true);
                setIdentitiesLoader(true);
              }}
              disabled={identitiesLoader}
              accessoryRight={() => (identitiesLoader ? <Spinner status="basic" size="tiny" /> : <></>)}
              size="large"
        >
              <Text category="s1" style={styles.subTextWhite}>{t('common.upload')}</Text>
              {' '}
              <Text category="s1" style={styles.subTextWhite}>{`${t('common.idTextUAE')}`}</Text>
              {' '}
              <Text category="s1" style={styles.subTextWhite}>{`(${t(`common.${!showBack ? 'frontSide' : 'backSide'}`)})`}</Text>
            </Button>
          </View>
        </Card>
      </Layout>
    </>
  );
  if ((!currentUser.hasIdentitiesUploaded || currentUser.isIdExpired) && isConsumerMerchantSpendLimitLecResolved && (startNFCFlow || (consumerMerchantSpendLimit && consumerMerchantSpendLimit >= consumerMinimumSpendLimit))) {
    if (nfcSupported && requiresNfcMAF && !nfcUqudoFailed) {
      return <>{renderNFC()}</>;
    }

    return <>{renderIDUpload()}</>;
  }

  const qualifyList = [
    {
      header: t('common.emiratesId'),
      title: t('common.uploadEmiratesId'),
      actionText: t('common.scanNow'),
      isComplete: currentUser.hasIdentitiesUploaded && !currentUser.isIdExpired,
      show: nfcSupported,
      action: () => setStartNFCFlow(true),
      completeMessage: t('common.idScanned'),
    },
    {
      header: t('common.bankAccount'),
      title: t('common.linkSalaryAccount'),
      actionText: t('common.linkNow'),
      show: true,
      isComplete: uploadedSalaryCert || leanIsLinked,
      action: () => navigation.navigate('Account'),
      completeMessage: t(
        leanIsLinked
          ? 'common.uploadBankDescVerified'
          : `common.${uploadedSalaryStatus === SCORE_DATA_VERIFIED ? 'uploadSalaryDescVerified' : 'uploadSalaryDescUploaded'}`,
      ),
    },
    {
      header: t('common.paymentOverdue'),
      title: t('common.clearOutstanding'),
      actionText: t('common.payNow'),
      show: true,
      isComplete: !(mobileLimit === 0
      || [BLOCKING_CODES.MOB_OOM, BLOCKING_CODES.DEF].includes(merchantSpendLimitLecReason))
      && !(nextPayments || { list: [] }).list.length,
      action: () => navigation.navigate('Orders'),
      completeMessage: t('common.allOutstandingCleared'),
    },
  ];

  return (
    <Layout style={styles.layout} level="1">
      <ScrollView overScrollMode="never">

        {/* Components */}
        {gcHero()}

        {!isMAFQualifiedLoading ? (
          <>
            {uaeCustomer && (
              !(isConsumerMerchantSpendLimitLecResolved && consumerMerchantSpendLimit < consumerMinimumSpendLimit) && (
                <View style={[styles.gcText]}>
                  <Text style={[styles.gcTitle, styles.centerAlign]}>{t('common.buyLECOnSpotii')}</Text>
                  <Text style={[styles.gcDescription, styles.centerAlign, styles.marginTop3]}>{t('common.buyLECOnSpotiiSubtitle')}</Text>
                </View>
              )
            )}
            <View style={styles.margin3}>
              {(isConsumerMerchantSpendLimitLecResolved && consumerMerchantSpendLimit < consumerMinimumSpendLimit)
                ? <HowToQualify qualifyList={qualifyList} navigation={navigation} qualifyHeader={t('common.howToQualifyHeadLec')} /> : (
                  <>
                    {gcGiftCard()}
                    {gcSlider()}
                    <Text style={[styles.margin2, styles.mediumSubText, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {t('common.eidAtCollection')}
                    </Text>
                    {error ? <Text style={styles.errorText}>{t('errors.somethingWrongContactSupport')}</Text> : <></>}
                    <Button
                      style={[styles.margin3, { borderRadius: 8 }]}
                      size="large"
                      onPress={startGcCheckout}
                      disabled={isSubmitting}
                      accessoryRight={() => (isSubmitting ? <Spinner size="tiny" /> : null)}
                    >
                      {evaProps => <Text {...evaProps} category="s1" style={{ color: 'white', marginHorizontal: 6 }}>{t('common.proceedToPay')}</Text>}
                    </Button>
                  </>
                )}
            </View>

          </>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', marginTop: '50%' }}>
            <Spinner size="large" />
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {gcHowItWorks()}

      <BottomSheetModal
        ref={whereItWorksBottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
        )}
      >
        <WhereItWorks
          whereItWorksBottomSheetRef={whereItWorksBottomSheetRef}
          isGiftCardLec
        />
      </BottomSheetModal>
    </Layout>
  );
};

LecGiftCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    reset: PropTypes.func,
  }),
};

LecGiftCard.defaultProps = {
  navigation: null,
};
export default LecGiftCard;
