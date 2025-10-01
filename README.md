# Merchant Buddy

A FinTech prototype built with Next.js (App Router) + MUI + TanStack Query on the frontend and NestJS + GraphQL + Prisma (MySQL) on the backend. Provides a merchant-facing portal with auth, payouts, transaction search, disputes, and device management, modeled after real payment workflows. Uses TypeScript end-to-end, with CI/CD via GitHub Actions, Prisma migrations, and RDS-ready MySQL schema.

## Architecture Blueprint

Frontend:
- Next.js (App Router) + MUI
- TanStack Query + react-hook-form + Zod
- Auth via JWT and RBAC-aware routes
- GraphQL client (graphql-request)

Backend:
- NestJS + Fastify
- Modules: Auth, Users, Merchants, Transactions, Payouts, Disputes, Devices, Audit
- GraphQL (SDL-first) and Prisma (MySQL/RDS)

Observability:
- Request IDs (Fastify reqId)
- Structured logs (Pino)
- Central error filter for Nest
- Minimal tracing hooks

Security:
- BCrypt password hashing
- JWT (short-lived)
- Role guards
- Zod DTO validation
- CORS allowlist