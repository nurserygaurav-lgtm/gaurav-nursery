import { useEffect } from 'react';
import env from '../config/env.js';

function setMetaAttribute(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    if (selector.includes('property=')) {
      element.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
    } else {
      element.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export function usePageMeta({ title, description, image = '/brand.svg', type = 'website', url } = {}) {
  useEffect(() => {
    const nextTitle = title ? `${title} | ${env.appName}` : env.appName;
    const nextDescription = description || 'Shop premium plants, planters, seeds, tools, and garden essentials from Gaurav Nursery.';
    const nextUrl = url || window.location.href;

    document.title = nextTitle;
    setMetaAttribute('meta[name="description"]', 'content', nextDescription);
    setMetaAttribute('meta[property="og:title"]', 'content', nextTitle);
    setMetaAttribute('meta[property="og:description"]', 'content', nextDescription);
    setMetaAttribute('meta[property="og:type"]', 'content', type);
    setMetaAttribute('meta[property="og:image"]', 'content', image);
    setMetaAttribute('meta[property="og:url"]', 'content', nextUrl);
    setMetaAttribute('meta[name="twitter:card"]', 'content', 'summary_large_image');
  }, [description, image, title, type, url]);
}
