/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable object-curly-newline */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import formatCurrency from 'utils/formatCurrency';
import ProgressCircle from 'react-native-progress-circle';
import { Divider } from 'react-native-elements';
import { Layout, Text, Spinner, Card, List, ListItem, Button } from '@ui-kitten/components';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { setScreen } from 'utils/handleLogEvent';
import { useSelector, useDispatch } from 'react-redux';
import {
  INSTALLMENT_STATUS_PAID,
  INSTALLMENTS_STATUS_COMPLETE,
  INSTALLMENT_STATUS_REFUNDED,
  INSTALLMENT_STATUS_AUTHORIZED,
  INSTALLMENT_STATUS_SCHEDULED,
  INSTALLMENT_STATUS_MISSED,
  INSTALLMENT_STATUS_VOIDED,
} from 'utils/constants';
import { t } from 'services/i18n';
import { fetchInstallments, setCurrentOrder, refreshReset } from 'reducers/instalments';
import moment from 'moment';
import 'moment/locale/ar';
import PropTypes from 'prop-types';
import FullyPaidIcon from 'assets/fullyPaidIcon';
import WarningIcon from 'assets/warningIcon';
import styles from './styles';
import OrderDetails from './orderDetails';

const Orders = ({ navigation }) => {
  const ORDERS_PER_PAGE = 12;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const currLang = useSelector((state) => state.language.language);
  const [firstLoadSuccess, setFirstLoadSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const isRTL = currLang === 'ar';

  const {
    list: installmentsList,
    currentPage,
    fetchParamsStatus,
    isLoading,
    isResolved,
    isSuccess,
    listLength,
    pageCount,
    isPaymentTried,
  } = useSelector((state) => state.instalments);

  const fetchParams = {
    limit: ORDERS_PER_PAGE,
    page,
    status: fetchParamsStatus,
  };


  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '85%'], []);


  useEffect(() => {
    if (isFocused) {
      setScreen('Orders');
    }

    if (isFocused && !isLoading) {
      setPage(1);
      setFirstLoadSuccess(true);
      dispatch(refreshReset());
      dispatch(fetchInstallments({ ...fetchParams, page: 1 }));
    }
  }, [isFocused, fetchParamsStatus]);


  const ordersList = installmentsList.map((item) => {
    const { merchant, order, installments, status } = item;
    const { currency, total } = order;

    let nextEffectiveDate = order.createdAt;

    if (installments.length > 0) {
      nextEffectiveDate = installments[0].effectiveAt;
    }

    const title = merchant && (merchant.displayName || merchant.name) ? `${merchant.displayName || merchant.name}` : '';
    const titleSub = formatCurrency(currency, parseFloat(total));

    const description = `${currLang === 'ar' ? moment(nextEffectiveDate).locale('ar').format('MMM D, YYYY') : moment(nextEffectiveDate).format('MMM D, YYYY')}`;
    const descriptionSub = item.order.displayReference;

    const numInstallments = installments.length;

    const numCompletedInstallments = installments.filter(
      (inst) => inst.status === INSTALLMENT_STATUS_AUTHORIZED
        || inst.status === INSTALLMENT_STATUS_PAID
        || inst.status === INSTALLMENT_STATUS_VOIDED
        || inst.status === INSTALLMENT_STATUS_REFUNDED,
    ).length;

    const missedInstallment = installments.find((inst) => inst.status === INSTALLMENT_STATUS_MISSED);
    const nextScheduledInstallment = installments.find((inst) => inst.status === INSTALLMENT_STATUS_SCHEDULED);

    let badgeTimeline = '';
    let badgeStyle = '';
    let icon = null;

    if (status === INSTALLMENTS_STATUS_COMPLETE) {
      badgeTimeline = t('common.fullyPaid');
      badgeStyle = [styles.badgeTextComplete];
      icon = <FullyPaidIcon />;
    } else if (missedInstallment) {
      const diffInDays = moment(new Date()).diff(moment(missedInstallment.effectiveAt), 'days');
      const missedAmount = formatCurrency(currency, missedInstallment.amount);
      badgeTimeline = (
        <>
          {t('common.missedTimelineAmount', { amount: missedAmount })}
          {'\n'}
          {t('common.missedTimelineTime', { days: diffInDays })}
        </>
      );
      badgeStyle = [styles.badgeTextMissed];
      icon = <WarningIcon />;
    } else if (nextScheduledInstallment) {
      const diffInDays = moment(nextScheduledInstallment.effectiveAt).diff(moment(new Date()), 'days');
      badgeTimeline = (
        <>
          {t('common.nextAutopay', { days: diffInDays })}
        </>
      );
    } else if (status === INSTALLMENT_STATUS_REFUNDED) {
      badgeTimeline = t('common.refunded');
    }

    return {
      title,
      titleSub,
      description,
      descriptionSub,
      item,
      numInstallments,
      numCompletedInstallments,
      badgeTimeline,
      badgeStyle,
      icon,
      missedInstallment,
    };
  });

  ordersList.sort((installment) => (installment.missedInstallment ? -1 : 1));

  const loadMore = () => {
    if (!isLoading && firstLoadSuccess && page < pageCount) {
      dispatch(fetchInstallments({ ...fetchParams, page: page + 1 }));
      setPage(page + 1);
    }
  };


  const refreshList = () => {
    if (!isLoading) {
      setPage(1);
      dispatch(refreshReset());
      dispatch(fetchInstallments({ ...fetchParams, page: 1 }));
    }
  };


  const onOrderSelect = (order) => {
    dispatch(setCurrentOrder({ currentOrder: order }));
    bottomSheetRef.current.present();
    // navigation.navigate('Order Details', { refreshList });
  };


  const renderItem = ({ item }) => (
    <>
      <ListItem
        style={{ backgroundColor: '#F9F9F9', paddingHorizontal: 10, marginHorizontal: 10, marginVertical: 6, borderRadius: 8 }}

        onPress={() => onOrderSelect(item.item)}

        title={() => (
          <View style={[styles.orderList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text
              style={[styles.listItemText, { textAlign: isRTL ? 'right' : 'left' }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {item.title}
            </Text>
            <Text style={[styles.listItemTextSub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {item.titleSub}
            </Text>
          </View>
        )}

        description={() => (
          <>
            <View style={[styles.listDesc, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View>
                <Text style={[styles.listItemTextRef, { marginBottom: 1, textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('common.orderReference', { reference: item.descriptionSub })}
                </Text>
                <Text style={[styles.listItemTextRef, { marginTop: 1, textAlign: isRTL ? 'right' : 'left' }]}>
                  {`${t('common.purchased')} ${item.description}`}
                </Text>
              </View>
              <View>
                <ProgressCircle percent={(item.numCompletedInstallments * 100) / item.numInstallments} radius={20} borderWidth={3} color="#AA8FFF" shadowColor="#EDE6FF" bgColor="#fff">
                  <Text style={styles.pendingInstals}>{`${item.numCompletedInstallments}/${item.numInstallments}`}</Text>
                </ProgressCircle>
              </View>
            </View>

            <Divider orientation="horizontal" color="#CCC" style={{ marginVertical: 16, flexGrow: 0 }} width={1} />

            <View>
              <View style={[styles.PaymentInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>

                {item.icon && (
                  <View
                    style={{
                      marginRight: isRTL ? 4 : 0,
                      marginLeft: !isRTL ? 4 : 0,
                      paddingLeft: isRTL ? 8 : 0,
                      paddingRight: !isRTL ? 8 : 0,
                    }}
                  >
                    {item.icon}
                  </View>
                )}

                <View style={[styles.PaymentInfoSub, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text
                    style={[
                      styles.autoPay,
                      item.badgeStyle[0],
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {item.badgeTimeline}
                  </Text>

                  {item.missedInstallment ? (
                    <Button style={styles.payButton} onPress={() => onOrderSelect(item.item)}>
                      {(evaProps) => (
                        <Text {...evaProps} style={{ fontSize: 14, fontWeight: '700', lineHeight: 18, color: '#fff' }}>
                          {t('common.payNow')}
                        </Text>
                      )}
                    </Button>
                  ) : (
                    <Text
                      style={[styles.autoPay, { textDecorationLine: 'underline', textAlign: isRTL ? 'right' : 'left' }]}
                      onPress={() => onOrderSelect(item.item)}
                    >
                      {t('common.viewOrderDetails')}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </>
        )}
      />
    </>
  );


  const renderLoader = () => (
    <View style={styles.listFooter}>
      {isSuccess && listLength === ORDERS_PER_PAGE ? <Spinner size="giant" /> : <></>}
    </View>
  );


  const renderEmptyPageMessage = () => {
    let text = t('common.noOrdersYetArchive');
    let subText = t('common.haveNotPurchaseArchive');

    if (fetchParams.status === 'ACTIVE') {
      text = t('common.noOrdersYetActive');
      subText = t('common.haveNotPurchase');
    }
    if (fetchParams.status === null) {
      text = t('common.noOrdersYet');
      subText = t('common.haveNotPurchase');
    }
    return (
      <>
        <Text style={[styles.centerText, { marginBottom: '8%', marginHorizontal: '6%' }]} category="h5" appearance="hint">
          {text}
        </Text>
        <Text style={[styles.centerText, { marginBottom: '8%', marginHorizontal: '6%', fontSize: 20 }]} category="p1" appearance="hint">
          {subText}
        </Text>
      </>
    );
  };


  return (
    <>
      <Layout style={styles.layout} level="2">
        {currentPage === null && !isResolved ? (
          <View style={styles.center}>
            <Spinner size="giant" />
          </View>
        ) : (
          <>
            {isResolved && !installmentsList.length ? (
              <Card style={styles.center}>
                <View>{renderEmptyPageMessage()}</View>
              </Card>
            ) : (
              <View style={{ marginBottom: 10, backgroundColor: '#FFF' }}>
                <List
                  data={ordersList}
                  onEndReached={() => {
                    // ORDERS_PER_PAGE
                    if (ordersList.length < ORDERS_PER_PAGE && page === 1) {
                      // Do not invert if statement!
                      // Do Nothing.
                    } else {
                      loadMore();
                    }
                  }}
                  onEndReachedThreshold={0.33}
                  renderItem={renderItem}
                  ListFooterComponent={renderLoader}
                  refreshing={false}
                  onRefresh={refreshList}
                  style={{ paddingTop: 8, marginBottom: 16, paddingBottom: 15, backgroundColor: 'white' }}
                />
              </View>
            )}
          </>
        )}
      </Layout>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
        )}
        onChange={(isOpened) => {
          if (isOpened === -1 && isPaymentTried) {
            refreshList();
          }
        }}
      >
        <OrderDetails bottomSheetRef={bottomSheetRef} refreshList={refreshList} navigation={navigation} />
      </BottomSheetModal>

    </>
  );
};

Orders.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    canGoBack: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

Orders.defaultProps = {
  navigation: null,
};

export default Orders;
