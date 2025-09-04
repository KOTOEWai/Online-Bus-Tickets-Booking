import type{ Destination, LocationOption } from "../interfaces/types";
import {
  Bell, CheckCircle,  MessageSquare, MessageCircle,  Clock,
  AlertTriangle,
  Calendar,
  ClipboardList,
  Gift,
  Info,
  Mail,
  Newspaper,
  Percent,
  RefreshCw,
  Star,
  Tag,
  Volume2,
  Key,
  Settings,
  User
} from 'lucide-react'; // Added more icons for different notification types



export  const menuItems = [
    { text: 'Home', path: '/' }, // Added icon
    { text: 'Services', path: '/service' }, // Added icon
    { text: 'About Us', path: '/about' }, // Added icon
    { text: 'Destinations', path: '/destinations' }, // Added icon
    { text: 'Reviews', path: '/review' }, // Added icon
    { text: 'Contact', path: '/contact' }, // Added icon
    { text: 'Notifications', path: '/notifications',showBadge: true }, // Added Notifications link
  ];

   // Profile menu items for dropdown/modal
export  const profileMenuItems = [
    { text: 'Profile Detail', path: '/profileDetail', icon: User },
    { text: 'Edit Profile', path: '/edit-profile', icon: Settings },
    { text: 'Change Password', path: '/change-password', icon: Key },
  ];


export const locationOptions: LocationOption[] = [
  { value: 'Aunglan', label: 'Aunglan (အောင်လံ)' },
  { value: 'Bago', label: 'Bago (ပဲခူး)' },
  { value: 'Chauk', label: 'Chauk (ချောက်)' },
  { value: 'Dawei', label: 'Dawei (ထားဝယ်)' },
  { value: 'Einme', label: 'Einme (အိမ်မဲ)' },
  { value: 'Falam', label: 'Falam (ဖလမ်း)' },
  { value: 'Gangaw', label: 'Gangaw (ဂန့်ဂေါ)' },
  { value: 'Hinthada', label: 'Hinthada (ဟင်္သာတ)' },
  { value: 'Ingapu', label: 'Ingapu (အင်္ဂပူ)' },
  { value: 'Kalay', label: 'Kalay (ကလေး)' },
  { value: 'Kyaukse', label: 'Kyaukse (ကျောက်ဆည်)' },
  { value: 'Lashio', label: 'Lashio (လားရှိုး)' },
  { value: 'Ma-ei', label: 'Ma-ei (မအည်)' },
  { value: 'Mabein', label: 'Mabein (မဘိမ်း)' },
  { value: 'Magway', label: 'Magway (မကွေး)' },
  { value: 'Mahar Myaing', label: 'Mahar Myaing (မဟာမြိုင်)' },
  { value: 'Mahlaing', label: 'Mahlaing (မလှိုင်)' },
  { value: 'Malun', label: 'Malun (မလွန်း)' },
  { value: 'Mandalay', label: 'Mandalay (မန္တလေး)' },
  { value: 'Meiktila', label: 'Meiktila (မိတ္ထီလာ)' },
  { value: 'Monywa', label: 'Monywa (မုံရွာ)' },
  { value: 'Myeik', label: 'Myeik (မြိတ်)' },
  { value: 'Myitkyina', label: 'Myitkyina (မြစ်ကြီးနား)' },
  { value: 'Naypyitaw', label: 'Naypyitaw (နေပြည်တော်)' },
  { value: 'Pathein', label: 'Pathein (ပုသိမ်)' },
  { value: 'Pyay', label: 'Pyay (ပြည်)' },
  { value: 'Sagaing', label: 'Sagaing (စစ်ကိုင်း)' },
  { value: 'Taunggyi', label: 'Taunggyi (တောင်ကြီး)' },
  { value: 'Thaton', label: 'Thaton (သထုံ)' },
  { value: 'Thayet', label: 'Thayet (သရက်)' },
  { value: 'Yamethin', label: 'Yamethin (ရမည်းသင်း)' },
  { value: 'Yangon', label: 'Yangon (ရန်ကုန်)' },
];


export const passengerTypeOptions: LocationOption[] = [ // Reusing LocationOption interface for simplicity

  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Monk', label: 'Monk' },
  { value: 'Group', label: 'Group' },
];


export const priceRangeOptions = [
  { value: '', label: 'All Price Ranges' },
  { value: '35000-50000', label: '35,000 - 50,000 MMK' },
  { value: '50001-85000', label: '50,001 - 85,000 MMK' },
  { value: '85001-100000', label: '85,001 - 100,000 MMK' },
  { value: '100001+', label: '100,001+ MMK' },
];

export const busTypeOptions = [
  { value: '', label: 'All Bus Types' },
  { value: 'AC Express Bus', label: 'A/C' },
  { value: 'VIP Bus', label: 'VIP' },
  { value: 'Luxury Bus', label: 'Luxury' },
  { value: 'Business/Normal Class Bus', label: 'Business/Normal' },
  { value: 'Mini Bus', label: 'Mini' },
  { value: 'Overnight Bus', label: 'Night' },
  { value: 'Double-Decker Bus', label: 'Double-Decker' },
];


