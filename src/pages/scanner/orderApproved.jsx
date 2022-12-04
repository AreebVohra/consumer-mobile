/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
import React, { useRef, useEffect, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { View, BackHandler } from 'react-native';
import {
  Text,
  Card,
  Button,
  Layout,
  Divider,
  Spinner,
} from '@ui-kitten/components';
import { GIFT_CARDS } from 'utils/constants';
import { paymentSuccessSound } from 'utils/sounds';
import { handleRatingPrompt } from 'utils/handleRatingPrompt';
import { t } from 'services/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { reset, fetchGCOrder } from 'reducers/scanner';
import { reset as checkoutReset } from 'reducers/checkout';
import { delay } from 'utils/delay';
import handleLogEvent from 'utils/handleLogEvent';
import 'moment/locale/ar';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import styles from './styles';
import GiftCardApproved from '../../../assets/giftCardApproved';
import LecGiftCardApproved from '../../../assets/lecGiftCardApproved';
import WhereItWorks from '../giftcards/whereItWorks';

const OrderApproved = ({ navigation }) => {
  const dispatch = useDispatch();
  const animation = useRef(null);
  const whereItWorksBottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '90%'], []);
  const {
    order,
    gcData,
  } = useSelector((state) => state.scanner);
  const { giftCardCheckout, currentUser } = useSelector((state) => state.application);
  const currentDraft = useSelector(state => state.scanner.draftData);
  const { checkoutId, total } = order || {};
  const { merchantInfo, merchantScanData: scanData } = useSelector((state) => state.scanner);

  const merchantName = (merchantInfo && merchantInfo.display_name) || '';
  const empName = merchantName && scanData && scanData.employeeName ? ` - ${scanData.employeeName}` : '';
  const displayName = merchantName + empName || '';

  // const fromStaticMerchantQr = useSelector(state => state.scanner.fromStaticMerchantQr);

  const backAction = () => {
    dispatch(reset());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Shop' }],
    });
    return true;
  };

  const giftCardCheckoutSuccessEvent = async () => {
    await handleLogEvent('SpotiiMobileGiftCardCheckoutSuccess', {
      email: currentUser.email,
      user_id: currentUser.userId,
      checkout_id: checkoutId,
      amount: total,
      purpose: 'Event that signifies MAF Gift Card checkout success',
    });
  };

  useEffect(() => {
    if (giftCardCheckout.checkoutUrl && !gcData.isFetched && !gcData.isSuccessful) {
      dispatch(fetchGCOrder(checkoutId));
      giftCardCheckoutSuccessEvent();
    }
  }, [giftCardCheckout, gcData.isFetched, gcData.isSuccessful]);

  useEffect(() => {
    // Detect Back button pressed on android phone and clear state accordingly
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    dispatch(checkoutReset());
    const successHapticAndSound = async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await paymentSuccessSound();
    };
    const successRatingPrompt = async () => {
      delay(1000);
      await handleRatingPrompt();
    };
    if (animation && animation.current) {
      successHapticAndSound();
      animation.current.play();
    }
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleContinue = async () => {
    dispatch(reset());
    await handleRatingPrompt();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Shop' }],
    });
  };

  if (giftCardCheckout.checkoutUrl) {
    return gcData.isFetched ? (
      <>
        <Layout style={styles.layout} level="2">
          <ScrollView overScrollMode="never">
            <Card style={styles.centerCard}>
              <Text style={styles.gcApprovedTextCenter} category="h6">{t('common.paymentComplete')}</Text>
              <Text style={[styles.gcApprovedTextCenter, styles.gcApprovedMarginVert]} category="h5">{giftCardCheckout.gcType === GIFT_CARDS.LEC ? t('common.lecGiftCard') : t('common.moeAndCityCentreGC')}</Text>
              <Text style={[styles.gcApprovedTextCenter, styles.gcApprovedMarginVert]}>{`${t('common.valueOfGC')} AED ${parseFloat(total).toFixed(0)}`}</Text>
              <Text style={[styles.gcApprovedTextCenter, styles.gcApprovedMarginVert]}>
                <Text category="s1">{t('common.cardRedemptionCode')}</Text>
                {' '}
                {gcData.reference}
              </Text>
              {giftCardCheckout.gcType === GIFT_CARDS.LEC
                ? (
                  <Text style={[styles.gcApprovedMarginVert, styles.gcApprovedTextCenter, styles.gcApprovedInfoText, { marginHorizontal: 10 }]}>
                    { `${t('common.lecCollectionInfo')} `}
                    <Text
                      onPress={() => { whereItWorksBottomSheetRef.current.present(); }}
                      style={[{ fontSize: 13, fontWeight: '400', lineHeight: 15, color: '#411351', textDecorationLine: 'underline' }]}
                    >
                      {`${t('common.seeHere')}`}
                    </Text>
                  </Text>
                )
                : <Text style={[styles.gcApprovedTextCenter, styles.gcApprovedMarginVert, styles.gcApprovedInfoText]}>{t('common.presentAtGCCollection')}</Text>}
              {gcData.expiresAfter ? (
                <Text style={[styles.gcApprovedTextCenter, styles.gcApprovedMarginVert, styles.gcApprovedInfoText]}>
                  {t('common.code')}
                  {' '}
                  <Text style={[styles.gcApprovedInfoText, { fontWeight: '700' }]}>{t('common.expiresIn', { days: gcData.expiresAfter })}</Text>
                  {' '}
                  <Text style={styles.gcApprovedInfoText}>{t('common.ifNotRedeemed')}</Text>
                </Text>
              ) : <></>}
              <View
                style={[styles.lottieViewContainer, styles.gcApprovedMarginVert]}
              >
                {giftCardCheckout.gcType === GIFT_CARDS.LEC ? <LecGiftCardApproved /> : <GiftCardApproved />}
              </View>
              <Text style={[styles.gcApprovedTextCenter, styles.gcApprovedMarginVert, styles.gcApprovedInfoText]}>{t('common.thankYouForSpotii')}</Text>
              <Text style={[styles.gcApprovedTextCenter, styles.gcApprovedMarginVert, styles.gcApprovedInfoText]}>{t('common.futureInstalsAuto')}</Text>

              <Button size="large" onPress={handleContinue}>{t('common.continueShopping')}</Button>
            </Card>
          </ScrollView>
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
      </>
    ) : (
      <>
        <Layout style={styles.layout} level="2">
          <Card style={[styles.centerCard, { marginTop: 7 }]}>
            <Spinner size="giant" />
          </Card>
        </Layout>

      </>

    );
  }

  return (
    <>
      {/* navigateBack backFunction={backAction} /> */}
      <Layout style={styles.layout} level="2">
        <Card style={styles.centerCard}>
          <View style={{ marginHorizontal: '20%' }}>
            <Text style={styles.displayName}>{displayName}</Text>
            {currentDraft && (currentDraft.display_reference || currentDraft.reference)
              ? (
                <Text style={{ textAlign: 'center', color: '#717171' }}>
                  {currentDraft.display_reference || currentDraft.reference}
                </Text>
              ) : <></>}
          </View>
          <View
            style={styles.lottieViewContainer}
          >
            <LottieView
              ref={animation}
              source={require('assets/lottie/order-approved.json')}
              style={styles.lottieView}
              loop={false}
            />
          </View>
          <Text style={styles.paymentComplete}>{t('common.paymentComplete')}</Text>
          <Text style={{ textAlign: 'center', marginVertical: '2%', color: '#717171' }}>{t('common.paymentProcessSuccess')}</Text>
          <View style={{ marginTop: '15%', marginHorizontal: '5%' }}>
            <Button size="large" onPress={handleContinue}>{t('common.continueShopping')}</Button>
          </View>
        </Card>
      </Layout>
    </>
  );
};

OrderApproved.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    reset: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

OrderApproved.defaultProps = {
  navigation: null,
};

export default OrderApproved;
