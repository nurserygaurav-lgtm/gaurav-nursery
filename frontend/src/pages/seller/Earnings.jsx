import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CreditCard, IndianRupee, ReceiptText, Wallet } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Panel, PageHeader, MetricCard, StatusPill } from '../../components/dashboard/DashboardUI.jsx';
import { useSellerDashboard } from '../../hooks/useSellerDashboard.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

function formatPercent(value) {
  const number = Number(value || 0);
  return `${number > 0 ? '+' : ''}${number.toFixed(1)}%`;
}

function hasChartValue(rows = [], keys = []) {
  return rows.some((row) => keys.some((key) => Number(row?.[key] || 0) > 0));
}

function EmptyState({ children }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-leaf-100 bg-leaf-50/70 p-6 text-center text-sm font-bold text-stone-600">
      {children}
    </div>
  );
}

export default function Earnings() {
  const { dashboard, isLoading, error } = useSellerDashboard();
  const earnings = dashboard.earnings;
  const earningsChart = dashboard.charts.earnings;
  const hasEarningsData = hasChartValue(earningsChart, ['revenue', 'commission', 'netRevenue']);

  return (
    <section>
      <PageHeader eyebrow="Earnings" title="Payouts and revenue settlements" text="Available balance, paid-order revenue, platform commission, and payout history calculated from seller payments and settlements." />
      {error && <p className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Available Balance" value={formatCurrency(earnings.availableBalance)} change={`${formatPercent(earnings.monthlyGrowth)} this month`} icon={Wallet} tone="dark" />
          <MetricCard label="Monthly Revenue" value={formatCurrency(earnings.monthlyRevenue)} change="Paid orders" icon={IndianRupee} />
          <MetricCard label="Commissions" value={formatCurrency(earnings.commission)} change={`${Math.round(Number(earnings.commissionRate || 0) * 100)}% platform fee`} icon={ReceiptText} />
          <MetricCard label="Next Payout" value={formatCurrency(earnings.nextPayout)} change={earnings.pendingPayouts ? 'Pending settlement' : 'Ready balance'} icon={CreditCard} />
        </div>
      )}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Monthly Earnings" subtitle="Paid revenue, commission, and net seller earnings">
          <div className="h-96">
            {isLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasEarningsData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" name="Paid revenue" stroke="#315f2e" strokeWidth={3} fill="#dcedd8" />
                  <Area type="monotone" dataKey="netRevenue" name="Net earnings" stroke="#72ae68" strokeWidth={3} fill="#eef8ec" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No paid order earnings yet.</EmptyState>
            )}
          </div>
        </Panel>
        <Panel title="Latest Payouts" subtitle="Settlement history from payout records">
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-2xl" />)
            ) : earnings.payoutHistory.length ? (
              earnings.payoutHistory.map((payout) => (
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
              ))
            ) : (
              <EmptyState>No payout history has been recorded yet.</EmptyState>
            )}
          </div>
        </Panel>
      </div>
    </section>
  );
}
