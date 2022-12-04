/* eslint-disable no-nested-ternary */
/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { useSelector } from 'react-redux';
import Icon from 'components/Icon';
import commonStyles from 'utils/commonStyles';
import { formatPaymentAmountNoDecimal } from 'utils/formatCurrency';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import {
  View,
} from 'react-native';
import {
  Card,
  Text,
  Divider,
  Spinner,
  CheckBox,
  List,
  ListItem,
} from '@ui-kitten/components';
import {
  AccordionList,
} from 'accordion-collapse-react-native';
import { BLOCKING_CODES, COUNTRIES } from 'utils/constants';
import 'moment/locale/ar';
import { t } from 'services/i18n';
import ProgressCircle from 'react-native-progress-circle';
import PropTypes from 'prop-types';
import styles from './styles';

const TierSystemCard = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const { currentUserScore, currentUser } = useSelector(state => state.application);
  const billingAddresses = useSelector(state => state.billingAddresses);

  const {
    consumerRating,
    mobileLimit,
    currency,
    uploadedId,
    uploadedLinkedin,
    uploadedSalaryCert,
    uploadedPassport,
    strongPhistory,
    lean,
    reason,
  } = currentUserScore;

  const percentage = (consumerRating / 5) * 100;

  const getProgressColor = () => {
    if (consumerRating <= 0.5) {
      return '#FF4D4A';
    }
    if (consumerRating <= 2.5) {
      return '#FAE160';
    }
    return '#411361';
  };

  const faqList = [
    {
      id: 1,
      numTitle: 2,
      titleA: t('common.faqQuestionOnePartA'),
      titleB: t('common.faqQuestionOnePartB'),
      description: t('common.faqOneDesc'),
      special: false,
    },
    {
      slug: 'faqTwo',
      id: 2,
      numTitle: 1,
      titleA: t('common.faqQuestionTwo'),
      description: 'hello',
      special: true,
    },
    {
      id: 3,
      numTitle: 2,
      titleA: t('common.faqQuestionThreePartA'),
      titleB: t('common.faqQuestionThreePartB'),
      description: t('common.faqThreeDesc'),
      special: false,
    },
    {
      id: 4,
      numTitle: 1,
      titleA: t('common.faqQuestionFour'),
      title: 'Question 4',
      description: t('common.faqFourDesc'),
      special: false,
    },
    {
      id: 5,
      numTitle: 1,
      special: true,
      titleA: t('common.faqQuestionFive'),
      title: 'Question 5',
      description: 'hello',
    },
  ];

  const getBlockingCodeMessage = () => {
    const country = alpha3FromISDPhoneNumber(currentUser.phoneNumber);
    switch (reason) {
      case BLOCKING_CODES.SAL_RQD:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedSalReqDesc')} ${country === COUNTRIES.UAE ? t('common.blockedSalReqDescBUAE') : country === COUNTRIES.SAU ? t('common.blockedSalReqDescBSAU') : t('common.blockedSalReqDescB')}\n\n${t('common.pleaseAllow48Hrs')}`}
          </Text>
        );
      case BLOCKING_CODES.SAL_PRG:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedSalPrgDesc')} ${country === COUNTRIES.UAE ? t('common.blockedSalPrgDescBUAE') : country === COUNTRIES.SAU ? t('common.blockedSalPrgDescBSAU') : ''}\n\n${t('common.pleaseAllow48Hrs')}`}
          </Text>
        );
      case BLOCKING_CODES.SAL_REJ:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedSalRejDesc')} `}
            <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
      case BLOCKING_CODES.MOB_CRD:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedMobCrdDesc')} `}
            <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
      case BLOCKING_CODES.MOB_EML:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedMobEmlDesc')} `}
            <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
      case BLOCKING_CODES.DEF:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedDefLtrDesc')} `}
            <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
      case BLOCKING_CODES.BLK:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedBlkLstDesc')} `}
            <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
      case BLOCKING_CODES.MOB_ERR:
      default:
        return (
          <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
            {`${t('common.blockedDefaultDesc')} `}
            <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
            .
          </Text>
        );
    }
  };

  const renderAccordionHeader = (item, index, isExpanded) => {
    return (
      <View style={styles.accordionHeader} key={item.id}>
        <Divider />
        <View style={styles.accordionHeaderTextIconContainer}>
          {currLang !== 'ar' ? (
            <View>
              {Icon({ fill: '#545454', width: 25, height: 25 }, isExpanded ? 'chevron-down' : 'chevron-right')}
            </View>
          ) : <></>}

          <View style={{ width: '100%', backgroundColor: 'white' }}>
            {
              item.numTitle === 2 ? (
                <View style={currLang === 'ar' ? styles.faqHeaderTextAr : styles.faqHeaderTextEn}>
                  <Text style={currLang === 'ar' ? styles.regularScriptAr : styles.regularScriptEn}>{item.titleA}</Text>
                  <Text style={currLang === 'ar' ? styles.superScriptAr : styles.superScriptEn}>TM</Text>
                  <Text style={currLang === 'ar' ? styles.regularScriptAr : styles.regularScriptEn}>
                    {item.titleB}
                  </Text>
                </View>
              ) : (
                <View style={currLang === 'ar' ? styles.faqHeaderTextAr : styles.faqHeaderTextEn}>
                  <Text style={currLang === 'ar' ? styles.regularScriptAr : styles.regularScriptEn}>{item.titleA}</Text>
                </View>
              )
            }
          </View>

          {currLang === 'ar' ? (
            <View>
              {Icon({ fill: '#545454', width: 25, height: 25 }, isExpanded ? 'chevron-down' : 'chevron-right')}
            </View>
          ) : <></>}
        </View>
        {item.id === 5 ? <Divider /> : <View />}
      </View>
    );
  };

  const renderSpecialFaqBodyTwo = item => {
    return (
      <View key={item.id}>
        <Divider />
        <View style={styles.accordionBody}>
          <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{t('common.faqTwoDesc')}</Text>

          <View style={styles.accordionBodyList}>
            <CheckBox
              style={styles.checkbox}
              disabled
              checked={strongPhistory}
            >
              {() => (
                <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                  <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{t('common.faqTwoDescItemOne')}</Text>
                </View>
              )}
            </CheckBox>
            <CheckBox
              style={styles.checkbox}
              disabled
              checked={strongPhistory}
            >
              {() => (
                <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                  <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{t('common.faqTwoDescItemTwo')}</Text>
                </View>
              )}
            </CheckBox>
            <CheckBox
              style={styles.checkbox}
              disabled
              checked={!!lean.entities.length || uploadedSalaryCert}
            >
              {() => (
                <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                  <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">
                    {`${t('common.faqTwoDescItemThree')} `}
                  </Text>
                </View>
              )}
            </CheckBox>
            <View>
              <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{t('common.faqTwoDescItemFour')}</Text>
              <View style={styles.accordionBodySubList}>
                <CheckBox
                  style={styles.checkbox}
                  disabled
                  checked={uploadedId}
                >
                  {() => (
                    <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                      <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">
                        {t('common.faqTwoDescItemFourSubA')}
                      </Text>
                    </View>
                  )}
                </CheckBox>
                <CheckBox
                  style={styles.checkbox}
                  disabled
                  checked={uploadedLinkedin}
                >
                  {() => (
                    <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                      <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">
                        {t('common.faqTwoDescItemFourSubB')}
                      </Text>
                    </View>
                  )}
                </CheckBox>
                {/* <CheckBox
                  style={styles.checkbox}
                  disabled
                  checked={uploadedPassport}
                >
                  {() => (
                    <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                      <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">
                        {t('common.faqTwoDescItemFourSubC')}
                      </Text>
                    </View>
                  )}
                </CheckBox> */}
                <CheckBox
                  style={styles.checkbox}
                  disabled
                  checked={
                    billingAddresses
                    && billingAddresses.list
                    && billingAddresses.list.length > 0
                  }
                >
                  {() => (
                    <View style={currLang === 'ar' ? styles.checkboxTextContainerAr : styles.checkboxTextContainerEn}>
                      <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">
                        {t('common.faqTwoDescItemFourSubD')}
                      </Text>
                    </View>
                  )}
                </CheckBox>
              </View>
            </View>

          </View>
          <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">
            {`${t('common.faqTwoDescFooterA')} `}
            <Text style={[commonStyles.link, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} category="p1" onPress={() => navigation.navigate('Account', { screen: 'Profile' })}>
              {t('common.account')}
            </Text>
            {` ${t('common.faqTwoDescFooterB')} `}
            <Text style={[commonStyles.link, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  const renderSpecialFaqBodyFive = item => {
    const listData = [
      {
        title: t('common.faqFiveItemOne'),
      },
      {
        title: t('common.faqFiveItemTwo'),
      },
      {
        title: t('common.faqFiveItemThree'),
      },
    ];

    const renderListItem = data => (
      <ListItem
        style={styles.faqFiveListItem}
        title={() => <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{data.item.title}</Text>}
        accessoryLeft={() => (currLang !== 'ar' ? <Text style={styles.textBullet}>{'\u2022'}</Text> : <></>)}
        accessoryRight={() => (currLang === 'ar' ? <Text style={styles.textBullet}>{'\u2022'}</Text> : <></>)}
      />
    );

    return (
      <View key={item.id}>
        <Divider />
        <View style={styles.accordionBody}>
          <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{t('common.faqFiveDesc')}</Text>

          <View style={styles.accordionBodyList}>
            <List
              style={styles.faqFiveList}
              data={listData}
              renderItem={renderListItem}
            />
          </View>

          <View style={currLang === 'ar' ? styles.faqFiveTextFooterContainerAr : styles.faqFiveTextFooterContainerEn}>
            <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">
              {t('common.faqFiveDescFooter')}
              <Text category="p1" style={[commonStyles.link, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                {' shoppersupport@spotii.me '}
              </Text>
              <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{t('common.or')}</Text>
              <Text category="p1" style={[commonStyles.link, currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft]} onPress={() => Linking.openURL('tel:+97142753550')}>
                {' +971 4 275 3550 '}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAccordionBody = (item, index, isExpanded) => {
    if (item.special) {
      if (item.id === 2) {
        return renderSpecialFaqBodyTwo(item);
      }
      if (item.id === 5) {
        return renderSpecialFaqBodyFive(item);
      }
    }

    return (
      <View key={item.id}>
        <Divider />
        <View style={styles.accordionBody}>
          <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <View>
        <Text category="h5" style={{ textAlign: currLang === 'ar' ? 'right' : 'left', marginBottom: 10, fontSize: 22 }}>
          {t('common.spotiiScore')}
        </Text>
        <Divider />
        {!consumerRating && consumerRating !== 0 ? (
          <View style={styles.mainSpinnerContainer}>
            <Spinner size="giant" />
          </View>
        ) : (
          <View style={styles.view}>
            {
              reason ? getBlockingCodeMessage() : (
                <View style={styles.ratingView}>
                  <ProgressCircle
                    percent={percentage}
                    radius={100}
                    borderWidth={16}
                    color={getProgressColor()}
                    shadowColor="#d6d6d6"
                    bgColor="#fff"
                  >

                    <View style={currLang === 'ar' ? styles.faqHeaderTextAr : styles.faqHeaderTextEn}>
                      <Text style={currLang === 'ar' ? styles.scoreSuperScriptAr : styles.scoreSuperScriptEn}>{t('common.scoreColon')}</Text>
                      <Text style={currLang === 'ar' ? styles.scoreRegularScriptAr : styles.scoreRegularScriptEn}>
                        {consumerRating}
                      </Text>
                      <Text style={currLang === 'ar' ? [styles.scoreSuperScriptAr, styles.invisible] : [styles.scoreSuperScriptEn, styles.invisible]}>{t('common.scoreColon')}</Text>
                    </View>

                    <Text style={{ fontSize: 20, color: '#979999', marginTop: '1%' }}>
                      {`${currency} ${formatPaymentAmountNoDecimal(mobileLimit)}`}
                    </Text>
                  </ProgressCircle>
                </View>
              )
            }
            {mobileLimit === 0 ? (
              <View>
                <Text style={currLang === 'ar' ? styles.tierCardDisclaimerAr : styles.tierCardDisclaimerEn}>
                  {t('common.limitReachedDesc')}
                </Text>
              </View>
            ) : (<></>)}
            <View style={styles.faqView}>
              <AccordionList
                list={[{ title: t('common.frequentlyAskedQuestions') }]}
                header={(item, index, isExpanded) => (
                  <View style={{ flexDirection: currLang !== 'ar' ? 'row' : 'row-reverse' }}>
                    <View style={styles.accordionHeaderTextIconContainer}>
                      {currLang !== 'ar' ? (
                        <View>
                          {Icon({
                            fill: '#545454', width: 30, height: 30, marginBottom: 3,
                          }, isExpanded ? 'chevron-down' : 'chevron-right')}
                        </View>
                      ) : <></>}
                      <View>
                        <Text
                          style={[commonStyles.subTextColor, currLang === 'ar' ? styles.faqTitleAr : styles.faqTitleEn]}
                        >
                          {t('common.frequentlyAskedQuestions')}
                        </Text>
                      </View>
                      {currLang === 'ar' ? (
                        <View>
                          {Icon({
                            fill: '#545454', width: 30, height: 30, marginBottom: 3,
                          }, isExpanded ? 'chevron-down' : 'chevron-right')}
                        </View>
                      ) : <></>}
                    </View>
                    {!isExpanded && <Divider />}
                  </View>

                )}
                body={() => (
                  <AccordionList
                    list={faqList}
                    header={renderAccordionHeader}
                    body={renderAccordionBody}
                    keyExtractor={item => `${item.id}`}
                  />
                )}
                keyExtractor={item => `${item.id}`}
              />

            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

TierSystemCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

TierSystemCard.defaultProps = {
  navigation: null,
};

export default TierSystemCard;
