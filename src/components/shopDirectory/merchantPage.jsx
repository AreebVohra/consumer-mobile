/* eslint-disable object-curly-newline */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { View, ImageBackground, SafeAreaView, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import ProgressCircle from 'react-native-progress-circle';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import { Button, Text, TopNavigationAction } from '@ui-kitten/components';
import { t } from 'services/i18n';

import Icon from 'components/Icon';
import ShoppingCart from 'assets/shoppingCart';
import Percentage from 'assets/percentage';
import EnjoyPurchase from 'assets/enjoyPurchase';
import styles from './styles';

const MerchantPage = ({ merchantPageBottomSheetRef, currMerchant, setCurrMerchant, openMerchantWebsite }) => {
  if (!(currMerchant && currMerchant.dedicatedPage)) {
    return <></>;
  }

  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const bgImage = { uri: currMerchant.dedicatedPageBanner };
  const merchantAppShopView = { uri: currMerchant.dedicatedPageShopView };

  const { displayName, planSplit, offersInfo } = currMerchant;
  const { header: offerHeader, subtitle: offerSubtitle } = offersInfo || {};
  const installmentPercents = planSplit.split('-');
  let splitTracker = 0;

  useEffect(() => {
    const backAction = () => {
      merchantPageBottomSheetRef.current.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.heroBlock]}>
        <ImageBackground source={bgImage} style={[styles.heroImage]}>
          <View style={styles.backButtonMerchantPage}>
            <TopNavigationAction
              icon={(props) => Icon(
                {
                  ...props,
                  fill: '#000000',
                  width: undefined,
                  height: undefined,
                  flex: 1,
                },
                'chevron-left',
              )}
              onPress={() => {
                // delay setting the current merchant to null for the bottom sheet not to be cleared while closing, which is visible to the user
                setTimeout(() => { setCurrMerchant(null); }, 500);
                merchantPageBottomSheetRef.current.close();
              }}
            />
          </View>
        </ImageBackground>
      </View>
      <ScrollView overScrollMode="never" style={[styles.scrollView, { backgroundColor: '#FFF' }]} showsVerticalScrollIndicator={false}>
        {/* title */}
        <View style={{ marginVertical: 14, marginHorizontal: 20 }}>
          <Text category="h1" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <Text category="h4">{`${t('common.shopNowPayLaterAtMerchant')} `}</Text>
            <Text category="h4" style={{ color: '#AA8FFF' }}>
              {displayName}
            </Text>
          </Text>
          {offerHeader ? (
            <Text category="p1" style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {`${offerHeader} ${offerSubtitle}`}
            </Text>
          ) : (
            <></>
          )}
        </View>

        {/* steps */}
        <View style={styles.stepsToShopContainer}>
          <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}`, alignItems: 'center', paddingVertical: 5 }}>
            <ShoppingCart />
            <View style={{ paddingHorizontal: 15, textAlign: isRTL ? 'right' : 'left' }}>
              <Text category="h6" style={{ marginVertical: 8 }}>
                {t('common.shopLikeNormal', { merchantName: displayName })}
              </Text>
              <Text style={{ paddingRight: 12 }}>{t('common.addCartItems')}</Text>
            </View>
          </View>

          <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}`, alignItems: 'center', paddingVertical: 5 }}>
            <Percentage />
            <View style={{ paddingHorizontal: 15, textAlign: isRTL ? 'right' : 'left' }}>
              <Text category="h6" style={{ marginVertical: 8 }}>
                {t('common.interestFreeInstals')}
              </Text>
              <Text style={{ paddingRight: 12 }}>{t('common.splitIntoXCostFree', { totalInstals: installmentPercents.length })}</Text>
            </View>
          </View>

          <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}`, alignItems: 'center', paddingVertical: 5 }}>
            <EnjoyPurchase />
            <View style={{ paddingHorizontal: 15, textAlign: isRTL ? 'right' : 'left' }}>
              <Text category="h6" style={{ marginVertical: 8 }}>
                {t('common.enjoyYourPurchase')}
              </Text>
              <Text style={{ paddingRight: 12 }}>{t('common.getProductMakePayment')}</Text>
            </View>
          </View>
        </View>

        {/* split your payment title */}
        <View style={{ marginVertical: 14, marginHorizontal: 20 }}>
          <Text category="h5" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            {t('common.splitOverX', { totalInstals: installmentPercents.length })}
          </Text>
          <Text category="p1" style={{ paddingVertical: 15, textAlign: isRTL ? 'right' : 'left' }}>
            {t('common.XEqualInstals', { totalInstals: installmentPercents.length })}
          </Text>
        </View>

        {/* installments */}
        {installmentPercents.map((percent, i) => {
          const percentValue = parseInt(percent, 10);
          splitTracker += percentValue;

          const dueInMonths = `${i} ${currLang === 'en' ? `${i > 0 ? 'months' : 'month'}` : `${i === 0 ? 'شهور' : 'شهر'}`}`;

          return (
            <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
              <View style={styles.timelineStamp}>
                <View style={styles.timelinePie}>
                  <ProgressCircle percent={splitTracker} radius={20} borderWidth={20} color="#AA8FFF" shadowColor="#ffffff" bgColor="#fff" />
                </View>
                {installmentPercents.length - 1 !== i ? <View style={{ height: 50, borderWidth: 1, width: 1 }} /> : <></>}
              </View>

              <View style={styles.timelineTextContainer}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ textAlign: currLang === 'ar' ? 'right' : 'left' }}>
                    <Text category="h6">{`${i > 2 ? i + 1 : ''}${t(`common.instal${i > 2 ? 'Xth' : i + 1}`)}`}</Text>
                    {'\n'}
                    <Text style={{ fontWeight: '600', fontSize: 14 }}>{t(`common.in${i !== 0 ? 'X' : '0'}MonthsDue`, { monthsNum: dueInMonths })}</Text>
                  </Text>
                </View>
                {installmentPercents.length - 1 !== i ? <View style={{ height: 50, borderWidth: 0, width: 0 }} /> : <></>}
              </View>
            </View>
          );
        })}

        {/* merchant app image */}
        <View style={[styles.merchantAppShopView]}>
          <ImageBackground source={merchantAppShopView} style={[styles.merchantAppShopImage]} />
        </View>

      </ScrollView>
      <View style={styles.merchantPageButtonView}>
        <Button onPress={() => openMerchantWebsite(currMerchant)} size="large" style={styles.merchantPageLink}>
          {(evaProps) => (
            <Text {...evaProps} style={styles.merchantPageButtonText}>
              {t('common.visit', { shop: currMerchant.displayName })}
            </Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};

MerchantPage.propTypes = {
  merchantPageBottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      present: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
  currMerchant: PropTypes.shape({
    dedicatedPage: PropTypes.bool,
    dedicatedPageBanner: PropTypes.string,
    dedicatedPageShopView: PropTypes.string,
    displayName: PropTypes.string,
    planSplit: PropTypes.string,
    offersInfo: PropTypes.shape({
      header: PropTypes.string,
      subtitle: PropTypes.string,
    }),
  }),
  setCurrMerchant: PropTypes.func,
  openMerchantWebsite: PropTypes.func,
};

MerchantPage.defaultProps = {
  merchantPageBottomSheetRef: null,
  currMerchant: {},
  setCurrMerchant: () => {},
  openMerchantWebsite: () => {},
};

export default MerchantPage;
