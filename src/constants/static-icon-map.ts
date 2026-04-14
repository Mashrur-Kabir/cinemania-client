import {
  PlayCircle,
  Clock,
  MessageSquare,
  Users,
  HelpCircle,
} from "lucide-react";

export const ICON_MAP = {
  PlayCircle,
  Clock,
  MessageSquare,
  Users,
  HelpCircle,
} as const;

export type IconName = keyof typeof ICON_MAP;
