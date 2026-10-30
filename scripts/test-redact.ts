/** Self-check for the personal-detail redaction: `npm run test:privacy`. Exits non-zero on a failure. */
import { isIsraeliId, redactPersonalDetails } from '../src/lib/privacy/redact';

const cases: [input: string, expectFound: string[], mustNotContain: string[], mustKeep: string[]][] = [
  ['הטלפון שלי 050-123-4567 תחזרו אליי', ['phone'], ['050-123-4567'], ['תחזרו אליי']],
  ['0501234567', ['phone'], ['0501234567'], []],
  ['+972 52 123 4567', ['phone'], ['4567'], []],
  ['מספר הזהות שלי 123456782', ['id'], ['123456782'], ['מספר הזהות שלי']],
  ['ת.ז. 000000018', ['id'], ['000000018'], []],
  ['הכרטיס 4580 4580 4580 4580', ['card'], ['4580 4580'], []],
  ['המייל lior.test@example.com תודה', ['email'], ['lior.test@example.com'], ['תודה']],
  ['עבדתי 3 חודשים ופוטרתי ב-12/05/2024', [], [], ['3 חודשים', '12/05/2024']],
  ['עשרים וארבע שעות, 2024, 1500 שקל', [], [], ['2024', '1500']],
  ['מספר 123456789 אינו תקין', [], [], ['123456789']],
];

let failed = 0;
for (const [input, expectFound, mustNot, keep] of cases) {
  const { text, found } = redactPersonalDetails(input);
  const ok =
    JSON.stringify([...found].sort()) === JSON.stringify([...expectFound].sort()) &&
    mustNot.every((s) => !text.includes(s)) &&
    keep.every((s) => text.includes(s));
  if (!ok) {
    failed += 1;
    console.error(`FAIL: ${input}\n   got: ${text} (${found.join(',')})`);
  }
}
if (!isIsraeliId('123456782') || isIsraeliId('123456789')) {
  failed += 1;
  console.error('FAIL: isIsraeliId');
}
console.log(failed ? `${failed} failed` : `all ${cases.length + 1} checks passed`);
process.exit(failed ? 1 : 0);
