/* eslint-disable import/prefer-default-export */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

export const handleRatingPrompt = async () => {
  const isAvailable = await StoreReview.isAvailableAsync();
  const hasAction = await StoreReview.hasAction();

  if (isAvailable && hasAction) {
    await StoreReview.requestReview();
  }
};
