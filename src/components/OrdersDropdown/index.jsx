/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import {
  Text,
  Spinner,
  Select,
  SelectItem,
  IndexPath,
  ButtonGroup,
  Button,
} from '@ui-kitten/components';
import { pickNextInstallment, pickNextInstallments } from 'utils/pickInstallment';
import convertCurrency from 'utils/convertCurrency';
import formatCurrency from 'utils/formatCurrency';
import 'moment/locale/ar';
import PropTypes from 'prop-types';
import { Image, ImageBackground, View, StatusBar } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails, reset } from 'reducers/orderDetails';
import { payInstallment, payAllInstallments } from 'api';
import { retrieveConsumerCashbacks } from 'reducers/user';
import { showMessage } from 'react-native-flash-message';
import { t } from 'services/i18n';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import styles from '../../pages/orders/payNowModal/styles';
import { INSTALLMENT_STATUS_AUTHORIZED, INSTALLMENT_STATUS_PAID, PAYMENT_TYPES } from '../../../utils/constants';

const OrdersDropDown = ({
  orders,
  selected,
  onSelect,
  isLoading,
  onSuccess,
  merchantsList,
  navigation,
}) => {
  const dispatch = useDispatch();
  //   const isFocused = useIsFocused();
  const paymentMethods = useSelector(
    state => state.paymentMethods.list.filter(pm => pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY),
  );
  const [initialIndex, setInitialIndex] = useState();
  const [cashbackError, setCashbackError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(initialIndex));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payWhat, setPayWhat] = useState('next');
  const [paymentMethodId, setPaymentMethodId] = useState(
    paymentMethods.filter(p => p && p.isDefault)[0].id,
  );
  const { currentUserCashback } = useSelector(state => state.user);
  const { isResolved, data } = useSelector(state => state.orderDetails);
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const [nextInstallment, setNextInstallment] = useState(
    pickNextInstallment((data || {}).installments),
  );
  const [remainingInstallments, setRemainingInstallments] = useState(
    pickNextInstallments((data || {}).installments),
  );
  const totalRemaining = remainingInstallments
    ? remainingInstallments.reduce((sum, item) => sum + item.total, 0) : 0;
  // eslint-disable-next-line no-nested-ternary
  const totalRemainingPayment = payWhat === 'full' ? totalRemaining + ((data || {}).lateFee || 0) : nextInstallment ? nextInstallment.total : 0;
  const [currency, setCurrency] = useState(nextInstallment ? nextInstallment.currency : '');
  const payInDiffCurrencyDisclaimer = currency === 'SAR';
  const [amount, setAmount] = useState(nextInstallment ? nextInstallment.total : '');
  const [initial, setInitial] = useState(selectedIndex.row || initialIndex);
  const [currentOrder, setCurrentOrder] = useState(orders[initial || 0]);

  const [convertedCashbackTotal, setConvertedCashbackTotal] = useState(convertCurrency(
    currency || 'AED',
    (currentUserCashback || {}).total || 0,
  )[1]);

  const [isSufficientCashback, setIsSufficientCashback] = useState(
    parseFloat(convertedCashbackTotal).toFixed(2) > 0,
  );

  useEffect(() => {
    setCurrency(nextInstallment ? nextInstallment.currency : '');
    setAmount(nextInstallment ? nextInstallment.total : '');
  }, [nextInstallment]);

  useEffect(() => {
    setConvertedCashbackTotal(convertCurrency(
      currency || 'AED',
      (currentUserCashback || {}).total || 0,
    )[1]);
  }, [currency]);

  useEffect(() => {
    setInitial(selectedIndex.row || initialIndex);
    setCurrentOrder(orders[selectedIndex.row || 0]);
  }, [selectedIndex]);

  const refreshDetails = () => {
    dispatch(reset());
    dispatch(fetchOrderDetails(currentOrder.externalKey));
  };

  useEffect(() => {
    refreshDetails();
  }, [currentOrder]);

  useEffect(() => {
    setNextInstallment(pickNextInstallment(data.installments));
    setRemainingInstallments(pickNextInstallments(data.installments));
    // setPaymentMethodId((data || {}).paymentMethod);
  }, [data]);

  useEffect(() => {
    let result;

    if (selected) {
      orders.forEach((o, i) => {
        if (o.installmentsId === selected) {
          result = i + 1;
        }
      });
    }
    // setSelectedIndex(new IndexPath(result -1));
    setInitialIndex(result - 1);
  }, []);

  const submitForm = async () => {
    if (isSubmitting) {
      return;
    }

    if (!isSufficientCashback) {
      setIsSubmitting(false);
      setCashbackError(true);
      return;
    }

    setIsSubmitting(true);
    setCashbackError(false);

    const promises = [];
    const { accountId } = data.installments[0];
    const parentInstallmentIds = [];
    parentInstallmentIds.push(currentOrder.installmentsId);

    if (payWhat === 'full') {
      promises.push(payAllInstallments(true, accountId, parentInstallmentIds, paymentMethodId));
    } else {
      promises.push(payInstallment(true, nextInstallment.id, paymentMethodId));
    }

    Promise.all(promises)
      .then(() => {
        setIsSubmitting(false);
        dispatch(retrieveConsumerCashbacks());
        showMessage({
          message: t('success.paymentPaid'),
          backgroundColor: '#FFFFFF',
          color: '#0EBD8F',
          statusBarHeight: StatusBar.currentHeight,
          style: {
            borderColor: '#0EBD8F',
            width: '100%',
            alignItems: `flex-${isRTL ? 'end' : 'start'}`,
            textAlign: isRTL ? 'right' : 'left',
            borderLeftWidth: isRTL ? 0 : 2,
            borderRightWidth: isRTL ? 2 : 0,
          },
        });
        onSuccess(false);
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
            width: '100%',
            alignItems: `flex-${isRTL ? 'end' : 'start'}`,
            textAlign: isRTL ? 'right' : 'left',
            borderLeftWidth: isRTL ? 0 : 2,
            borderRightWidth: isRTL ? 2 : 0,
          },
        });
        onSuccess(false);
      });
  };

  const handleSelect = index => {
    setSelectedIndex(index);
    setCurrentOrder(orders[index.row]);
    onSelect(orders[index.row].installmentsId);
  };

  const orderSelectItem = (order, isSelected = false) => {
    const orderMerchant = merchantsList.find(
      ({ merchant_ids }) => (merchant_ids || []).includes((order.merchant || {}).merchantId),
    ) || {};
    const affiliateAttempt = orderMerchant.is_affiliate;
    const bgImage = { uri: orderMerchant.displayPicture };
    const image = { uri: orderMerchant.logo };
    const numInstallments = order.installments.length;
    const numCompletedInstallments = order.installments.filter(
      inst => inst.status === INSTALLMENT_STATUS_AUTHORIZED
              || inst.status === INSTALLMENT_STATUS_PAID,
    ).length;
    return (
      <SelectItem
        key={order.installmentsId}
        style={isSelected ? { backgroundColor: 'rgb(247, 249, 252)', maxWidth: '90%', borderWidth: 0 } : null}
        title={() => (
          <View style={styles.cashbackParentTile}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.merchantTile}
              >
                <ImageBackground
                  source={bgImage}
                  style={
                  affiliateAttempt
                    ? styles.bgImageAffiliate
                    : styles.bgImage
                  }
                >
                  <ImageBackground
                    source={null}
                    style={
                    affiliateAttempt
                      ? styles.bgLogoAffiliate
                      : styles.bgLogo
                    }
                  >
                    <Image
                      style={styles.image}
                      source={image}
                    />
                  </ImageBackground>
                </ImageBackground>
              </TouchableOpacity>
              <Text style={styles.orderDetails}>
                <Text category="s1">
                  {(orderMerchant || {}).displayName || 'Merchant'}
                </Text>
                {'\n'}
                <Text styles={styles.orderAmount}>
                  {formatCurrency(order.currency, order.total)}
                </Text>
                {'\n'}
                <Text style={styles.cashbackDate}>
                  {t('from')}
                  {' '}
                  {isRTL ? moment(order.createdAt).locale('ar').format('MMMM D, YYYY') : moment(order.createdAt).format('MMMM D, YYYY')}
                </Text>
                {'\n'}
              </Text>
              <View style={styles.cashbackAmtSignParent}>
                <View style={styles.cashbackAmount}>
                  <View style={styles.cashbackSignIcon}>
                    <ProgressCircle
                      percent={(numCompletedInstallments * 100) / numInstallments}
                      radius={25}
                      borderWidth={4}
                      color="#FF4D4A"
                      shadowColor="#d6d6d6"
                      bgColor="#fff"
                    >
                      <Text style={styles.pendingInstals}>{`${numCompletedInstallments}/${numInstallments}`}</Text>
                    </ProgressCircle>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={{ backgroundColor: '#FFFFFF', padding: 10 }}>
      {isLoading ? <View style={styles.spinnerView}><Spinner /></View> : (
        <Select
          selectedIndex={selectedIndex}
          onSelect={index => handleSelect(index)}
          style={{ backgroundColor: '#ffffff', borderColor: '#ffffff', borderWidth: 0 }}
          value={() => (currentOrder
            ? orderSelectItem(currentOrder, true)
            : <Text>{t('common.noOrdersYet')}</Text>)}
        >
          {orders.map(order => orderSelectItem(order))}
          <SelectItem
            key="order-dropdown-orders-page-link"
            title={() => (
              <View style={styles.allOrdersView}>
                <Text style={styles.allOrdersLink}>{t('common.allOrders')}</Text>
              </View>
            )}
            onPress={() => { onSuccess(false); navigation.navigate('Orders'); }}
          />
        </Select>
      )}
      {amount && currency ? (
        <>
          <View style={{ marginTop: '6%' }}>
            <ButtonGroup
              appearance="outline"
              style={styles.buttonGroup}
            >
              <Button
                size="small"
                style={payWhat === 'next' ? { width: '50%' } : styles.paymentTypeButton}
                onPress={() => { setPayWhat('next'); setAmount(nextInstallment ? nextInstallment.total : ''); }}
              >
                {`${t('common.next')}`}
              </Button>
              <Button
                size="small"
                style={payWhat !== 'next' ? { width: '50%' } : styles.paymentTypeButton}
                onPress={() => { setPayWhat('full'); setAmount(totalRemaining); }}
              >
                {`${t('common.totalAmount')}`}
              </Button>
            </ButtonGroup>
            <Text category="h6" style={{ textAlign: isRTL ? 'right' : 'left', marginTop: 20 }}>{formatCurrency(currency, amount)}</Text>
          </View>
          <Button
            onPress={() => submitForm()}
            size="small"
            accessoryRight={() => (isSubmitting ? <Spinner status="basic" size="tiny" /> : null)}
            disabled={isSubmitting || !isSufficientCashback}
          >
            {evaProps => <Text {...evaProps} style={styles.redeemNowButton}>{t('common.redeemNow', { amount: formatCurrency(currency, Math.min(convertedCashbackTotal, amount)) })}</Text>}
          </Button>
          {!isSufficientCashback ? (
            <Text style={styles.insufficientCashback}>
              {t('common.cashbackScarcity')}
            </Text>
          ) : null}
        </>
      ) : <View style={styles.spinnerView}><Spinner size="large" /></View> }
    </View>
  );
};

OrdersDropDown.propTypes = {
  selected: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  merchantsList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

OrdersDropDown.defaultProps = {
  isLoading: false,
  navigation: null,
};

export default OrdersDropDown;
