import { AtSign, BriefcaseBusiness, Camera, MessageCircle } from "lucide-react";

export const SOCIAL_LINKS = [
  {
    label: "X",
    href: "https://x.com/planckspace_dev",
    icon: AtSign,
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/planckspace_dev/",
    icon: MessageCircle,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/planckspace_dev",
    icon: Camera,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/planckspace",
    icon: BriefcaseBusiness,
  },
] as const;
