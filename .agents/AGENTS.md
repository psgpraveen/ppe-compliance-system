# User Development Profile & Workflow Rules

When working on full-stack web applications, enforce the following rules and preferences unless explicitly instructed otherwise:

## 1. Tech Stack Preferences
- **Frontend**: Next.js, TypeScript, Tailwind CSS, React Hook Form, Zod, TanStack Query.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL using the raw `pg` driver. **DO NOT use ORMs** (e.g., Prisma, TypeORM, Sequelize).

## 2. Architecture & Code Quality
- Follow **Clean Architecture** (Routes -> Controllers -> Services -> Repositories -> DB).
- Keep business logic in Services. Keep SQL queries in Repositories. Controllers should only validate input and return responses.
- Adhere to **SOLID principles**.
- Every file should have a single responsibility.
- Never duplicate code. Prefer readability and scalability over clever/short code.
- Always use centralized error middleware.

## 3. Development Workflow
- **One Feature at a Time**: Complete a feature end-to-end (Database -> Backend -> Frontend -> Tests -> Docs) before moving on.
- Wait for explicit user approval before generating code for a new feature module.
