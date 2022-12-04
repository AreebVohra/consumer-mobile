import { StyleSheet } from 'react-native';
import theme from 'themes/light/theme.json';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  topActionsRight: {
    zIndex: 10,
    position: 'absolute',
    top: Constants.statusBarHeight + 15,
    right: '6%',
  },
  logoContainer: {
    marginTop: Constants.statusBarHeight + 80,
    alignItems: 'center',
    marginBottom: 50,
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  welcomeText: {
    marginHorizontal: 18,
    marginBottom: 12,
    fontSize: 28,
    lineHeight: 35,
    color: '#1A0826',
  },
  descriptionText: {
    marginHorizontal: 18,
    fontSize: 14,
    lineHeight: 20,
    color: '#717171',
    fontWeight: '400',
  },
  inputStyles: {
    marginHorizontal: 18,
    marginVertical: 12,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    borderBottomColor: '#CCCCCC',
    borderRadius: 0,
  },
  caption: {
    fontSize: 18,
  },
  signInButton: {
    marginHorizontal: 18,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 24,
    paddingVertical: 5,
  },
  label: {
    marginBottom: '1%',
  },
  acceptTermsAndConditions: {
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 4,
    height: 32,
    justifyContent: 'center',
  },
});

export default styles;
