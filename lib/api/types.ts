export type UserRole = 'FARMER' | 'FPO' | 'BUYER' | 'ADMIN';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CANCELLED' | 'EXPIRED';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
export type UnitEnum = 'KG' | 'QUINTAL' | 'METRIC_TON' | 'CRATE' | 'BAG';
export type QualityGrade = 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'FAQ' | 'PREMIUM' | 'ORGANIC';
export type BuyerType = 'WHOLESALER' | 'RETAILER' | 'PROCESSOR' | 'EXPORTER' | 'INSTITUTIONAL' | 'COMMISSION_AGENT';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface User {
  id: string;
  auth_user_id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  profile: FarmerProfile | FPOProfile | BuyerProfile | null;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  farm_size: number | null;
  preferred_crops: string[];
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface FPOProfile {
  id: string;
  organization_name: string;
  registration_number: string;
  contact_person: string;
  phone: string;
  email: string | null;
  address: string | null;
  village_or_city: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface BuyerProfile {
  id: string;
  organization_name: string;
  buyer_type: BuyerType;
  contact_person: string;
  phone: string;
  email: string | null;
  address: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  business_description: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  name: string;
  local_name: string | null;
  category: string;
  variety: string | null;
  default_unit: UnitEnum;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProduceListing {
  id: string;
  seller_id: string;
  seller_type: 'FARMER' | 'FPO';
  crop_id: string;
  variety: string | null;
  quantity: number;
  unit: UnitEnum;
  quality_grade: QualityGrade;
  harvest_date: string | null;
  expected_price: number;
  min_price: number | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  status: ListingStatus;
  available_from: string | null;
  available_until: string | null;
  created_at: string;
  updated_at: string;
  crop: Crop | null;
}

export interface BuyerRequirement {
  id: string;
  buyer_id: string;
  crop_id: string;
  variety: string | null;
  required_quantity: number;
  unit: UnitEnum;
  quality_grade: QualityGrade | null;
  target_price: number;
  delivery_location: string | null;
  latitude: number | null;
  longitude: number | null;
  required_from: string | null;
  required_until: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  crop: Crop | null;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  quantity: number;
  agreed_price: number;
  total_amount: number;
  status: OrderStatus;
  delivery_location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Mandi {
  id: string;
  name: string;
  market_code: string | null;
  state: string;
  district: string;
  taluk: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface MandiPrice {
  id: string;
  mandi_id: string;
  commodity_id: string | null;
  commodity_name: string;
  variety: string | null;
  grade: string | null;
  arrival_date: string;
  arrival_quantity: number | null;
  arrival_unit: string | null;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_unit: string;
  source: string;
  source_record_id: string | null;
  fetched_at: string;
  created_at: string;
  updated_at: string;
  mandi: Mandi | null;
}

export interface NearbyMandi {
  mandi: Mandi;
  distance_km: number;
}

export interface UploadedDocument {
  id: string;
  owner_id: string;
  owner_type: 'FARMER' | 'FPO' | 'BUYER' | 'LISTING' | 'ORDER';
  bucket: string;
  path: string;
  file_name: string;
  content_type: string;
  size: number;
  url: string | null;
  created_at: string;
}

export interface NearbyParticipant {
  id: string;
  participant_type: 'FARMER' | 'BUYER' | 'FPO';
  name: string;
  location_name: string | null;
  district: string | null;
  latitude: number;
  longitude: number;
  verification_status: VerificationStatus;
  distance_km: number;
}

export interface PricePredictionPoint {
  ds: string;
  predicted_modal_price: number;
  temp_max: number;
  temp_min: number;
  temp_mean: number;
  rainfall: number;
  et0: number;
}

export interface PredictionMetrics {
  mae: number;
  rmse: number;
  mape: number;
  training_markets_count: number;
  total_observations: number;
  test_observations: number;
}

export interface PricePredictionForecast {
  unique_id: string;
  market_name: string;
  commodity: string;
  district: string;
  model_type: string;
  input_window_days: number;
  forecast_horizon_days: number;
  weather_source: string;
  metrics?: PredictionMetrics;
  last_historical_price?: number;
  last_historical_date?: string;
  forecasts: PricePredictionPoint[];
}

export interface MarketPredictionSummary {
  unique_id: string;
  market_name: string;
  commodity: string;
  district: string;
  last_price?: number;
  next_predicted_price: number;
  final_predicted_price: number;
  forecast_trend: 'UP' | 'DOWN';
  metrics?: PredictionMetrics;
}


