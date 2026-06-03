import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsPage from "@/components/TestimonialsPage";

export const metadata: Metadata = {
  title: "המלצות לקוחות | ליאור קלואי ארז — עורכת דין פלילית",
  description:
    "לקוחות מספרים על ייצוג משפטי מקצועי, תוצאות מוכחות ושירות 24/7. הגנה פלילית אמיתית — בדוקה ומוכחת.",
};

export default function Page() {
  return (
    <main className="relative z-10 min-h-screen">
      <Navbar />
      <TestimonialsPage />
      <Footer />
    </main>
  );
}
