/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
import {
  View,
  ImageBackground,
  Linking,
  Image,
  BackHandler,
} from 'react-native';
import {
  Text,
  Divider,
  Button,
  TopNavigationAction,
} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'components/Icon';
import { t } from 'services/i18n';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProgressCircle from 'react-native-progress-circle';
import PropTypes from 'prop-types';
import { merchant } from '@spotii-me/auth';
import styles from './styles';
import { AFFILIATE_AGENT_ID_PARAM } from '../../../utils/constants';

const CouponCodePage = ({ merchantPageBottomSheetRef, currMerchant, setCurrMerchant, openMerchantWebsite }) => {
  if (!(currMerchant)) {
    return <></>;
  }
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const bgImage = { uri: currMerchant.heroImageMobile };
  const { displayName, description, planSplit, discountCode, discountText, discountPercentage } = currMerchant;

  const installmentPercents = planSplit && planSplit.split('-');

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
    <View style={{ marginTop: 30, flex: 1 }}>
      <View style={[styles.heroBlock]}>
        <ImageBackground source={bgImage} resizeMode="cover" style={[styles.heroImage]}>
          <View style={styles.backButtonMerchantPage}>
            <TopNavigationAction
              icon={(props) => Icon(
                {
                  ...props,
                  fill: '#353535',
                  width: undefined,
                  height: undefined,
                },
                'arrow-back-outline',
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
      <ScrollView>
        <View style={styles.merchantPageDetailView}>
          <View>
            <Text style={[styles.affiliatePageHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{displayName}</Text>
            <Text style={[styles.affiliatePageDesc, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{description || 'merchantDesc' }</Text>
          </View>
          <View style={{ marginTop: '5%', marginBottom: '3%' }}>
            <Text style={[styles.affiliateCashbackHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.discounts')}</Text>
            <View style={{flexDirection: `row${isRTL ? '-reverse': ''}`, marginBottom: 20, width: '100%'}}>
            <Text style={[styles.cashbackSubheading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{`${t('common.useCode')} `}
            <Text style={[styles.cashbackSubheading, {fontWeight: 'bold', textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{`${discountCode} `}</Text>
            <Text style={[styles.cashbackSubheading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{`${t('common.toGet')} `}</Text>
            <Text style={[styles.cashbackSubheading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{`${discountText} `}</Text>
            </Text>
            </View>
          </View>
          <View>
            <Text style={[styles.affiliateCategoryHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.cashbackTermsHead')}</Text>
            <Text category="p1" style={[styles.affiliatePageDesc, { lineHeight: 21.03, textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.discountTermsBody1')}</Text>
          </View>
          {planSplit ? (
            <View style={{ marginTop: 20, marginBottom: 15 }}>
              <Text style={[styles.installmentsHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.payInInstals')}</Text>
              <Text category="p1" style={[styles.affiliatePageDesc, { marginBottom: 25, textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.shopNowPayLater')}</Text>
              {installmentPercents.map((percent, i) => {
                const percentValue = parseInt(percent, 10);
                splitTracker += percentValue;

                const dueInMonths = `${i} ${currLang === 'en' ? `${i > 1 ? 'months' : 'month'}` : `${i === 0 ? 'شهور' : 'شهر'}`}`;

                return (
                  <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                    <View style={styles.timelineStamp}>
                      <View style={styles.timelinePie}>
                        <ProgressCircle percent={splitTracker} radius={20} borderWidth={20} color="#AA8FFF" shadowColor="#ffffff" bgColor="#fff" />
                      </View>
                      {installmentPercents.length - 1 !== i ? <View style={{ height: 50, borderWidth: 1, width: 1 }} /> : <></>}
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={{ textAlign: currLang === 'ar' ? 'right' : 'left' }}>
                          <Text style={styles.installmentText}>{`${i > 2 ? i + 1 : ''}${t(`common.instal${i > 2 ? 'Xth' : i + 1}`)}`}</Text>
                          {'\n'}
                          <Text style={styles.TimelineDueText}>{t(`common.in${i !== 0 ? 'X' : '0'}MonthsDue`, { monthsNum: dueInMonths })}</Text>
                        </Text>
                      </View>
                      {installmentPercents.length - 1 !== i ? <View style={{ height: 50, borderWidth: 0, width: 0 }} /> : <></>}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : <></>}
        </View>
      </ScrollView>
      <View style={styles.merchantCTA}>
        <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}`, alignItems: 'center', marginHorizontal: '5%', marginTop: '2%' }}>
          <Text style={styles.couponCode}>
            {`${discountPercentage} `}
          <Text style={styles.couponCode}>
          {`${t('common.off')} `}
          </Text>
          <Text style={styles.couponCode}>
            {`${t('common.discountCode')}: `}
          </Text>
          <Text style={styles.couponCodeCTA}>
            {`${discountCode}`}
          </Text>
          </Text>
        </View>
        <View>
          <Button
            size="small"
            onPress={() => openMerchantWebsite(currMerchant)}
            style={{ marginTop: 15, marginBottom: 15, marginHorizontal: '5%', paddingVertical: 12 }}
          >
            {(evaProps) => (<Text {...evaProps} style={styles.affiliatePageButtonText}>{t('common.shopAtAffiliate', { shop: currMerchant.displayName })}</Text>)}
          </Button>
        </View>
      </View>
    </View>
  );
};

CouponCodePage.propTypes = {
  merchantPageBottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      present: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
  currMerchant: PropTypes.shape({
    heroImageMobile: PropTypes.string,
    logo: PropTypes.string,
    description: PropTypes.string,
    displayName: PropTypes.string,
    planSplit: PropTypes.string,
    cashbackCategories: PropTypes.objectOf(PropTypes.string),
    maxCashback: PropTypes.string,
    discountText: PropTypes.string,
    discountCode: PropTypes.string,
    discountPercentage: PropTypes.string,
  }),
  setCurrMerchant: PropTypes.func,
  openMerchantWebsite: PropTypes.func,
};

CouponCodePage.defaultProps = {
  merchantPageBottomSheetRef: null,
  currMerchant: {},
  setCurrMerchant: () => {},
  openMerchantWebsite: () => {},
};

export default CouponCodePage;
