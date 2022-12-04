/* eslint-disable import/prefer-default-export */
import { Platform } from 'react-native';
import * as Permissions from 'expo-permissions';

export const getCameraRollPermission = async () => {
  if (Platform.OS !== 'web') {
    const roll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (roll.status !== 'granted') {
      // alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      return roll.status;
    }
  }
};

export const getCameraPermission = async () => {
  if (Platform.OS !== 'web') {
    const roll = await Permissions.askAsync(Permissions.CAMERA);
    if (roll.status !== 'granted') {
      // alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      return roll.status;
    }
  }
};
