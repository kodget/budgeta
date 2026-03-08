import * as Icons from "lucide-react";

export const ICON_LIST = [
  "Utensils", "Car", "FileText", "User", "Package",
  "Home", "ShoppingCart", "Plane", "Lightbulb", "Smartphone",
  "GraduationCap", "Heart", "Music", "Gamepad2", "Coffee",
  "Pizza", "Bus", "Train", "Bike", "Fuel",
  "Zap", "Wifi", "Tv", "Film", "Book",
  "Dumbbell", "Shirt", "Watch", "Gift", "Briefcase"
];

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function DynamicIcon({ name, size = 20, className = "", strokeWidth = 2 }: IconProps) {
  const IconComponent = (Icons as any)[name] || Icons.Package;
  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
}
