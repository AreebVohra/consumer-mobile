import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Image, TouchableOpacity } from 'react-native';
import {
  Text, ViewPager, Layout, Card,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import styles from './styles';

const HowItWorks = props => {
  const { navigation } = props;
  const currLang = useSelector(state => state.language.language);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const list = [0, 1, 2, 3];
  const [backBtn, setBackBtn] = useState(false);
  const [skipBtn, setSkipBtn] = useState(true);
  const [nextBtn, setNextBtn] = useState(true);
  const [doneBtn, setDoneBtn] = useState(false);
  const handleBtn = (val) => {
    setSelectedIndex(val);
    if (val > 0 && val < list.length - 1) {
      setSkipBtn(false);
      setBackBtn(true);
      setDoneBtn(false);
      setNextBtn(true);
    } else if (val === list.length - 1) {
      setSkipBtn(false);
      setBackBtn(true);
      setDoneBtn(true);
      setNextBtn(false);
    } else if (val === 0) {
      setSkipBtn(true);
      setBackBtn(false);
      setDoneBtn(false);
      setNextBtn(true);
    }
  };

  return (
    <>
      <ViewPager
        style={styles.center}
        selectedIndex={selectedIndex}
        onSelect={index => handleBtn(index)}
      >
        <Layout
          style={[styles.fullScreen, {
            flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent: 'center',
          }]}
          level="2"
        >
          <View>
            <View style={{ marginBottom: '0%' }}>
              <Text style={styles.textBlock} category="h5">{t('common.step1Title1')}</Text>
              <Text style={styles.subTextBlock}>{t('common.step1Title2')}</Text>
            </View>
            <View style={styles.view}>
              <Card style={styles.block}>
                <View style={styles.icon}>{Icon({ fill: '#FF4D4A', width: 30, height: 30 }, 'rewind-right-outline')}</View>
                <View style={styles.cardView}>
                  <Text style={[styles.textBlockWhiteHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="h6">{t('common.step1Block1Title')}</Text>
                  <Text style={[styles.textBlockWhite, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="c1">{t('common.step1Block1Description')}</Text>
                </View>
              </Card>
              <Card style={styles.block}>
                <View style={styles.icon}>{Icon({ fill: '#FF4D4A', width: 30, height: 30 }, 'credit-card-outline')}</View>
                <View style={styles.cardView}>
                  <Text style={[styles.textBlockWhiteHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="h6">{t('common.step1Block2Title')}</Text>
                  <Text style={[styles.textBlockWhite, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="c1">{t('common.step1Block2Description')}</Text>
                </View>
              </Card>
              <Card style={styles.block}>
                <View style={styles.icon}>{Icon({ fill: '#FF4D4A', width: 30, height: 30 }, 'award-outline')}</View>
                <View style={styles.cardView}>
                  <Text style={[styles.textBlockWhiteHeading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="h6">{t('common.step1Block4Title')}</Text>
                  <Text style={[styles.textBlockWhite, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="c1">{t('common.step1Block4Description')}</Text>
                </View>
              </Card>
            </View>
          </View>
        </Layout>
        <Layout style={styles.fullScreen} level="2">
          <Image style={styles.imageQr} source={require('assets/checkout.png')} />
          <View style={styles.step1Desc}>
            <Text style={styles.textBlock} category="h4">{t('common.step2Title')}</Text>
          </View>
        </Layout>
        <Layout style={styles.fullScreen} level="2">
          {currLang === 'ar'
            ? <Image style={styles.imageQr} source={require('assets/complete-ar.png')} />
            : <Image style={styles.imageQr} source={require('assets/complete.png')} />}
          <View style={styles.step1Desc}>
            <Text style={styles.textBlock} category="h4">{t('common.pickPlanComma')}</Text>
            <Text style={styles.textBlock} category="h4">{t('common.enterAmount')}</Text>
          </View>
        </Layout>
        <Layout style={styles.fullScreen} level="2">
          <Image style={styles.imageQr} source={require('assets/checkmark.png')} />
          <View style={styles.step1Desc}>
            <Text style={styles.textBlock} category="h4">{t('common.step5Title')}</Text>
          </View>
        </Layout>
      </ViewPager>
      <View style={styles.btnContainer}>
        {skipBtn ? (
          <>
            <TouchableOpacity>
              {Icon({
                fill: '#AA8FFF', width: 40, height: 40, borderWidth: 1, onPress: () => navigation.navigate('LoginAndRegistrationLanding'),
              }, 'close')}
            </TouchableOpacity>
          </>
        ) : (
          null
        )}
        {backBtn ? (
          <>
            <TouchableOpacity>
              {Icon({
                fill: '#AA8FFF', width: 45, height: 45, borderWidth: 1, onPress: () => { setSelectedIndex(selectedIndex - 1); handleBtn(selectedIndex - 1); },
              }, 'chevron-left')}
            </TouchableOpacity>
          </>
        ) : (
          null
        )}
        <View style={styles.paymentControls}>
          {list.map((e, i) => (
            <View key={`circle-${i} `} style={selectedIndex === i ? styles.circleActive : styles.circle} />
          ))}
        </View>
        {nextBtn ? (
          <>
            <TouchableOpacity>
              {Icon({
                fill: '#AA8FFF', width: 45, height: 45, onPress: () => { setSelectedIndex(selectedIndex + 1); handleBtn(selectedIndex + 1); },
              }, 'chevron-right')}
            </TouchableOpacity>
          </>
        ) : (
          null
        )}
        {doneBtn ? (
          <>
            <TouchableOpacity>
              {Icon({
                fill: '#AA8FFF', width: 40, height: 40, onPress: () => navigation.navigate('LoginAndRegistrationLanding'),
              }, 'checkmark')}
            </TouchableOpacity>
          </>
        ) : (
          null
        ) }
      </View>
    </>
  );
};
HowItWorks.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

HowItWorks.defaultProps = {
  navigation: null,
};

export default HowItWorks;
