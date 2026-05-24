import React from 'react';
import LegalPage from './LegalPage.jsx';

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These draft terms explain how the Gaurav Nursery website should be used while the full policy text is finalized."
      sections={[
        {
          title: 'Website use',
          body:
            'Please use the site for browsing products, placing orders, and contacting support.\n\nAvoid any activity that could disrupt service, damage content, or misuse customer data.'
        },
        {
          title: 'Orders and availability',
          body:
            'All products are subject to stock availability and dispatch timing.\n\nOrder confirmation does not guarantee immediate delivery if stock is temporarily unavailable.'
        },
        {
          title: 'Payments and support',
          body:
            'Payments are processed through secure checkout flows where enabled.\n\nFor any order issue, contact support with your order number so we can investigate quickly.'
        }
      ]}
    />
  );
}
