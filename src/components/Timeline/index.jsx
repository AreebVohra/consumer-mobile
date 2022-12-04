/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable arrow-body-style */
import React from 'react';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';

import { Text } from '@ui-kitten/components';
import { t } from 'services/i18n';
import formatCurrency from 'utils/formatCurrency';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './styles';
import { PLAN_SLUGS, ZERO_DOWN_PLANS } from '../../../utils/constants';
import EtcIcon from './EtcIcon';

const Timeline = ({
  userFeeDetails,
  payments,
  total,
  currency,
  slug,
  payNowPlan,
}) => {
  const currLang = useSelector(state => state.language.language);

  const isRTL = currLang === 'ar';

  let splitTracker = 0;
  const totalMileStones = payments.length;
  const stripMilestoneSize = totalMileStones > 6;
  const isVertical = totalMileStones > 3;

  const firstPaymentIsToday = !ZERO_DOWN_PLANS.includes(slug);

  const { hasUserFee, isUpfront, feePerInstallment, userFeeAmount } = userFeeDetails;

  const feePerInstallmentStr = formatCurrency(
    currency,
    feePerInstallment,
  );

  const userFeeAmountStr = formatCurrency(
    currency,
    userFeeAmount,
  );

  const paymentsPieView = payments.map((estimation, i) => {
    const { date, amount } = estimation;
    const isToday = i === 0 ? firstPaymentIsToday : false;
    const hideMilestone = stripMilestoneSize && i > 3 && i + 1 < totalMileStones;
    const percentValue = (parseFloat(amount) * 100) / total;
    splitTracker += percentValue;

    if (hideMilestone) {
      if (i === totalMileStones - 2) {
        return (
          <View key={`${slug}${date}${amount}${percentValue}`} style={isVertical ? styles.verticalTimeLineColumn : styles.horizontalTimeLineColumn}>
            <View style={{
              height: isVertical ? 20 : 1,
              width: !isVertical ? 20 : 1,
              borderColor: `${!isToday ? '#CCCCCC' : '#AA8FFF'}`,
              borderWidth: 1,
            }}
            />
          </View>
        );
      }
      return i === 4
      && (
      <View key={`${slug}${date}${amount}${percentValue}`} style={isVertical ? styles.verticalTimeLineColumn : styles.horizontalTimeLineColumn}>
        <EtcIcon key={`${slug}${date}${amount}${percentValue}`} />
      </View>
      );
    }

    return (
      <View key={`${slug}${date}${amount}${percentValue}`} style={isVertical ? styles.verticalTimeLineColumn : styles.horizontalTimeLineColumn}>
        <View style={!isToday ? styles.timelinePie : styles.timelinePieActive}>
          <ProgressCircle percent={splitTracker} radius={6.25} borderWidth={22} color={`${isToday ? '#AA8FFF' : '#717171'}`} shadowColor={`${isToday ? '#EDE6FF' : `${splitTracker > 99 ? '#717171' : '#FFFFFF'}`}`} bgColor={`${isToday ? '#EDE6FF' : '#717171'}`} />
        </View>
        {totalMileStones !== i + 1 ? (
          <View style={[isVertical ? styles.verticalLine : styles.horizontalLine, { borderColor: isToday ? '#AA8FFF' : '#CCCCCC' }]} />
        ) : <></>}
      </View>
    );
  });

  const paymentsTextView = payments.map((estimation, i) => {
    const { date, amount } = estimation;
    const isToday = i === 0 ? firstPaymentIsToday : false;
    const hideMilestone = stripMilestoneSize && i > 3 && i + 1 < totalMileStones;
    const percentValue = (parseFloat(amount) * 100) / total;

    if (hideMilestone) {
      if (i === totalMileStones - 2) {
        return (
          <View key={`${slug}${date}${amount}${percentValue}`} style={isVertical ? styles.verticalTimeLineColumn : styles.horizontalTimeLineColumn}>
            <View style={{
              height: isVertical ? 20 : 1,
              width: !isVertical ? 20 : 1,
              borderColor: `${!isToday ? '#CCCCCC' : '#AA8FFF'}`,
            }}
            />
          </View>
        );
      }
      return i === 4 ? (
        <View key={`${slug}${date}${amount}${percentValue}`} style={isVertical ? styles.verticalTimeLineColumn : styles.horizontalTimeLineColumn}>
          <View style={{
            height: isVertical ? 16 : 1,
            width: !isVertical ? 70 : 1,
            borderColor: `${!isToday ? '#CCCCCC' : '#AA8FFF'}`,
          }}
          />
        </View>
      ) : <></>;
    }

    return (
      <View key={`${slug}${date}${amount}${percentValue}`}>
        <View style={[{ flexDirection: isVertical ? `row${currLang === 'ar' ? '-reverse' : ''}` : 'column', justifyContent: 'space-between' }, !isVertical ? { alignItems: 'center' } : {}]}>
          <Text
            style={{
              color: isToday ? '#AA8FFF' : '#717171', fontSize: 14, fontWeight: '600', lineHeight: 17.5,
            }}
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {isToday
              ? t('common.today')
              : currLang === 'ar'
                ? moment(estimation.date).locale('ar').format('D MMM')
                : moment(estimation.date).format('D MMM')}
          </Text>
          <Text
            style={{
              color: isToday ? '#AA8FFF' : '#717171',
              fontSize: 14,
              fontWeight: '400',
              lineHeight: 17.5,
            }}
            category="p1"
          >
            {formatCurrency(
              currency,
              estimation.amount,
            )}
          </Text>
        </View>
        <View style={{
          height: isVertical ? 24 : 1,
          width: !isVertical ? 100 : 1,
          borderColor: `${!isToday ? '#CCCCCC' : '#AA8FFF'}`,
        }}
        />
      </View>
    );
  });

  return (
    <>
      {!payNowPlan ? (
        <View style={[styles.container, {
          flexDirection: isVertical ? `row${isRTL ? '-reverse' : ''}` : 'column',
        }, !isVertical ? { alignItems: 'center' } : {}]}
        >
          <View style={isVertical ? styles.flexColumn : styles.flexRow}>
            {paymentsPieView}
          </View>
          <View style={[isVertical ? styles.flexColumn : styles.flexRow, isVertical ? { flex: 1, marginLeft: !isRTL ? 12 : 0, marginRight: isRTL ? 12 : 0 } : { marginTop: '2%' }]}>
            {paymentsTextView}
          </View>
        </View>
      ) : <></>}
      <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.totalTextContainer]}>
        <Text style={styles.totalText}>
          {t('common.total')}
          <Text style={{ color: '#717171', fontSize: 10, fontWeight: '400' }}>
            {
              hasUserFee && !isUpfront
                ? ` ${t('common.inclFeeOf', { amount: feePerInstallmentStr })}`
                : ` ${hasUserFee
                  ? t('common.inclUpfrontFeeOf', { amount: userFeeAmountStr })
                  : ':'
                }`
            }
          </Text>
        </Text>
        <Text style={styles.totalText}>
          {formatCurrency(
            currency,
            total,
          )}
        </Text>
      </View>
    </>
  );
};

Timeline.propTypes = {
  slug: PropTypes.string,
  payments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  userFeeDetails: PropTypes.shape({
    hasUserFee: PropTypes.bool,
    isUpfront: PropTypes.bool,
    feePerInstallment: PropTypes.string,
    userFeeAmount: PropTypes.string,
  }).isRequired,
  total: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  payNowPlan: PropTypes.bool,
};

Timeline.defaultProps = {
  slug: '',
  payNowPlan: false,
};

export default Timeline;
