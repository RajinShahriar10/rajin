import {
  AtSign,
  Camera,
  CodeXml,
  FileCode2,
  Globe,
  Link2,
  Mail,
  MessageCircle,
  Phone,
  Play,
  Rss,
  Send,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/brand-icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const PLATFORM_ICONS: Record<string, IconComponent> = {
  github: GithubIcon,
  gitlab: CodeXml,
  bitbucket: FileCode2,
  linkedin: LinkedinIcon,
  twitter: AtSign,
  x: AtSign,
  facebook: MessageCircle,
  instagram: Camera,
  youtube: Play,
  dribbble: Send,
  behance: Send,
  email: Mail,
  mail: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  telegram: Send,
  website: Globe,
  blog: Rss,
  other: Link2,
};

export function SocialIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const Icon = PLATFORM_ICONS[platform.toLowerCase()] ?? Link2;
  return <Icon className={className} aria-hidden />;
}
