import React from 'react';
import LegalPage from './LegalPage.jsx';

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This draft privacy page describes the basic handling of customer information while the final policy copy is prepared."
      sections={[
        {
          title: 'What we collect',
          body:
            'We may collect your name, phone number, email address, shipping address, and order details when you place an order or contact support.'
        },
        {
          title: 'How we use data',
          body:
            'Your information is used for order fulfillment, delivery updates, customer support, and account management.\n\nWe do not use customer data for unrelated purposes without permission.'
        },
        {
          title: 'Keeping it safe',
          body:
            'We aim to keep customer data protected with secure application practices and trusted payment providers.\n\nIf you need your data reviewed or corrected, please contact support.'
        }
      ]}
    />
  );
}
