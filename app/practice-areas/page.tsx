import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PracticeAreasPage from "@/components/PracticeAreasPage";

export const metadata: Metadata = {
  title: "תחומי עיסוק | ליאור קלואי ארז — עורכת דין פלילית",
  description:
    "הגנה פלילית מקצועית בתחומי סמים, אלימות, עבירות מין, עבירות כלכליות, תעבורה ועבירות נוער. ייעוץ חסוי ראשוני ללא עלות.",
};

export default function Page() {
  return (
    <main className="bg-noir-bg min-h-screen">
      <Navbar />
      <PracticeAreasPage />
      <Footer />
    </main>
  );
}
