/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';

import { Card, Text } from '@ui-kitten/components';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import styles from './styles';
import CompleteQualify from '../../../assets/completeQualify';
import PendingQualify from '../../../assets/pendingQualify';

const QualifyTile = ({
  navigation, header, title, actionText, action, isComplete, show, completeMessage,
}) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);

  const isRTL = currLang === 'ar';

  const handleAction = () => {
    if (!isComplete) {
      action();
    }
  };

  if (!show) return <></>;

  return (
    <TouchableOpacity style={{ backgroundColor: '#f4f5f6', borderRadius: 5, margin: 5 }} onPress={() => handleAction()}>
      <View style={[styles.fullWidth]}>
        <View style={[{ flexDirection: `row${isRTL ? '-reverse' : ''}` }, styles.paddingNonBottom]}>
          {isComplete ? <CompleteQualify /> : <PendingQualify />}
          <Text style={[styles.dullText, { paddingHorizontal: 5 }]}>{header}</Text>
        </View>
        <View style={[{ flexDirection: `row${isRTL ? '-reverse' : ''}` }, styles.qualifyContainer]}>
          <View style={styles.columnFlex}>
            <Text category="p1" style={{ fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>{title}</Text>
            {isComplete
              ? (
                <Text style={[styles.dullText, { fontSize: 13, textAlign: isRTL ? 'right' : 'left' }]}>{completeMessage}</Text>
              ) : <></>}
          </View>
          {!isComplete ? <View style={styles.qualifyActionBadge}><Text category="c2">{actionText}</Text></View> : <></>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

QualifyTile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
  header: PropTypes.string,
  title: PropTypes.string,
  actionText: PropTypes.string,
  action: PropTypes.func,
  isComplete: PropTypes.bool,
  show: PropTypes.bool,
  completeMessage: PropTypes.string,
};

QualifyTile.defaultProps = {
  navigation: null,
  header: '',
  title: '',
  actionText: '',
  action: () => {},
  isComplete: false,
  show: true,
  completeMessage: '',
};

export default QualifyTile;
