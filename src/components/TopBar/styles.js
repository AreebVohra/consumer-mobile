import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  TopNavigationStyle: {
    width: '100%',
  },
  navigationButton: {
    width: 44,
    height: 44,
    marginHorizontal: 4,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 110,
    // maxHeight: 30,
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
  },
  avatar: {
    padding: '4%',
  },
  avatarPlaceHolder: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe2e2',
  },
});

export default styles;
