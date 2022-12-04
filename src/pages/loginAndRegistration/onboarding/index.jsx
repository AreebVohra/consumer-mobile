import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Layout,
  Text,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import { changeLanguage } from 'reducers/language';
import { LANGUAGES_TEXT } from 'utils/constants';
import Icon from 'components/Icon';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import styles from './styles';

const Onboarding = ({ navigation }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const { persistedLoginAttempted } = useSelector((state) => state.user);
  const { isAuthenticated, currentUser } = useSelector((state) => state.application);

  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);

  const isRTL = currLang === 'ar';

  const { width: viewportWidth } = Dimensions.get('window');
  const SLIDE_WIDTH = viewportWidth;
  const SLIDER_WIDTH = viewportWidth;

  const onboardingImg1 = require('assets/onboarding1.png');
  const onboardingImg2 = currLang === 'ar' ? require('assets/onboarding2-ar.png') : require('assets/onboarding2-en.png');
  const onboardingImg3 = currLang === 'ar' ? require('assets/onboarding3-ar.png') : require('assets/onboarding3-en.png');

  const onboardingScreens = [
    {
      header: <Text style={styles.tileHeaderText}>{t('common.shopOnlineAnytime')}</Text>,
      subtitle: (
        <Text style={styles.centerText}>
          <Text style={styles.tileSubtitleText}>{t('common.fashionLifestyleAnd')}</Text>
          {' '}
          <Text style={styles.tileSubtitleSpecial}>{t('common.lotMore')}</Text>
        </Text>),
      image: onboardingImg1,
    },
    {
      header: <Text style={styles.tileHeaderText}>{t('common.selectSpotiiAtCheckout')}</Text>,
      subtitle: (
        <Text style={styles.centerText}>
          <Text style={styles.tileSubtitleText}>{t('common.payInstalsWith')}</Text>
          {' '}
          <Text style={styles.tileSubtitleSpecial}>{t('common.zeroInterest')}</Text>
        </Text>),
      image: onboardingImg2,
    },
    {
      header: <Text style={styles.tileHeaderText}>{t('common.completeYourPurchase')}</Text>,
      subtitle: (
        <Text style={styles.centerText}>
          <Text style={styles.tileSubtitleText}>{t('common.within')}</Text>
          {' '}
          <Text style={styles.tileSubtitleSpecial}>{t('common.aMinute')}</Text>
          {' '}
          <Text style={styles.tileSubtitleText}>{t('common.withSpotii')}</Text>
        </Text>),
      image: onboardingImg3,
    },
  ];

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (!currentUser.phoneVerified) {
        if (currentUser.phoneNumber) {
          navigation.navigate('LoginOtpForm', { changePhoneNumber: true, preventBackAction: true });
        } else {
          navigation.navigate('ChoosePhoneNumberForm', { changePhoneNumber: true });
        }
      }
    }
  }, [isAuthenticated, currentUser]);

  const renderScreen = ({ item }) => {
    const { header, subtitle, image } = item;
    return (
      <View style={styles.tile}>
        <View style={styles.tileHeader}>
          {header}
          {subtitle}
        </View>
        <View style={styles.tileImageContainer}>
          <FastImage
            source={image}
            style={styles.tileImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      {/* persistedLoginAttempted is set to true after first login attempt and never changes until the app dies */}
      {/* isAuthenticated changes when we logout, so here, if the user was logged in and logs out, persistedLoginAttempted is true but the isAuthenticated is false so we show the login form */}
      {/* and when he logs in, isAuthenticated is true, but the statusSplash never shows since we are changing the root element in landing.jsx */}
      {!persistedLoginAttempted || isAuthenticated
        ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AA8FFF' }}>
            <Image
              resizeMode="contain"
              style={{
                flex: 1,
              }}
              source={require('assets/staticSplash.png')}
            />
          </View>
        ) : (
          <Layout style={styles.layout} level="1">
            <KeyboardAvoidingView>
              <TouchableOpacity
                style={styles.topActionsRight}
                onPress={() => dispatch(changeLanguage({ lang: `${currLang === 'ar' ? 'en' : 'ar'}`, shouldFetchMerchantDetailsList: true }))}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    onPress={() => { navigation.navigate('Shop'); }}
                    category="h7"
                    style={{ width: 120, textAlign: 'center', backgroundColor: '#f9f9f9', paddingVertical: 6, paddingHorizontal: 1, borderRadius: 4, fontSize: 12, marginRight: 10 }}
                  >
                    {t('common.exploreShops')}
                  </Text>
                  <Text category="h7" style={{ width: 80, textAlign: 'center', backgroundColor: '#f9f9f9', paddingVertical: 6, paddingHorizontal: 4, borderRadius: 4 }}>
                    {currLang === 'ar' ? LANGUAGES_TEXT.ENGLISH : LANGUAGES_TEXT.ARABIC}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.mainContainer}>
                <Carousel
                  data={onboardingScreens}
                  renderItem={renderScreen}
                  ref={isCarousel}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={SLIDE_WIDTH}
                  onSnapToItem={(idx) => setIndex(idx)}
                  enableSnap
                  lockScrollWhileSnapping
                  autoplay
                  loop
                />
                <View style={styles.carouselPaginationContainer}>
                  <TouchableOpacity
                    style={styles.carouselNavBtn}
                    onPress={() => {
                      isCarousel.current.stopAutoplay();
                      isCarousel.current.snapToPrev(true);
                    }}
                  >
                    {Icon(
                      {
                        fill: '#AA8FFF',
                        width: '100%',
                        height: '100%',
                      },
                      'arrow-back-outline',
                    )}
                  </TouchableOpacity>
                  <Pagination
                    dotsLength={onboardingScreens.length}
                    activeDotIndex={index}
                    carouselRef={isCarousel}
                    dotStyle={styles.dotStyle}
                    inactiveDotStyle={styles.inactiveDotStyle}
                    inactiveDotOpacity={1}
                    inactiveDotScale={0.8}
                    animatedTension={200}
                  />
                  <TouchableOpacity
                    style={styles.carouselNavBtn}
                    onPress={() => {
                      isCarousel.current.stopAutoplay();
                      isCarousel.current.snapToNext(true);
                    }}
                  >
                    {Icon(
                      {
                        fill: '#AA8FFF',
                        width: '100%',
                        height: '100%',
                      },
                      'arrow-forward-outline',
                    )}
                  </TouchableOpacity>
                </View>

                <View style={[styles.buttonsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Button size="small" appearance="ghost" onPress={() => navigation.navigate('CreateAccount')}>
                    {(evaProps) => (
                      <>
                        <Text
                          {...evaProps}
                          style={styles.signUpText}
                        >
                          {t('common.signUp')}
                        </Text>
                        <Text>
                          {Icon(
                            {
                              fill: '#411361',
                              width: 20,
                              height: 20,
                              margin: 3,
                            },
                            'arrow-forward-outline',
                          )}
                        </Text>
                      </>
                    )}
                  </Button>
                  <Button style={styles.signInButton} size="small" appearance="ghost" onPress={() => navigation.navigate('ChoosePhoneNumberForm')}>
                    {(evaProps) => (
                      <Text
                        {...evaProps}
                        style={styles.signInText}
                      >
                        {t('common.signIn')}
                      </Text>
                    )}
                  </Button>
                </View>

              </View>
            </KeyboardAvoidingView>
          </Layout>
        )}
    </>
  );
};

Onboarding.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

Onboarding.defaultProps = {
  navigation: null,
};

export default Onboarding;
