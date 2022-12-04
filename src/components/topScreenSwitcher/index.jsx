/* eslint-disable react/no-array-index-key */
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Card, Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import styles from './styles';

const TopScreenSwitcher = ({
  options,
  activeScreenIndex,
  setActiveScreenIndex,
  navigation,
}) => {
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  return (
    <View style={styles.layout}>
      <Card appearance="topScreenSwitcher">
        <View style={[styles.row, { flexDirection: `row${isRTL ? '-reverse' : ''}` }]}>
          {options.map((option, idx) => (
            <Button
              key={idx}
              style={[
                styles.navigationButton,
                {
                  borderColor: activeScreenIndex === idx ? '#AA8FFF' : '#CCCCCC',
                  flex: 1,
                  marginHorizontal: 4,
                },
              ]}
              onPress={() => {
                navigation.navigate(option.navigateToScreen);
                setActiveScreenIndex(idx);
              }}
              appearance="outline"
              size="large"
              status="control"
            >
              {(evaProps) => (
                <Text
                  {...evaProps}
                  style={[
                    {
                      color: activeScreenIndex === idx ? '#AA8FFF' : '#717171',
                      fontSize: 12,
                      fontWeight: '400',
                    },
                  ]}
                >
                  {option.text}
                </Text>
              )}
            </Button>
          ))}
        </View>
      </Card>
    </View>
  );
};

TopScreenSwitcher.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      navigateToScreen: PropTypes.string,
    }),
  ).isRequired,

  activeScreenIndex: PropTypes.number.isRequired,
  setActiveScreenIndex: PropTypes.func.isRequired,

  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

TopScreenSwitcher.defaultProps = {
  navigation: null,
};

export default TopScreenSwitcher;
