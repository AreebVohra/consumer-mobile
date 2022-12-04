/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { View, BackHandler, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Text,
  Button,
  Spinner,
  Layout,
} from '@ui-kitten/components';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { pickNextInstallment, pickNextInstallments, pickNextInstallmentIndex, checkIsLastInstallment } from 'utils/pickInstallment';
import { payInstallment, payAllInstallments } from 'api';
import { showMessage } from 'react-native-flash-message';
import PropTypes from 'prop-types';
import formatCurrency, { formatPaymentAmount } from 'utils/formatCurrency';
import { t } from 'services/i18n';
import convertCurrency from 'utils/convertCurrency';
import { fetchPaymentMethods } from 'reducers/paymentMethods';
import { retrieveConsumerCashbacks } from 'reducers/user';
import {
  PAYMENT_TYPES,
  CASHBACK,
  INSTALLMENT_STATUS_MISSED,
} from 'utils/constants';
import {
  selectPaymentMethod,
} from 'reducers/scanner';
import commonStyles from 'utils/commonStyles';
import VisaLogo from 'assets/visaLogo';
import MasterCardLogo from 'assets/masterCardLogo';
import GiftCardIcon from 'assets/giftCardIcon';
import AddNew from 'assets/addNew';
import TileSelector from 'components/TileSelector';
import VgsPaymentForm from 'components/VgsPaymentForm';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { setInstallmentData, resetRedirectData } from 'reducers/vgs';
import { delay } from 'utils/delay';
import styles from './styles';

