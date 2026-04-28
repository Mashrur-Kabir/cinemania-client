import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";

export const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Discovery", href: "/discovery" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact / Mail Us", href: "/mail-us" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FiYoutube, href: "https://youtube.com", label: "Youtube" },
];
