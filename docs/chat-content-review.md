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
