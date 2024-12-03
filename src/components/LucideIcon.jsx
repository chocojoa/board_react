import { cn } from "@/lib/utils";
import * as icons from "lucide-react";

const LucideIcon = ({ name, color, size, ...props }) => {
  const SelectLucideIcon = icons[name];

  const isClickEvent = !!props.onClick;
  const pointerStyle = isClickEvent ? "cursor-pointer" : "";

  return (
    <SelectLucideIcon
      color={color}
      size={size}
      className={cn(pointerStyle, props.className)}
      {...props}
    />
  );
};

export default LucideIcon;
