/**
 * ANEKAL AGRICULTURAL SERVICES
 * Mix of publicly listed businesses (verifiedFromPublicListing: true)
 * and demo entries (demo: true).
 * No invented phone numbers or ratings.
 */

export interface ServiceProvider {
  id: string;
  providerName: string;
  category: string;
  location: string;
  address?: string;
  description: string;
  phone?: string;
  website?: string;
  sourceUrl?: string;
  verifiedFromPublicListing: boolean;
  _demo?: boolean;
}

export const ANEKAL_SERVICES: ServiceProvider[] = [
  {
    id: 'svc-001',
    providerName: 'Sri Manjunatha Enterprises (Sonalika Dealer)',
    category: 'Tractor & Machinery',
    location: 'Anekal, Bengaluru Urban, Karnataka',
    address: 'Vishwakarma Nilaya, Chandapura Main Road, Shivaji Circle, Rudrappa Layout, Anekal, Bengaluru, Karnataka',
    description: 'Authorised Sonalika tractor dealer. Tractor sales, spare parts, and servicing. Official Sonalika listing.',
    verifiedFromPublicListing: true,
  },
  {
    id: 'svc-002',
    providerName: 'MS Agri Clinic',
    category: 'Agricultural Inputs & Equipment',
    location: 'Anekal, Bengaluru Urban, Karnataka',
    description: 'Fertilizer dealer, agricultural equipment dealer, and agricultural sprayer dealer. Publicly listed agri clinic.',
    verifiedFromPublicListing: true,
  },
  {
    id: 'svc-003',
    providerName: 'RCM Agriculture Products',
    category: 'Soil Health & Fertilizers',
    location: 'Anekal, Bengaluru Urban, Karnataka',
    description: 'Soil health products, fertilizers, and spray adjuvants. Publicly listed agri business in Anekal.',
    verifiedFromPublicListing: true,
  },
  {
    id: 'svc-004',
    providerName: 'Sri Lakshmi Seeds & Fertilizers',
    category: 'Seeds & Pesticides',
    location: 'Anekal, Bengaluru Urban, Karnataka',
    description: 'Seeds, pesticides, and fertilizer retail. Publicly listed seed and input dealer in Anekal area.',
    verifiedFromPublicListing: true,
  },
  {
    id: 'svc-005',
    providerName: 'Anekal Krishi Vigyan Kendra Support',
    category: 'Agricultural Advisory',
    location: 'Bengaluru Urban, Karnataka',
    description: 'Government agricultural extension and advisory services for Bengaluru Urban district farmers. Soil testing, crop advice, and farmer training.',
    _demo: true,
    verifiedFromPublicListing: false,
  },
];
