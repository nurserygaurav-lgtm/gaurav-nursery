import React from 'react';
import LegalPage from './LegalPage.jsx';

export default function ReplacementPolicy() {
  return (
    <LegalPage
      title="Replacement Policy"
      intro="This draft replacement page gives customers a clear place to check what happens if a plant arrives damaged."
      sections={[
        {
          title: 'Damaged arrival cases',
          body:
            'If a plant arrives damaged, please report it quickly with order details and photos of the package and plant.\n\nSupport will review the case and guide the next step.'
        },
        {
          title: 'Live plant handling',
          body:
            'Because plants are living products, replacement decisions can depend on the damage severity and the condition at delivery.\n\nWe try to handle each case fairly and quickly.'
        },
        {
          title: 'How to contact us',
          body:
            'You can reach support through the contact page, WhatsApp, or the order screen after login.\n\nShare your order number so the team can find the shipment faster.'
        }
      ]}
    />
  );
}
