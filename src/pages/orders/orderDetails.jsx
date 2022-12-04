/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-multiple-empty-lines */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ScrollView, View, BackHandler, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Divider } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/ar';

import { Text, Spinner, Button } from '@ui-kitten/components';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { handleRatingPrompt } from 'utils/handleRatingPrompt';
import formatCurrency from 'utils/formatCurrency';
import { paymentFailureSound, paymentSuccessSound } from 'utils/sounds';
import { pickNextInstallments } from 'utils/pickInstallment';
import {
  INSTALLMENT_STATUS_PAID,
  INSTALLMENT_STATUS_MISSED,
  INSTALLMENT_STATUS_VOIDED,
  INSTALLMENT_STATUS_REFUNDED,
  INSTALLMENTS_STATUS_COMPLETE,
  INSTALLMENTS_STATUS_REFUNDED,
  INSTALLMENT_STATUS_AUTHORIZED,
  INSTALLMENT_STATUS_SCHEDULED,
  INSTALLMENT_STATUS_DRAFT,
  PAYMENT_TYPES,
} from 'utils/constants';
import Icon from 'components/Icon';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { setOrderInfo, setCurrentOrder, setIsPaymentTried } from 'reducers/instalments';
import { fetchPaymentMethods } from 'reducers/paymentMethods';
import { fetchOrderDetails, reset } from 'reducers/orderDetails';
import { fetchMerchantDetailsList } from 'reducers/directory';
import { t } from 'services/i18n';
import FullyPaidIcon from 'assets/fullyPaidIcon';
import PayNowModal from './payNowModal';
import styles from './styles';