const PayNowModal = ({
  bottomSheetRef,
  visible,
  setVisible,
  installmentsId,
  lateFee,
  installments,
  paymentMethods,
  defaultPaymentMethod,
  onSuccess,
  onFail,
  firstInstallmentAmountAed,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCashbackSubmitting, setIsCashbackSubmitting] = useState(false);
  const [cashbackError, setCashbackError] = useState(false);
  const currLang = useSelector(state => state.language.language);
  const { currentUserCashback } = useSelector(state => state.user);
  const { conversions } = useSelector(state => state.application);
  const orderInfo = useSelector(state => state.instalments.orderInfo);
  const { installmentData } = useSelector(state => state.vgs);
  const [payWhat, setPayWhat] = useState('next');
  const [paymentMethodId, setPaymentMethodId] = useState(defaultPaymentMethod);

  const nextInstallment = pickNextInstallment(installments);
  const nextInstallmentIndex = pickNextInstallmentIndex(installments);
  const remainingInstallments = pickNextInstallments(installments);
  const totalRemaining = remainingInstallments ? remainingInstallments.reduce((sum, item) => sum + item.total, 0) : 0;
  // eslint-disable-next-line no-nested-ternary
  const totalRemainingPayment = payWhat === 'full' ? totalRemaining : nextInstallment ? nextInstallment.total : 0;
  const amountToBePaid = totalRemainingPayment + (lateFee || 0);
  const currency = nextInstallment ? nextInstallment.currency : '';
  const payInDiffCurrencyDisclaimer = currency === 'SAR';
  const isLateFeeApplicable = lateFee > 0;
  const isMissedInstallment = payWhat === 'next' && nextInstallment.status === INSTALLMENT_STATUS_MISSED;
  const isLastInstallment = checkIsLastInstallment(installments);

  const [defaultPMIndex, setDefaultPMIndex] = useState(0);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [newCardAttempt, setNewCardAttempt] = useState(false);
  const [cashback, setCashback] = useState(false);
  const [cvvOnly, setCvvOnly] = useState(false);
  const isRTL = currLang === 'ar';

  useEffect(() => {
    const backAction = () => {
      bottomSheetRef.current.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (orderInfo) {
      setPayWhat(orderInfo.installmentType);
    }
  }, [orderInfo]);

  useEffect(() => {
    dispatch(resetRedirectData());
    if ((cvvOnly || newCardAttempt) && currency && orderInfo) {
      const [convertedCurrency, convertedAmount] = convertCurrency(currency, amountToBePaid);
      const currentInstallmentData = {
        payWhat,
        orderId: orderInfo.order.orderId,
        amount: formatCurrency(convertedCurrency, convertedAmount),
        nextInstallmentId: payWhat === 'full' ? 'all' : nextInstallment.id,
      };
      dispatch(setInstallmentData(currentInstallmentData));
    }
  }, [newCardAttempt, cvvOnly, orderInfo?.order?.orderId]);

  const cards = paymentMethods.filter((pm) => pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY);
  const defaultPaymentMethodId = (paymentMethods.find((pm) => pm.isDefault && (pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY)));

  useEffect(() => {
    if (defaultPaymentMethodId) {
      setSelectedPaymentMethodId(defaultPaymentMethodId?.id || defaultPaymentMethod);
      setDefaultPMIndex(paymentMethods.findIndex((pm) => pm.id === defaultPaymentMethodId.id));
      if (!defaultPaymentMethodId.autoDebit) {
        setCvvOnly(true);
      }
    }
  }, []);

  useEffect(() => {
    if (listData.length === 1) {
      handlePaymentMethodSelect(listData[0]);
    }
  }, []);

  const convertedCashbackTotal = currency && convertCurrency(
    currency,
    (currentUserCashback || {}).total || 0,
    'AED',
    true,
    conversions,
  )[1];

  const listData = cards.map((method) => ({
    title: <Text style={{ paddingHorizontal: 14 }}>{`﹡﹡﹡﹡${method.number ? method.number.slice(-4) : ''}`}</Text>,
    item: method,
  }));

  if (isLastInstallment && convertedCashbackTotal > 0) {
    listData.push({
      title: <Text style={{ fontSize: 14 }}>{t('common.spotiiRewards')}</Text>,
      cashback: true,
    });
  }

  listData.push({
    title: <Text style={{ fontSize: 14 }}>{t('common.addNewCard')}</Text>,
    newCard: true,
  });

  const renderListItemIcon = (props, item) => {
    if (item.cashback) {
      const gitCardLogo = <GiftCardIcon />;
      return <View style={styles.cardLogo}>{gitCardLogo}</View>;
    }
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

  const renderNewCardSelectHeader = (item, _, __) => (
    <View style={newCardAttempt ? styles.accordionHeaderContainerSelected : styles.accordionHeaderContainer}>
      <View style={[styles.flexRow, { alignItems: 'center' }]}>
        {!newCardAttempt ? (
          <View style={styles.accordionSelectPlus}>
            <AddNew />
          </View>
        )
          : (
            <View style={[styles.accordionSelectOuter, { borderColor: newCardAttempt ? '#AA8FFF' : '#717171' }]}>
              <View style={[styles.accordionSelectInner, { backgroundColor: newCardAttempt ? '#AA8FFF' : '#FFFFFF' }]} />
            </View>
          )}
        <View style={[styles.pmContainer, { justifyContent: 'space-between' }]}>
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

  const renderCashbackSelectHeader = (item, _, __) => (
    <View style={cashback ? styles.headerContainerSelectedFullBorder : styles.accordionHeaderContainer}>
      <View style={[styles.flexRow, { alignItems: 'center' }]}>
        <View style={[styles.accordionSelectOuter, { borderColor: cashback ? '#AA8FFF' : '#717171' }]}>
          <View style={[styles.accordionSelectInner, { backgroundColor: cashback ? '#AA8FFF' : '#FFFFFF' }]} />
        </View>
        <View style={styles.pmContainer}>
          {renderListItemIcon(null, item)}
          {item.title}
        </View>
      </View>
    </View>
  );

  const renderPaymentMethodSelectHeader = (item, _, __) => {
    if (item.newCard) {
      return renderNewCardSelectHeader(item, _, __);
    }
    if (item.cashback) {
      return renderCashbackSelectHeader(item, _, __);
    }
    const isSelected = item.item && item.item.id === selectedPaymentMethodId;
    return (
      <View style={isSelected ? styles.headerContainerSelectedFullBorder : styles.accordionHeaderContainer}>
        <View style={[styles.flexRow, { alignItems: 'center' }]}>
          <View style={[styles.accordionSelectOuter, { borderColor: isSelected ? '#AA8FFF' : '#717171' }]}>
            <View style={[styles.accordionSelectInner, { backgroundColor: isSelected ? '#AA8FFF' : '#FFFFFF' }]} />
          </View>
          <View style={styles.pmContainer}>
            {renderListItemIcon(null, item.item)}
            {item.title}
          </View>
        </View>
      </View>

    );
  };

  const renderNewCardSelectBody = (_, __, ___) => (newCardAttempt && installmentData.orderId ? (
    <Layout level="1" style={styles.accordionBodyNoPadding}>
      <View style={styles.accordionHeaderDivider} />
      <VgsPaymentForm
        handleBack={(shouldApplyDelay = false) => {
          delay(shouldApplyDelay ? 3000 : 0).then(() => {
            dispatch(fetchPaymentMethods('all'));
            dispatch(resetRedirectData());
            setNewCardAttempt(false);
            onSuccess();
          });
        }}
        showHeader={false}
      />
    </Layout>

  ) : <></>);

  const renderAddCVVBody = (_, __, ___) => (cvvOnly && installmentData.orderId ? (
    <Layout level="1" style={styles.accordionBodyNoPadding}>
      <View style={styles.accordionHeaderDividerCVV} />
      <VgsPaymentForm
        handleBack={(shouldApplyDelay = false) => {
          delay(shouldApplyDelay ? 3000 : 0).then(() => {
            dispatch(fetchPaymentMethods('all'));
            dispatch(resetRedirectData());
            setCvvOnly(false);
            onSuccess();
          });
        }}
        showHeader={false}
        cvvOnly={cvvOnly}
        paymentMethodId={selectedPaymentMethodId}
      />
    </Layout>
  ) : <></>);

  const renderPaymentMethodSelectBody = (item, __, ___) => {
    if (item.newCard) {
      return renderNewCardSelectBody(item, __, ___);
    // eslint-disable-next-line no-else-return
    } else if (item.item && !item.item.autoDebit) {
      return renderAddCVVBody(item, __, ___);
    } else {
      return <></>;
    }
  };

  const handlePaymentMethodSelect = (item) => {
    if (item.cashback) {
      setSelectedPaymentMethodId(null);
      setNewCardAttempt(false);
      setCvvOnly(false);
      return setCashback(true);
    }
    setCashback(false);
    if (!item.item) {
      setSelectedPaymentMethodId(null);
      setCvvOnly(false);
      return setNewCardAttempt(true);
    }
    setCvvOnly(!item.item.autoDebit);
    setNewCardAttempt(false);
    setSelectedPaymentMethodId(item.item.id);
    dispatch(selectPaymentMethod(item.item.id));
  };

  const submitForm = async (isCashback = false) => {
    if (isSubmitting) {
      return;
    }

    if (isCashback) {
      setIsCashbackSubmitting(true);
    } else {
      setIsSubmitting(true);
    }

    const promises = [];
    const { accountId } = installments[0];
    const parentInstallmentIds = [];
    parentInstallmentIds.push(installmentsId);

    if (paymentMethods.length) {
      if (payWhat === 'full') {
        promises.push(payAllInstallments(isCashback, accountId, parentInstallmentIds, selectedPaymentMethodId));
      } else {
        promises.push(payInstallment(isCashback, nextInstallment.id, selectedPaymentMethodId || defaultPaymentMethodId.id));
      }

      Promise.all(promises)
        .then(() => {
          setIsSubmitting(false);
          setVisible(false);
          dispatch(retrieveConsumerCashbacks());
          showMessage({
            message: t('success.paymentPaid'),
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
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(err => {
          setIsSubmitting(false);
          console.error('error', err);
          showMessage({
            message: t('errors.somethingWrongContactSupport'),
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
          if (onFail) {
            onFail();
          }
        });
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {orderInfo && (
        <View style={{ height: '100%' }}>
          <BottomSheetScrollView>
            <KeyboardAvoidingView>
              <View style={{
                backgroundColor: '#F9F9F9',
                paddingVertical: '5%',
              }}
              >
                <Text style={[styles.heading]}>{t('common.confirmPayment')}</Text>

                <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '400', marginVertical: 18 }}>
                  {currency}
                  <Text style={{ fontSize: 35, fontWeight: '400' }}>
                    {' '}
                    {!cashback ? formatPaymentAmount(amountToBePaid) : formatPaymentAmount(Math.min(convertedCashbackTotal, totalRemainingPayment))}
                  </Text>
                </Text>
              </View>
              <View style={{ paddingHorizontal: '4%' }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontWeight: '700', fontSize: 18, lineHeight: 22.5, color: '#1A0826', marginTop: '4%', maxWidth: '65%',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {orderInfo.merchant.displayName}
                  </Text>
                  {payWhat === 'next' && nextInstallmentIndex ? <Text style={styles.installmentNumber}>{` (${t(`common.instal${nextInstallmentIndex}`)})`}</Text> : <></>}
                </View>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: '2%' }}>
                  <Text style={{ color: '#717171', fontSize: 14 }}>{t('common.orderRef')}</Text>
                  <Text style={{ color: '#717171', fontSize: 14 }}>{orderInfo.order.displayReference}</Text>
                </View>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: '1%' }}>
                  <Text style={{ color: '#717171', fontSize: 14 }}>{t('common.status')}</Text>
                  <Text style={{ color: isMissedInstallment ? '#FF4D4A' : '#717171', fontSize: 14 }}>{orderInfo.installmentStatus}</Text>
                </View>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: '1%' }}>
                  <Text style={{ color: '#717171', fontSize: 14 }}>{t('common.installmentAmount')}</Text>
                  <Text style={{ color: '#717171', fontSize: 14 }}>{formatCurrency(currency, totalRemainingPayment)}</Text>
                </View>
                {isLateFeeApplicable ? (
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: '1%' }}>
                    <Text style={{ color: '#717171', fontSize: 14 }}>{t('common.lateFeeCharges')}</Text>
                    <Text style={{ color: '#717171', fontSize: 14 }}>{formatCurrency(currency, lateFee)}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.paymentOptionListContainer}>
                <View style={styles.cardSelection}>
                  <Text
                    style={[
                      commonStyles.subTextColor,
                      {
                        textAlign: currLang === 'ar' ? 'right' : 'left', marginBottom: '2%', fontWeight: '400', fontSize: 14, lineHeight: 17.5, color: '#353535',
                      },
                    ]}
                  >
                    {t('common.selectPaymentMethod')}
                  </Text>
                  {listData.length ? (
                    <TileSelector
                      list={listData}
                      renderHeader={renderPaymentMethodSelectHeader}
                      renderBody={renderPaymentMethodSelectBody}
                      onToggle={(item, index, random) => {
                        handlePaymentMethodSelect(listData[index]);
                      }}
                      defaultIndex={Math.max(defaultPMIndex, 0)}
                      isDisabled={(item, _) => (item.newCard && newCardAttempt && listData.length > 1) || (item.item && item.item.id === selectedPaymentMethodId)}
                      // eslint-disable-next-line no-nested-ternary
                      itemKey={item => (item.newCard ? 'new-card-form' : item.cashback ? 'cashback-form' : item.item.id)}
                    />
                  ) : (
                    <></>
                  )}
                  {(selectedPaymentMethodId || cashback) && !cvvOnly
                  && (
                  <Button
                    size="medium"
                    onPress={() => submitForm(cashback)}
                    style={{ marginTop: '4%' }}
                    accessoryRight={() => (isSubmitting && !isCashbackSubmitting ? <Spinner status="basic" size="tiny" /> : null)}
                    disabled={isSubmitting || isCashbackSubmitting}
                  >
                    {`${t('common.payInstallment')} `}
                    {!cashback ? formatCurrency(currency, amountToBePaid) : formatCurrency(currency, Math.min(convertedCashbackTotal, totalRemainingPayment))}
                  </Button>
                  )}
                  {payInDiffCurrencyDisclaimer ? (
                    <View style={{ paddingHorizontal: '2%', marginTop: '2%' }}>
                      <Text style={{ textAlign: currLang === 'ar' ? 'right' : 'left' }} category="s2">
                        {t('common.differentCurrencyNote', { amount: formatCurrency('AED', firstInstallmentAmountAed) })}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {cashbackError ? (
                <Text style={{
                  width: '100%', color: 'red', marginTop: 5, textAlign: 'center',
                }}
                >
                  {t('common.cashbackScarcity')}
                </Text>
              ) : null}
            </KeyboardAvoidingView>
          </BottomSheetScrollView>
        </View>
      ) }
    </>

  );
};

PayNowModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  installmentsId: PropTypes.string.isRequired,
  lateFee: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  firstInstallmentAmountAed: PropTypes.number,
};

PayNowModal.defaultProps = {
  onSuccess: () => {},
  onFail: () => {},
  firstInstallmentAmountAed: 0,
};

export default PayNowModal;
