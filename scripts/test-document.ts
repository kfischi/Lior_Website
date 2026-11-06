/** Self-check for reading a letter: `npm run test:document`. */
import { readDocument } from '../src/lib/document/analyze';

const today = new Date(2026, 9, 27); // 27 Oct 2026
let failed = 0;
const check = (name: string, ok: boolean) => {
  if (!ok) {
    failed += 1;
    console.error(`FAIL: ${name}`);
  }
};

const hearing = readDocument('זימון לשימוע\nהנך מוזמן לשימוע טרם קבלת החלטה ביום 02/11/2026 בשעה 10:00', today);
check('hearing kind', hearing.kind === 'hearing');
check('hearing date', hearing.dates[0]?.iso === '2026-11-02' && hearing.dates[0].inDays === 6);
check('hearing urgent', hearing.urgent);

const dismissal = readDocument('הודעה על פיטורים. עבודתך תסתיים ב-15 בדצמבר 2026. הודעה מוקדמת', today);
check('dismissal kind', dismissal.kind === 'dismissal');
check('hebrew month', dismissal.dates.some((d) => d.iso === '2026-12-15'));

const police = readDocument('משטרת ישראל. הנך מוזמן להתייצב לחקירה באזהרה ביום 5.11.26', today);
check('investigation kind', police.kind === 'investigation');
check('short year', police.dates[0]?.iso === '2026-11-05');

check('invalid date ignored', readDocument('ביום 31/02/2026', today).dates.length === 0);
check('plain text', readDocument('שלום מה שלומך', today).kind === null);
check('no urgent without cues', !readDocument('שלום מה שלומך', today).urgent);
console.log(failed ? `${failed} failed` : 'all document checks passed');
process.exit(failed ? 1 : 0);
