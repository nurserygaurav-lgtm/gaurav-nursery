export const USER_ROLES = ['super_admin', 'admin', 'moderator', 'finance', 'support', 'seller', 'seller_staff', 'customer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PRODUCT_STATUSES = ['draft', 'pending_review', 'approved', 'rejected', 'archived'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const SELLER_STATUSES = ['draft', 'kyc_pending', 'pending_approval', 'approved', 'suspended', 'rejected'] as const;
export type SellerStatus = (typeof SELLER_STATUSES)[number];

export const ORDER_STATUSES = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface ApiResponse<T> { data: T; meta?: { requestId: string }; }
export interface AuthenticatedUser { id: string; email: string; role: UserRole; sessionId: string; }
