"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem(STORAGE_KEY, "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem(STORAGE_KEY, "declined"); setVisible(false); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[200] px-5 py-4 md:px-10 md:py-5"
          style={{ background: "rgba(10,10,10,0.97)", borderTop: "1px solid rgba(212,175,55,0.2)" }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          dir="rtl"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="font-heebo text-xs text-noir-text/70 leading-relaxed max-w-2xl">
              אתר זה משתמש בעוגיות לשיפור חוויית הגלישה ולניתוח תנועה.
              המשך גלישה מהווה הסכמה למדיניות העוגיות שלנו.{" "}
              <a href="/cookies" className="text-noir-gold hover:underline">קראו עוד</a>
              {" · "}
              <a href="/privacy" className="text-noir-gold hover:underline">מדיניות פרטיות</a>
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={decline}
                className="font-heebo text-xs text-noir-muted hover:text-noir-text transition-colors bg-transparent border-none px-4 py-2"
              >
                דחה
              </button>
              <button
                onClick={accept}
                className="font-heebo text-xs text-white px-5 py-2 bg-noir-accent hover:bg-[#a00000] transition-colors border-none"
              >
                אני מסכים/ה
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
