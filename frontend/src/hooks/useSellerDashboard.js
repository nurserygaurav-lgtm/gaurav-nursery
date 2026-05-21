import { useCallback, useEffect, useState } from 'react';
import { getSellerDashboard } from '../services/dashboardService.js';
import { getApiError } from '../utils/auth.js';

export const defaultSellerDashboard = {
  metrics: {
    totalSales: 0,
    revenue: 0,
    orders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    productsSold: 0,
    weeklySales: 0,
    monthlyGrowth: 0
  },
  analytics: {
    totalRevenue: 0,
    weeklySales: 0,
    weeklyRevenue: 0,
    productsSold: 0,
    orders: 0,
    monthlyGrowth: 0
  },
  inventory: {
    currentStock: 0,
    incomingStock: 0,
    pendingRestocks: 0,
    soldStock: 0,
    lowStockAlerts: 0,
    lowStockProducts: []
  },
  earnings: {
    availableBalance: 0,
    monthlyRevenue: 0,
    grossRevenue: 0,
    commission: 0,
    commissionRate: 0,
    pendingPayouts: 0,
    paidOut: 0,
    nextPayout: 0,
    monthlyGrowth: 0,
    payoutHistory: []
  },
  charts: {
    revenueAnalytics: [],
    ordersAnalytics: [],
    weeklySales: [],
    monthlyRevenue: [],
    categoryMix: [],
    salesAnalytics: [],
    inventoryTrend: [],
    stockMovement: [],
    earnings: []
  },
  recentOrders: [],
  topProducts: []
};

function normalizeDashboard(data = {}) {
  return {
    ...defaultSellerDashboard,
    ...data,
    metrics: { ...defaultSellerDashboard.metrics, ...(data.metrics || {}) },
    analytics: { ...defaultSellerDashboard.analytics, ...(data.analytics || {}) },
    inventory: { ...defaultSellerDashboard.inventory, ...(data.inventory || {}) },
    earnings: { ...defaultSellerDashboard.earnings, ...(data.earnings || {}) },
    charts: { ...defaultSellerDashboard.charts, ...(data.charts || {}) },
    recentOrders: data.recentOrders || [],
    topProducts: data.topProducts || []
  };
}

export function useSellerDashboard({ refreshMs = 30000 } = {}) {
  const [dashboard, setDashboard] = useState(defaultSellerDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async ({ force = false, silent = false } = {}) => {
    try {
      if (!silent) setIsLoading(true);
      setError('');
      const data = await getSellerDashboard({ force });
      setDashboard(normalizeDashboard(data));
    } catch (err) {
      setError(getApiError(err, 'Unable to load dashboard data'));
      if (!silent) setDashboard(defaultSellerDashboard);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getSellerDashboard();
        if (isMounted) setDashboard(normalizeDashboard(data));
      } catch (err) {
        if (isMounted) {
          setDashboard(defaultSellerDashboard);
          setError(getApiError(err, 'Unable to load dashboard data'));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initialLoad();
    const intervalId = refreshMs
      ? window.setInterval(() => {
          if (isMounted) loadDashboard({ force: true, silent: true });
        }, refreshMs)
      : null;

    return () => {
      isMounted = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [loadDashboard, refreshMs]);

  return { dashboard, isLoading, error, reload: () => loadDashboard({ force: true }) };
}
