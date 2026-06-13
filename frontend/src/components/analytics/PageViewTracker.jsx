import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import env from '../../config/env.js';

function loadGoogleAnalytics(measurementId) {
  if (!measurementId || window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
}

export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!env.googleAnalyticsId || typeof window === 'undefined') return;

    loadGoogleAnalytics(env.googleAnalyticsId);
    window.gtag?.('config', env.googleAnalyticsId, {
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title
    });
  }, [location.pathname, location.search]);

  return null;
}
