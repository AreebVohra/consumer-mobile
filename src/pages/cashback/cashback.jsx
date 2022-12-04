/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import convertCurrency from 'utils/convertCurrency';
import { ImageBackground, View, Image, TouchableOpacity } from 'react-native';
import { t } from 'services/i18n';
import {
  Text,
  TopNavigationAction,
  Layout,
  Button,
  Spinner,
  Tooltip,
} from '@ui-kitten/components';
import { Divider } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'components/Icon';
import { useIsFocused } from '@react-navigation/core';
import moment from 'moment';
import { retrieveConsumerCashbacks } from 'reducers/user';
import { fetchMerchantDetailsList } from 'reducers/directory';
import { CASHBACK } from 'utils/constants';
import styles from './styles';
import { MONTHS } from '../../../utils/constants';
import TileSelector from '../../components/TileSelector';
import Chevron from '../../../assets/chevron';
import CashIcon from '../../../assets/cashIcon';

const Cashback = ({ navigation }) => {
  const dispatch = useDispatch();

  const currLang = useSelector(state => state.language.language);
  const { currentUserCashback, cashbackResolved } = useSelector(state => state.user);
  const { currentUser, conversions } = useSelector(state => state.application);
  const {
    allMerchantDetails = [],
  } = useSelector(state => state.directory);

  const isFocused = useIsFocused();

  const [filteredMerchants, setFilteredMerchants] = useState([]);

  const [showAll, setShowAll] = useState(false);
  const [pendingCashback, setPendingCashback] = useState(0);
  const [redeemedCashback, setRedeemedCashback] = useState(0);
  const [cashbackDateMap, setCashbackDateMap] = useState({});
  const [visible, setVisible] = useState(false);

  const noCashbackImage = require('assets/noCashback.png');

  const isRTL = currLang === 'ar';

  let userCurrency = 'AED';

  if (currentUser && currentUser.phoneNumber) {
    const phoneNumberPrefix = currentUser.phoneNumber.substring(0, 4);
    switch (phoneNumberPrefix) {
      case '+971': {
        break;
      }
      case '+966': {
        userCurrency = 'SAR';
        break;
      }
      case '+973': {
        userCurrency = 'BHD';
        break;
      }
      case '+968': {
        userCurrency = 'OMR';
        break;
      }
      default:
        break;
    }
  }

  useEffect(() => {
    dispatch(retrieveConsumerCashbacks());
  }, []);

  useEffect(() => {
    if (currentUserCashback && currentUserCashback.cashbacks) {
      let pendingSum = 0;
      let redeemedSum = 0;
      const cashbacks = cashbackDateMap;

      currentUserCashback.cashbacks.map(cashback => {
        const cashbackDate = new Date(cashback.createdAt);
        const cashbackYear = cashbackDate.getUTCFullYear();
        const yearMonthKey = `${cashbackYear}${cashbackDate.getMonth()}`;
        const cashbackAmount = convertCurrency(cashback.currency, parseFloat(cashback.amount).toFixed(2), 'AED', false, conversions)[1];

        if (!cashbackDateMap[yearMonthKey]) {
          cashbackDateMap[yearMonthKey] = [];
        }

        cashbackDateMap[yearMonthKey].push(cashback);

        if (!cashback.valid) {
          pendingSum += parseFloat(cashbackAmount);
        } else if (cashbackAmount < 0) {
          redeemedSum -= parseFloat(cashbackAmount);
        }
      });
      const pendingTotal = convertCurrency(userCurrency, parseFloat(pendingSum).toFixed(2), 'AED', true, conversions)[1];
      const redeemedTotal = convertCurrency(userCurrency, parseFloat(redeemedSum).toFixed(2), 'AED', true, conversions)[1];
      setPendingCashback(pendingTotal);
      setRedeemedCashback(redeemedTotal);
      setCashbackDateMap(cashbacks);
    }
  }, [showAll]);

  useEffect(() => {
    if (allMerchantDetails && allMerchantDetails.merchants) {
      setFilteredMerchants(allMerchantDetails.merchants);
    }
  }, [allMerchantDetails]);

  useEffect(() => {
    dispatch(fetchMerchantDetailsList(currLang));
  }, [isFocused]);

  let cashbackTotal = (currentUserCashback || {}).total || 0;
  let bankWithdrawalLimit = (currentUserCashback || {}).bankWithdrawalTotal || 0;

  cashbackTotal = convertCurrency(userCurrency, cashbackTotal, 'AED', true, conversions)[1];
  bankWithdrawalLimit = convertCurrency(userCurrency, bankWithdrawalLimit, 'AED', true, conversions)[1];

  const userCashbackTotal = parseFloat(cashbackTotal).toFixed(2);
  const userWithdrawalLimit = parseFloat(bankWithdrawalLimit).toFixed(2);

  const renderFullCashbackTile = (cashback, _, __) => {
    const renderCashbackInfo = () => {
      const cashbackRemarks = cashback.remarks || {};
      const {
        details, bank_withdrawal: bankWithdrawal, is_reimbursement: isReimbursement,
      } = cashbackRemarks || {};
      const {
        cashback_percent: cashbackPercent,
        order_ref: orderRef,
        merchant_name: merchantName,
      } = details || {};
      if (!cashback.valid) {
        return t('common.cashbackPending');
      }
      if (bankWithdrawal) {
        return t('common.cashbackWithdrawn');
      }
      if (isReimbursement) {
        return t('common.cashbackReimbursedAt', {
          orderRef: (cashbackRemarks || {}).order_ref,
          merchantName,
        });
      }
      if (cashbackPercent) {
        return t('common.cashbackEarnedAt', {
          percent: cashbackPercent,
          merchantName,
        });
      }
      return t('common.cashbackRedeemedFor', {
        orderRef,
        merchantName,
      });
    };
    const cashbackInfo = renderCashbackInfo();
    const cashbackStatus = !cashback.valid ? t('common.pending') : t(`common.${parseFloat(cashback.amount).toFixed(2) > 0 ? 'earned' : 'redeemed'}`);

    const cashbackMerchant = filteredMerchants.filter(
      merchant => merchant.merchantId === (cashback.remarks || {}).merchant_id,
    )[0];

    const bgImage = { uri: (cashbackMerchant || {}).displayPicture };
    
    const { isAffiliate, needsBackground } = cashbackMerchant || {};

    return (
      <View style={[styles.cashbackParentTile, isRTL ? styles.flexRowReverse : styles.flexRow]}>
        <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
          <View
            style={styles.merchantTile}
          >
            <ImageBackground source={bgImage} style={[styles.bgImage, { borderColor: isAffiliate && !needsBackground ? '#c6c7c2' : '#ffffff' }]}>
            </ImageBackground>
          </View>

          <View style={{
            flexDirection: 'column', justifyContent: 'center', paddingHorizontal: '3%', width: '83%',
          }}
          >
            <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <Text style={styles.merchantName}>
                {(cashbackMerchant || {}).displayName || 'Merchant'}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '300', lineHeight: 20, color: '#1A0826' }}>{`${cashback.currency} ${Math.abs(parseFloat(cashback.amount).toFixed(2))}`}</Text>
            </View>

            <View style={isRTL ? styles.flexRowReverse : styles.flexRow}>
              <Text style={[styles.cashbackTransactionDescription, { textAlign: isRTL ? 'right' : 'left' }]}>
                {currLang === 'ar' ? moment(cashback.createdAt).locale('ar').format('DD MMM YYYY') : moment(cashback.createdAt).format('DD MMM YYYY')}
              </Text>
            </View>

            <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { justifyContent: 'space-between' }]}>
              <Text style={[styles.cashbackTransactionDescription, { fontSize: 12, width: '60%', textAlign: isRTL ? 'right' : 'left' }]}>
                {`${cashbackInfo.slice(0, 40)}${cashbackInfo.length > 40 ? '...' : ''}`}
              </Text>
              <Text style={[{ fontSize: 14 }, cashback.valid ? { color: parseFloat(cashback.amount).toFixed(2) > 0 ? '#AA8FFF' : '#FF4D4A' } : { color: '#717171' }]}>
                {cashbackStatus}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderCashbackHeader = (item, index, isExpanded) => {
    if (showAll) {
      const monthName = MONTHS[parseInt(item.slice(4, 6), 10)];
      const year = item.slice(0, 4);
      return (
        <View style={{
          flexDirection: 'column', paddingVertical: '2%', marginVertical: '1%', width: '95%',
        }}
        >
          <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { width: '100%', justifyContent: 'space-between', marginBottom: '2%' }]}>
            <Text>{`${monthName}, ${year}`}</Text>
            <View style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}><Chevron /></View>
          </View>
          <Divider />
        </View>
      );
    }
    return <>{renderFullCashbackTile(item, index, isExpanded)}</>;
  };

  const renderCashbackBody = (item, index, isExpanded) => {
    if (!showAll) return <></>;
    return <>{cashbackDateMap[item].map(cashback => renderFullCashbackTile(cashback, index, isExpanded))}</>;
  };

  const renderToggleButton = () => (
    <Button
      onPress={() => setVisible(true)}
      appearance="ghost"
      size="small"
    >
      {Icon(
        {
          fill: '#6542BE',
          width: 25,
          height: 20,
        },
        'info-outline',
      )}
    </Button>
  );

  return (
    <Layout style={styles.layout} level="1">
      {!cashbackResolved ? (
        <View style={styles.spinner}>
          <Spinner size="giant" />
        </View>
      ) : (
        // there is no cashback
        currentUserCashback.cashbacks.length === 0 ? (
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={{
              height: '70%',
              width: '100%',
            }}
            >
              <ImageBackground
                style={{
                  resizeMode: 'center',
                  position: 'relative',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flex: 1,
                }}
                source={noCashbackImage}
              >
                <View style={{ position: 'relative', top: 24 }}>
                  <Text style={styles.noCashbackTitle}>{t('common.noCashbackOffersTitle')}</Text>
                  <Text style={styles.noCashbackDesc}>{t('common.noCashbackOffersDesc')}</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={{ height: '30%', justifyContent: 'center', marginHorizontal: 18 }}>
              <Button
                style={{ borderRadius: 8 }}
                appearance="filled"
                size="large"
                onPress={() => navigation.navigate('Shop')}
              >
                {(evaProps) => (
                  <Text {...evaProps} style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700', lineHeight: 18 }}>
                    {t('common.visitShopDirectory')}
                  </Text>
                )}
              </Button>
              <TouchableOpacity style={{ marginTop: 15, flexDirection: isRTL ? 'row-reverse' : 'row' }} onPress={() => navigation.navigate('HowItWorks')}>
                <Text style={{ color: '#411361', fontSize: 14, fontWeight: '400', lineHeight: 18 }}>
                  {t('common.howItWorksCashback')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView overScrollMode="never" style={styles.view}>
            {!showAll && (
              <>
                <View style={styles.cashbackCardView}>
                  <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubSummary]}>
                    <Text style={styles.cashbackTotalHeaderDesc}>{t('common.yourCashback')}</Text>
                    <Text style={styles.cashbackTotalHeader}>{`${userCurrency} ${userCashbackTotal}`}</Text>
                  </View>
                  <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubSummary, { marginBottom: 0 }]}>
                    <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { alignItems: 'center' }]}>
                      <Text style={{ color: '#6542BE' }}>{t('common.availableToWithdraw')}</Text>
                      <Tooltip
                      style={[isRTL ? {marginRight: 50} : {marginLeft: 10}]}
                        anchor={renderToggleButton}
                        visible={visible}
                        onBackdropPress={() => setVisible(false)}
                      >
                        {evaProps => (
                          <Text {...evaProps} style={{fontSize: 10, color: '#FFF'}}>
                            {t('common.avalableToWithdrawLimitText')}
                          </Text>
                        )}
                      </Tooltip>
                    </View>
                    <Text style={{ color: '#6542BE', alignSelf: 'center' }}>{`${userCurrency} ${parseFloat(userWithdrawalLimit).toFixed(2)}`}</Text>
                  </View>

                  <Divider orientation="horizontal" color="#EDE6FF" style={{ marginVertical: 12, flexGrow: 0 }} width={1} />

                  <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubSummary]}>
                    <Text style={styles.pendingRedeemedStyles}>{t('common.pending')}</Text>
                    <Text style={styles.pendingRedeemedStyles}>{`${userCurrency} ${parseFloat(pendingCashback).toFixed(2)}`}</Text>
                  </View>

                  <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubSummary]}>
                    <Text style={styles.pendingRedeemedStyles}>{t('common.redeemed')}</Text>
                    <Text style={styles.pendingRedeemedStyles}>{`${userCurrency} ${parseFloat(redeemedCashback).toFixed(2)}`}</Text>
                  </View>

                  <TouchableOpacity style={{ marginTop: 8, flexDirection: isRTL ? 'row-reverse' : 'row' }} onPress={() => navigation.navigate('HowItWorks')}>
                    <Text style={{ color: '#411361', fontSize: 14, fontWeight: '500', lineHeight: 18 }}>
                      {t('common.howItWorksCashback')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.cashbackCardView}>
                  <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubSummary]}>
                    <Text style={styles.redeemCashbackHeaderDesc}>{t('common.redeemYourCashback')}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Orders')}
                    style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubCardView, { alignItems: 'center' }]}
                  >
                    <TopNavigationAction
                      icon={props => Icon({
                        ...props, fill: '#AA8FFF', width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
                      }, 'credit-card-outline')}
                    />
                    <Text
                      style={{ fontSize: 12 }}
                    >
                      {t('common.payForNextInstal')}

                    </Text>
                  </TouchableOpacity>
                  {userWithdrawalLimit >= CASHBACK.MIN_TOTAL_REDEEMABLE_CASHBACK ? (
                    <TouchableOpacity style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubCardView, { alignItems: 'center', justifyContent: 'space-between' }]} onPress={() => navigation.navigate('BankWithdrawalForm')}>
                      <View style={[{ marginLeft: 10, marginRight: 10, alignItems: 'center' }, isRTL ? styles.flexRowReverse : styles.flexRow]}>
                        <CashIcon color="#AA8FFF" />
                        <Text style={{ fontSize: 12, marginLeft: 10, marginRight: 10 }}>{t('common.withdrawCash')}</Text>
                      </View>
                      <Text style={styles.bankWithdrawalAmount}>{`${userCurrency} ${parseFloat(userWithdrawalLimit).toFixed(2)}`}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubCardView, { alignItems: 'center' }]}>
                      <View style={{ marginLeft: 10, marginRight: 10 }}>
                        <CashIcon color="#CCCCCC" />
                      </View>
                      <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, flex: 1, justifyContent: 'space-between' }}>
                        <Text style={{ color: '#CCCCCC', fontSize: 12 }}>
                          {`${t('common.withdrawCash')}`}
                        </Text>
                        <Text style={{ color: '#AA8FFF', fontSize: 12 }}>{t('common.minimumCashbackWithdrawalLimit', { currency: userCurrency })}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
            <View style={styles.cashbackCardView}>
              <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.cashbackSubSummary, { alignItems: 'center' }]}>
                <Text style={styles.cashbackTransactionsHeaderDesc}>{t('common.cashbackTrxs')}</Text>
                <Text style={[styles.cashbackTransactionsHeaderDesc, { fontSize: 15, fontWeight: '400' }]} onPress={() => setShowAll(!showAll)}>{t(`common.see${showAll ? 'Less' : 'All'}`)}</Text>
              </View>
              <TileSelector
                list={showAll ? Object.keys(cashbackDateMap).sort() : (currentUserCashback.cashbacks || []).slice(0, 5)}
                renderHeader={renderCashbackHeader}
                renderBody={renderCashbackBody}
                itemKey={item => `${showAll ? item : item.cashbackId}`}
                isDisabled={(_, __) => !showAll}
                defaultIndex={0}
              />
            </View>
          </ScrollView>
        )
      )}
    </Layout>
  );
};

Cashback.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

Cashback.defaultProps = {
  navigation: null,
};
export default Cashback;
