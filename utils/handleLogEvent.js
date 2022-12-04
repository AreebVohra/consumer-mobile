import * as Analytics from 'expo-firebase-analytics';
import config from 'utils/config';

const handleLogEvent = async (name, properties = {}) => {
  // if (config('current_env') === 'PROD') {
  if (config('current_env') === 'PROD') {
    await Analytics.logEvent(name, properties);
  } else {
    console.warn('Event not triggered - must be in a prod environment');
  }
};

export const setScreen = async (name) => {
  if (config('current_env') === 'PROD') {
    await Analytics.setScreen(name);
  } else {
    console.warn('Screen not set - must be in a prod environment');
  }
};

export default handleLogEvent;
