import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  header: {
    marginBottom: 40,
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
  caption: {
    fontSize: 18,
  },
  acceptTermsAndConditions: {
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 4,
    height: 32,
    justifyContent: 'center',
  },
  signInButton: {
    marginHorizontal: 18,
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 22,
    paddingVertical: 5,
  },
});

export default styles;
