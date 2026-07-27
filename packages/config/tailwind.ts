import type { Config } from 'tailwindcss';

export const nurseryTheme: Pick<Config, 'theme'> = {
  theme: { extend: { colors: { nursery: { 50: '#f2faf3', 600: '#1d6b3b', 900: '#0b3d1e' } } } }
};
