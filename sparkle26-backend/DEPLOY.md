# SPARKLE'26 – Supabase + backend deploy (step by step)

```
College subdomain (frontend, https) ---> Backend (Render, Docker) ---> Supabase Postgres
```
College la backend/DB upload panna vendaam. Frontend mattum college la irukkum.

## Step 0 – Ithu already ready
Indha zip la Supabase (PostgreSQL) ku venum ellaa maatramum pannitten:
MySQL driver -> PostgreSQL driver, port `${PORT:8080}`, small DB pool, Dockerfile.
Real `.env` (keys) serkala, so keys neenga hosting la set pannanum (Step 3).

## Step 1 – Supabase project
1. supabase.com -> New project. DB password oru idathula save pannikonga.
2. Region: Mumbai / Singapore (Chennai ku kitta).
3. Project ready aana apram top la **Connect** click -> **Session pooler** choose pannunga.
4. Anga irukkura **host** (`aws-...pooler.supabase.com`) and **user** (`postgres.<project-ref>`) copy pannikonga.
   (Direct connection IPv6 only, Render maari hosting ku work aagaathu. Session pooler thaan use pannanum.)

DB_URL ipdi irukkanum:

    jdbc:postgresql://<POOLER-HOST>:5432/postgres?sslmode=require&prepareThreshold=0

Tables thaanaave create aagum (`DDL_AUTO=update`), SQL ezhutha vendaam.

## Step 2 – GitHub
Indha `sparkle26-backend` folder ah (or full `sparkle26` project ah) GitHub la push pannunga. `.env` gitignore la irukku, so keys push aagaathu.

## Step 3 – Backend deploy (Render)
1. render.com -> New -> Web Service -> GitHub repo select.
2. Runtime = **Docker**. Root Directory: indha folder ah thaniya push panniyirundha **blank**, full `sparkle26` repo na `backend`.
3. Environment variables:

| Key | Value |
|---|---|
| DB_URL | Step 1 la sonna URL |
| DB_USERNAME | `postgres.<project-ref>` |
| DB_PASSWORD | Supabase DB password |
| DDL_AUTO | update |
| VOLUNTEER_API_KEY | pudhu long random key |
| ADMIN_API_KEY | vera long random key |
| GMAIL_USER | sparkle gmail id |
| GMAIL_APP_PASSWORD | Gmail App Password |
| SITE_URL | `https://<college-subdomain>` |
| APP_ALLOWED_ORIGINS | `https://<college-subdomain>,https://<checkin-url>` |

4. Deploy. Aana apram check:
   - `https://<render-url>/api/health`
   - `https://<render-url>/api/events`  (17 events varanum)

## Step 4 – Frontend rebuild
`frontend/.env` and `checkin/.env`:

    VITE_API_BASE_URL=https://<render-url>
    VITE_UPI_ID=<gpay upi id>

    npm run build:all

`frontend/dist/` content ah college subdomain la upload pannunga.

## Step 5 – College IT kitta kekka vendiyathu
Mail la `/ticket/<code>` link varum. College server "ellaa route um index.html ku pogattum"
(SPA fallback) set pannanum, illana ticket links 404 aagum.

## Step 6 – Event ku munnadi test
- [ ] Events page load aaguthu
- [ ] Junior (free) register -> ticket mail
- [ ] Senior (paid) register -> UTR submit -> Payments tab approve -> mail
- [ ] Ticket QR scan -> check-in
- [ ] On-spot booking, Excel download

## Gotchas
- **Supabase free project 1 week inactive na pause aagum.** Event ku 2-3 naal munnadi dashboard la "Restore/Active" aa irukka paarunga, and event week la daily oru registration/test pannunga.
- **Render free server 15 min idle na sleep aagum** (first request ~1 min). Event day morning wake pannunga, illana paid always-on plan.
- DB password la special character (`@`, `#`) irundha Supabase la simple password reset pannidunga, URL/properties la problem varaama irukkum.
- Keys (`Sparkle26`, `Sparkle@2026`) use pannaadhinga, weak.