const OrderDetails = ({ bottomSheetRef, refreshList, navigation }) => {
  const dispatch = useDispatch();
  const currLang = useSelector((state) => state.language.language);
  const currentOrder = useSelector((state) => state.instalments.currentOrder);
  const paymentMethods = useSelector((state) => state.paymentMethods.list.filter((pm) => pm.cooledOff && (pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY)));
  const { isResolved, data } = useSelector((state) => state.orderDetails);
  const { currentUserCashback } = useSelector((state) => state.user);
  const [payNowVisible, setPayNowVisible] = useState(false);
  const [merchantTile, setMerchantTile] = useState(null);
  const { allMerchantDetails = [] } = useSelector((state) => state.directory);

  const paymentBottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '85%'], []);
  const isRTL = currLang === 'ar';

  const { externalKey, merchant } = currentOrder || {
    externalKey: null,
    merchant: null,
    paymentMethodId: null,
    refundedAmount: null,
  };

  const { currency, userFee, isUpfrontFee, feePerInstallment } = data;
  const userFeeAmount = parseFloat(userFee || 0);
  const feePerInstallmentAmount = parseFloat(feePerInstallment);

  const feePerInstallmentStr = formatCurrency(
    currency,
    feePerInstallmentAmount,
  );

  const userFeeAmountStr = formatCurrency(
    currency,
    userFeeAmount,
  );

  const title = merchant && (merchant.displayName || merchant.name) ? `${merchant.displayName || merchant.name}` : null;
  const remainingInstallments = pickNextInstallments(data.installments);
  const totalRemaining = remainingInstallments ? remainingInstallments.reduce((sum, item) => sum + item.total, 0) : 0;
  const orderCreatedAt = isRTL ? moment(data.createdAt).locale('ar').format('MMMM D, YYYY') : moment(data.createdAt).format('MMMM D, YYYY');

  const authorizedInstallment = data.installments && data.installments.find((inst) => [INSTALLMENT_STATUS_AUTHORIZED].includes(inst.status));


  const refreshDetails = () => {
    dispatch(reset());
    dispatch(fetchOrderDetails(externalKey));
    setPayNowVisible(false);
    dispatch(fetchPaymentMethods('all'));
  };


  useEffect(() => {
    if (allMerchantDetails && allMerchantDetails.merchants) {
      const merchantId = allMerchantDetails.merchants.find((sdMerchant) => sdMerchant.merchantId === merchant.merchantId);
      setMerchantTile(merchantId);
    }
  }, [allMerchantDetails]);


  useEffect(() => {
    refreshDetails();
    dispatch(fetchMerchantDetailsList(currLang));
  }, []);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);


  const handlePayNowSuccess = async () => {
    paymentBottomSheetRef.current.close();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await paymentSuccessSound();
    dispatch(reset());
    dispatch(fetchOrderDetails(externalKey));
    dispatch(fetchPaymentMethods('all'));
    await handleRatingPrompt();
    dispatch(setIsPaymentTried(true));
    // refreshList();
  };


  const handlePayNowFail = async () => {
    paymentBottomSheetRef.current.close();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    await paymentFailureSound();
    dispatch(fetchPaymentMethods('all'));
    // dispatch(setIsPaymentTried());
    // refreshList();
  };


  const handleBack = () => {
    dispatch(reset());
    if (refreshList) {
      refreshList();
      dispatch(setCurrentOrder({ currentOrder: null }));
    }
    bottomSheetRef.current.close();
    return true;
  };


  const totalReimbursedAmount = (installmentId) => {
    let installmentRedeemedAmount = 0;
    if (installmentId && currentUserCashback) {
      currentUserCashback.cashbacks.forEach((cashback) => {
        const { amount, remarks } = cashback;
        if ((remarks || {}).installment_id === installmentId && parseFloat(amount) > 0) {
          installmentRedeemedAmount += parseFloat(amount);
        }
      });
    }
    return installmentRedeemedAmount;
  };


  const renderInstalmentsTimeLine = () => {
    const missedOrNextInstalment = data.installments && data.installments.find((inst) => [INSTALLMENT_STATUS_MISSED, INSTALLMENT_STATUS_SCHEDULED].includes(inst.status));
    let totalRefunded = 0;

    const instalmentsTimeLine = !data.installments
      ? []
      : data.installments.map((instalment, i) => {
        totalRefunded += instalment.refunded || 0;

        const isFirstInstallment = i === 0;

        const redeemedCashbacks = currentUserCashback.cashbacks.filter((cashback) => (cashback.remarks || {}).installment_id === instalment.id && cashback.amount < 0);

        const isCurrentInstallmentMissedOrNext = (missedOrNextInstalment || {}).id === instalment.id;
        const isPartiallyRefunded = data.status !== INSTALLMENTS_STATUS_REFUNDED && instalment.refunded;

        let badgeStyle = [];
        let badgeText = '';
        let badgeTimeline = '';

        let reimbursedAmt = totalReimbursedAmount(instalment.id);
        // eslint-disable-next-line padded-blocks
        switch (instalment.status) {

          case INSTALLMENT_STATUS_PAID: case INSTALLMENT_STATUS_AUTHORIZED: {
            badgeText = t('common.paid');
            badgeStyle = [styles.badgeComplete, styles.badgeTextComplete];

            const paidAtDate = moment(instalment.updatedAt)
              .locale(isRTL ? 'ar' : 'en')
              .format('MMMM D, YYYY');

            badgeTimeline = `${t('common.paidOn')} ${paidAtDate}`;
            break;
          }

          case INSTALLMENT_STATUS_MISSED: {
            badgeStyle = [styles.badgeMissed, styles.badgeTextMissed];
            const diffInDays = moment(new Date()).diff(moment(instalment.date), 'days');
            badgeTimeline = t('common.missedDays', { days: diffInDays });
            break;
          }

          case INSTALLMENT_STATUS_SCHEDULED: case INSTALLMENT_STATUS_DRAFT: {
            const diffInDays = moment(instalment.date).diff(moment(new Date()), 'days');
            badgeTimeline = t('common.nextAutopay', { days: diffInDays });
            break;
          }

          case INSTALLMENT_STATUS_VOIDED: {
            badgeText = t('common.voided');
            badgeStyle = [styles.badgeVoided, styles.badgeTextVoided];

            const voidedAt = moment(instalment.updatedAt)
              .locale(isRTL ? 'ar' : 'en')
              .format('MMMM D, YYYY');

            badgeTimeline = `${t('common.voidedOn')} ${voidedAt}`;
            break;
          }

          case INSTALLMENT_STATUS_REFUNDED: {
            badgeText = t('common.refunded');
            badgeStyle = [styles.badgeRefunded, styles.badgeTextRefunded];
            if(reimbursedAmt){
              badgeTimeline = (<Text style={{fontSize: 10}}>
                {t('common.reimbursedCashback', { amount: formatCurrency(data.currency, reimbursedAmt)})}
              </Text>)
            }
            break;
          }

          default:
            break;
        }

        let totalAmount = instalment.total || instalment.amount || reimbursedAmt;
        totalAmount = instalment.status === INSTALLMENT_STATUS_VOIDED ? 0 : totalAmount;

        const refundedPaymentMethod = paymentMethods.find(pm => pm.id === instalment.paymentMethod);

        return (
          <View style={[styles.installmentCard, { paddingVertical: 14, paddingBottom: isCurrentInstallmentMissedOrNext ? 28 : 14 }]}>
            {
              redeemedCashbacks.map((cashback) => {
                const { createdAt, amount: cashbackAmount, currency: cashbackCurrency } = cashback;

                const isRedeemed = reimbursedAmt < Math.abs(cashbackAmount);

                const componentToReturn = (
                  <View key={createdAt} style={[isRTL ? styles.orderDetailTimelineItemAr : styles.orderDetailTimelineItemEn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>

                    {/* <View key={`circle-${i}`} style={styles.circleActive} /> */}

                    <View style={[isRTL ? styles.cashbackTextAr : styles.cashbackTextEn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View>
                        <Text style={{ marginBottom: '1%' }} category="p1">
                          {
                            currLang === 'ar'
                              ? moment(createdAt).locale('ar').format('MMM D, YYYY')
                              : moment(createdAt).format('MMM D, YYYY')
                          }
                        </Text>
                        <Text category="c1" appearance="hint" style={{ fontSize: 10, textAlign: isRTL ? 'right' : 'left' }}>
                          {
                            isRedeemed
                              ? t('common.cashbackRedeemed')
                              : t('common.cashbackReimbursed')
                          }
                        </Text>
                      </View>

                      <View style={{ justifyContent: 'center' }}>
                        <Text style={{ marginBottom: '1%' }} category="p1">
                          {
                            isRedeemed
                              ? formatCurrency(cashbackCurrency, Math.abs(parseFloat(cashbackAmount) + reimbursedAmt))
                              : formatCurrency(cashbackCurrency, 0)
                          }
                        </Text>
                        <Text
                          category="c1"
                          appearance="hint"
                          style={[
                            isRedeemed ? styles.badgeTextCashbackComplete : styles.badgeTextRefunded,
                            { fontSize: 10, textAlign: isRTL ? 'left' : 'right' },
                          ]}
                        >
                          {
                                  isRedeemed
                                    ? t('common.redeemed')
                                    : t('common.refunded')
                                }
                        </Text>
                      </View>

                    </View>
                  </View>
                );

                if (!isRedeemed) {
                  reimbursedAmt += cashbackAmount;
                }

                return componentToReturn;
              })
            }

            <View key={instalment.date} style={{ alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <View style={[styles.instalmentDetails, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ alignItems: redeemedCashbacks && redeemedCashbacks.length > 0 ? 'flex-start' : 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <Text
                    style={[
                      styles.installmentNumber,
                      isCurrentInstallmentMissedOrNext || isPartiallyRefunded ? { position: 'absolute', top: 40 } : {},
                      isRTL ? { marginLeft: 12 } : { marginRight: 12 },
                    ]}
                  >
                    {isRTL ? `.${i + 1}` : `${i + 1}.`}
                  </Text>

                  <View
                    style={[
                      { justifyContent: 'center' },
                      isRTL ? { marginRight: isCurrentInstallmentMissedOrNext || isPartiallyRefunded ? 24 : 0 } : { marginLeft: isCurrentInstallmentMissedOrNext || isPartiallyRefunded ? 24 : 0 },
                    ]}
                  >
                    <Text style={[styles.installmentDate, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {
                        currLang === 'ar'
                          ? moment(instalment.date).locale('ar').format('MMM D, YYYY')
                          : moment(instalment.date).format('MMM D, YYYY')
                      }
                    </Text>
                    {badgeTimeline !== '' && (
                      <Text
                        style={[
                          instalment.status === INSTALLMENT_STATUS_MISSED
                            ? styles.missedTimelineText
                            : styles.orderText,
                          { marginTop: 2, marginBottom: 0, textAlign: isRTL ? 'right' : 'left' },
                        ]}
                      >
                        {badgeTimeline}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ justifyContent: 'center' }}>
                  <Text
                    style={[
                      styles.installmentDate,
                      !isRTL
                        ? { textAlign: 'right' }
                        : { textAlign: 'left' },
                    ]}
                  >
                    {formatCurrency(data.currency, totalAmount)}
                  </Text>

                  {isFirstInstallment && userFeeAmount && isUpfrontFee ? (
                    <Text
                      style={[
                        { color: '#717171', fontSize: 12, fontWeight: '300', lineHeight: 15 },
                        isRTL
                          ? { textAlign: 'left' }
                          : { textAlign: 'right' },
                      ]}
                    >
                      {t('common.inclUpfrontFeeOf', { amount: userFeeAmountStr })}
                    </Text>
                  ) : <></>}

                  <Text
                    style={[
                      badgeStyle[1],
                      isRTL
                        ? { textAlign: 'left' }
                        : { textAlign: 'right' },
                    ]}
                  >
                    {badgeText}
                  </Text>
                </View>
              </View>
            </View>


            {isCurrentInstallmentMissedOrNext && (
              <View style={{ marginLeft: isRTL ? 0 : 24, marginBottom: 12 }}>
                <Divider orientation="horizontal" insetType="middle" color="#EDE6FF" style={{ marginTop: 12, flexGrow: 0 }} width={1} />

                <View style={[styles.missedOrNextTimeline, { display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text
                    style={{
                      flex: 3,
                      color: '#717171',
                      fontSize: 12,
                      lineHeight: 15,
                      textAlign: isRTL ? 'right' : 'left',
                      flexWrap: 'wrap',
                    }}
                  >
                    {t('common.installmentCardPayment')}
                  </Text>

                  <Button
                    appearance="filled"
                    onPress={() => {
                      const orderInfo = { ...currentOrder, installmentStatus: badgeTimeline, installmentType: 'next' };
                      dispatch(setOrderInfo(orderInfo));
                      paymentBottomSheetRef.current.present();
                      dispatch(setIsPaymentTried(false));
                    }}
                    style={styles.payNowButton}
                  >
                    {(evaProps) => (
                      <Text {...evaProps} style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                        {t('common.payNow')}
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
            )}

            {isPartiallyRefunded ? (
              <View style={{ marginLeft: isRTL ? 0 : 24, marginRight: isRTL ? 24 : 0 }}>
                <Divider orientation="horizontal" insetType="middle" color="#EDE6FF" style={{ marginTop: 12, flexGrow: 0 }} width={1} />

                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginTop: 12 }}>
                  <Text
                    style={{
                      flex: 1,
                      color: '#717171',
                      fontSize: 12,
                      fontWeight: '300',
                      lineHeight: 15,
                      textAlign: isRTL ? 'right' : 'left',
                      flexWrap: 'wrap',
                    }}
                  >
                    {refundedPaymentMethod
                      ? t('common.installmentRefundedOnCard', {
                        cardNumber: refundedPaymentMethod.number.slice(4),
                        refundDate: moment(instalment.updatedAt)
                          .locale(isRTL ? 'ar' : 'en')
                          .format('MMMM D, YYYY'),
                      })
                      : t('common.installmentRefunded', {
                        refundDate: moment(instalment.updatedAt)
                          .locale(isRTL ? 'ar' : 'en')
                          .format('MMMM D, YYYY'),
                      })}
                  </Text>

                  <View style={{ justifyContent: 'center' }}>
                    <Text
                      style={[
                        styles.installmentDate,
                        !isRTL
                          ? { textAlign: 'right' }
                          : { textAlign: 'left' },
                      ]}
                    >
                      {formatCurrency(instalment.currency, instalment.refunded)}
                    </Text>

                    <Text
                      style={[
                        styles.badgeTextRefunded,
                        isRTL
                          ? { textAlign: 'left' }
                          : { textAlign: 'right' },
                      ]}
                    >
                      {t('common.refunded')}
                    </Text>
                  </View>
                </View>
              </View>
            ) : <></>}
          </View>
        );
      });
    return { component: instalmentsTimeLine, totalRefunded };
  };

  const instalmentsTimeLine = isResolved ? renderInstalmentsTimeLine() : {};
  const refundedPaymentMethod = paymentMethods.find(pm => pm.id === data.paymentMethod);

  return (
    <BottomSheetScrollView>
      <KeyboardAvoidingView>
        <View style={{ marginHorizontal: 18, marginTop: 34, paddingBottom: '7%', backgroundColor: 'white' }}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            {merchantTile ? (
              <Image style={styles.image} source={{ uri: merchantTile.displayPicture }} />
            ) : (
              <Image style={[styles.image, { backgroundColor: 'rgba(0,0,0,.35)' }]} source={{ uri: '' }} />
            )}
            <View style={styles.orderDetailHeader}>
              {title && (
                <Text style={styles.merchantText}>
                  {title}
                </Text>
              )}

              <Text style={[styles.orderText]}>
                {data.displayReference}
                {' '}
              </Text>

              <Text style={[styles.orderText, { textAlign: 'left' }]}>
                {data.displayReference && (
                  `${t('common.purchased')} ${orderCreatedAt}`
                )}
                {' '}
              </Text>
            </View>
          </View>

          <View style={[
            styles.totalCard,
            data.refundedAmount ? { paddingVertical: 14 } : {},
          ]}
          >
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              {
                !isResolved
                  ? <Spinner size="medium" />
                  : (
                    <>
                      {userFeeAmount || data.refundedAmount ? (
                        <Text
                          style={[
                            styles.totalAmountWithFee,
                            isRTL ? { marginRight: 32, textAlign: 'right' } : { marginLeft: 32, textAlign: 'left' },
                          ]}
                        >
                          {`${t('common.total')}: `}
                        </Text>
                      ) : (
                        <Text style={[styles.orderText, { textAlign: isRTL ? 'right' : 'left' }]}>
                          {t('common.totalAmount')}
                        </Text>
                      )}
                      <Text
                        style={[data.status === INSTALLMENTS_STATUS_COMPLETE ? styles.totalAmountPaidText : styles.totalAmountText, { fontSize: userFeeAmount ? 18 : 20 }]}
                        status="basic"
                        appearance="hint"
                      >
                        {formatCurrency(
                          data.currency,
                          data.refundedAmount && data.installmentsAmount === data.refundedAmount
                            ? data.installmentsAmountInclFee || data.installmentsAmount
                            : data.installmentsTotal,
                        )}
                      </Text>
                      {userFeeAmount ? (
                        <Text style={{ color: '#717171', fontSize: 12, fontWeight: '300', lineHeight: 15 }}>
                          {
                            !isUpfrontFee
                              ? ` ${t('common.inclFeeOf', { amount: feePerInstallmentStr })}`
                              : ` ${t('common.inclUpfrontFeeOf', { amount: userFeeAmountStr })}`
                          }
                        </Text>
                      ) : <></>}
                    </>
                  )
              }
            </View>
            {data.refundedAmount ? (
              <View style={{ marginHorizontal: 20 }}>
                <Divider orientation="horizontal" insetType="middle" color="#D9D9D9" style={{ marginTop: 12, flexGrow: 0 }} width={1} />

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <Text style={[styles.refundInfoText, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('common.originalAmount')}
                  </Text>

                  <Text
                    style={styles.refundInfoText}
                    status="basic"
                    appearance="hint"
                  >
                    {formatCurrency(data.currency, data.installmentsAmountInclFee || data.installmentsAmount)}
                  </Text>
                </View>

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.refundInfoText, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('common.refundedAmount')}
                  </Text>

                  <Text
                    style={styles.refundInfoText}
                    status="basic"
                    appearance="hint"
                  >
                    {formatCurrency(data.currency, data.refundedAmount)}
                  </Text>
                </View>
              </View>
            ) : <></>}
          </View>

          <View style={styles.orderDetailTimelineContainer}>
            {(data || {}).gcReference && (
              <Text style={{ textAlign: currLang === 'ar' ? 'right' : 'left', marginVertical: 7 }}>
                <Text style={{ textAlign: currLang === 'ar' ? 'right' : 'left' }} category="s1">
                  {t('common.cardRedemptionCode')}
                </Text>
                {' '}
                {data.gcReference}
              </Text>
            )}
            <Text style={[styles.subTextColor]}>{t('common.paymentsTimeline')}</Text>
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              {
                !isResolved
                  ? <Spinner size="medium" />
                  : (
                    <>
                      {instalmentsTimeLine.component}
                      <View style={{ marginTop: 20 }}>
                        {data.status === INSTALLMENTS_STATUS_COMPLETE ? (
                          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View>
                              <FullyPaidIcon />
                            </View>
                            <Text
                              style={[
                                styles.badgeTextComplete,
                                {
                                  fontSize: 16,
                                  fontWeight: '700',
                                  textAlign: 'center',
                                  marginHorizontal: 4,
                                },
                              ]}
                            >
                              {t('common.orderFullyPaid')}
                            </Text>
                          </View>
                        ) : data.status === INSTALLMENTS_STATUS_REFUNDED ? (
                          <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
                              <View>
                                <FullyPaidIcon />
                              </View>
                              <Text
                                style={[
                                  styles.badgeTextComplete,
                                  {
                                    fontSize: 16,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    marginHorizontal: 4,
                                  },
                                ]}
                              >
                                {t('common.fullyRefunded', { currency: data.currency, amount: instalmentsTimeLine.totalRefunded })}
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: '#717171',
                                fontSize: 12,
                                fontWeight: '300',
                                lineHeight: 15,
                                textAlign: isRTL ? 'right' : 'left',
                                flexWrap: 'wrap',
                                marginTop: 10,
                              }}
                            >
                              {refundedPaymentMethod
                                ? t('common.installmentRefundedOnCard', {
                                  cardNumber: refundedPaymentMethod.number.slice(4),
                                  refundDate: moment(data.updatedAt)
                                    .locale(isRTL ? 'ar' : 'en')
                                    .format('MMMM D, YYYY'),
                                })
                                : t('common.installmentRefunded', {
                                  refundDate: moment(data.updatedAt)
                                    .locale(isRTL ? 'ar' : 'en')
                                    .format('MMMM D, YYYY'),
                                })}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: isRTL ? 'row-reverse' : 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {!authorizedInstallment && data.status !== INSTALLMENTS_STATUS_REFUNDED ? (
                              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                <Text
                                  style={{
                                    color: '#411361',
                                    fontSize: 16,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                  }}
                                  onPress={() => {
                                    dispatch(
                                      setOrderInfo({
                                        ...currentOrder,
                                        installmentType: 'full',
                                        installmentStatus: t('common.payAll'),
                                        remainingInstallmentTotal: totalRemaining,
                                      }),
                                    );
                                    paymentBottomSheetRef.current.present();
                                    dispatch(setIsPaymentTried(false));
                                  }}
                                >
                                  {`${t('common.payFullRemaining')} ${formatCurrency(data.currency, totalRemaining)}`}
                                </Text>
                                <Text>
                                  {Icon(
                                    {
                                      fill: '#411361',
                                      width: 20,
                                      height: 20,
                                      padding: 3,
                                    },
                                    isRTL ? 'arrow-back-outline' : 'arrow-forward-outline',
                                  )}
                                </Text>
                              </View>
                            ) : <></>}
                          </View>
                        )}
                      </View>
                    </>
                  )
              }
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomSheetModal
        ref={paymentBottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(backdropProps) => <BottomSheetBackdrop {...backdropProps} enableTouchThrough />}
      >
        <PayNowModal
          bottomSheetRef={paymentBottomSheetRef}
          visible={payNowVisible}
          setVisible={setPayNowVisible}
          installmentsId={data.installmentsId}
          lateFee={data.lateFee}
          installments={data.installments}
          paymentMethods={paymentMethods}
          defaultPaymentMethod={data.paymentMethod}
          onSuccess={handlePayNowSuccess}
          onFail={handlePayNowFail}
          firstInstallmentAmountAed={data.firstInstallmentAmountAed}
        />
      </BottomSheetModal>
    </BottomSheetScrollView>
  );
};

OrderDetails.propTypes = {
  bottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      present: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
  refreshList: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

OrderDetails.defaultProps = {
  bottomSheetRef: null,
  navigation: null,
};

export default OrderDetails;
