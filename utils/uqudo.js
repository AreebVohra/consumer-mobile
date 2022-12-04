/* eslint-disable import/prefer-default-export */
import { getNfcAuthToken, getNfcStatus, postNfcData } from 'api';
import { NFC_ENROLLMENT_ERRORS } from 'utils/constants';

import {
  ReadingConfigurationBuilder,
  DocumentBuilder,
  DocumentType,
  EnrollmentBuilder,
  UqudoIdSDK,
} from '../node_modules/react-native-uqudoid';

export const handleNfcScan = async (userId, country = 'UAE') => {
  let dataToken = null;
  try {
    let resp = await getNfcAuthToken();
    const token = resp.access_token;
    const doc = new DocumentBuilder()
      .setDocumentType(DocumentType.UAE_ID)
      .enableReading(
        new ReadingConfigurationBuilder()
          .forceReading(true)
          .build(),
      )
      .build();
    const enrollObject = new EnrollmentBuilder()
      .setToken(token)
      .setUserIdentifier(userId)
      .add(doc)
      .build();
    resp = await new UqudoIdSDK().enroll(enrollObject);
    dataToken = resp.result;
  } catch (err) {
    if (err.message
        && Object.values(NFC_ENROLLMENT_ERRORS).includes(JSON.parse(err.message).code)) {
      const resp = await postNfcData({ country, scan_status: JSON.parse(err.message).code });
      return { error: JSON.parse(err.message).code };
    }
  }

  let processResp = null;

  try {
    processResp = await postNfcData({ country, token: dataToken });
  } catch (err) {
    return { error: 'unknown' };
  }

  if (processResp && processResp.reject_reason) {
    return { error: processResp.reject_reason };
  }

  return { success: true };
};
