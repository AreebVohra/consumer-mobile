/* eslint-disable object-curly-newline */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, ScrollView, Dimensions, Linking, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import PropTypes from 'prop-types';

import { Button, Text, TopNavigationAction, Input, Layout, Modal } from '@ui-kitten/components';
import { t } from 'services/i18n';

import { smartSearch } from 'api';
import Icon from 'components/Icon';
import { resetFilteredCategories, updateFilteredCategories, fetchRecommendedMerchants, updateFilteredCountry } from 'reducers/directory';
import handleLogEvent from 'utils/handleLogEvent';
import { AFFILIATE_SLUG, IS_CASHBACK_ENABLED, RECOMMENDED_CATEGORY, BLOCKING_CODES, mainCountrySelectOptions } from 'utils/constants';
import CashbackPartnerIcon from 'assets/hiwCashback1';
import CashbackCheckoutIcon from 'assets/hiwCashback2';
import CashbackUIIcon from 'assets/hiwCashback3';
import renderDirectoryList from './renderLists';
import styles from './styles';
import MerchantPage from './merchantPage';
import AffiliatePage from './affiliatePage';
import CouponCodePage from './couponCodePage';
import MerchantCarousel from '../Carousel';

const ShopDirectory = ({ categoryFiltrationBottomSheetRef, navigation }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();

  const { isAuthenticated, currentUser, remoteMobileConfig, currentUserScore, isConsumerMerchantSpendLimitResolved, isConsumerMerchantSpendLimitLecResolved, shouldApplyDiscount } = useSelector((state) => state.application);
  const { userId, phoneNumber = '', isIdExpired } = currentUser;
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const { mafCardsOn } = remoteMobileConfig || {};
  const { merchantSpendLimitReason, merchantSpendLimitLecReason } = currentUserScore;

  const { detailsIsResolved, allMerchantDetails = [], filteredCategories, filteredCountry, recommendedMerchants } = useSelector((state) => state.directory);

  const [directorySearchValue, setDirectorySearchValue] = useState('');
  const [directorySearchTerms, setDirectorySearchTerms] = useState([]);
  const [filteredMerchants, setFilteredMerchants] = useState(allMerchantDetails.merchants || []);
  const [categoriesOfFilter, setCategoriesOfFilter] = useState(allMerchantDetails.categories || []);
  const [currMerchant, setCurrMerchant] = useState(null);
  const [deliveryCountry, setDeliveryCountry] = useState(false);
  const [currParent, setCurrParent] = useState({});
  const [recommendedSearchMerchants, setRecommendedSearchMerchants] = useState([]);
  const [searchHeaderVisible, setSearchHeaderVisible] = useState(true);
  const [smartSearchLoading, setSmartSearchLoading] = useState(false);
  const [allowGiftCardCheckout, setAllowGiftCardCheckout] = useState(false);
  const [allowLecCardCheckout, setAllowLecCardCheckout] = useState(false);
  const [searchResults, setSearchResults] = useState(false);
  const [canBeCleared, setCanBeCleared] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const merchantPageBottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['80%', '100%'], []);

  useEffect(() => {
    if (mafCardsOn
      // the phoneNumber check is for VM users, since they have no phone number but they are UAE only
      && phoneNumber
      && phoneNumber.includes('+971')
      && isConsumerMerchantSpendLimitResolved
      && !isIdExpired
      && !([BLOCKING_CODES.MOB_CRD, BLOCKING_CODES.MOB_EML, BLOCKING_CODES.BLK].includes(merchantSpendLimitReason))
    ) {
      setAllowGiftCardCheckout(true);
    }
  }, [isIdExpired, phoneNumber, merchantSpendLimitReason, isConsumerMerchantSpendLimitResolved]);

  useEffect(() => {
    if (mafCardsOn
      // the phoneNumber check is for VM users, since they have no phone number but they are UAE only
      && phoneNumber
      && phoneNumber.includes('+971')
      && isConsumerMerchantSpendLimitLecResolved
      && !isIdExpired
      && !([BLOCKING_CODES.MOB_CRD, BLOCKING_CODES.MOB_EML, BLOCKING_CODES.BLK].includes(merchantSpendLimitLecReason))
    ) {
      setAllowLecCardCheckout(true);
    }
  }, [isIdExpired, phoneNumber, merchantSpendLimitLecReason, isConsumerMerchantSpendLimitLecResolved]);




  useEffect(() => {
    dispatch(fetchRecommendedMerchants(userId));
  }, [userId]);

  useEffect(() => {
    if (phoneNumber && phoneNumber.includes('+971')) {
      dispatch(updateFilteredCountry(mainCountrySelectOptions[0][0]));
    } else if (phoneNumber && phoneNumber.includes('+966')) {
      dispatch(updateFilteredCountry(mainCountrySelectOptions[1][0]));
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (detailsIsResolved) {
      setFilteredMerchants(allMerchantDetails.merchants);
      setCategoriesOfFilter(allMerchantDetails.categories);
    }
  }, [detailsIsResolved]);


  const clearSearch = (merchants = null) => {
    inputRef.current.clear();
    setCanBeCleared(false);
    setDirectorySearchValue('');
    setDirectorySearchTerms([]);
    setSearchResults(false);
    setRecommendedSearchMerchants([]);
    setSmartSearchLoading(false);
    if (allMerchantDetails && allMerchantDetails.merchant && allMerchantDetails.merchant.length) {
      if (merchants) {
        setFilteredMerchants(merchants);
      } else {
        setFilteredMerchants(allMerchantDetails.merchants);
      }
    }
  };

  const searchAgainstTerms = (searchTerms) => {
    const affiliateCategory = (allMerchantDetails.categories || []).find((cat) => cat.slug === AFFILIATE_SLUG);
    const filterHasCashback = (categoriesOfFilter || []).length <= 2 && (categoriesOfFilter || []).includes(affiliateCategory);

    const merchants = (allMerchantDetails.merchants || []).filter((merchant) => {
      if (directorySearchValue === t('common.searchStore')) {
        return true;
      }
      const loadedCategories = (allMerchantDetails || {}).categories || [];
      const lowerCaseMerchantName = merchant.displayName.toLowerCase();
      const { displayCategories, searchCategories } = merchant;
      const tagCategories = searchCategories || displayCategories;
      const deliversToFilter = merchant.deliveringTo ? searchTerms.find(term => merchant.deliveringTo.includes(term)) : false;
      if (
        (displayCategories || []).find((category) => searchTerms.find(term => category.includes(term)))
        || (tagCategories || []).find((category) => ((loadedCategories.find((cat) => cat.slug === category) || {}).tags || []).find((tag) => searchTerms.find(term => tag.includes(term))))
        || searchTerms.find(term => lowerCaseMerchantName.includes(term))
        || deliversToFilter
      ) {
        return true;
      }
      return false;
    });
    // if no merchants were found, return false in order to fetch search terms synonyms
    setFilteredMerchants(merchants);
    setSearchResults(true);
    setCategoriesOfFilter(filterHasCashback ? [affiliateCategory] : allMerchantDetails.categories);
    if (merchants.length === 0) {
      return false;
    }
    return true;
  };

  const fetchSearchTermSynonyms = (merchantFilterToApply) => {
    const dataUrl = `https://api.datamuse.com/words?ml=${merchantFilterToApply}&max=5`;
    try {
      fetch(dataUrl).then((response) => {
        const result = response.json();

        result.then((responseData) => {
          const matchingWordsList = responseData.map((key) => key.word);
          setDirectorySearchTerms(matchingWordsList);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleSmartSearch = async () => {
      setSmartSearchLoading(true);
      setSearchHeaderVisible(true);
      const category = categoriesOfFilter && categoriesOfFilter.length === 1 ? categoriesOfFilter[0].slug : null;
      const payload = { keyword: directorySearchValue.trim().toLowerCase() };

      if (category !== 'affiliate') {
        payload.category = category;
      }

      const resp = await smartSearch(payload);
      const { recommended } = resp.payload;

      let ordered = recommended.map((rId) => {
        // eslint-disable-next-line camelcase
        const m = allMerchantDetails.merchants.find(({ merchantIds }) => merchantIds.includes(rId));
        if (m) {
          return m;
        }
      });

      ordered = ordered.filter((o) => o !== undefined);
      setRecommendedSearchMerchants(ordered);
      setSmartSearchLoading(false);
    };

    if (!directorySearchValue && directorySearchTerms.length === 0) {
      if (detailsIsResolved) {
        setFilteredMerchants(allMerchantDetails.merchants);
        setCategoriesOfFilter(allMerchantDetails.categories);
      }
      setRecommendedSearchMerchants([]);
    } else {
      // smart search
      // handleSmartSearch();

      // regular search
      setCanBeCleared(directorySearchValue.length > 0);

      if (detailsIsResolved) {
        const merchantFilterToApply = directorySearchValue.trim().toLowerCase();
        const merchantsFound = searchAgainstTerms([merchantFilterToApply]);
        // only use synonyms endpoint if no merchants were found when searching
        if (!merchantsFound) {
          fetchSearchTermSynonyms(merchantFilterToApply);
        }
      }
    }
  }, [directorySearchValue]);


  useEffect(() => {
    if (directorySearchTerms.length > 0) {
      searchAgainstTerms(directorySearchTerms);
    }
  }, [directorySearchTerms]);


  const handleShowAllCategories = () => {
    clearSearch();
    setCategoriesOfFilter([RECOMMENDED_CATEGORY, ...allMerchantDetails.categories]);
    dispatch(resetFilteredCategories());
  };


  const handleShowCertainCategory = (category) => {
    setCategoriesOfFilter([category]);
    dispatch(updateFilteredCategories([category]));
  };


  // eslint-disable-next-line no-shadow
  const renderList = (merchants, hideNotFound = false, setSearchHeaderVisible = null) => (
    <View style={styles.view}>
      {detailsIsResolved && merchants && merchants.length ? (
        renderDirectoryList(
          (merchants || []).filter(({ isAffiliate }) => IS_CASHBACK_ENABLED || !isAffiliate),
          currentUser,
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
        )
      ) : (
        <View style={styles.spinnerContainer}>
          {detailsIsResolved && merchants && !hideNotFound ? <Text style={styles.noResultsText}>{t('common.noResults')}</Text> : <></>}
        </View>
      )}
    </View>
  );

  const openMerchantWebsite = async (merchant) => {
    await handleLogEvent('SpotiiMobileDirectoryMerchantPressed', {
      merchant_id: merchant.merchantId,
    });
    const displayUrl = merchant.displayUrl || 'https://www.spotii.me';

    Linking.openURL(displayUrl).catch((err) => console.error('An error occurred', err));
  };

  const handleOnMerchantPress = async (merchant) => {
    if (merchant.dedicatedPage || merchant.isAffiliate || merchant.isDiscount) {
      setCurrMerchant(merchant);
      merchantPageBottomSheetRef.current.present();
    } else {
      openMerchantWebsite(merchant);
    }
  };

  const renderCloseIcon = (props) => (
    canBeCleared ? (
      <TouchableOpacity onPress={clearSearch}>
        {Icon({
          ...props, fill: '#CCCCCC', width: 24, height: 24,
        }, 'close')}
      </TouchableOpacity>
    ) : Icon({ ...props, fill: '#717171', width: 20, height: 20 }, 'search-outline')
  );

  const selectedMerchantPage = () => {
    if (currMerchant.isAffiliate) {
      return (
        <AffiliatePage
          merchantPageBottomSheetRef={merchantPageBottomSheetRef}
          currMerchant={currMerchant}
          setCurrMerchant={setCurrMerchant}
          setShowLoginModal={setShowLoginModal}
          userId={userId}
          phoneNumber={phoneNumber}
        />
      );
    }
    if (currMerchant.isDiscount) {
      return (
        <CouponCodePage
          merchantPageBottomSheetRef={merchantPageBottomSheetRef}
          currMerchant={currMerchant}
          setCurrMerchant={setCurrMerchant}
          openMerchantWebsite={openMerchantWebsite}
        />
      );
    }

    return (
      <MerchantPage
        merchantPageBottomSheetRef={merchantPageBottomSheetRef}
        currMerchant={currMerchant}
        setCurrMerchant={setCurrMerchant}
        openMerchantWebsite={openMerchantWebsite}
        currLang={currLang}
      />
    );
  };


  return (
    <>
      <Modal
        visible={showLoginModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowLoginModal(false)}
        style={styles.modal}
      >
        <View style={styles.loginModalView}>
          <View style={[styles.loginHeader, { flexDirection: currLang === 'ar' ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.loginModaltext, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.cashbackHeading1')}</Text>
            <TouchableOpacity>
              {Icon({
                fill: '#717171', width: 25, height: 25, borderWidth: 1, onPress: () => setShowLoginModal(false),
              }, 'close')}
            </TouchableOpacity>
          </View>
          <Text style={[styles.loginModaltext, { color: '#AA8FFF', textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.cashbackHeading2')}</Text>
          <Text style={[styles.loginModalSubheading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>
            {t('common.cashbackLoginHeading')}
            {'\n'}
          </Text>
          <View style={{ flexDirection: currLang === 'ar' ? 'row-reverse' : 'row', marginTop: 15 }}>
            <View style={{ width: '10%', marginLeft: 5 }}>
              <CashbackPartnerIcon />
            </View>
            <View style={{ width: '90%' }}>
              <Text style={[styles.cashbackHiwHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.loginCashbackHeader1')}</Text>
              <Text style={[styles.cashbackHiwSubheading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.loginCashbackBody1')}</Text>
            </View>
          </View>
          <View style={{ flexDirection: currLang === 'ar' ? 'row-reverse' : 'row', marginTop: 20, justifyContent: 'space-between' }}>
            <View style={{ width: '10%', marginLeft: 5 }}>
              <CashbackCheckoutIcon />
            </View>
            <View style={{ width: '90%' }}>
              <Text style={[styles.cashbackHiwHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.loginCashbackHeader2')}</Text>
              <Text style={[styles.cashbackHiwSubheading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>
                {t('common.loginCashbackBody2')}
                <Text style={{ color: '#AA8FFF' }}>
                  {` ${t('common.loginCashbackCheckoutText')}`}
                </Text>
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: currLang === 'ar' ? 'row-reverse' : 'row', marginTop: 20, justifyContent: 'space-between' }}>
            <View style={{ width: '10%', marginLeft: 5 }}>
              <CashbackUIIcon />
            </View>
            <View style={{ width: '90%' }}>
              <Text style={[styles.cashbackHiwHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.loginCashbackHeader3')}</Text>
              <Text style={[styles.cashbackHiwSubheading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]}>{t('common.loginCashbackBody3')}</Text>
            </View>
          </View>
          <Button
            size="small"
            style={styles.LoginCTA}
            onPress={() => {
              merchantPageBottomSheetRef.current.close();
              setShowLoginModal(false);
              navigation.navigate('ChoosePhoneNumberForm');
            }}
          >
            {t('common.shopAndEarnRewards')}
          </Button>
        </View>
      </Modal>
      {isAuthenticated && isConsumerMerchantSpendLimitResolved ? (
        <MerchantCarousel navigation={navigation} allowGiftCardCheckout={allowGiftCardCheckout} allowLecCardCheckout={allowLecCardCheckout} filteredCountry={filteredCountry} />
      ) : <></>}
      {!isAuthenticated ? (
        <Layout
          style={styles.form}
          level="1"
        >
          <TopNavigationAction
            icon={(props) => Icon(
              {
                ...props,
                fill: '#000000',
                width: 40,
                height: 40,
                paddingTop: '5%',
              },
              'chevron-left',
            )}
            onPress={() => {
              if (categoriesOfFilter && categoriesOfFilter.length === 1) {
                setDeliveryCountry(false);
                setCurrParent({});
                setFilteredMerchants(allMerchantDetails.merchants);
                setCategoriesOfFilter(allMerchantDetails.categories);
              } else if (directorySearchValue) {
                setDeliveryCountry(false);
                setCurrParent({});
                setDirectorySearchValue('');
                setFilteredMerchants(allMerchantDetails.merchants);
                setCategoriesOfFilter(allMerchantDetails.categories);
              } else {
                navigation.goBack();
              }
            }}
          />
        </Layout>
      ) : null}

      <ScrollView overScrollMode="never">
        <View style={[styles.searchBarView, currLang === 'ar' ? { left: 10, width: screenWidth - 20 } : { right: 10, width: screenWidth - 20 }]}>
          <View>
            {detailsIsResolved ? (
              <View style={{ flex: 1, flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                <Input
                  ref={inputRef}
                  textAlign={isRTL ? 'right' : 'left'}
                  accessoryLeft={(props) => (currLang !== 'ar' ? renderCloseIcon(props) : null)}
                  accessoryRight={(props) => (currLang === 'ar' ? renderCloseIcon(props) : null)}
                  size="large"
                  style={{ flex: 3, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, backgroundColor: '#FFF' }}
                  textStyle={{ fontSize: 14, color: '#717171' }}
                  placeholder={t('common.searchStore')}
                  onEndEditing={(e) => setDirectorySearchValue(e.nativeEvent.text)}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  // accessoryRight={renderCloseIcon}
                />
                <Button
                  accessoryRight={(props) => (currLang !== 'ar' ? Icon({ ...props, fill: '#717171', marginLeft: 4, width: 18, height: 18 }, 'arrow-down-outline') : null)}
                  accessoryLeft={(props) => (currLang === 'ar' ? Icon({ ...props, fill: '#717171', marginRight: 4, width: 18, height: 18 }, 'arrow-down-outline') : null)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#CCC',
                    flex: 1,
                    marginLeft: currLang === 'en' ? 8 : 0,
                    marginRight: currLang === 'ar' ? 8 : 0,
                  }}
                  appearance="outline"
                  size="small"
                  status="control"
                  onPress={() => categoryFiltrationBottomSheetRef?.current?.present()}
                >
                  {(evaProps) => (
                    <Text {...evaProps} style={{ marginLeft: 4, fontSize: 13, color: '#717171' }}>
                      {t('common.categories')}
                    </Text>
                  )}
                </Button>
              </View>
            ) : null}
          </View>
        </View>

        <View style={{ paddingTop: 0, marginTop: '20%', marginBottom: '10%' }}>
          {directorySearchValue ? (
            <>
              {/* //TODO: uncomment and implement this code  */}
              {/* {searchHeaderVisible && ((!smartSearchLoading && recommendedSearchMerchants.length > 0) || smartSearchLoading) ? (
                <>
                  <View style={currLang === 'ar' ? styles.sectionHeadingSearchAr : styles.sectionHeadingSearchEn}>
                    <Text category="h5">{t('common.recommended')}</Text>
                  </View>
                  {smartSearchLoading ? (
                    <View style={styles.centerSpinnerContainer}>
                      <Spinner />
                    </View>
                  ) : (
                    renderList(recommendedSearchMerchants, true, setSearchHeaderVisible)
                  )}
                </>
              ) : (
                <></>
              )} */}

              <View style={currLang === 'ar' ? styles.sectionHeadingSearchAr : styles.sectionHeadingSearchEn}>
                <Text category="h5">{t('common.resultsFor', { term: directorySearchValue })}</Text>
              </View>
            </>
          ) : (
            <></>
          )}
          {renderList(filteredMerchants)}
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={merchantPageBottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
        )}
      >
        {currMerchant ? selectedMerchantPage() : <></>}
      </BottomSheetModal>
    </>
  );
};

ShopDirectory.propTypes = {
  categoryFiltrationBottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      present: PropTypes.func,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

ShopDirectory.defaultProps = {
  categoryFiltrationBottomSheetRef: null,
  navigation: null,
};

export default ShopDirectory;
