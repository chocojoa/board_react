import { cn } from "@/lib/utils";
import * as icons from "lucide-react";

const LucideIcon = ({ name, color, size, className, onClick, ...props }) => {
  const Icon = icons[name];

  if (!Icon) {
    console.warn(`아이콘 "${name}"을(를) 찾을 수 없습니다.`);
    return null;
  }

  return (
    <Icon
      color={color}
      size={size}
      className={cn(onClick && "cursor-pointer", className)}
      onClick={onClick}
      {...props}
    />
  );
};

export default LucideIcon;
