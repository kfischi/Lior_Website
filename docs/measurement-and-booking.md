# Measurement and appointment requests

## Anonymous visit statistics
- Client `Tracker` (mounted in `SiteChrome`) posts `{page, source}` to `/api/e` once per page view; first view per tab also sends the referrer, which the server reduces to a coarse source (google, bing, facebook, AI tools...). Click delegation counts tel / WhatsApp / mailto; chat open and lead/booking are counted too.
- Stored as daily aggregate counters in the existing Blobs store (`visits-YYYY-MM-DD`). No IPs, cookies or per-visitor rows. Honors Do-Not-Track, skips bots, `/admin`, `/studio`.
- Shown in `/admin` ("מי מגיע לאתר"). Privacy page describes it.

## Appointment requests
- Config: `brand.booking` (weekdays, horizonDays, time windows, meeting types). Edit in `brand.ts`.
- `BookingForm` (Contact section and `/consultation`) -> `requestAppointment` server action: zod validation, rate limit (4/hour/IP), same delivery as leads (Meta WhatsApp Cloud API when configured, else a prefilled wa.me link). It is a REQUEST; the office confirms. Nothing is stored server-side beyond the anonymous counter.
