import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  topActionsRight: {
    zIndex: 10,
    position: 'absolute',
    top: Constants.statusBarHeight + 15,
    right: '6%',
  },
  logoContainer: {
    marginTop: Constants.statusBarHeight + 100,
    alignItems: 'center',
    marginBottom: 80,
  },
  mainContainer: {
    marginTop: Constants.statusBarHeight + 100,
    alignItems: 'center',
    height: '80%',
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
  signInButton: {
    backgroundColor: '#411361',
    borderColor: '#411361',
    fontWeight: '700',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
  },
  centerText: {
    textAlign: 'center',
  },
  tile: {
    width: '100%',
    height: 500,
  },
  carouselPaginationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 15,
  },
  carouselNavBtn: { borderColor: '#AA8FFF',
    borderWidth: 1,
    width: 30,
    height: 30,
    padding: '1%',
    borderRadius: 5,
  },
  tileHeader: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  tileHeaderText: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 5,
  },
  tileSubtitleText: {
    fontSize: 14,
  },
  tileSubtitleSpecial: {
    fontSize: 14,
    color: '#AA8FFF',
  },
  tileImageContainer: {
    width: '100%',
    height: 600,
  },
  tileImage: {
    alignSelf: 'center',
    width: '90%',
    height: '100%',
  },
  dotStyle: {
    width: 50,
    height: 3,
    backgroundColor: '#411361',
    borderColor: '#411361',
  },
  inactiveDotStyle: {
    width: 50,
    height: 3,
    backgroundColor: '#EDE6FF',
    borderColor: '#EDE6FF',
  },
  buttonsContainer: {
    width: '100%',
    justifyContent: 'space-around',
  },
  signUpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#411361',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 18,
  },
  signInText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
