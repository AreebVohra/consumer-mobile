import React, { useEffect, useState } from 'react';
import {
  Text,
  Spinner,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';

import 'moment/locale/ar';
import PropTypes from 'prop-types';

const PaymentMethodsDropDown = ({
  paymentMethods,
  selected,
  onSelect,
  isLoading,
}) => {
  const [initialIndex, setInitialIndex] = useState();

  useEffect(() => {
    let result;

    if (selected) {
      paymentMethods.forEach((p, i) => {
        if (p.id === selected) {
          result = i + 1;
        }
      });
    }
    if (!result) {
      paymentMethods.forEach((p, i) => {
        if (p.isDefault) {
          result = i + 1;
        }
      });
    }

    // setSelectedIndex(new IndexPath(result -1));
    setInitialIndex(result - 1);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(initialIndex));
  const initial = selectedIndex.row || initialIndex;
  const currentPaymentMethod = paymentMethods[initial || 0];

  const handleSelect = index => {
    setSelectedIndex(index);
    onSelect(paymentMethods[index.row].id);
  };

  return (
    <>
      {isLoading ? <Spinner /> : (
        <Select
          selectedIndex={selectedIndex}
          onSelect={index => handleSelect(index)}
          // value={countrySelectDisplayValue}
          value={() => <Text>{currentPaymentMethod ? `${currentPaymentMethod.type && `${currentPaymentMethod.type} `}﹡﹡﹡﹡${currentPaymentMethod.number && currentPaymentMethod.number.slice(-4)}` : 'Select Card'}</Text>}
        >
          {paymentMethods.map(method => <SelectItem key={method.id} title={() => <Text>{`${method.type && `${method.type} `}﹡﹡﹡﹡${method.number && method.number.slice(-4)}`}</Text>} />)}
        </Select>
      )}
    </>
  );
};

PaymentMethodsDropDown.propTypes = {
  selected: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  paymentMethods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

PaymentMethodsDropDown.defaultProps = {
  isLoading: false,
};

export default PaymentMethodsDropDown;
