/* eslint-disable padded-blocks */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
import React, { useRef, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  Text,
  Card,
  Button,
  Layout,
} from '@ui-kitten/components';
import { paymentFailureSound } from 'utils/sounds';
import * as Linking from 'expo-linking';
import { t } from 'services/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import LottieView from 'lottie-react-native';
import commonStyles from 'utils/commonStyles';
import { View, BackHandler } from 'react-native';
import {
  DECLINE_REASONS,
  DECLINE_MESSAGES,
  BLOCKING_CODES,
  COUNTRIES,
  REJECTIONS,
  PT2_INSUFFICIENT_FUNDS,
  DRAFT_STATUS_CANCELLED,
} from 'utils/constants';
import 'moment/locale/ar';
import PropTypes from 'prop-types';
import styles from './styles';
import { resetGiftCardCheckout } from '../../../reducers/application';
import { setCheckoutAttempted, reset as scannerReset } from '../../../reducers/scanner';
import { reset as checkoutReset } from '../../../reducers/checkout';

const OrderDeclined = ({ navigation }) => {
  const dispatch = useDispatch();
  const animation = useRef(null);
  // const fromStaticMerchantQr = useSelector(state => state.scanner.fromStaticMerchantQr);
  const currentDraft = useSelector(state => state.scanner.draftData);
  const { isPaymentLinkExpired, currentDraftStatus: draftStatus } = useSelector(state => state.scanner);
  const { code: checkoutErrorCode } = useSelector((state) => state.checkout);
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';

  const expectedVersion = useSelector(state => state.scanner.expectedVersion);
  const {
    merchantInfo,
    fromStaticMerchantQr,
    order,
  } = useSelector(state => state.scanner);
  const [code, setCode] = useState(null);
  const [reason, setReason] = useState(null);
  const { rejections = [], giftCardCheckout } = order || {};
  const { phoneNumber } = useSelector(state => state.application.currentUser);
  const [isUAECustomer, setIsUAECustomer] = useState(false);
  const [isKSACustomer, setIsKSACustomer] = useState(false);
  // const hasNoCode = !checkoutErrorCode || checkoutErrorCode === '';

  let tryAgainMessage = t('common.tryAgain');

  const backAction = () => {
    dispatch(scannerReset());
    dispatch(checkoutReset());
    dispatch(resetGiftCardCheckout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Shop' }],
    });
    return true;
  };

  useEffect(() => {
    if (phoneNumber && phoneNumber.substring(0, 4) === '+971') {
      setIsUAECustomer(true);
    }
    if (phoneNumber && phoneNumber.substring(0, 4) === '+966') {
      setIsKSACustomer(true);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (isPaymentLinkExpired) {
      setCode(DECLINE_MESSAGES.SPOTII_EXP);

    } else if (currentDraft) {
      if (currentDraft.error_reason) {
        setReason(currentDraft.error_reason);
      }

      if (currentDraft.error_code) {
        setCode(currentDraft.error_code);
      } else if (draftStatus === DRAFT_STATUS_CANCELLED) {
        setCode(DRAFT_STATUS_CANCELLED);
      }

    } else if (checkoutErrorCode) {
      setCode(checkoutErrorCode);
    }
  }, [currentDraft]);

  useEffect(() => {
    // Detect Back button pressed on android phone and clear state accordingly
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    const errorHapticAndSound = async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await paymentFailureSound();
    };
    errorHapticAndSound();

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (animation && animation.current) {
      animation.current.play();
    }
  }, [code, animation]);

  const getGraphic = () => {
    return (
      <View
        style={styles.lottieViewContainer}
      >
        <LottieView
          ref={animation}
          source={require('assets/lottie/order-declined.json')}
          loop={false}
          style={styles.lottieViewOrderFail}
        />
      </View>
    );
  };

  const isRejectionPresent = rejection => {
    return rejections.length > 0
      ? rejections[rejections.length - 1].indexOf(rejection) !== -1
          || rejections[rejections.length - 1].indexOf(rejection.toUpperCase()) !== -1
      : false;
  };

  // Check for last rejection
  const lastRejectionPaymentCancelled = isRejectionPresent(REJECTIONS.PAYMENT_CANCELLED);
  const lastRejectionCVV = isRejectionPresent(REJECTIONS.CVV);

  const lastRejectionCardExpired = isRejectionPresent(REJECTIONS.EXPIRED_CARD);
  const lastRejectionStolenOrLostCard = isRejectionPresent(REJECTIONS.STOLEN_OR_LOST_CARD);
  const lastRejectionInsufficientFunds = isRejectionPresent(REJECTIONS.INSUFFICIENT_FUNDS) || isRejectionPresent(PT2_INSUFFICIENT_FUNDS);

  const getDeclineHeader = () => {
    if (code) {
      switch (code) {
        case DECLINE_MESSAGES.UNPAID_INSTALLMENTS: {
          return (
            <Text
              style={styles.DeclinedHeader}
              category="h5"
            >
              {t('errors.unpaidDuesDeclinedOrderHeader')}
            </Text>
          );
        }
        case DECLINE_MESSAGES.INSUFFICIENT_FUNDS: {
          return (
            <Text
              style={styles.DeclinedHeader}
              category="h5"
            >
              {t('errors.insufficientFundsHeading')}
            </Text>
          );
        }
        case DECLINE_MESSAGES.INVALID_CVV: {
          return (
            <Text
              style={styles.DeclinedHeader}
              category="h5"
            >
              {t('errors.cvvMismatchHeader')}
            </Text>
          );
        }
        case DECLINE_MESSAGES.SPOTII_02: {
          return (
            <Text
              style={styles.DeclinedHeader}
              category="h5"
            >
              {t('errors.orderDeclined')}
            </Text>
          );
        }
        case BLOCKING_CODES.SAL_RQD: {
          return (
            <Text
              style={styles.DeclinedHeader}
              category="h5"
            >
              {t('common.verificationRequired')}
            </Text>
          );
        }
        case DRAFT_STATUS_CANCELLED: {
          return (
            <Text
              style={styles.DeclinedHeader}
              category="h5"
            >
              {t('errors.merchantDeclined')}
            </Text>
          );
        }
        default:
          return (
            <Text
              style={styles.DeclinedHeader}
              category="h5"
            >
              {code === DECLINE_MESSAGES.SPOTII_APP_VERSION ? t('errors.versionNotSupported') : t('errors.orderDeclined')}
            </Text>
          );
      }
    }
    if (lastRejectionCVV) {
      return (
        <Text
          style={styles.DeclinedHeader}
          category="h5"
        >
          {t('errors.cvvMismatchHeader')}
        </Text>
      );
    } if (lastRejectionInsufficientFunds) {
      return (
        <Text
          style={styles.DeclinedHeader}
          category="h5"
        >
          {t('errors.insufficientFundsHeading')}
        </Text>
      );
    }
    return (
      <Text
        style={styles.DeclinedHeader}
        category="h5"
      >
        {t('errors.orderDeclined')}
      </Text>
    );
  };

  const getDeclineView = () => {
    const country = alpha3FromISDPhoneNumber(phoneNumber);

    if (code) {
      switch (code) {
        case BLOCKING_CODES.SAL_RQD: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {`${t('common.blockedSalReqDescAlt')} ${country === COUNTRIES.UAE ? t('common.blockedSalReqDescBUAE') : country === COUNTRIES.SAU ? t('common.blockedSalReqDescBSAU') : t('common.blockedSalReqDescB')}`}
                <Text style={{ color: '#AA8FFF' }} category="p1" onPress={() => navigation.navigate('Account', { screen: 'Profile' })}>
                  {` ${t('common.here')}.`}
                </Text>
              </Text>
            </>
          );
        }
        case BLOCKING_CODES.SAL_PRG: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {`${t('common.blockedSalPrgDesc')} ${country === COUNTRIES.UAE ? t('common.blockedSalPrgDescBUAE') : country === COUNTRIES.SAU ? t('common.blockedSalPrgDescBSAU') : ''}\n\n${t('common.pleaseAllow48Hrs')}`}
              </Text>
            </>
          );
        }
        case BLOCKING_CODES.SAL_REJ: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {`${t('common.blockedSalRejDesc')} `}
                <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                  shoppersupport@spotii.me
                </Text>
                .
              </Text>
            </>
          );
        }
        case BLOCKING_CODES.MOB_OOM: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('common.blockedOOMDesc', { merchant: merchantInfo && merchantInfo.display_name ? merchantInfo.display_name : '' })}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.UNPAID_INSTALLMENTS: {
          tryAgainMessage = null;
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.unpaidDuesDeclinedOrder')}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.SPOTII_TABS: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.cardDeclinedDesc')}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.CONTACT_BANK: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                <Text category="p1">
                  {`${t('errors.cardDeclinedDesc')} ${t('common.pleaseContact')} `}
                  <Text style={[commonStyles.link]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                    shoppersupport@spotii.me
                  </Text>
                </Text>
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.SPOTII_02: {
          tryAgainMessage = null;
          if (reason === DECLINE_REASONS.SPOTII_02_DL) {
            return (
              <>
                <Text style={styles.DeclinedDesc} category="p1">{`${t('errors.orderNotApprovedSCDescOne')} ${t('errors.orderNotApprovedSCDescTwo')}`}</Text>
                <Text style={[styles.DeclinedDesc]} category="p1">
                  {isUAECustomer ? `${t('errors.orderNotApprovedSCDescThreeUAE')} ` : isKSACustomer ? `${t('errors.orderNotApprovedSCDescThreeKSA')} ` : `${t('errors.orderNotApprovedSCDescThreeNonUAE')} `}
                  <Text style={{ color: '#AA8FFF' }} category="p1" onPress={() => navigation.navigate('Account', { screen: 'Profile' })}>
                    {`${t('common.account')}.`}
                  </Text>
                </Text>
              </>
            );
          }
          if (reason === DECLINE_REASONS.SPOTII_02_SPU) {
            return (
              <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Text style={styles.DeclinedDescAlt} category="p1">{`${t('errors.orderNotApprovedDLDescOne')}`}</Text>

                <Text style={styles.DeclinedDescAlt} category="p1">{`${t('errors.orderNotApprovedDLDescTwo')}`}</Text>

                <Text style={styles.DeclinedDescAlt} category="p1">{`${t('common.pleaseContact')} `}</Text>

                <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel:+971 4275 3550')}>+971 4275 3550</Text>

                <Text style={styles.DeclinedDescAlt} category="p1">{` ${t('common.or')} `}</Text>

                <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel:+966 11 520 9914')}>+966 11 520 9914</Text>

                <Text style={styles.DeclinedDescAlt} category="p1">{` ${t('common.forMoreDetails')}`}</Text>
              </View>
            );
          }
          if (reason === DECLINE_REASONS.SPOTII_02_PPU) {
            return (
              <View>
                <Text style={styles.DeclinedDescAlt} category="p1">
                  {`${t('errors.orderNotApprovedDLDescOne')} ${t('errors.orderNotApprovedDLDescTwo')}\n`}
                </Text>
                <Text style={styles.DeclinedDescAlt} category="p1">{`${t('errors.orderNotApprovedDescPpu')}`}</Text>
              </View>
            );
          }
          return (
            <View>
              <Text style={styles.DeclinedDescAlt} category="p1">
                {`${t('errors.orderNotApprovedCLDescOne')} `}
                {`${t('errors.orderNotApprovedCLDescTwo')} `}
                {isUAECustomer ? `${t('errors.orderNotApprovedCLDescThreeUAE')} ` : isKSACustomer ? `${t('errors.orderNotApprovedCLDescThreeKSA')} ` : `${t('errors.orderNotApprovedCLDescThreeNonUAE')} `}
                <Text style={{ color: '#AA8FFF' }} category="p1" onPress={() => navigation.navigate('Account', { screen: 'Profile' })}>
                  {`${t('common.here')}.`}
                </Text>
              </Text>
              {/* <Text style={styles.DeclinedDesc} category="p1">
                <Text style={styles.DeclinedDesc} category="p1">
                  {`${t('errors.orderNotApprovedCLDescFourA')} `}
                  <Text style={[commonStyles.link, styles.DeclinedDesc]} category="p1" onPress={() => navigation.navigate('Shop')}>
                    {` ${t('common.here')} `}
                  </Text>
                  {` ${t('errors.orderNotApprovedCLDescFourB')}`}
                </Text>
              </Text> */}
            </View>
          );
        }
        case DECLINE_MESSAGES.SPOTII_03: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">{`${t('errors.orderNotApprovedSCDescOne')} ${t('errors.orderNotApprovedSCDescTwo')}`}</Text>
              <Text style={[styles.DeclinedDesc, { marginBottom: 75 }]} category="p1">
                {isUAECustomer ? `${t('errors.orderNotApprovedSCDescThreeUAE')} ` : isKSACustomer ? `${t('errors.orderNotApprovedSCDescThreeKSA')} ` : `${t('errors.orderNotApprovedSCDescThreeNonUAE')} `}
                <Text style={[commonStyles.link, styles.DeclinedDesc, { color: '#AA8FFF' }]} category="p1" onPress={() => navigation.navigate('Account', { screen: 'Profile' })}>
                  {`${t('common.account')}.`}
                </Text>
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.SPOTII_APP_VERSION: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.versionNotSupportedDesc', { version: expectedVersion })}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.IDENTITIES_LOCK: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.accBlockedForInvalidEID')}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.INSUFFICIENT_FUNDS: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.insufficientFundsDesc')}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.INVALID_CVV: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.cvvMismatchDesc')}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.ADDRESS_VERIFICATION_FAIL: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.cardAddressVerificationFail')}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.SPOTII_EXP: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.expiredCheckoutDesc')}
              </Text>
            </>
          );
        }
        case BLOCKING_CODES.MOB_ERR: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">{`${t('errors.orderNotApprovedSCDescOne')} ${t('errors.orderNotApprovedSCDescTwo')}`}</Text>
              <Text style={[styles.DeclinedDesc, { marginBottom: 75 }]} category="p1">
                {isUAECustomer ? `${t('errors.orderNotApprovedSCDescThreeUAE')} ` : isKSACustomer ? `${t('errors.orderNotApprovedSCDescThreeKSA')} ` : `${t('errors.orderNotApprovedSCDescThreeNonUAE')} `}
                <Text style={[commonStyles.link, styles.DeclinedDesc, { color: '#AA8FFF' }]} category="p1" onPress={() => navigation.navigate('Account', { screen: 'Profile' })}>
                  {`${t('common.account')}.`}
                </Text>
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.UNREGISTERED_PHONE: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {`${t('common.pleaseContact')}\n`}
                <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel:+971 4275 3550')}>
                  +971 4275 3550
                </Text>
                {` ${t('common.or')} `}
                <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel:+966 11 520 9914')}>
                  +966 11 520 9914
                </Text>
                {`\n${t('common.forMoreDetails')}`}
              </Text>
            </>
          );
        }
        case DECLINE_MESSAGES.INVALID_COUNTRY: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.gcNotInYourCountry')}
              </Text>
            </>
          );
        }
        case DRAFT_STATUS_CANCELLED: {
          return (
            <>
              <Text style={styles.DeclinedDesc} category="p1">
                {t('errors.merchantDeclinedDesc')}
              </Text>
            </>
          );
        }
        default: {
          return (
            <>
              <Text style={[styles.DeclinedDesc, { marginBottom: 75 }]} category="p1">
                {`${t('common.blockedDefaultDesc')} `}
                <Text style={[commonStyles.link]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                  shoppersupport@spotii.me
                </Text>
              </Text>
            </>
          );
        }
      }
    }
    // else if (hasNoCode) {
    if (lastRejectionPaymentCancelled) {
      return (
        <Text style={styles.DeclinedDesc} category="p1">
          {t('errors.paymentCancelledDesc')}
        </Text>
      );
    } if (lastRejectionCVV) {
      return (
        <Text style={styles.DeclinedDesc} category="p1">
          {t('errors.cvvMismatchDesc')}
        </Text>
      );
    } if (lastRejectionInsufficientFunds) {
      return (
        <Text style={styles.DeclinedDesc} category="p1">
          {t('errors.insufficientFundsDesc')}
        </Text>
      );
    } if ((lastRejectionStolenOrLostCard || lastRejectionCardExpired)) {
      return (
        <Text style={styles.DeclinedDesc} category="p1">
          {t('errors.cardDeclinedDesc')}
          {' '}
          {t('common.pleaseContact')}
          {' '}
          <Text style={[commonStyles.link]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
            shoppersupport@spotii.me
          </Text>
        </Text>
      );
    }
    //   }
    return (
      <>
        <Text style={styles.DeclinedDesc} category="p1">
          <Text style={styles.DeclinedDesc} category="p1">
            {`${t('common.blockedDefaultDesc')} `}
            <Text style={[commonStyles.link]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
          </Text>
        </Text>
      </>
    );
  };

  const handleContinue = () => {
    dispatch(scannerReset());
    dispatch(resetGiftCardCheckout());

    navigation.reset({
      index: 0,
      routes: [{ name: 'Shop' }],
    });
  };

  const customBackAction = () => {
    dispatch(checkoutReset());
    dispatch(setCheckoutAttempted({ checkoutAttempted: false }));
    if (tryAgainMessage) {
      navigation.navigate('DeepLinkPaymentForm');
    } else {
      handleContinue();
    }
  };

  const getDeclineCTA = () => {
    switch (code) {
      case DECLINE_MESSAGES.UNPAID_INSTALLMENTS: {
        return (
          <>
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={() => navigation.navigate('Orders')}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.goToOrders')}
                </Text>
              )}
            </Button>
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={handleContinue}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.goBackToHome')}
                </Text>
              )}
            </Button>
          </>
        );
      }
      case DECLINE_MESSAGES.INSUFFICIENT_FUNDS: {
        return (
          <>
            {!isPaymentLinkExpired && !fromStaticMerchantQr && tryAgainMessage && (
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={() => customBackAction()}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.payWithDiffCard')}
                </Text>
              )}
            </Button>
            )}
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={handleContinue}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.goBackToHome')}
                </Text>
              )}
            </Button>
          </>
        );
      }
      case DECLINE_MESSAGES.INVALID_CVV: {
        return (
          <>
            {!isPaymentLinkExpired && !fromStaticMerchantQr && tryAgainMessage && (
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={() => customBackAction()}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.tryAgain')}
                </Text>
              )}
            </Button>
            )}
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={handleContinue}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.goBackToHome')}
                </Text>
              )}
            </Button>
          </>
        );
      }
      case DECLINE_MESSAGES.SPOTII_02: {
        return (
          <>
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={handleContinue}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.goBackToHome')}
                </Text>
              )}
            </Button>
          </>
        );
      }
      default: {
        return (
          <>
            <Button
              style={{ marginTop: '3%', paddingVertical: 10 }}
              onPress={handleContinue}
              size="small"
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{
                    color: 'white', fontSize: 16, fontWeight: '700', lineHeight: 20,
                  }}
                >
                  {t('common.goBackToHome')}
                </Text>
              )}
            </Button>
            {!isPaymentLinkExpired && !fromStaticMerchantQr && tryAgainMessage && (
            <Button
              appearance="ghost"
              size="small"
              style={{ marginTop: '2%' }}
              onPress={() => customBackAction()}
            >
              {evaProps => (
                <Text
                  {...evaProps}
                  style={{ color: '#411361', paddingBottom: '1.5%' }}
                >
                  {tryAgainMessage}
                </Text>
              )}
            </Button>
            )}
          </>
        );
      }
    }
  };

  return (
    <>
      {/* navigateBack backFunction={backAction} /> */}
      <Layout style={styles.layout} level="2">
        <View style={styles.centerCard}>
          <View style={{ width: '90%' }}>
            <Text style={{
              fontSize: 24, fontWeight: '400', lineHeight: 35, textAlign: 'center', paddingTop: 24,
            }}
            >
              {t('errors.orderDeclinedHeader')}
            </Text>
            {getGraphic()}
            {getDeclineHeader()}
            {getDeclineView()}
            <View style={{ marginTop: '7%' }}>
              {getDeclineCTA()}
            </View>
          </View>
        </View>
      </Layout>
    </>
  );
};

OrderDeclined.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    reset: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

OrderDeclined.defaultProps = {
  navigation: null,
};

export default OrderDeclined;
