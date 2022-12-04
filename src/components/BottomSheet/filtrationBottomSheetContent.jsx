/* eslint-disable no-multiple-empty-lines */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Button,
  IndexPath,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import { mainCountrySelectOptions } from 'utils/constants';
import {
  updateFilteredCategories, resetFilteredCategories, resetFilteredCountry, updateFilteredCountry,
} from 'reducers/directory';
import Icon from 'components/Icon';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import FiltrationCheckbox from './filtrationCheckbox';
import styles from './styles';

const FiltrationBottomSheetContent = ({ bottomSheetRef }) => {
  const dispatch = useDispatch();

  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';

  const { allMerchantDetails = [], filteredCategories, filteredCountry } = useSelector((state) => state.directory);

  const { phoneNumber } = useSelector((state) => state.application.currentUser);
  const defaultIndex = mainCountrySelectOptions.findIndex(
    ([shortCut, _, code]) => (
      filteredCountry ? filteredCountry === shortCut : phoneNumber?.substring(0, 4) === code
    ),
  );

  const [topCategories, setTopCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(new IndexPath(defaultIndex !== -1 ? defaultIndex : 0));


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
    const { categories: cats = [] } = allMerchantDetails;

    const parentCategories = cats.filter(category => category.isParent);

    setAllCategories(parentCategories.map(category => {
      if (!category.topPicks) {
        const returnCategory = { ...category };
        returnCategory.isChecked = filteredCategories.find(filteredCat => filteredCat.slug === category.slug)?.isChecked || false;
        return returnCategory;
      }
    }).filter(category => category));

    setTopCategories(parentCategories.map(category => {
      if (category.topPicks) {
        const returnCategory = { ...category };
        returnCategory.isChecked = filteredCategories.find(filteredCat => filteredCat.slug === category.slug)?.isChecked || false;
        return returnCategory;
      }
    }).filter(category => category));
  }, [allMerchantDetails]);


  const resetFilters = () => {
    const { categories: cats = [] } = allMerchantDetails;

    setAllCategories(cats.filter((category) => !category.topPicks));
    setTopCategories(cats.filter((category) => category.topPicks));

    dispatch(resetFilteredCategories());
    dispatch(resetFilteredCountry());
    bottomSheetRef.current.close();
  };


  const handleCheckCategory = (category, categories, setCategories) => {
    const updatedCategories = categories.map((cat) => {
      const returnCategory = { ...cat };

      if (cat.slug === category.slug) {
        returnCategory.isChecked = !returnCategory.isChecked;
      } else {
        returnCategory.isChecked = categories.find(filteredCat => filteredCat.slug === cat.slug)?.isChecked;
      }

      return returnCategory;
    });

    setCategories(updatedCategories);
  };


  const handleShopFiltrationButtonCLick = () => {
    const checkedCategories = [];

    checkedCategories.push(
      ...topCategories.filter(category => category.isChecked),
      ...allCategories.filter(category => category.isChecked),
    );

    dispatch(updateFilteredCategories(checkedCategories));
    dispatch(updateFilteredCountry(mainCountrySelectOptions[selectedCountryIndex.row][0]));
    bottomSheetRef.current.close();
  };


  return (
    <View style={{ flex: 1, marginVertical: 12 }}>
      <View style={{ flexDirection: `row${isRTL ? '-reverse' : ''}`, marginHorizontal: 12 }}>
        <Select
          size="medium"
          status="control"
          style={{ flex: 2 }}
          accessoryRight={() => (
            !isRTL ? (
              Icon(
                {
                  fill: '#AA8FFF',
                  width: 18,
                  height: 18,
                  marginTop: 4,
                },
                'arrow-down',
              )
            ) : <></>
          )}
          accessoryLeft={() => (
            isRTL ? (
              Icon(
                {
                  fill: '#AA8FFF',
                  width: 18,
                  height: 18,
                  marginTop: 4,
                },
                'arrow-down',
              )
            ) : <></>
          )}
          selectedIndex={selectedCountryIndex}
          onSelect={(index) => setSelectedCountryIndex(index)}
          value={(props) => (
            <Text {...props} style={[props.style, { fontSize: 15, color: '#353535', fontWeight: '400', textAlign: isRTL ? 'right' : 'left' }]}>
              {t(mainCountrySelectOptions[selectedCountryIndex.row][1])}
            </Text>
          )}
        >
          {mainCountrySelectOptions.map(([_, country, code]) => (
            <SelectItem
              key={code}
              title={(titleProps) => (
                <Text {...titleProps} style={{ width: '100%', textAlign: isRTL ? 'right' : 'left' }}>
                  {t(country)}
                </Text>
              )}
            />
          ))}
        </Select>

        <Button style={{ flex: 1, backgroundColor: 'transparent' }} size="small" appearance="ghost" onPress={resetFilters} disabled={!filteredCategories.length}>
          {(evaProps) => (
            <Text
              {...evaProps}
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: filteredCategories.length ? '#AA8FFF' : '#717171',
                marginLeft: 18,
              }}
            >
              {t('common.resetFilter')}
            </Text>
          )}
        </Button>
      </View>

      <Divider orientation="horizontal" color="#EDE6FF" style={{ marginHorizontal: 18, marginVertical: 14, flexGrow: 0 }} width={1} />

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            flexDirection: `row${isRTL ? '-reverse' : ''}`,
            textAlign: isRTL ? 'right' : 'left',
            fontSize: 12,
            fontWeight: '400',
            color: '#717171',
            lineHeight: 15,
            paddingLeft: !isRTL ? 18 : 0,
            paddingRight: isRTL ? 18 : 0,
            marginBottom: 2,
          }}
        >
          {t('common.topPicks')}
        </Text>
        <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, flexWrap: 'wrap' }}>
          {topCategories.map((category) => (
            <FiltrationCheckbox
              key={category.slug}
              category={category}
              isAlreadyChecked={topCategories.some(cat => cat.slug === category.slug && cat.isChecked)}
              handleCheckCategory={() => handleCheckCategory(category, topCategories, setTopCategories)}
              isRTL={isRTL}
            />
          ))}
        </View>

        <Divider orientation="horizontal" color="#EDE6FF" style={{ marginHorizontal: 18, marginVertical: 14, flexGrow: 0 }} width={1} />

        <Text
          style={{
            flexDirection: `row${isRTL ? '-reverse' : ''}`,
            fontSize: 12,
            textAlign: isRTL ? 'right' : 'left',
            fontWeight: '400',
            color: '#717171',
            lineHeight: 15,
            paddingLeft: !isRTL ? 18 : 0,
            paddingRight: isRTL ? 18 : 0,
            marginBottom: 2,
          }}
        >
          {t('common.allCategories')}
        </Text>
        <ScrollView overScrollMode="never">
          <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, flexWrap: 'wrap' }}>
            {allCategories.map((category) => (
              <FiltrationCheckbox
                key={category.slug}
                category={category}
                isAlreadyChecked={allCategories.some(cat => cat.slug === category.slug && cat.isChecked)}
                handleCheckCategory={() => handleCheckCategory(category, allCategories, setAllCategories)}
                isRTL={isRTL}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <Button
        style={styles.showShopsButton}
        size="large"
        onPress={handleShopFiltrationButtonCLick}
        // disabled={topCategories.every((category) => !category.isChecked) && allCategories.every((category) => !category.isChecked)}
      >
        {(evaProps) => <Text {...evaProps}>{t('common.showShops')}</Text>}
      </Button>
    </View>
  );
};

FiltrationBottomSheetContent.propTypes = {
  bottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      expand: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
};

FiltrationBottomSheetContent.defaultProps = {
  bottomSheetRef: null,
};

export default FiltrationBottomSheetContent;
