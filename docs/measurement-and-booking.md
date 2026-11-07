# Measurement and appointment requests

## Anonymous visit statistics
- Client `Tracker` (mounted in `SiteChrome`) posts `{page, source}` to `/api/e` once per page view; first view per tab also sends the referrer, which the server reduces to a coarse source (google, bing, facebook, AI tools...). Click delegation counts tel / WhatsApp / mailto; chat open and lead/booking are counted too.
- Stored as daily aggregate counters in the existing Blobs store (`visits-YYYY-MM-DD`). No IPs, cookies or per-visitor rows. Honors Do-Not-Track, skips bots, `/admin`, `/studio`.
- Shown in `/admin` ("מי מגיע לאתר"). Privacy page describes it.

## Appointment requests
- Config: `brand.booking` (weekdays, horizonDays, time windows, meeting types). Edit in `brand.ts`.
- `BookingForm` (Contact section and `/consultation`) -> `requestAppointment` server action: zod validation, rate limit (4/hour/IP), same delivery as leads (Meta WhatsApp Cloud API when configured, else a prefilled wa.me link). It is a REQUEST; the office confirms. Nothing is stored server-side beyond the anonymous counter.

## Source attribution (added)
- The first view of a visit gets a coarse source from `/api/e`; it is kept in `sessionStorage` for that tab only (`v_src`, `v_land`).
- Callback form, booking form and the chat intake send it as hidden `src`/`landing` fields. The server validates it against known keys / a path pattern and appends "הגיע מ: ..., עמוד נחיתה: ..." to the WhatsApp alert.
- Contact actions are counted per source (`conv`), shown in `/admin` as "איזה מקור מביא פניות".
- JSON-LD: LegalService now carries `contactPoint` and a `ReserveAction` pointing to `/consultation`; `llms.txt` lists the consultation page.

## Channel line (added)
Every inquiry message to the office starts with its channel: "פנייה חדשה: השארת טלפון / צ׳אט / בקשת פגישה". The chat intake and the callback form share `submitLead` and send a `channel` field (validated server side, default form); the booking action always uses `booking`. `/admin` counts chat leads (`lead_chat`) separately from form leads (`lead`). In template mode the channel is prefixed to template variable {{4}} (details).
