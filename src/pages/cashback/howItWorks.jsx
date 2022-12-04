import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { t } from 'services/i18n';
import {
  Text,
  Layout,
  TopNavigationAction,
  Divider,
} from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import CashbackPartnerIcon from 'assets/hiwCashback1';
import CashbackCheckoutIcon from 'assets/hiwCashback2';
import CashbackUIIcon from 'assets/hiwCashback3';
import Icon from 'components/Icon';
import styles from './styles';
import CashbackFAQ from './FAQs';

const HowCashbackWorks = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const { currentUserCashback } = useSelector(state => state.user);

  return (
    <>
      <ScrollView overScrollMode="never" style={styles.view}>
        <Layout
          style={styles.form}
          level="1"
        >
          <View style={styles.form}>
            <TopNavigationAction
              icon={(props) => Icon(
                {
                  ...props,
                  fill: '#353535',
                  width: 20,
                  height: 20,
                },
                'arrow-back-outline',
              )}
              onPress={() => {
                navigation.navigate('Cashbacks');
              }}
            />
            <View style={styles.header}>
              <View style={{ width: '100%', flexDirection: `row${isRTL ? '-reverse' : ''}`, justifyContent: 'center' }}>
                <Text style={styles.text}>{t('common.cashbackHeading1')}</Text>
                <Text style={[styles.text, { color: '#AA8FFF' }]}>{t('common.cashbackHeading2')}</Text>
              </View>

              <View>
                <Text style={[styles.subHeading, { textAlign: 'center', marginTop: '2%' }]}>{t('common.cashbackSubheading')}</Text>
              </View>

              <View style={styles.cashbackSummaryPic}>
                <Image style={styles.cashbackImage} source={require('assets/hiw-cashback-partners.png')} />
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', paddingHorizontal: 10, marginTop: -50 }}>
                  <View style={{ width: '10%', marginLeft: 8 }}>
                    <CashbackPartnerIcon />
                  </View>
                  <View style={{ width: '90%' }}>
                    <Text style={[styles.cashbackHiwHeading, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.hiwCashbackHeader1')}</Text>
                    <Text style={[styles.cashbackHiwSubheading, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.hiwCashbackBody1')}</Text>
                  </View>
                </View>
              </View>

              <Divider style={{ backgroundColor: '#CCCCCC', width: '65%', marginTop: 30, marginBottom: -20 }} />

              <View style={styles.cashbackSummaryPic}>
                <Image style={styles.cashbackImage} source={require('assets/hiw-cashback-checkout.png')} />
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', paddingHorizontal: 10, marginTop: -60 }}>
                  <View style={{ width: '10%', marginLeft: 8 }}>
                    <CashbackCheckoutIcon />
                  </View>
                  <View style={{ width: '90%' }}>
                    <Text style={[styles.cashbackHiwHeading, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.hiwCashbackHeader2')}</Text>
                    <Text style={[styles.cashbackHiwSubheading, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {t('common.hiwCashbackBody2')}
                      <Text style={{ color: '#AA8FFF' }}>{` ${t('common.loginCashbackCheckoutText')}`}</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <Divider style={{ backgroundColor: '#CCCCCC', width: '65%', marginTop: 30, marginBottom: -20 }} />

              <View style={[styles.cashbackSummaryPic, { marginTop: 100, marginBottom: 20 }]}>
                <Image style={styles.cashbackImage} source={require('assets/hiw-cashback-withdraw.png')} />
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', paddingHorizontal: 10, marginTop: 30 }}>
                  <View style={{ width: '10%', marginLeft: 8 }}>
                    <CashbackUIIcon />
                  </View>
                  <View style={{ width: '90%' }}>
                    <Text style={[styles.cashbackHiwHeading, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.hiwCashbackHeader3')}</Text>
                    <Text style={[styles.cashbackHiwSubheading, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.hiwCashbackBody3')}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <CashbackFAQ />
        </Layout>
      </ScrollView>
    </>
  );
};

HowCashbackWorks.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

HowCashbackWorks.defaultProps = {
  navigation: null,
};
export default HowCashbackWorks;
