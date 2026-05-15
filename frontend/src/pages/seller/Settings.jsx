import { Bell, CreditCard, Lock, Store } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { Panel, PageHeader } from '../../components/dashboard/DashboardUI.jsx';

const settings = [
  { icon: Store, title: 'Store profile', text: 'Business name, nursery address, pickup windows, and seller branding.' },
  { icon: CreditCard, title: 'Payout settings', text: 'Bank details, tax profile, settlement preferences, and commission view.' },
  { icon: Bell, title: 'Notifications', text: 'Order alerts, review alerts, low-stock notifications, and email preferences.' },
  { icon: Lock, title: 'Security', text: 'Password, session management, and dashboard access controls.' }
];

export default function Settings() {
  return (
    <section>
      <PageHeader eyebrow="Settings" title="Seller workspace settings" text="A premium settings surface for store identity, payout controls, notifications, and secure access." />
      <div className="grid gap-5 lg:grid-cols-2">
        {settings.map((item) => (
          <Panel key={item.title} title={item.title} subtitle={item.text} action={<item.icon className="text-leaf-700" size={22} />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="form-input" placeholder="Primary value" />
              <input className="form-input" placeholder="Secondary value" />
            </div>
            <Button className="mt-4">Save Changes</Button>
          </Panel>
        ))}
      </div>
    </section>
  );
}
