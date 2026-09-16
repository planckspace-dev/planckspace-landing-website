import {
  InstagramLogo,
  LinkedInLogo,
  RedditLogo,
  XLogo,
} from "@/components/brand/SocialLogos";

export const SOCIAL_LINKS = [
  {
    label: "X",
    href: "https://x.com/planckspace_dev",
    icon: XLogo,
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/planckspace_dev/",
    icon: RedditLogo,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/planckspace_dev",
    icon: InstagramLogo,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/planckspace",
    icon: LinkedInLogo,
  },
] as const;
