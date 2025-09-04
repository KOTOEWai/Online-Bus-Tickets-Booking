
export interface LocationOption {
  value: string;
  label: string;
}

export interface FormState {
  from: string;
  to: string;
  date: string;
  travellerType: 'local' | 'foreign';
  passengerCount: number;
  passengerType: string; // Added passengerType to FormState
}
export interface BusDetails {
  schedule_id: number;
  bus_number: string;
  bus_type: string;
  total_seats: number;
  image: string | null;
  description: string;
  start_location: string;
  end_location: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  duration_minutes: number;
}
export interface RawFormInput {
  from: string;
  to: string;
  date: string;
  passengerCount: string; // The raw value from <select> is always a string
  passengerType: string;
  travellerType: 'local' | 'foreign';
}
// Interface for notification count fetch
export interface Notification {
  notification_id: number;
  is_read: boolean;
  // Other notification properties are not strictly needed for count
}
export type Seat = {
  seat_id: number;
  seat_number: string;
  is_booked: number | string; // or boolean if your API returns it that way
};

export type Schedules = {
  generated_seats: number;
  schedule_id:number;
  bus_number: string;
  bus_type: string;
  start_location: string;
  end_location: string;
  departure_time: string;
  arrival_time: string;
  price: number;
total_seats: number;
};
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
 
}

// Define the API response structure
export interface ContactFormResponse {
  success: boolean;
  message: string;
}

export interface BookingInfo {
  booking_id: number;
  start_location: string;
  end_location: string;
  departure_time: string;
  arrival_time: string;
  total_amount: number;
  bus_type: string;
  opertor_name: string; // Typo: Should be 'operator_name'
  price: number;
  seats: string[];
  // Add travellerType here if you plan to store it in booking state
  // travellerType: 'local' | 'foreign';
}


export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
}
 
export interface SearchId {
  id: string | undefined;
}

export interface DestinationDetail {
  destination_id: number;
  name: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  popular_attractions: string[]; // Assuming comma-separated string from DB, converted to array
  related_routes: { start: string; end: string; price: number }[];
}

// Interface for user information (from backend)
export interface UserInfo {
  [x: string]: string;
  user_id: string;
  username: string; // Matches 'name' column in your 'users' table, aliased as 'username'
  email: string;
  role: string;
  // Note: 'phone' is not directly in the 'users' table based on tickets.sql.
  // If you need a primary user phone, it should be added to the 'users' table.
}

// Interface for a single notification
export interface Notification {
  notification_id: number;
  user_id: string;
  type: string; // e.g., 'price_alert', 'schedule_change', 'promotion', 'new_user', 'message', 'comment', 'connect'
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
 
}

export interface Tickets {
  booking_id: number;
  schedule_id: number;
  booking_date: string;
  total_amount: number;
  bus_number: string;
  bus_type: string;
  start_location: string;
  end_location: string;
  departure_time: string;
  arrival_time: string;
  payment_status: 'pending' | 'approved' | 'rejected';
}


// Interface for a single review
export interface Reviews {
  full_name: string;
  review_id: number;
  user_id: string; // Assuming user_id is stored
  rating: number; // 1 to 5 stars
  comment: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral'; // ADDED THIS LINE
  created_at: string; // Timestamp of the review
}

// Interface for the form data
export interface ReviewFormData {
  rating: number;
  comment: string;
}


// Search Payload interface
export interface SearchPayload extends FormState {
  busTypeFilter: string;
  priceRangeFilter: string;
  sortBy: 'departure_time' | 'price' | null;
  sortOrder: 'ASC' | 'DESC';
}


// Interface for SalesRecord
export interface SalesRecord {
  booking_id: number;
  bus_number: string;
  bus_type: string;
  start_location: string;
  end_location: string;
  departure_time: string;
  total_amount: string;
  num_seats: number;
  booking_status: string;
  booking_date: string;
}

// Interface for Booking (different from sales)
export interface Booking {
  booking_id: number;
  full_name: string;
  start_location: string;
  end_location: string;
  seats: number;
  booking_date: string;
  payment_status: "approved" | "pending" | "cancelled";
}


export interface IndexTableProps {
  bookings: Booking[];
  handleDelete: (booking_id: number) => void;
}

// types.ts (or inside the same file if you prefer)
export interface DateRangeProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  getSalesReport: (params: { startDate: string; endDate: string }) => void;
  handleDownloadReport: () => void;
  isLoading: boolean;
  salesData: SalesRecord[]; // 
}
export interface SummaryCardProps {
  totalRevenue: number;
  totalTicketsSold: number;
  totalBookings: number;
}


export interface ChartDataItem {
  date: string;
  revenue: number | undefined;
}

// Props type
export interface GraphProps {
  isLoading: boolean;
  error: unknown;
  chartData: ChartDataItem[];
}