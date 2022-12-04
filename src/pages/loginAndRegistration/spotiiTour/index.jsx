import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Layout,
  Text,
  Spinner,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
// import { fetchDirectory } from 'reducers/directory';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { SPOTII_URL } from 'utils/constants';
import styles from './styles';
import handleLogEvent from '../../../../utils/handleLogEvent';

const SpotiiTour = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const directory = useSelector(state => state.directory);
  const {
    isLoading,
  } = useSelector(state => state.directory);
  const { list: directoryList } = directory;
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (isFocused) {
  //     dispatch(fetchDirectory());
  //   }
  // }, [isFocused]);

  const handleOnShopDirectoryPress = async () => {
    await handleLogEvent('SpotiiMobileShopDirectoryVisit');
  };

  const renderDirectoryList = directoryList.map(item => {
    const bgImage = { uri: item.displayPicture.file };
    const image = { uri: item.logo.file };

    return (
      <TouchableOpacity
        key={item.merchantId}
        style={styles.block}
        onPress={() => {
          const url = item.displayUrl ? item.displayUrl : SPOTII_URL;
          Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        }}
      >
        <ImageBackground source={bgImage} style={styles.bgImage}>
          <Image
            style={styles.image}
            source={image}
          />
        </ImageBackground>
        <Text category="c2">{item.displayName}</Text>
        {item.displayCategory !== null ? <Text category="s2" style={{ color: '#999', marginTop: 3 }}>{`#${item.displayCategory}`}</Text> : null}
      </TouchableOpacity>
    );
  });

  return (
    <Layout
      style={styles.form}
      level="1"
    >
      <ScrollView overScrollMode="never">
        <View style={styles.form}>
          <View>
            <View style={styles.header}>
              <Text style={styles.text} category="h2">{t('common.popularMerchants')}</Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <View>
                <Text onPress={() => { handleOnShopDirectoryPress(); navigation.navigate('ShopDirectory'); }} category="p1" style={styles.exploreMore}>{t('common.exploreMore')}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.view}>
              {!isLoading ? renderDirectoryList : (
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginVertical: '50%' }}>
                  <Spinner size="giant" />
                </View>
              )}
            </View>
          </View>
          <Button
            style={styles.signInButton}
            size="giant"
            onPress={() => navigation.goBack()}
          >
            {evaProps => <Text {...evaProps} category="p1" style={{ fontSize: 22, color: 'white' }}>{t('common.getStarted')}</Text>}
          </Button>
        </View>
      </ScrollView>

    </Layout>
  );
};

SpotiiTour.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

SpotiiTour.defaultProps = {
  navigation: null,
};

export default SpotiiTour;