// Dummy data for popular destinations
export const popularDestinations: Destination[] = [
  {
    id: '1',
    name: 'Yangon (ရန်ကုန်)',
    image: 'https://images.unsplash.com/photo-1644810495465-04a89151ee07?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eWFuZ29ufGVufDB8fDB8fHww',
    description: 'Myanmar\'s largest city, known for its vibrant markets, parks, and the iconic Shwedagon Pagoda.',
  },
  {
    id: '2',
    name: 'Mandalay(မန္တလေး)',
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/36/a6/68/mandalay-palace-wall.jpg',
    description: 'The last royal capital of Myanmar, rich in history and culture, with ancient monasteries and palaces.',
  },
  {
    id: '3',
    name: 'Bagan (ပုဂံ)',
    image: 'https://content.r9cdn.net/rimg/dimg/39/01/de981725-city-41060-167f64bd01e.jpg?crop=true&width=1366&height=768&xhint=1548&yhint=1584',
    description: 'An ancient city with thousands of temples and pagodas, a breathtaking archaeological site.',
  },
  {
    id: '4',
    name: 'Sagaing (စစ်ကိုင်း)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Sagaing3.jpg',
    description: 'A spiritual center with numerous monasteries and meditation centers, offering panoramic views.',
  },
  {
    id: '5',
    name: 'Inle Lake (အင်းလေးကန်)',
    image: 'https://www.go-myanmar.com/sites/go-myanmar.com/files/uploads/inle_lake_photo_third.jpg',
    description: 'Famous for its unique leg-rowing fishermen and floating gardens, surrounded by serene villages.',
  },
  
  {
    id: '6',
    name: 'Naypyitaw (နေပြည်တော်)',
    image: 'https://cdn.i-scmp.com/sites/default/files/styles/1020x680/public/2015/04/03/7ce438bd102fc28d1309922680ac3be0.jpg?itok=SXmiOkQY',
    description: 'The modern capital city of Myanmar, known for its grand infrastructure and spacious layout.',
  },
  {
    id: '7',
    name: 'Taunggyi (တောင်ကြီး)',
    image: 'https://d6qyz3em3b312.cloudfront.net/upload/images/media/2019/05/29/shutterstock_500746483.2048x1024.jpg',
    description: 'Taunggyi is the fifth largest of Myanmar.It is famous for its hot air balloon festival held  on the full moon day of Tazaungmon.',
  },
  {
    id: '8',
    name: 'Ngapali Beach (ငပလီကမ်းခြေ)',
    image: 'https://www.indochinatravelpackages.com/wp-content/uploads/2016/05/Nagapali-Beach-4-600x400.jpg',
    description: 'Myanmar\'s most popular beach destination, offering pristine sands and clear waters.',
  },
];



export const getNotificationTypeProps = (type: string) => {
  switch (type) {
    case 'message':
      return { icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-100', badgeText: 'Message' };
    case 'price_alert':
      return { icon: Tag, color: 'text-red-500', bgColor: 'bg-red-100', badgeText: 'Price Alert' };
    case 'update':
      return { icon: RefreshCw, color: 'text-teal-500', bgColor: 'bg-teal-100', badgeText: 'Update' };
    case 'news':
      return { icon: Newspaper, color: 'text-indigo-500', bgColor: 'bg-indigo-100', badgeText: 'News' };
    case 'event':
      return { icon: Calendar, color: 'text-purple-500', bgColor: 'bg-purple-100', badgeText: 'Event' };
    case 'offer':
      return { icon: Gift, color: 'text-pink-500', bgColor: 'bg-pink-100', badgeText: 'Special Offer' };
    case 'announcement':
      return { icon: Volume2, color: 'text-yellow-600', bgColor: 'bg-yellow-100', badgeText: 'Announcement' };
    case 'reminder':
      return { icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-100', badgeText: 'Reminder' };
    case 'feedback':
      return { icon: MessageCircle, color: 'text-green-500', bgColor: 'bg-green-100', badgeText: 'Feedback' };
    case 'survey':
      return { icon: ClipboardList, color: 'text-blue-600', bgColor: 'bg-blue-100', badgeText: 'Survey' };
    case 'newsletter':
      return { icon: Mail, color: 'text-cyan-500', bgColor: 'bg-cyan-100', badgeText: 'Newsletter' };
    case 'feature':
      return { icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-100', badgeText: 'Feature' };
    case 'promotion':
      return { icon: Percent, color: 'text-indigo-500', bgColor: 'bg-indigo-100', badgeText: 'Promotion' };
    case 'booking':
      return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', badgeText: 'Booking Update' };
    case 'info':
      return { icon: Info, color: 'text-sky-500', bgColor: 'bg-sky-100', badgeText: 'Information' };
    case 'urgent':
      return { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100', badgeText: 'Urgent' };
    case 'Booking Update': // Existing type
        return { icon: CheckCircle, color: 'text-teal-500', bgColor: 'bg-teal-100', badgeText: 'Booking Update' };
    default:
      return { icon: Bell, color: 'text-gray-500', bgColor: 'bg-gray-100', badgeText: 'Notification' };
  }
};


