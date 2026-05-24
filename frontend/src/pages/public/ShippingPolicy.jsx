import React from 'react';
import LegalPage from './LegalPage.jsx';

export default function ShippingPolicy() {
  return (
    <LegalPage
      title="Shipping Policy"
      intro="A simple shipping page helps customers understand dispatch timing and delivery expectations before checkout."
      sections={[
        {
          title: 'Dispatch',
          body:
            'Orders are packed after stock confirmation and routed for dispatch as soon as possible.\n\nLive plants may need slightly more careful handling than dry products.'
        },
        {
          title: 'Delivery estimates',
          body:
            'Delivery time depends on your pincode, courier coverage, and plant type.\n\nEstimated windows shown on the product page are guidance, not a guarantee.'
        },
        {
          title: 'Delivery support',
          body:
            'If a package is delayed, damaged, or missing, contact support with your order number and photos so we can review the shipment.'
        }
      ]}
    />
  );
}
