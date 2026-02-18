// lib/sidebar/sidebar.config.ts
import { IconArticle, IconChalkboardTeacher, IconDashboard, IconDeviceImacCode, IconHeartHandshake, IconMessage2, IconMessageCircleUser, IconUserSquareRounded, IconWorldSearch } from "@tabler/icons-react";

export type Role = "ADMIN" | "SUPER_ADMIN";

export const navGeneral = [
  {
    title: "Dashboard",
    url: "/general/dashboard",
    icon: IconDashboard,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Message",
    url: "/general/messages",
    icon: IconMessage2,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "User",
    url: "/general/users",
    icon: IconUserSquareRounded,
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "SEO Management",
    url: "/general/seo-manage",
    icon: IconWorldSearch,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

export const navContentWebsite = [
  {
    title: "Course",
    url: "/content-website/courses",
    icon: IconDeviceImacCode,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Contributors",
    url: "/content-website/contributors",
    icon: IconChalkboardTeacher,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Mitra",
    url: "/content-website/mitras",
    icon: IconHeartHandshake,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Testimoni",
    url: "/content-website/testimonies",
    icon: IconMessageCircleUser,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Article",
    url: "/content-website/articles",
    icon: IconArticle,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];
