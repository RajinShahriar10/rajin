import {
  AtSign,
  Camera,
  Code,
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
  type LucideIcon,
} from "lucide-react";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  github: Code,
  gitlab: CodeXml,
  bitbucket: FileCode2,
  linkedin: Link2,
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
