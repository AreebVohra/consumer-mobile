import { View, Dimensions, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { t } from 'services/i18n';
import { Button, Text } from '@ui-kitten/components';
import FastImage from 'react-native-fast-image';
import { storeUrl } from 'expo-store-review';
import styles from './styles';

const MerchantDiscounts = ({ bottomSheetRef, merchant, navigation }) => {
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const openMerchantWebsite = async (m) => {
    // after json changes - merchant.displayUrl
    const displayUrl = m.displayUrl || 'https://www.spotii.me';

    Linking.openURL(displayUrl).catch((err) => console.error('An error occurred', err));
  };

  return (
    <>
      {merchant ? (
        <View style={styles.merchantTile}>
          <View style={styles.merchantDiscountPic}>
            <FastImage
              source={{ uri: merchant.displayPicture }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
            <View style={styles.merchantDiscountLogo}>
              <FastImage
                source={{ uri: merchant.carouselLogo }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>
          <View style={styles.merchantDiscountText}>
            <Text
              style={[
                styles.merchantDiscountPercentage,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {merchant.carouselOfferPercentage}
            </Text>
            <Text
              style={[
                styles.merchantDiscountDesc,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {merchant.carouselModalDesc}
            </Text>
            <Button
              style={styles.shopButton}
              onPress={() => {
                openMerchantWebsite(merchant);
              }}
            >
              {(evaProps) => (
                <Text
                  {...evaProps}
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    lineHeight: 18,
                    color: '#fff',
                  }}
                >
                  {t('common.shopNow')}
                </Text>
              )}
            </Button>
            <Text
              style={
                isRTL
                  ? styles.termsAndConditionsAr
                  : styles.termsAndConditionsEn
              }
            >
              {t('common.DiscountTermsAndConditions')}
            </Text>
          </View>
        </View>
      ) : <></>}
    </>
  );
};

MerchantDiscounts.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  bottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      present: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
  merchant: PropTypes.shape({
    displayPicture: PropTypes.string,
    carouselLogo: PropTypes.string,
    display_name: PropTypes.string,
    carouselOfferPercentage: PropTypes.string,
    carouselModalDesc: PropTypes.string,
  }),
};

MerchantDiscounts.defaultProps = {
  navigation: null,
  bottomSheetRef: null,
  merchant: null,
};

export default MerchantDiscounts;
