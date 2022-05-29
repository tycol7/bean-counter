/* eslint-disable require-jsdoc */
// https://vasanthk.gitbooks.io/react-bits/content/patterns/33.format-text-via-component.html
import React from 'react';

type Props = {
    amount: number | boolean
}

export default function Price({amount}: Props) {
  if (amount) {
    const formattedPrice = amount.toLocaleString('en', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    });
    return <>{formattedPrice}</>;
  }
  return <></>;
}
