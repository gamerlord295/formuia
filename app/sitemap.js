export default function sitemap() {
    return [
            {
                url: "https://formuia.vercel.app/",
                lastmod: new Date(),
                changefreq: "weekly",
                priority: 1
            },
            {
                url: "https://formuia.vercel.app/login",
                lastmod: new Date(),
                changefreq: "weekly",
                priority: 0.4
            }
    ]
}