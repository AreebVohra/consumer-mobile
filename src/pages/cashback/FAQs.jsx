import React, { useEffect, useRef, useState } from 'react';
import * as Linking from 'expo-linking';
import PropTypes from 'prop-types';
import ProgressCircle from 'react-native-progress-circle';
import commonStyles from 'utils/commonStyles';
import {
  ImageBackground, TouchableOpacity, View, Image, Dimensions, Animated,
} from 'react-native';
import { t } from 'services/i18n';
import {
  Card,
  Button,
  Text,
  Divider,
  Spinner,
  CheckBox,
  List,
  ListItem,
  TopNavigationAction,
  Layout,
} from '@ui-kitten/components';
import AccordionList from 'accordion-collapse-react-native/build/components/AccordionList';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'components/Icon';
import { FAB } from 'react-native-elements';
import styles from './styles';

const CashbackFAQ = () => {
  const currLang = useSelector(state => state.language.language);

  const faqList = [
    {
      id: 1,
      numTitle: 1,
      titleA: t('common.cashbackFaqQuestionOne'),
      description: t('common.cashbackFaqQuestionOneDesc'),
      special: false,
    },
    {
      id: 2,
      numTitle: 1,
      titleA: t('common.cashbackFaqQuestionTwo'),
      description: t('common.cashbackFaqQuestionTwoDesc'),
      special: false,
    },
    {
      id: 3,
      numTitle: 1,
      titleA: t('common.cashbackFaqQuestionThree'),
      description: t('common.cashbackFaqQuestionThreeDesc'),
      special: false,
    },
    {
      id: 4,
      numTitle: 1,
      titleA: t('common.cashbackFaqQuestionFour'),
      title: 'Question 4',
      description: t('common.cashbackFaqQuestionFourDesc'),
      special: false,
    },
    {
      id: 5,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionFive'),
      title: 'Question 5',
      description: t('common.cashbackFaqQuestionFiveDesc'),
    },
    {
      id: 6,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionSix'),
      title: 'Question 6',
      description: t('common.cashbackFaqQuestionSixDesc'),
    },
    {
      id: 7,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionSeven'),
      title: 'Question 7',
      description: t('common.cashbackFaqQuestionSevenDesc'),
    },
    {
      id: 8,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionEight'),
      title: 'Question 8',
      description: t('common.cashbackFaqQuestionEightDesc'),
    },
    {
      id: 9,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionNine'),
      title: 'Question 9',
      description: t('common.cashbackFaqQuestionNineDesc'),
    },
    {
      id: 10,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionTen'),
      title: 'Question 10',
      description: t('common.cashbackFaqQuestionTenDesc'),
    },
    {
      id: 11,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionEleven'),
      title: 'Question 11',
      description: t('common.cashbackFaqQuestionElevenDesc'),
    },
    {
      id: 12,
      numTitle: 1,
      special: false,
      titleA: t('common.cashbackFaqQuestionTwelve'),
      title: 'Question 12',
      description: t('common.cashbackFaqQuestionTwelveDesc'),
    },
  ];

  const renderAccordionHeader = (item, index, isExpanded) => (
    <View style={styles.accordionHeader} key={item.id}>
      {index > 0 ? <Divider /> : <View />}
      <View style={styles.accordionHeaderTextIconContainer}>
        {currLang === 'ar' && (
        <View>
          {Icon({ fill: '#545454', width: 25, height: 25 }, isExpanded ? 'chevron-down' : 'chevron-left')}
        </View>
        )}

        <View style={{ width: '100%', backgroundColor: 'white' }}>
          <View style={currLang === 'ar' ? styles.faqHeaderTextAr : styles.faqHeaderTextEn}>
            <Text style={currLang === 'ar' ? styles.regularScriptCashbackAr : styles.regularScriptCashbackEn}>{item.titleA}</Text>
          </View>
        </View>

        {currLang !== 'ar' && (
        <View>
          {Icon({ fill: '#545454', width: 25, height: 25 }, isExpanded ? 'chevron-down' : 'chevron-right')}
        </View>
        )}
      </View>
      <View />
    </View>
  );

  const renderAccordionBody = (item, index, isExpanded) => (
    <View key={item.id}>
      <View style={styles.accordionBody}>
        {item.special
          ? (
            <View>
              <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{item.descriptionA}</Text>
              <Text style={[currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft, { marginHorizontal: 10, marginVertical: 7 }]} category="p1">{`\u2022 ${item.descriptionListA}`}</Text>
              <Text style={[currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft, { marginHorizontal: 10, marginVertical: 7 }]} category="p1">{`\u2022 ${item.descriptionListB}`}</Text>
              <Text style={currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft} category="p1">{item.descriptionB}</Text>
            </View>
          )
          : <Text style={[currLang === 'ar' ? styles.alignTextRight : styles.alignTextLeft, styles.cashbackBody]} category="p1">{item.description}</Text>}
      </View>
    </View>
  );

  return (
    <Card style={{ padding: 0 }}>
      <View style={styles.faqView}>
        <View>
          <Text
            style={[styles.faqHeaderEn, { textAlign: `${currLang === 'ar' ? 'right' : 'left'}` }]}
          >
            {t('common.frequentlyAskedQuestions')}
          </Text>
        </View>
        <AccordionList
          list={faqList}
          header={renderAccordionHeader}
          body={renderAccordionBody}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    </Card>
  );
};

export default CashbackFAQ;
