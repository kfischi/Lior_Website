# Chat content added in this round: for the attorney's review

These answers were added to `src/lib/knowledge.ts` (the assistant's approved knowledge). They only repeat what the
site already says or describe the process, but anything the assistant says speaks for the firm, so please read and
approve or edit them. Nothing here gives a legal opinion on a specific case.

| Entry | What it says | Check |
|---|---|---|
| `about-lior` | Who the attorney is: bar member, three specialties, a seminar on the criminal investigation | Is the wording of her background right? Anything to add (years, education)? |
| `talk-to-lawyer` | Phone/WhatsApp, or leave details in the chat | OK to promise "the office or the attorney will answer"? |
| `unpaid-wages` | Pay, severance and resignation: the office's focus is discrimination and bullying; consult before resigning or signing | Does the firm take wage/severance matters? Adjust the sentence. |
| `recording` | Be careful with recordings; consult first; document in writing | Her preferred advice on recordings. |
| `language` | The chat is mainly Hebrew; ask the office about other languages | Which languages can the office serve? |
| `site-guide`, `how-it-works`, `reviews-info`, `press`, `legal-pages` | What is on the site and where | Reviews: no quotes, no promise of outcomes. |

Changes to behaviour (no legal content): empathy opener for a visitor describing their own situation, no repeating of
the same answer, "the police called me" goes to the investigation answer, "I want to talk to Lior" goes to contact.

The chat now also moves around the site: "show me the reviews" scrolls to them and lights them up; "take me to the
criminal law page" opens it. Targets are in `src/lib/site-actions.ts`.

## Round 2: Lior's own description of her practice (to approve)

Added from her message to colleagues (21 years; graduate of the Tel Aviv criminal prosecution; former prosecutor at the
Ministry of Economy; medical negligence, employment, torts, National Insurance, defamation, harassment/restraining orders,
probate/wills/guardianship/death declarations/continuing power of attorney; criminal from before the investigation to all
courts; Harish and Zoom; referrals welcome). Shown in: About (text, credentials, "21 years" figure), the practice section
("ובתחומים נוספים"), FAQ, meta description, JSON-LD `knowsAbout`, and the assistant's knowledge and instructions.

Please check, in particular:
1. **"Families of the murdered" (משפחות הנרצחים)** from her text about vaccine injuries was NOT published. The site says
   "ייצוג נפגעי רשלנות רפואית, ובהם נפגעי חיסונים ומשפחותיהם". Attributing a death to a medical product is a serious factual
   claim under the Bar's advertising rules and defamation law; she should decide the exact wording with the Bar rules in mind.
2. **"21 years"** is computed from `practisingSince: 2005` in `brand.ts` (her "21 years" in 2026). Confirm the start year.
3. "מתמחה" (specialises) is used for areas she listed. The Bar restricts "מומחית"; the assistant is told not to use it.
4. **Divorce**: she does not handle marriage and divorce; the assistant also says to check custody/alimony with the office.
5. **Referrals from colleagues**: the assistant says she is glad to receive them. Add a visible line on the site if she wants.
6. Her original text lists employment, torts, etc. but not sexual harassment or workplace bullying pages that already exist;
   those stay. Say if any area should be removed or get its own page.

## Round 3: more topics and starter questions (to approve)

New answers in `src/lib/knowledge.ts` for people looking for information or wanting to reach Lior: right to silence and to
consult a lawyer before questioning; the hearing before a dismissal; where a sexual-harassment complaint can be filed;
how to document what happened; "I am not sure which area this is"; contacting on behalf of a relative (needs the person's
consent to be represented); how to send documents; existing clients; how to prepare for a meeting; living far away or abroad (Zoom).
The first screen of the chat now offers eight starter questions instead of three. These are general information in the
same careful wording as the earlier rounds (no promises, no individual advice), but they are legal statements:
please read them, especially the first three.

## Round 4: three practice areas (to approve)

The site now presents three areas, as requested: **criminal** (including accompanying victims of crime under the Crime
Victims' Rights Law), **torts** (negligence, discrimination and bullying at work, sexual harassment, defamation and
claims over Pfizer vaccines) and **personal status** (drafting wills, continuing power of attorney, declaration of a
missing person). The old pages for discrimination and sexual harassment were merged into torts; their addresses
redirect there. The earlier "other areas" list (National Insurance, labour-law claims for wages, guardianship,
probate orders, restraining orders) is no longer shown, and the chat says wage claims alone are outside the areas.

Please check, in particular:
1. **Pfizer vaccines.** The text says a person who believes they were harmed by a vaccine may consult about a claim, that
   the link between vaccine and harm is examined on medical evidence, and that no result can be promised. It does not say
   vaccines cause harm. The Bar's advertising rules and defamation law apply; the wording is hers to approve.
2. **Crime Victims' Rights Law.** The page lists rights in general terms (information about the proceedings, a victim
   statement before sentencing). Please confirm which rights she wants named, and whether the office offers free or
   state-funded representation, which is not mentioned.
3. **Personal status.** The title "מעמד אישי" is read by many visitors as family law, so the page and the chat say the
   office does not handle marriage and divorce. "Declaration of a missing person" is described only in general terms:
   please give the exact name of the procedure and what the office does in it.
4. **Continuing power of attorney.** The text says it is made with a lawyer and registered with the Public Guardian.
5. **Labour law.** Wage and severance claims, hearings before dismissal outside discrimination, and National Insurance
   are not in the three areas. Say if any of them should stay.
