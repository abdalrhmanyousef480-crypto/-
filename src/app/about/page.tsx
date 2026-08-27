import { StaticPage } from "@/components/public/StaticPage";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "من نحن — كوبونيتا", description: "تعرّف على منصة كوبونيتا ورسالتنا.", path: "/about", locale: "ar",
});

export default function AboutPage() {
  return (
    <StaticPage title="من نحن">
      <p className="text-ink-muted leading-relaxed mb-4">
        كوبونيتا هي منصة عربية متخصصة في جمع أحدث أكواد الخصم والعروض من أشهر المتاجر الإلكترونية في المنطقة والعالم، بهدف مساعدتك على التوفير في كل عملية شراء.
      </p>
      <h2 className="text-lg mt-6 mb-2">مهمتنا</h2>
      <p className="text-ink-muted leading-relaxed mb-4">
        نؤمن أن التسوق الذكي يبدأ بمعرفة أن هناك خصمًا متاحًا. لذلك يراجع فريقنا الكوبونات بانتظام للتأكد من صلاحيتها، ونعرضها بطريقة واضحة وسريعة تمكنك من الحصول على الكود واستخدامه في ثوانٍ.
      </p>
      <h2 className="text-lg mt-6 mb-2">كيف نعمل</h2>
      <p className="text-ink-muted leading-relaxed">
        نجمع الكوبونات من المتاجر الشريكة ونتحقق من عملها الفعلي بشكل دوري، ثم نصنفها حسب المتجر والتصنيف والنوع لتسهيل الوصول إليها. الموقع مجاني بالكامل للمستخدمين.
      </p>
    </StaticPage>
  );
}
