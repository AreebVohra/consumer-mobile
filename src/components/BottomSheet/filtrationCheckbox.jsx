import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { CheckBox as AndroidCheckBox, Text } from '@ui-kitten/components';
import CheckBox from '@react-native-community/checkbox';
import PropTypes from 'prop-types';
import styles from './styles';

const FiltrationCheckbox = ({
  category,
  handleCheckCategory,
  isAlreadyChecked,
  isRTL,
}) => (
  <>
    {Platform.OS === 'ios' ? (
      <TouchableOpacity
        onPress={handleCheckCategory}
        style={[styles.checkBoxView, { flexDirection: `row${isRTL ? '-reverse' : ''}` }]}
      >
        <CheckBox
          style={{ backgroundColor: '#F5F5F5', height: 24, width: 24 }}
          value={category.isChecked || isAlreadyChecked}
          boxType="square"
          // android colors
          tintColors={{ true: '#AA8FFF', false: '#F5F5F5' }}
          // ios colors
          tintColor="#DDD"
          onCheckColor="#FFF"
          onFillColor="#AA8FFF"
          onTintColor="#AA8FFF"
          animationDuration={0.25}
          onAnimationType="fade"
          offAnimationType="fade"
        />

        <Text
          style={[styles.checkBoxText, { marginLeft: !isRTL ? 12 : 0, marginRight: isRTL ? 12 : 0 }]}
        >
          {category.displayName.includes('Pay In-Store') ? 'In-Store' : category.displayName}
        </Text>
      </TouchableOpacity>
    ) : (
      <AndroidCheckBox
        status="info"
        // status="control"
        style={[styles.checkBoxView, { flexDirection: `row${isRTL ? '-reverse' : ''}` }]}
        checked={category.isChecked || isAlreadyChecked}
        onChange={handleCheckCategory}
      >
        {() => (
          <Text
            style={[styles.checkBoxText, { marginLeft: !isRTL ? 12 : 0, marginRight: isRTL ? 12 : 0 }]}
          >
            {category.displayName.includes('Pay In-Store') ? 'In-Store' : category.displayName}
          </Text>
        )}
      </AndroidCheckBox>
    )}
  </>
);

FiltrationCheckbox.propTypes = {
  category: PropTypes.shape({
    isChecked: PropTypes.bool,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  handleCheckCategory: PropTypes.func.isRequired,
  isAlreadyChecked: PropTypes.bool,
  isRTL: PropTypes.bool,
};

FiltrationCheckbox.defaultProps = {
  isAlreadyChecked: false,
  isRTL: false,
};

export default FiltrationCheckbox;
