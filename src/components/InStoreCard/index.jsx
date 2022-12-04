/* eslint-disable arrow-body-style */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  View, Image, TouchableOpacity,
} from 'react-native';
import {
  Card, Text, Divider,
} from '@ui-kitten/components';
import 'moment/locale/ar';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import styles from './styles';

const InStoreCard = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
        <View>
          <Text category="h5" style={{ textAlign: currLang === 'ar' ? 'right' : 'left', marginBottom: 10, fontSize: 22 }}>
            {t('common.payInStore')}
          </Text>
          <Divider />
          <View style={styles.view}>
            <Image style={styles.image} source={require('assets/qr-and-phone.png')} />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

InStoreCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

InStoreCard.defaultProps = {
  navigation: null,
};

export default InStoreCard;
