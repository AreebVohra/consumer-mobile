import { View, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { Text, Divider, Spinner } from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import { t } from 'services/i18n';
import React from 'react';
import styles from './styles';
import { AFFILIATE_SLUG, SMART_MERCHANT_TYPES, RECOMMENDED_CATEGORY } from '../../../utils/constants';

const renderTile = (merchant, type = 'regular', handleOnMerchantPress) => {
  const imageProps = { uri: merchant.displayPicture, priority: FastImage.priority.normal };
  const affiliateAttempt = merchant.isAffiliate;

  return (
    <TouchableOpacity
      key={`${merchant.merchantId}-${type}`}
      style={[styles.block, { width: 115, flexDirection: 'row' }]}
      onPress={() => handleOnMerchantPress(merchant)}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <FastImage source={imageProps} style={[styles.bgImage, { height: 100 }]} resizeMode={FastImage.resizeMode.cover}>
          <ImageBackground source={null} style={[styles.bgLogo]} />
        </FastImage>
        <Text numberOfLines={2} style={styles.displayNameAllCats}>
          {merchant.displayName}
        </Text>
        {merchant.dealTile || merchant.isDiscount ? (
          <View style={styles.dealContainer}>
            {merchant.dealTile ? (
              <Text style={styles.merchantDealText}>
                {merchant.dealTile}
              </Text>
            ) : (
              <Text style={styles.couponDealText}>
                {`${t('common.discountCode')}: ${merchant.discountCode}`}
              </Text>
            )}
          </View>
        ) : null}
        {affiliateAttempt || merchant.isDiscount ? (
          <Text category="c4" style={styles.maxCashbackAllCats}>
            {affiliateAttempt ? t('common.maxCashbackUpto', { maxCashback: merchant.maxCashback }) : t('common.discount', { percentage: merchant.discountPercentage })}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const renderDirectoryList = (
  merchants,
  currentUser = {},
  currLang,
  currParent,
  deliveryCountry,
  recommendedMerchants,
  categoriesOfFilter,
  setSearchHeaderVisible,
  filteredCategories,
  filteredCountry,
  handleShowAllCategories,
  handleShowCertainCategory,
  handleOnMerchantPress,
  searchResults,
) => {
  const { userId } = currentUser;

  if (deliveryCountry) {
    // eslint-disable-next-line no-param-reassign
    merchants = merchants.filter((m) => (m.deliveringTo || []).includes(deliveryCountry));
  }

  if (searchResults) {
    return (
      <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>
        {merchants.slice(0, 30).map((item) => renderTile(item, 'sorted', handleOnMerchantPress))}
      </View>
    );
  }

  if (filteredCategories) {
    const affiliateCategory = filteredCategories.find((cat) => cat.slug === AFFILIATE_SLUG);
    const isSingleCategory = filteredCategories.length === 1;
    const isNestedAffiliate = filteredCategories.length === 2 && affiliateCategory;
    const nestedFilter = isNestedAffiliate && filteredCategories.slice(1)[0];

    if (isNestedAffiliate) {
      if (Object.keys(currParent).length > 0) {
        // eslint-disable-next-line no-param-reassign
        merchants = merchants.filter((m) => m.displayCategories.includes(currParent.slug));
      }
      const sortedByCategoryFlagMerchants = [
        ...merchants.filter((elem) => elem.categoryFlag === nestedFilter.slug),
        ...merchants.filter((elem) => elem.categoryFlag !== nestedFilter.slug),
      ];
      const merchantsSegregated = sortedByCategoryFlagMerchants.filter(
        (merchant) => merchant.displayCategories.includes(AFFILIATE_SLUG)
        && ((merchant.categoryFlag && merchant.categoryFlag === nestedFilter.slug) || merchant.displayCategories.includes(nestedFilter.slug)),
      );

      const merchantsToShow = isSingleCategory || isNestedAffiliate ? merchantsSegregated : merchantsSegregated.slice(0, 5);

      return (
        <>
          <View style={[styles.sectionHeading, { flexDirection: 'row' }]}>
            <Text style={{ fontSize: 20, maxWidth: '50%' }} category="h5">
              {`${affiliateCategory.displayName} > ${nestedFilter.displayName}`}
            </Text>
            <Text
              style={{ color: '#411361', lineHeight: 24 }}
              onPress={() => {
                handleShowAllCategories();
              }}
            >
              {t('common.seeLess')}
            </Text>
          </View>
          <Divider style={styles.categoryDivider} />
          {merchantsToShow.length > 0 ? (
            merchantsToShow.map((item) => renderTile(item, 'affiliate', handleOnMerchantPress))
          ) : (
            <View style={styles.spinnerContainer}>
              <Text style={styles.noResultsText}>{t('common.noResults')}</Text>
            </View>
          )}
        </>
      );
    }

    const recommendedMerchantsToShow = isSingleCategory || isNestedAffiliate ? recommendedMerchants : recommendedMerchants.slice(0, 5);

    const categoriesToShow = filteredCategories.length > 0 ? filteredCategories : [RECOMMENDED_CATEGORY, ...categoriesOfFilter.filter(category => category.topPicks)];

    let renderedMerchants = [];

    return (
      <>
        {/* Recommended merchants row */}
        {userId && (categoriesToShow.length > 1 || categoriesToShow[0].slug === SMART_MERCHANT_TYPES.RECOMMENDED) ? (
          <>
            <View style={[styles.sectionHeading, { flexDirection: currLang === 'ar' ? 'row-reverse' : 'row' }]}>
              <Text style={{ fontSize: 18, fontWeight: '700', lineHeight: 20 }}>{t('common.recommended')}</Text>

              {recommendedMerchants.length ? (
                <Text
                  style={{ color: '#411361', lineHeight: 24 }}
                  onPress={() => {
                    if (!isSingleCategory) {
                      handleShowCertainCategory(RECOMMENDED_CATEGORY);
                    } else {
                      handleShowAllCategories();
                    }
                  }}
                >
                  {!isSingleCategory ? t('common.seeAll') : t('common.seeLess')}
                </Text>
              ) : (
                <></>
              )}
            </View>

            {isSingleCategory && categoriesToShow.length && categoriesToShow[0].slug === SMART_MERCHANT_TYPES.RECOMMENDED ? (
              <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>
                {recommendedMerchantsToShow.map((item) => renderTile(item, SMART_MERCHANT_TYPES.RECOMMENDED, handleOnMerchantPress))}
              </View>
            ) : (
              <ScrollView overScrollMode="never" style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: 0 }} horizontal>
                {recommendedMerchants.length ? (
                  recommendedMerchantsToShow.map((item) => renderTile(item, SMART_MERCHANT_TYPES.RECOMMENDED, handleOnMerchantPress))
                ) : (
                  <View style={styles.centerSpinnerContainer}>
                    <Spinner />
                  </View>
                )}
              </ScrollView>
            )}
          </>
        ) : (
          <></>
        )}

        {/* Other merchants by category rows */}
        {categoriesToShow.map((category) => {
          if (Object.keys(currParent).length > 0) {
            // eslint-disable-next-line no-param-reassign
            merchants = merchants.filter((m) => m.displayCategories.includes(currParent.slug));
          }

          const sortedByCategoryFlagMerchants = [...merchants.filter((elem) => elem.categoryFlag === category.slug), ...merchants.filter((elem) => elem.categoryFlag !== category.slug)];
          const filteredMerchants = filteredCountry ? sortedByCategoryFlagMerchants.filter((merchant) => merchant.deliveringTo.includes(filteredCountry)) : sortedByCategoryFlagMerchants;

          let merchantsToShow = filteredMerchants.filter(
            (merchant) => (merchant.categoryFlag && merchant.categoryFlag === category.slug) || merchant.displayCategories.includes(category.slug),
          );

          if (category.slug === SMART_MERCHANT_TYPES.PROMOTED || category.slug === SMART_MERCHANT_TYPES.RECOMMENDED) {
            merchantsToShow = [];
          }

          merchantsToShow = merchantsToShow.filter(merchant => !renderedMerchants.find(m => m.merchantId === merchant.merchantId));
          renderedMerchants = renderedMerchants.concat(merchantsToShow);

          if (merchantsToShow.length === 0 && setSearchHeaderVisible) {
            setSearchHeaderVisible(false);
          }

          return merchantsToShow.length ? (
            <React.Fragment key={category.slug}>
              <View style={[styles.sectionHeading, { marginTop: 20, flexDirection: currLang === 'ar' ? 'row-reverse' : 'row' }]}>
                <Text style={{ fontSize: 18, fontWeight: '700', lineHeight: 20 }}>{category.displayName}</Text>
                <Text
                  style={{ color: '#411361', lineHeight: 24 }}
                  onPress={() => {
                    if (!isSingleCategory) {
                      handleShowCertainCategory(category);
                    } else {
                      handleShowAllCategories();
                    }
                  }}
                >
                  {!isSingleCategory ? t('common.seeAll') : t('common.seeLess')}
                </Text>
              </View>

              {isSingleCategory ? (
                <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>
                  {merchantsToShow.map((item) => renderTile(item, 'segregated', handleOnMerchantPress))}
                </View>
              ) : (
                <ScrollView overScrollMode="never" style={{ width: '100%', display: 'flex', flexDirection: 'row', flexGrow: 0 }} horizontal>
                  {merchantsToShow.slice(0, 5).map((item) => renderTile(item, 'segregated', handleOnMerchantPress))}
                </ScrollView>
              )}
            </React.Fragment>
          ) : (
            <></>
          );
        })}
      </>
    );
  }

  const sortedMerchants = [...merchants.filter((elem) => elem.categoryFlag), ...merchants.filter((elem) => !elem.categoryFlag)];

  return sortedMerchants.slice(0, 30).map((item) => renderTile(item, 'sorted', handleOnMerchantPress));
};

export default renderDirectoryList;
