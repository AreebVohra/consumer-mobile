/* eslint-disable operator-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { View, BackHandler, Image, StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  reset,
  requestMerchantInfo,
  selectPlan,
  selectPaymentMethod,
  setScanData,
  setFromStaticMerchantQr,
  fetchOrder,
} from 'reducers/scanner';
import Icon from 'components/Icon';
import { requestConfirmOrder } from 'reducers/checkout';
import { resetFirebaseDynamicLink, resolveHasIdentitiesAndExpired } from 'reducers/application';
import {
  Text, Spinner, Card, Button, SelectItem, Layout,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import { delay } from 'utils/delay';
import formatCurrency from 'utils/formatCurrency';
import {
  PLAN_SLUGS,
  IN_STORE_PLANS,
  PAYMENT_TYPES,
  NFC_ENROLLMENT_ERRORS,
  NFC_ENROLLMENT_RISK_ERRORS,
  BACK_COUNTRIES,
  COUNTRIES,
  BLOCKING_CODES,
  ZERO_DOWN_PLANS,
} from 'utils/constants';
import { handleNfcScan } from 'utils/uqudo';
import { resetRedirectData } from 'reducers/vgs';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPaymentMethods } from 'reducers/paymentMethods';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import VisaLogo from 'assets/visaLogo';
import MasterCardLogo from 'assets/masterCardLogo';
import moment from 'moment';
import 'moment/locale/ar';
import PropTypes from 'prop-types';
import { showMessage } from 'react-native-flash-message';
import handleLogEvent from 'utils/handleLogEvent';
import snakeToCamel from 'utils/snakeToCamel';
import commonStyles from 'utils/commonStyles';
import UploadId from 'pages/account/modals/uploadId';
import * as Linking from 'expo-linking';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import { getNfcHardwareStatus } from 'reducers/nfcId';
import VgsPaymentForm from 'components/VgsPaymentForm';
import genericIDAsset from 'assets/nationalIdImage.png';
import idAsset from 'assets/gamifiedID.png';
import PendingModal from './pendingModal';
import styles from './styles';
import { resetGiftCardCheckout, retrieveInitConsumerSpendLimit, setIsMAFQualifiedLoading } from '../../../reducers/application';
import Timeline from '../../components/Timeline';
import TileSelector from '../../components/TileSelector';
import AddNew from '../../../assets/addNew';

const DeepLinkPaymentForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const screenIsFocused = useIsFocused();
  const currLang = useSelector((state) => state.language.language);
  const {
    merchantScanData: scanData,
    estimations,
    selectedPlan,
    selectedPaymentMethod,
    isMerchantInfoRequestLoading,
    isMerchantInfoPosted,
    merchantInfo,
    isRequestLoading,
    order,
    merchantScanData,
    checkoutAttempted,
    isPaymentLinkSubmitted,
    isPaymentLinkExpired,
  } = useSelector((state) => state.scanner);
  const {
    status: checkoutStatus,
  } = useSelector((state) => state.checkout);
  const {
    nfcScanBlocked, nfcSupported, nfcHardwareStatusResolved,
  } = useSelector((state) => state.nfcId);

  const {
    merchantInfo: orderMerchantInfo, checkoutId, total, merchantHighRisk, rejections, isSaudiMerchant,
  } = order || {};
  const { merchantId } = orderMerchantInfo || {};

  const appState = useSelector((state) => state.application);

  const { hasIdentitiesUploaded, phoneNumber, isIdExpired } = useSelector((state) => state.application.currentUser);
  const {
    giftCardCheckout: { checkoutUrl, gcType },
  } = appState;
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [displayPaymentMethod, setDisplayPaymentMethod] = useState(<Text>{t('common.selectCard')}</Text>);
  const [pendingModalVisible, setPendingModalVisible] = useState(false);
  const [uploadEmId, setUploadEmId] = useState(false);
  const [identitiesLoader, setIdentitiesLoader] = useState(false);
  const [newCardAttempt, setNewCardAttempt] = useState(false);
  const {
    currentUser,
    currentUserScore,
    firebaseDynamicLink,
  } = useSelector((state) => state.application);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEstimates, setFilteredEstimates] = useState(false);
  const [isPayNowSelected, setIsPayNowSelected] = useState(false);
  const [addCardVisible, setAddCardVisible] = useState(false);

  const [showVgsPaymentForm, setShowVgsPaymentForm] = useState(false);

  const [nfcEnrollmentLoading, setNfcEnrollmentLoading] = useState(false);
  const [hideNfcSubmitButton, setHideNfcSubmitButton] = useState(false);
  const [nfcErrorMessage, setNfcErrorMessage] = useState(null);

  const [preloadedNfc, setPreloadedNfc] = useState(false);
  const [nfcUqudoFailed, setNfcUqudoFailed] = useState(false);
  const [userCancelUqudo, setUserCancelUqudo] = useState(0);
  const [sesssionExpiredUqudo, setSesssionExpiredUqudo] = useState(0);
  const [defaultPMIndex, setDefaultPMIndex] = useState(0);
  const [cvvOnly, setCvvOnly] = useState(false);

  const paymentMethods = useSelector((state) => state.paymentMethods);
  // list is already paytabs only cards
  const cards = paymentMethods.list.filter((pm) => pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY);
  // const bankAccounts = paymentMethods.list.filter(pm => pm.pmType === PAYMENT_TYPES.LEAN);

  const listData = cards.map((method) => ({
    title: <Text style={{ paddingHorizontal: 14 }}>{`﹡﹡﹡﹡${method.number ? method.number.slice(-4) : ''}`}</Text>,
    item: method,
  }));

  listData.push({
    title: <Text style={{ fontSize: 14 }}>{t('common.addNewCard')}</Text>,
    newCard: true,
  });

  const isRTL = currLang === 'ar';

  const country = alpha3FromISDPhoneNumber(phoneNumber);
  const showBack = BACK_COUNTRIES.includes(country);

  const { reason } = currentUserScore;

  const cannotSubmit = !hasIdentitiesUploaded && merchantInfo;

  const backAction = () => {
    dispatch(reset());
    setSelectedPaymentMethodId(null);
    setSelectedPlanId(null);
    if (checkoutUrl) {
      if (nfcScanBlocked) {
        dispatch(resetGiftCardCheckout());
        dispatch(retrieveInitConsumerSpendLimit(gcType || null));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Shop' }],
        });
      } else {
        dispatch(resetGiftCardCheckout());
        dispatch(setIsMAFQualifiedLoading(true));
        // eslint-disable-next-line no-unused-expressions
        gcType ? navigation.navigate('LecGiftCard') : navigation.navigate('GiftCard');
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Shop' }],
      });
    }
    return true;
  };

  const handleCheckoutURLParsing = (url) => {
    const { queryParams } = Linking.parse(url);
    const scannedData = {
      checkoutToken: queryParams.token,
    };
    dispatch(fetchOrder(scannedData.checkoutToken, currentUser.userId));
    dispatch(setScanData({ scanData: scannedData }));
    dispatch(fetchPaymentMethods('checkout'));
    return scannedData;
  };

  const giftCardCheckoutStartEvent = async () => {
    await handleLogEvent('SpotiiMobileGiftCardCheckoutStart', {
      email: currentUser.email,
      user_id: currentUser.userId,
      checkout_id: checkoutId,
      amount: total,
      has_id_uploaded: hasIdentitiesUploaded,
      requires_nfc: nfcSupported && !hasIdentitiesUploaded,
      purpose: 'Event that signifies start of MAF Gift Card checkout flow',
    });
  };

  useEffect(() => {
    dispatch(resetRedirectData());
  }, []);

  // this is maf specific
  useEffect(() => {
    if (checkoutUrl && merchantId) {
      dispatch(requestMerchantInfo(merchantId));
    }
  }, [merchantId]);

  useEffect(() => {
    if (!nfcHardwareStatusResolved) {
      dispatch(getNfcHardwareStatus());
    }
  }, [nfcHardwareStatusResolved]);

  // we can use useIsFocused which returns a bool that changes whenever focus changes, put the bool inside useEffect dependency array
  useEffect(() => {
    // Detect Back button pressed on android phone and clear state accordingly
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    if (screenIsFocused) {
      let scannedData = scanData;

      if (!scannedData || checkoutUrl) {
        // when the screen loads from scanning the qr code using the mobile camera (not the scannerCamera screen_)
        if (checkoutUrl) { // this is for gift cards only
          scannedData = handleCheckoutURLParsing(checkoutUrl);
        } else if (firebaseDynamicLink) {
          const decodedUrl = decodeURI(firebaseDynamicLink);

          const { queryParams } = Linking.parse(decodedUrl);

          scannedData = {
            tag: queryParams.tag,
            id: queryParams.id, // merchantId
            userId: queryParams.userId,
            employeeName: queryParams.employeeName,
            checkoutToken: queryParams.token,
          };

          dispatch(fetchOrder(scannedData.checkoutToken, currentUser.userId));

          dispatch(setScanData({ scanData: scannedData }));

          dispatch(requestMerchantInfo(scannedData.id));

          dispatch(fetchPaymentMethods('checkout'));

          dispatch(resetFirebaseDynamicLink());
        }
      } else {
        // when the screen loads from scanning qr code using the scannerCamera Screen from within the application
        dispatch(fetchOrder(scannedData.checkoutToken, currentUser.userId));

        dispatch(requestMerchantInfo(scannedData.id));

        dispatch(fetchPaymentMethods('checkout'));
      }

      dispatch(setFromStaticMerchantQr(false));
    }
    return () => {
      backHandler.remove();
    };
  }, [screenIsFocused]);

  useEffect(() => {
    if (merchantInfo) {
      const acceptedEstimations = [];
      if (merchantInfo.plans.length && estimations) {
        const allMerchantPlans = merchantInfo.plan_dictionary.filter(
          (dictionaryPlan) => merchantInfo.plans.includes(dictionaryPlan.plan_id),
        );
        allMerchantPlans.forEach((plan) => {
          const { plan_id } = plan;
          estimations.forEach((estimate) => {
            if (estimate.id === plan_id) {
              acceptedEstimations.push(estimate);
            }
          });
        });
      } else if (estimations) {
        const temp = merchantInfo.plan_dictionary.filter((plan) => plan.slug === PLAN_SLUGS.MONTHLY);
        temp.forEach((plan) => {
          const { plan_id } = plan;
          estimations.forEach((estimate) => {
            if (estimate.id === plan_id) {
              acceptedEstimations.push(estimate);
            }
          });
        });
      }

      if (acceptedEstimations.length > 0) {
        const defaultPlan =
          acceptedEstimations.find(({ slug }) => [PLAN_SLUGS.MONTHLY_3, PLAN_SLUGS.BI_WEEKLY].includes(slug)) ||
          acceptedEstimations.find(({ slug }) => !ZERO_DOWN_PLANS.includes(slug)) ||
          acceptedEstimations[0];

        const orderedEstimations = [
          acceptedEstimations.find(estimation => estimation.id === defaultPlan.id),
          ...acceptedEstimations.filter(estimation => estimation.id !== defaultPlan.id),
        ];

        setFilteredEstimates(orderedEstimations);
      }
    }
  }, [merchantInfo, estimations]);

  useEffect(() => {
    if (paymentMethods && paymentMethods.isResolved && listData.length) {
      let defaultMethodIndex = cards.findIndex((method) => method.isDefault);

      if (!defaultMethodIndex || defaultMethodIndex === -1) {
        defaultMethodIndex = 0;
      }

      setDefaultPMIndex(defaultMethodIndex);

      if (cards.length > 0) {
        handlePaymentMethodSelect(cards[defaultMethodIndex]);
      }
      setDisplayPaymentMethod(renderListItemText(listData[defaultMethodIndex], defaultMethodIndex, true));
    }
  }, [paymentMethods]);

  useEffect(() => {
    if (filteredEstimates) {
      handlePlanSelect(0);
    }
  }, [filteredEstimates]);

  useEffect(() => {
    if (checkoutUrl && scanData) {
      giftCardCheckoutStartEvent();
    }
  }, [scanData]);

  // this is triggered when the scanned payment link is already submitted or expired
  useEffect(() => {
    if (isPaymentLinkExpired) {
      navigation.navigate('OrderDeclined');
    } else if (isPaymentLinkSubmitted) {
      navigation.navigate('OrderApproved');
    }
  }, [isPaymentLinkSubmitted, isPaymentLinkExpired]);

  const handlePaymentMethodSelect = (method) => {
    if (!method) {
      setSelectedPaymentMethodId(null);
      setCvvOnly(false);
      return setNewCardAttempt(true);
    }
    setCvvOnly(!method.autoDebit);
    setNewCardAttempt(false);
    setSelectedPaymentMethodId(method.id);
    dispatch(selectPaymentMethod(method.id));
  };

  const renderListItemIcon = (props, item) => {
    if (item.type) {
      let logo = <Text category="s2">{item.type.slice(0, 1).toUpperCase() + item.type.slice(1)}</Text>;
      if (item.type === 'visa') {
        logo = <VisaLogo />;
      }
      if (item.type === 'mastercard') {
        logo = <MasterCardLogo />;
      }
      return <View style={styles.cardLogo}>{logo}</View>;
    }
    return null;
  };

  const renderListItemText = (item, index, isDisplay = false) => {
    if (!item || !item.item) {
      return <></>;
    }
    let style = styles.paymentInactive;
    if (item.item.id === selectedPaymentMethodId) {
      style = styles.paymentActive;
    }
    if (isDisplay) {
      style = styles.paymentDisplay;
    }
    return (
      <SelectItem
        key={item.title}
        title={item.title}
        style={style}
        accessoryLeft={(props) => renderListItemIcon(props, item.item)}
      />
    );
  };

  const handlePlanSelect = (index) => {
    setSelectedPlanIndex(index);
    setSelectedPlanId(filteredEstimates[index].id);
    dispatch(selectPlan(filteredEstimates[index].id));

    setIsPayNowSelected(filteredEstimates[index].slug === PLAN_SLUGS.PAY_NOW);
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

  useEffect(() => {
    if (!checkoutUrl && isMerchantInfoPosted && (!hasIdentitiesUploaded || isIdExpired)) {
      if (nfcSupported && merchantInfo.requires_nfc && !preloadedNfc) {
        handleNfcEnrollment();
        setPreloadedNfc(true);
      }
    }
  }, [nfcSupported, isMerchantInfoPosted]);

  const handleSubmit = ({ newCard = false } = {}) => {
    setIsLoading(true);
    try {
      if (selectedPlan) {
        if (!newCard && selectedPaymentMethod) {
          dispatch(requestConfirmOrder(
            scanData.checkoutToken, selectedPlan, selectedPaymentMethod,
          ));
        } else if (newCard) {
          setAddCardVisible(true);

          setShowVgsPaymentForm(true);
        }
      } else {
        console.error('Trying to confirm the order without installments plan selected');
        setAddCardVisible(false);
        setShowVgsPaymentForm(false);
      }
      setIsLoading(false);
      setPendingModalVisible(true);
    } catch (err) {
      setIsLoading(false);
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
    <Card style={styles.card}>
      <UploadId
        side={showBack ? 'back' : 'front'}
        visible={uploadEmId}
        setVisible={setUploadEmId}
        setIdentitiesLoader={setIdentitiesLoader}
      />
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

  const renderPlanSelectHeader = (item, _, isExpanded) => {
    const { userFeeDetails } = item;
    const { hasUserFee } = userFeeDetails || {};
    const hasPlansWithFee = estimations && estimations.find(
      ({ userFeeDetails: estimate }) => estimate.hasUserFee,
    );

    const currentPlan = filteredEstimates.find(({ id: planId }) => item.id === planId);
    const phaseCount = currentPlan.payments.length;

    if ((filteredEstimates || []).length === 1) {
      return (
        <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { alignItems: 'center', marginBottom: '5%' }]}>
          <View>
            <Text
              style={[styles.tipsHeaderTextSinglePlan, { textAlign: isRTL ? 'right' : 'left' }]}
              category="p1"
            >
              {t('common.noInterestNoFee')}
            </Text>
            <Text style={[styles.tipsHeaderSubTextSinglePlan, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('common.dueToday', {
                amount: formatCurrency(
                  item.currency,
                  item.payments[0].amount,
                ),
              })}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[isExpanded ? styles.accordionHeaderContainerSelected : styles.accordionHeaderContainer, { justifyContent: 'space-between' }]}>
        {/* {!isExpanded && item.id === filteredEstimates[0].id ? (
          <View
            style={{
              position: 'absolute',
              right: 1,
              top: 0,
              elevation: 5,
              backgroundColor: '#EDE6FF',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
            }}
          >
            <Text style={{ color: '#411361', fontSize: 12, fontWeight: '400' }}>{t('common.mostPopular')}</Text>
          </View>
        ) : (
          <></>
        )} */}

        <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { flex: 1, alignItems: 'center' }]}>
          <View style={[styles.accordionSelectOuter, { borderColor: isExpanded ? '#AA8FFF' : '#717171' }]}>
            <View style={[styles.accordionSelectInner, { backgroundColor: isExpanded ? '#AA8FFF' : '#FFFFFF' }]} />
          </View>
          <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { flex: 1 }]}>
            <View>
              <Text
                style={[styles.tipsHeaderText, { textAlign: isRTL ? 'right' : 'left' }]}
                category="p1"
              >
                {currentPlan.slug === PLAN_SLUGS.PAY_NOW ? t('common.payNow') : t('common.payInXPeriod', { numUnits: phaseCount, period: t('common.months') })}
              </Text>
              <Text style={[styles.tipsHeaderSubText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {isExpanded
                  ? t('common.payUsingAnyCard') : t('common.dueToday', {
                    amount: formatCurrency(
                      item.currency,
                      item.payments[0].amount,
                    ),
                  }) }
              </Text>
            </View>
            {!isExpanded && hasPlansWithFee ? (
              <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { flex: 1, justifyContent: 'flex-end', alignItems: 'center' }]}>
                <Text style={[styles.tipsHeaderSubTextSinglePlan, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t(hasUserFee ? 'common.inclFee' : 'common.noFee')}
                </Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderPlanSelectBody = (item, _, __) => (
    <View style={(filteredEstimates || []).length > 1 ? styles.accordionBody : {}}>
      <Timeline
        userFeeDetails={item.userFeeDetails}
        payments={item.payments}
        total={item.total}
        slug={item.id}
        currency={item.currency}
        payNowPlan={isPayNowSelected}
      />
    </View>
  );

  const renderNewCardSelectHeader = (item, _, isExpanded) => (
    <View style={isExpanded ? styles.accordionHeaderContainerSelected : styles.accordionHeaderContainer}>
      <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { alignItems: 'center', width: '100%' }]}>
        {!isExpanded ? (
          <View style={styles.accordionSelectPlus}>
            <AddNew />
          </View>
        )
          : (
            <View style={[styles.accordionSelectOuter, { borderColor: isExpanded ? '#AA8FFF' : '#717171' }]}>
              <View style={[styles.accordionSelectInner, { backgroundColor: isExpanded ? '#AA8FFF' : '#FFFFFF' }]} />
            </View>
          )}
        <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.pmContainer, { justifyContent: 'space-between', width: '100%' }]}>
          {item.title}
          <View style={styles.processorLogoContainer}>
            <View style={styles.processorLogo}>
              <VisaLogo />
            </View>
            <View style={styles.processorLogo}>
              <MasterCardLogo />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNewCardSelectBody = (_, __, ___) => (
    <Layout level="1" style={styles.accordionBodyNoPadding}>
      <View style={styles.accordionHeaderDivider} />
      {filteredEstimates ? (
        <VgsPaymentForm
          handleBack={(shouldApplyDelay = false) => {
            delay(shouldApplyDelay ? 3000 : 0).then(() => {
              setIsLoading(false);
              if (!checkoutAttempted) {
                setPendingModalVisible(false);
              }
              dispatch(resetRedirectData());
              dispatch(fetchPaymentMethods('checkout'));
              dispatch(selectPaymentMethod(null));
              setAddCardVisible(false);
              dispatch(fetchOrder(merchantScanData.checkoutToken, currentUser.userId));
              setShowVgsPaymentForm(false);
              setDefaultPMIndex(-1);
              setNewCardAttempt(false);
            });
          }}
          navigation={navigation}
          amountStr={`${filteredEstimates[selectedPlanIndex] && filteredEstimates[selectedPlanIndex].currency
            ? formatCurrency(
              filteredEstimates[selectedPlanIndex].currency,
              filteredEstimates[selectedPlanIndex].payments[0].amount,
            )
            : ''}`}
          showHeader={false}
        />
      ) : (
        <View style={styles.addNewCardSpinner}>
          <Spinner />
        </View>
      )}
    </Layout>
  );

  const renderAddCVVBody = (_, __, ___) => (cvvOnly ? (
    <Layout level="1" style={styles.accordionBodyNoPadding}>
      <View style={styles.accordionHeaderDividerCVV} />
      <VgsPaymentForm
        handleBack={(shouldApplyDelay = false) => {
          delay(shouldApplyDelay ? 3000 : 0).then(() => {
            setIsLoading(false);
            if (!checkoutAttempted) {
              setPendingModalVisible(false);
            }
            dispatch(resetRedirectData());
            dispatch(fetchPaymentMethods('checkout'));
            dispatch(selectPaymentMethod(null));
            setAddCardVisible(false);
            dispatch(fetchOrder(merchantScanData.checkoutToken, currentUser.userId));
            setShowVgsPaymentForm(false);
            setDefaultPMIndex(-1);
            setCvvOnly(false);
          });
        }}
        amountStr={`${filteredEstimates[selectedPlanIndex] && filteredEstimates[selectedPlanIndex].currency
          ? formatCurrency(
            filteredEstimates[selectedPlanIndex].currency,
            filteredEstimates[selectedPlanIndex].payments[0].amount,
          )
          : ''}`}
        showHeader={false}
        cvvOnly={cvvOnly}
        paymentMethodId={selectedPaymentMethodId}
      />
    </Layout>
  ) : <></>);

  const renderPaymentMethodSelectHeader = (item, _, __) => {
    if (item.newCard) {
      return renderNewCardSelectHeader(item, _, __);
    }
    const isSelected = item.item && item.item.id === selectedPaymentMethodId;
    return (
      <View style={isSelected ? styles.headerContainerSelectedFullBorder : styles.accordionHeaderContainer}>
        <View style={[styles.accordionSelectOuter, { borderColor: isSelected ? '#AA8FFF' : '#717171' }]}>
          <View style={[styles.accordionSelectInner, { backgroundColor: isSelected ? '#AA8FFF' : '#FFFFFF' }]} />
        </View>
        <View style={[styles.flexRow, styles.pmContainer]}>
          {renderListItemIcon(null, item.item)}
          {item.title}
        </View>
      </View>

    );
  };

  const renderPaymentMethodSelectBody = (item, __, ___) => {
    if (item.newCard) {
      return renderNewCardSelectBody(item, __, ___);
    }
    if (item.item && !item.item.autoDebit) {
      return renderAddCVVBody(item, __, ___);
    }
    return <></>;
  };

  const merchantName = (merchantInfo && merchantInfo.display_name) || '';
  const empName = merchantName && scanData && scanData.employeeName ? ` - ${scanData.employeeName}` : '';
  const displayName = merchantName + empName || '';

  if (reason) {
    return (
      <Card style={styles.card}>
        <View style={styles.scannerCameraMessageView}>
          {getBlockingCodeMessage()}
        </View>
      </Card>
    );
  }
  if (!checkoutUrl && isMerchantInfoPosted && (!hasIdentitiesUploaded || isIdExpired)) {
    if (nfcSupported && merchantInfo.requires_nfc && !nfcUqudoFailed) {
      return <>{renderNFC()}</>;
    }
    return <>{renderIDUpload()}</>;
  }

  return (
    <>
      <Layout style={styles.layout} level="2">
        <KeyboardAvoidingView>
          <View style={styles.card}>
            {isMerchantInfoPosted && !isMerchantInfoRequestLoading ? (
              <View style={styles.mainView}>
                <View style={styles.paymentFormHeader}>
                  <View
                    style={{ width: '5%', paddingBottom: 1 }}
                  >
                    <Button
                      onPress={backAction}
                      appearance="ghost"
                      size="small"
                    >
                      {Icon(
                        {
                          fill: '#353535',
                          width: 25,
                          height: 20,
                        },
                        'arrow-back-outline',
                      )}
                    </Button>
                  </View>
                  <View style={{ width: '95%', marginHorizontal: 4 }}>
                    <Text category="h6" style={{ textAlign: 'center' }}>{displayName}</Text>
                  </View>
                  {/* <Divider /> */}
                </View>
                <View style={styles.planSelectionContainer}>
                  {!isRequestLoading && filteredEstimates ? (

                    <TileSelector
                      list={filteredEstimates}
                      renderHeader={renderPlanSelectHeader}
                      renderBody={renderPlanSelectBody}
                      onToggle={(_, index, __) => handlePlanSelect(index)}
                      isDisabled={(item, _) => item.id === selectedPlanId}
                      defaultIndex={0}
                      itemKey={item => `${item.id}`}
                    />
                  ) : (
                    <View style={{ marginTop: '2%', width: '100%', alignItems: 'center' }}>
                      <Spinner />
                    </View>
                  )}
                </View>

                <View style={styles.paymentOptionListContainer}>
                  {hasIdentitiesUploaded && (
                    <View style={styles.cardSelection}>
                      <Text
                        style={[
                          styles.tipsHeaderTextSinglePlan,
                          { textAlign: currLang === 'ar' ? 'right' : 'left', marginBottom: '2%' },
                        ]}
                        category="p1"
                      >
                        {t('common.selectPaymentMethod')}
                      </Text>
                      {listData.length ? (
                        <View style={{ paddingBottom: 60 }}>
                          <TileSelector
                            list={listData}
                            renderHeader={renderPaymentMethodSelectHeader}
                            renderBody={renderPaymentMethodSelectBody}
                            onToggle={(_, index, __) => handlePaymentMethodSelect(listData[index].item)}
                            defaultIndex={defaultPMIndex}
                            isDisabled={(item, _) => (item.newCard && newCardAttempt && listData.length > 1) || (item.item && item.item.id === selectedPaymentMethodId)}
                            itemKey={item => `${item.newCard ? 'new-card-form' : item.item.id}`}
                          />
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                </View>

              </View>
            ) : (
              <View style={[styles.center, { marginTop: '50%' }]}>
                <Spinner size="giant" />
              </View>
            )}
          </View>

          <PendingModal
            status={checkoutStatus}
            // fromDynamicPaymentLinkQr={true}
            visible={pendingModalVisible}
            setVisible={setPendingModalVisible}
            navigation={navigation}
            merchantScanData={scanData || {}}
            setAddCardVisible={setAddCardVisible}
          />
          {!isRequestLoading && selectedPaymentMethodId && !cvvOnly ? (
            <View style={styles.BottomSubmitActions}>
              {cannotSubmit ? (
                <Button
                  size="large"
                  style={{ marginTop: '2%' }}
                  status="success"
                  accessoryRight={() => (identitiesLoader ? <Spinner status="basic" size="tiny" /> : <></>)}
                // onPress={() => { setUploadEmId(true); setIdentitiesLoader(true); }}
                  onPress={() => {
                    navigation.navigate('Account', { screen: 'Profile' });
                  }}
                >
                  {t('common.uploadIdRequired')}
                </Button>
              ) : (
                <>
                  <Button
                    size="large"
                    disabled={
                      !selectedPaymentMethodId
                      || !selectedPlanId
                      || !cards.length
                      || isLoading
                      || isRequestLoading
                      || (filteredEstimates && !filteredEstimates[selectedPlanIndex]?.total)
                    }
                    onPress={() => handleSubmit()}
                    accessoryRight={(props) => (isLoading ? <Spinner status="control" /> : null)}
                  >
                    {`${t('common.payNow')} ${
                      filteredEstimates && filteredEstimates[selectedPlanIndex] && filteredEstimates[selectedPlanIndex].currency
                        ? formatCurrency(
                          filteredEstimates[selectedPlanIndex].currency,
                          filteredEstimates[selectedPlanIndex].payments[0].amount,
                        )
                        : ''
                    }`}
                  </Button>
                  {merchantScanData && filteredEstimates && filteredEstimates[selectedPlanIndex] && filteredEstimates[selectedPlanIndex].currency !== 'AED' && filteredEstimates[selectedPlanIndex].firstInstallmentAmountAed
                    ? (
                      <View style={{ marginTop: '3%' }}>
                        <Text category="s2">
                          {t('common.differentCurrencyNote', {
                            amount: formatCurrency(
                              'AED',
                              filteredEstimates[selectedPlanIndex].firstInstallmentAmountAed,
                              // merchantScanData.currency,
                              // paymentAmount,
                              // true,
                            ),
                          }) }
                        </Text>
                      </View>
                    ) : <></>}
                </>
              )}
            </View>
          ) : <></> }
        </KeyboardAvoidingView>
      </Layout>
    </>
  );
};

DeepLinkPaymentForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
    reset: PropTypes.func,
  }),
};

DeepLinkPaymentForm.defaultProps = {
  navigation: null,
};

export default DeepLinkPaymentForm;
