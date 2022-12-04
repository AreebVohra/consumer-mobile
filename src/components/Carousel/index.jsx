// import Carousel from 'react-multi-carousel';
import Carousel from 'react-native-snap-carousel';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@ui-kitten/components';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import styles from './styles';
import { MAF_MERCHANT_ID, LEC_MERCHANT_ID } from '../../../utils/constants';
import MerchantDiscounts from './merchantDiscounts';
import { setIsMAFQualifiedLoading } from '../../../reducers/application';
import { setCarouselMerchants } from '../../../reducers/directory';

const MerchantCarousel = ({ navigation, allowGiftCardCheckout, allowLecCardCheckout, filteredCountry }) => {
  const dispatch = useDispatch();

  const currLang = useSelector(state => state.language.language);
  const { allMerchantDetails = [], carouselMerchants } = useSelector((state) => state.directory);
  const [showMerchantDiscountPage, setShowMerchantDiscountPage] = useState(false);
  const isRTL = currLang === 'ar';
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '85%'], []);

  useEffect(() => {
    if ((allMerchantDetails || {}).merchants) {
      dispatch(setCarouselMerchants({ merchants: allMerchantDetails.merchants, filteredCountry, allowGiftCardCheckout, allowLecCardCheckout }));
    }
  }, [allMerchantDetails, allowGiftCardCheckout, allowLecCardCheckout]);

  const renderItem = ({ item }) => {
    const logoImage = { uri: item.carouselLogo };
    const bgImage = { uri: item.displayPicture };
    const mafBgImage = { uri: item.carouselImage };

    const onTilePress = tile => {
      if (tile.merchantId === MAF_MERCHANT_ID) {
        dispatch(setIsMAFQualifiedLoading(true));
        navigation.navigate('Scanner', { screen: 'GiftCard' });
      } else if (tile.merchantId === LEC_MERCHANT_ID) {
        dispatch(setIsMAFQualifiedLoading(true));
        navigation.navigate('Scanner', { screen: 'LecGiftCard' });
      } else {
        setShowMerchantDiscountPage(tile);
        bottomSheetRef.current.present();
      }
    };

    return (
      <TouchableOpacity style={{ height: 160, width: carouselMerchants.length > 1 ? 300 : '100%' }} onPress={() => onTilePress(item)}>
        <View
          style={[styles.banner, { width: carouselMerchants.length > 1 ? 300 : '100%' }]}
        >
          {item.showBareImage ? (
            <FastImage
              source={mafBgImage}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
          ) : (
            <View style={[styles.regularCarouselTile, { flexDirection: `row${isRTL ? '-reverse' : ''}` }]}>
              <View style={styles.merchantInfo}>
                <View style={[styles.merchantLogo, { left: !isRTL ? 10 : 0, right: isRTL ? 10 : 0 }]}>
                  <FastImage
                    source={logoImage}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
                <Text style={[styles.merchantOfferText, { left: !isRTL ? 10 : 0, right: isRTL ? 10 : 0 }]}>
                  <Text style={styles.carouselText}>{item.carouselOfferText}</Text>
                  {'\n'}
                  <Text style={styles.carouselOffer}>{item.carouselOfferPercentage}</Text>
                </Text>
              </View>
              <View style={styles.merchantDisplayPic}>
                <FastImage
                  source={bgImage}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderBottomLeftRadius: isRTL ? 8 : 0,
                    borderTopLeftRadius: isRTL ? 8 : 0,
                    borderBottomRightRadius: !isRTL ? 8 : 0,
                    borderTopRightRadius: !isRTL ? 8 : 0,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const { width: viewportWidth } = Dimensions.get('window');
  const SLIDE_WIDTH = (carouselMerchants || []).length > 1 ? 300 : 350;
  const ITEM_HORIZONTAL_MARGIN = 15;
  const ITEM_WIDTH = (carouselMerchants || []).length > 1 ? SLIDE_WIDTH + ITEM_HORIZONTAL_MARGIN : SLIDE_WIDTH;
  const SLIDER_WIDTH = viewportWidth;

  return (
    <View>
      <Carousel
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        data={carouselMerchants}
        renderItem={renderItem}
        activeSlideAlignment="start"
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
        )}
      >
        <MerchantDiscounts bottomSheetRef={bottomSheetRef} merchant={showMerchantDiscountPage} navigation={navigation} />
      </BottomSheetModal>
    </View>
  );
};

MerchantCarousel.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  allowGiftCardCheckout: PropTypes.bool,
  allowLecCardCheckout: PropTypes.bool,
  filteredCountry: PropTypes.string,
};

MerchantCarousel.defaultProps = {
  navigation: null,
  allowGiftCardCheckout: false,
  allowLecCardCheckout: false,
  filteredCountry: null,
};

export default MerchantCarousel;
