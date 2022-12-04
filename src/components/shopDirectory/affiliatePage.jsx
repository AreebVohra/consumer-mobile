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

const AffiliatePage = ({ merchantPageBottomSheetRef, currMerchant, setCurrMerchant, userId, setShowLoginModal, phoneNumber }) => {
  if (!(currMerchant)) {
    return <></>;
  }
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const bgImage = { uri: currMerchant.heroImageMobile };
  const image = { uri: currMerchant.logo };
  const loggedIn = userId;
  const merchantCashbackCategories = currMerchant.cashbackCategories;
  const merchantCashbackCatsKeys = Object.keys(merchantCashbackCategories);
  const { displayName, description, planSplit } = currMerchant;

  const installmentPercents = planSplit && planSplit.split('-');

  let splitTracker = 0;

  const handleOnAffiliateLinkPress = (merchant, currentUserId) => {
    if (phoneNumber && phoneNumber.includes('+971')) {
      return;
    }
    const merchantAffiliateAgentSubIDParam = AFFILIATE_AGENT_ID_PARAM[(merchant.affiliateAgent || 'ADMITAD').toUpperCase()];
    let { displayUrl } = merchant;
    displayUrl += `${displayUrl.includes('?') ? '&' : '?'}${merchantAffiliateAgentSubIDParam}=${currentUserId}`;
    Linking.openURL(displayUrl).catch((err) => console.error('An error occurred', err));
  };

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
        <View style={{ width: '100%' }}>
          <ImageBackground source={bgImage} style={[styles.heroImage]}>
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
      </View>
      <ScrollView>
        <View style={styles.merchantPageDetailView}>
          <View>
            <Text style={[styles.affiliatePageHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{displayName}</Text>
            <Text style={[styles.affiliatePageDesc, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{description || 'merchantDesc' }</Text>
          </View>
          <View style={{ marginTop: '5%', marginBottom: '5%' }}>
            <Text style={[styles.affiliateCashbackHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.cashback')}</Text>
            <Text style={[styles.cashbackSubheading, { marginBottom: 20, textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{`${t('common.shopAt')} ${displayName} ${t('common.earnCashbackSubheading')}`}</Text>
            <Text style={[styles.affiliateCategoryHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.categories')}</Text>
            {merchantCashbackCatsKeys.map(key => (
              <View style={[styles.merchantPageCashbackInfo, { flexDirection: currLang === 'ar' ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.merchantPageCategoryNames, { width: '50%', textAlign: currLang === 'ar' ? 'right' : 'left' }]}>
                  {key[0].toUpperCase() + key.slice(1)}
                </Text>
                <Text style={styles.merchantPageCashbackPercent}>
                  {t('common.percentageCashback', { amount: merchantCashbackCategories[key] })}
                </Text>
              </View>
            ))}
          </View>
          <View>
            <Text style={[styles.affiliateCategoryHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.cashbackTermsHead')}</Text>
            <Text category="p1" style={[styles.affiliatePageDesc, { lineHeight: 21.03, textAlign: currLang === 'ar' ? 'right' : 'left'  }]}>{t('common.cashbackTermsBody1')}</Text>
            <Text category="p1" style={[styles.affiliatePageDesc, { margin: 0, textAlign: currLang === 'ar' ? 'right' : 'left'  }]}>{t('common.cashbackTermsBody2')}</Text>
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
        <View>
          <Button
            size="small"
            onPress={() => (!loggedIn ? setShowLoginModal(true) : handleOnAffiliateLinkPress(currMerchant, userId))}
            style={{ marginTop: 15, marginBottom: 15, marginHorizontal: '5%', paddingVertical: 12 }}
          >
            {(evaProps) => (<Text {...evaProps} style={styles.affiliatePageButtonText}>{t('common.shopAtAffiliate', { shop: currMerchant.displayName })}</Text>)}
          </Button>
        </View>
      </View>
    </View>
  );
};

AffiliatePage.propTypes = {
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
    isDiscount: PropTypes.bool,
  }),
  setCurrMerchant: PropTypes.func,
  setShowLoginModal: PropTypes.func,
  userId: PropTypes.string,
  phoneNumber: PropTypes.string,
};

AffiliatePage.defaultProps = {
  merchantPageBottomSheetRef: null,
  currMerchant: {},
  setCurrMerchant: () => {},
  setShowLoginModal: () => {},
  userId: '',
  phoneNumber: '',
};

export default AffiliatePage;
