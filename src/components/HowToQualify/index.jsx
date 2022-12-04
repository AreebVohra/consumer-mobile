/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';

import { requestNfcStatus, setNfcStatusResolved, getNfcHardwareStatus } from 'reducers/nfcId';

import { Text, Button } from '@ui-kitten/components';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import styles from './styles';
import QualifyTile from './qualifyTile';
import SadFace from '../../../assets/sadFace';

const HowToQualify = ({
  navigation,
  qualifyList,
  qualifyHeader,
  qualifySub,
  unqualifiedHeader,
  unqualifiedSub,
}) => {
  const isUnqualified = (
    qualifyList.filter(qualifyItem => !qualifyItem.isComplete && qualifyItem.show) || []
  ).length === 0;

  if (isUnqualified) {
    return (
      <View style={[styles.fullWidth, styles.columnFlex, styles.allCenter, styles.marginTop3]}>
        <View style={[styles.width90, styles.columnFlex, styles.allCenter]}>
          <SadFace />
          <Text style={{ textAlign: 'center' }} category="h6">{t(unqualifiedHeader)}</Text>
          <Text style={{ textAlign: 'center' }}>{t(unqualifiedSub)}</Text>
          <Button style={styles.noCashbackShopNowButton} onPress={() => navigation.navigate('Shop')}>{t('common.goToShopDirectory')}</Button>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.fullWidth, styles.columnFlex, styles.allCenter, styles.marginTop3]}>
      <View style={[styles.width90, styles.columnFlex, styles.allCenter]}>
        <Text style={{ textAlign: 'center', paddingVertical: 10 }} category="h6">{t(qualifyHeader)}</Text>
        <Text style={{ textAlign: 'center' }}>{t(qualifySub)}</Text>
      </View>
      <View style={[styles.margin2, styles.fullWidth, styles.paddingHorizontal15]}>
        {qualifyList.map(qualifyCategory => <QualifyTile {...qualifyCategory} navigation />)}
      </View>
    </View>
  );
};

HowToQualify.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
  qualifyList: PropTypes.arrayOf(),
  qualifyHeader: PropTypes.string,
  qualifySub: PropTypes.string,
  unqualifiedHeader: PropTypes.string,
  unqualifiedSub: PropTypes.string,
};

HowToQualify.defaultProps = {
  navigation: null,
  qualifyList: [],
  qualifyHeader: 'common.howToQualifyHead',
  qualifySub: 'common.howToQualifySub',
  unqualifiedHeader: 'common.weSorry',
  unqualifiedSub: 'common.youDoNotQualify',
};

export default HowToQualify;
