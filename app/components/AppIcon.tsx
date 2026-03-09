import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils, faCar, faFileInvoice, faUser, faBox,
  faHome, faCartShopping, faPlane, faLightbulb, faMobileScreen,
  faGraduationCap, faHeart, faMusic, faGamepad, faMugHot,
  faPizzaSlice, faBus, faTrain, faBicycle, faGasPump,
  faBolt, faWifi, faTv, faFilm, faBook,
  faDumbbell, faShirt, faClock, faGift, faBriefcase,
  faCoins, faFire, faTrophy, faStar, faCircleCheck,
  faMoneyBillWave, faBullseye, faPenToSquare, faMedal,
  faWallet, faChartLine, faReceipt, faCreditCard, faPiggyBank,
  faTriangleExclamation, faBell, faChartColumn, faCircleDollarToSlot,
  faSackDollar, faHandHoldingDollar, faArrowTrendUp, faArrowTrendDown
} from '@fortawesome/free-solid-svg-icons';

// Icon mapping for all emojis used in the app
const ICON_MAP: Record<string, any> = {
  // Category icons
  'Utensils': faUtensils,
  'Car': faCar,
  'FileInvoice': faFileInvoice,
  'User': faUser,
  'Box': faBox,
  'Home': faHome,
  'CartShopping': faCartShopping,
  'Plane': faPlane,
  'Lightbulb': faLightbulb,
  'MobileScreen': faMobileScreen,
  'GraduationCap': faGraduationCap,
  'Heart': faHeart,
  'Music': faMusic,
  'Gamepad': faGamepad,
  'MugHot': faMugHot,
  'PizzaSlice': faPizzaSlice,
  'Bus': faBus,
  'Train': faTrain,
  'Bicycle': faBicycle,
  'GasPump': faGasPump,
  'Bolt': faBolt,
  'Wifi': faWifi,
  'Tv': faTv,
  'Film': faFilm,
  'Book': faBook,
  'Dumbbell': faDumbbell,
  'Shirt': faShirt,
  'Clock': faClock,
  'Gift': faGift,
  'Briefcase': faBriefcase,
  
  // App-specific icons
  'Coins': faCoins,
  'Fire': faFire,
  'Trophy': faTrophy,
  'Star': faStar,
  'CircleCheck': faCircleCheck,
  'MoneyBillWave': faMoneyBillWave,
  'Bullseye': faBullseye,
  'PenToSquare': faPenToSquare,
  'Medal': faMedal,
  'Wallet': faWallet,
  'ChartLine': faChartLine,
  'Receipt': faReceipt,
  'CreditCard': faCreditCard,
  'PiggyBank': faPiggyBank,
  'TriangleExclamation': faTriangleExclamation,
  'Bell': faBell,
  'ChartColumn': faChartColumn,
  'CircleDollarToSlot': faCircleDollarToSlot,
  'SackDollar': faSackDollar,
  'HandHoldingDollar': faHandHoldingDollar,
  'ArrowTrendUp': faArrowTrendUp,
  'ArrowTrendDown': faArrowTrendDown
};

// Emoji to icon name mapping
export const EMOJI_TO_ICON: Record<string, string> = {
  '🪙': 'Coins',
  '🔥': 'Fire',
  '🎯': 'Bullseye',
  '🏆': 'Trophy',
  '⚠️': 'TriangleExclamation',
  '🚨': 'Bell',
  '💰': 'MoneyBillWave',
  '📝': 'PenToSquare',
  '✅': 'CircleCheck',
  '🎉': 'Star',
  '🎁': 'Gift',
  '⚡': 'Bolt',
  '📊': 'ChartColumn',
  '🍔': 'Utensils',
  '🚗': 'Car',
  '📄': 'FileInvoice',
  '💼': 'Briefcase',
  '📦': 'Box'
};

export const CATEGORY_ICONS = [
  'Utensils', 'Car', 'FileInvoice', 'User', 'Box',
  'Home', 'CartShopping', 'Plane', 'Lightbulb', 'MobileScreen',
  'GraduationCap', 'Heart', 'Music', 'Gamepad', 'MugHot',
  'PizzaSlice', 'Bus', 'Train', 'Bicycle', 'GasPump',
  'Bolt', 'Wifi', 'Tv', 'Film', 'Book',
  'Dumbbell', 'Shirt', 'Clock', 'Gift', 'Briefcase'
];

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'lg' | 'xl' | '2x' | '3x';
  className?: string;
  style?: React.CSSProperties;
}

export function AppIcon({ name, size = 'lg', className = '', style }: IconProps) {
  // Check if it's an emoji, convert to icon name
  const iconName = EMOJI_TO_ICON[name] || name;
  const icon = ICON_MAP[iconName] || ICON_MAP['Box'];
  
  return <FontAwesomeIcon icon={icon} size={size} className={className} style={style as any} />;
}
