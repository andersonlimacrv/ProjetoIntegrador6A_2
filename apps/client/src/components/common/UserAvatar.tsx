import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";

export interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallbackIcon?: React.ReactNode;
}

const sizeMap = {
  sm: "w-6 h-6 text-xs",
  md: "w-9 h-9 text-base",
  lg: "w-14 h-14 text-xl",
};

const UserAvatar = React.forwardRef<HTMLSpanElement, UserAvatarProps>(
  (
    {
      name = "?",
      avatarUrl = "",
      size = "md",
      className = "",
      fallbackIcon,
      ...props
    },
    ref
  ) => (
    <Avatar
      ref={ref}
      className={clsx(sizeMap[size], className, "shadow")}
      {...props}
    >
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>
        {fallbackIcon || name?.[0]?.toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  )
);

UserAvatar.displayName = "UserAvatar";
export default UserAvatar;
