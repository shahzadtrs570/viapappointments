import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rain Ventures App",
    short_name: "Rain Ventures",
    description: "Rain Ventures Dashboard",
    start_url: "/",
    display: "standalone",
    background_color: "#020817",
    theme_color: "#020817",
    // icons: [
    //   {
    //     src: "/logo.svg",
    //     sizes: "64x64 32x32 24x24 16x16",
    //   },
    // ],
  }
}
