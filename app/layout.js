import "@/app/_css/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "@/app/_components/main/provider";

import Streak from "@/app/_components/main/streak";

export const metadata = {
  title: "formuia Social Media",
  description: "formuia is a social media app used to share your thoughts and express yourself without limits.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <head>
      <meta name="google-site-verification" content="0Do0sdVFMfqaX-qOX0zPG9OUvpZJGG4ISqsrVdzV4Gg" />
      </head>
      <body>
        <Providers>
          <Streak />
            {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
