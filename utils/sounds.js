/* eslint-disable import/prefer-default-export */
import { Audio } from 'expo-av';

export const paymentSuccessSound = async () => {
  const soundObject = new Audio.Sound();

  try {
    await soundObject.loadAsync(require('../assets/sounds/payment_success.m4a'));
    await soundObject.playAsync();
  } catch (error) {
    console.error('Sound failed to play: ', error);
  }
};

export const paymentFailureSound = async () => {
  const soundObject = new Audio.Sound();

  try {
    await soundObject.loadAsync(require('../assets/sounds/payment_failure.m4a'));
    await soundObject.playAsync();
  } catch (error) {
    console.error('Sound failed to play: ', error);
  }
};
