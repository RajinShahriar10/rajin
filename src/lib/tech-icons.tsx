import type { IconType } from "react-icons";
import {
  SiAngular,
  SiBlazor,
  SiBootstrap,
  SiC,
  SiCplusplus,
  SiCss,
  SiDart,
  SiDjango,
  SiDocker,
  SiDotnet,
  SiElementor,
  SiFigma,
  SiFlask,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSharp,
  SiSpring,
  SiSpringboot,
  SiSvelte,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiWordpress,
} from "react-icons/si";

type TechEntry = { Icon: IconType; color: string };

/**
 * Free-text skill/tool name → brand mark, with muted brand colours tuned for
 * the dark UI. Used by the tech marquee and anywhere else a tech name needs a
 * recognisable logo.
 */
const CATALOG: Record<string, TechEntry> = {
  "c#": { Icon: SiSharp, color: "#A179DC" },
  "c sharp": { Icon: SiSharp, color: "#A179DC" },
  java: { Icon: SiOpenjdk, color: "#7BA7D7" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  python: { Icon: SiPython, color: "#F7C948" },
  "c++": { Icon: SiCplusplus, color: "#6A9BC7" },
  c: { Icon: SiC, color: "#A8B9CC" },
  html5: { Icon: SiHtml5, color: "#E34F26" },
  css3: { Icon: SiCss, color: "#1572B6" },
  css: { Icon: SiCss, color: "#1572B6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  react: { Icon: SiReact, color: "#61DAFB" },
  "react.js": { Icon: SiReact, color: "#61DAFB" },
  "next.js": { Icon: SiNextdotjs, color: "#E9ECEF" },
  nextjs: { Icon: SiNextdotjs, color: "#E9ECEF" },
  "tailwind css": { Icon: SiTailwindcss, color: "#38BDF8" },
  tailwind: { Icon: SiTailwindcss, color: "#38BDF8" },
  bootstrap: { Icon: SiBootstrap, color: "#7952B3" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  redis: { Icon: SiRedis, color: "#FF4438" },
  ".net": { Icon: SiDotnet, color: "#512BD4" },
  "asp.net": { Icon: SiDotnet, color: "#512BD4" },
  "asp.net core": { Icon: SiDotnet, color: "#512BD4" },
  blazor: { Icon: SiBlazor, color: "#6D28D9" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#D0D7DE" },
  netlify: { Icon: SiNetlify, color: "#00C7B7" },
  wordpress: { Icon: SiWordpress, color: "#21759B" },
  elementor: { Icon: SiElementor, color: "#92003B" },
  "node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  nodejs: { Icon: SiNodedotjs, color: "#5FA04E" },
  npm: { Icon: SiNpm, color: "#CB3837" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  php: { Icon: SiPhp, color: "#777BB4" },
  flutter: { Icon: SiFlutter, color: "#02569B" },
  dart: { Icon: SiDart, color: "#0175C2" },
  kotlin: { Icon: SiKotlin, color: "#7F52FF" },
  swift: { Icon: SiSwift, color: "#F05138" },
  go: { Icon: SiGo, color: "#00ADD8" },
  golang: { Icon: SiGo, color: "#00ADD8" },
  angular: { Icon: SiAngular, color: "#DD0031" },
  "vue.js": { Icon: SiVuedotjs, color: "#4FC08D" },
  vue: { Icon: SiVuedotjs, color: "#4FC08D" },
  svelte: { Icon: SiSvelte, color: "#FF3E00" },
  django: { Icon: SiDjango, color: "#FFFFFF" },
  flask: { Icon: SiFlask, color: "#FFFFFF" },
  spring: { Icon: SiSpring, color: "#6DB33F" },
  "spring boot": { Icon: SiSpringboot, color: "#6DB33F" },
  laravel: { Icon: SiLaravel, color: "#FF2D20" },
  figma: { Icon: SiFigma, color: "#F24E1E" },
};

export function getTechEntry(name: string | null | undefined): TechEntry | null {
  if (!name) return null;
  return CATALOG[name.trim().toLowerCase()] ?? null;
}

export function TechLogo({
  name,
  size,
  className,
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
}) {
  const entry = getTechEntry(name);
  if (!entry) return null;
  const { Icon, color } = entry;
  return <Icon aria-hidden="true" style={{ color }} size={size} className={className} />;
}