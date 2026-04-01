import { generateSEO } from "@/lib/seo"
import DashboardClient from "./DashboardClient"

export const metadata = generateSEO({
  title: "Home",
  description: "Learn how SolarioTech builds scalable, future-ready digital solutions.",
  path: "/home",
  keywords: ["SolarioTech", "Home", "Technology Company"],
});


// SERVER COMPONENT
export default function DashboardPage() {
  return <DashboardClient />
}
