import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Valhalla Girls",
    short_name: "Valhalla Girls",
    description: "Become a Valhalla Girl and enter today.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#94754A",
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
