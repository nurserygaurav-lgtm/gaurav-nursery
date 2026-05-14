export const TOKEN_KEY = 'gaurav_nursery_token';

export function getRoleHome(role) {
  if (role === 'admin') return '/admin/analytics';
  if (role === 'seller') return '/seller';
  return '/';
}

export function getApiError(error, fallback = 'Something went wrong') {
  return error.response?.data?.message || error.message || fallback;
}
