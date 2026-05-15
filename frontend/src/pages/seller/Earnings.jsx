import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CreditCard, IndianRupee, ReceiptText, Wallet } from 'lucide-react';
import { Panel, PageHeader, MetricCard, StatusPill } from '../../components/dashboard/DashboardUI.jsx';
import { chartData } from '../../components/dashboard/dashboardData.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const payouts = [
  { id: 'PAY-9012', date: '15 May 2026', amount: 42800, status: 'paid' },
  { id: 'PAY-9011', date: '08 May 2026', amount: 36500, status: 'paid' },
  { id: 'PAY-9010', date: '01 May 2026', amount: 29800, status: 'pending' }
];

export default function Earnings() {
  return (
    <section>
      <PageHeader eyebrow="Earnings" title="Payouts and revenue settlements" text="Track seller payouts, commissions, monthly revenue, and settlement status with a premium finance view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Available Balance" value={formatCurrency(84200)} change="+10.4%" icon={Wallet} tone="dark" />
        <MetricCard label="Monthly Revenue" value={formatCurrency(286500)} change="+14.8%" icon={IndianRupee} />
        <MetricCard label="Commissions" value={formatCurrency(34200)} change="12% platform fee" icon={ReceiptText} />
        <MetricCard label="Next Payout" value={formatCurrency(42800)} change="Processing" icon={CreditCard} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Monthly Earnings" subtitle="Revenue trend after commissions">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#315f2e" strokeWidth={3} fill="#dcedd8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Latest Payouts" subtitle="Settlement history">
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft">
                <div>
                  <p className="font-black text-leaf-950">{payout.id}</p>
                  <p className="text-sm text-stone-500">{payout.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-leaf-950">{formatCurrency(payout.amount)}</p>
                  <StatusPill status={payout.status} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}
