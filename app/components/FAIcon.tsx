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
  faWallet, faChartLine, faReceipt, faCreditCard, faPiggyBank
} from '@fortawesome/free-solid-svg-icons';

export const ICON_MAP: Record<string, any> = {
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
  'PiggyBank': faPiggyBank
};

export const ICON_LIST = Object.keys(ICON_MAP);

interface IconProps {
  name: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FAIcon({ name, size = '1x', className = '', style }: IconProps) {
  const icon = ICON_MAP[name] || ICON_MAP['Box'];
  return <FontAwesomeIcon icon={icon} size={size as any} className={className} style={style as any} />;
}
