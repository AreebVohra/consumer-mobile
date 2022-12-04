/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import formatCurrency from 'utils/formatCurrency';
import {
  Card,
  Text,
  Layout,
  Divider,
} from '@ui-kitten/components';
import ViewPager from '@react-native-community/viewpager';
import moment from 'moment';
import 'moment/locale/ar';
import { t } from 'services/i18n';
import { setCurrentOrder } from 'reducers/instalments';
import PropTypes from 'prop-types';
import styles from './styles';

const NextPayments = ({ list, navigation }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onOrderSelect = order => {
    dispatch(setCurrentOrder({ currentOrder: order }));
    // navigation.navigate('Order Details', { refreshList: () => {} });
    navigation.navigate('Orders', { screen: 'Order Details', params: { refreshList: null } });
  };

  const renderPayments = list.map((item, i) => {
    return (
      <Layout style={styles.item} level="2" key={`${item.order.orderId}-${i}`}>
        <TouchableOpacity style={styles.sliderCard} onPress={() => onOrderSelect(item)}>
          <View style={{ alignItems: 'center' }}>
            {item.merchant ? <Text style={styles.refLink} category="p1">{item.merchant}</Text> : <Text style={styles.refLink} category="p1">{`${t('common.orderRef')} ${item.order.displayReference ? item.order.displayReference : ''}`}</Text>}
            <Text category="h6" style={{ marginVertical: 6, fontSize: 26 }}>{formatCurrency(item.currency, item.amount)}</Text>
            <Text appearance="hint" style={{ fontSize: 20 }} category="p2">{currLang === 'ar' ? moment(item.effectiveAt).locale('ar').format('dddd, MMMM D') : moment(item.effectiveAt).format('dddd, MMMM D')}</Text>
          </View>
        </TouchableOpacity>
      </Layout>
    );
  });
  const renderNextPayments = () => {
    return (
      <Card style={styles.slider}>
        <Text category="h5" style={{ textAlign: currLang === 'ar' ? 'right' : 'left', marginBottom: 10, fontSize: 22 }}>{t('common.yourNextPayments')}</Text>
        <Divider />
        <View style={{ overflow: 'hidden' }}>
          <ViewPager
            onPageSelected={e => setCurrentIndex(e.nativeEvent.position)}
            style={{ flex: 1, height: 150 }}
            initialPage={0}
          >
            {renderPayments}
          </ViewPager>
        </View>
        <View style={styles.paymentControls}>
          {list.map((payment, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <View key={`circle-${i} `} style={currentIndex === i ? styles.circleActive : styles.circle} />
          ))}
        </View>
      </Card>
    );
  };

  return (
    <>
      {list && list.length ? renderNextPayments() : <></>}
    </>
  );
};

NextPayments.propTypes = {
  // className: PropTypes.string,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      currency: PropTypes.string,
      amount: PropTypes.number,
      total: PropTypes.number,
      effectiveAt: PropTypes.string,
      order: PropTypes.shape({
        orderId: PropTypes.string,
        displayReference: PropTypes.string,
      }).isRequired,
      merchant: PropTypes.shape({
        name: PropTypes.string,
        logo: PropTypes.string,
        icon: PropTypes.string,
      }),
    }),
  ).isRequired,
};

NextPayments.defaultProps = {
  navigation: null,
};

export default NextPayments;
