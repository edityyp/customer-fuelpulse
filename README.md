# FuelPulse Customer

Production-oriented customer web app for FuelPulse.

## Customer flow
- Device-secured customer account using Supabase anonymous authentication behind the UI.
- Multiple customer vehicles.
- Parchi photo upload with OCR-assisted field extraction.
- Private receipt-image storage.
- Server-side verification through the existing `customer-redeem` Supabase Edge Function.
- Points ledger, verification history, and offers.
- Duplicate/replay and mismatch protections remain server-authoritative.

## Stack
- Mobile-first static frontend
- Supabase Auth, Database, Storage and Edge Functions
- Existing Fastify verification utilities retained under `server/`
- Vercel-ready static build

## Existing Supabase project
This customer app is configured for the existing FuelPulse customer Supabase project. Do not create or apply the old standalone V2 migration to another production database without reviewing the schema first.

## Local build
```bash
npm install
npm run build
```

The generated production files are placed in `dist/`.
