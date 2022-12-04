import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import { MAF_ASSETS } from '../../../utils/constants';
import { setIsMAFQualifiedLoading } from '../../../reducers/application';

const Banner = ({ navigation }) => {
  const dispatch = useDispatch();

  const currLang = useSelector(state => state.language.language);

  const bgImage = { uri: `${MAF_ASSETS.BANNER}-${currLang}.png` };

  return (
    <TouchableOpacity onPress={() => {
      dispatch(setIsMAFQualifiedLoading(true));
      navigation.navigate('Scanner', { screen: 'GiftCard' });
    }}
    >
      <View
        style={[styles.banner]}
      >
        <FastImage
          source={bgImage}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 8,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </TouchableOpacity>
  );
};

Banner.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

Banner.defaultProps = {
  navigation: null,
};
export default Banner;
