# HCare CRM

HCare CRM is a React/Vite healthcare workspace for patient records, appointments,
activities, surveys, medical staff, authentication, and support chat.

## Stack

- React 19 and TypeScript
- Vite 8 and Tailwind CSS 4
- TanStack Router and TanStack Query
- Firebase Authentication and Firestore
- WebSocket support chat demo

## Requirements

- Node.js 20 or newer
- A Firebase project with Authentication and Firestore enabled

## Local development

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.
Fill `.env` with the web app configuration from Firebase Console. Never commit
`.env` or production credentials.

## Commands

```bash
npm run dev       # start the Vite development server
npm run build     # type-check and create a production build
npm run lint      # run ESLint
npm run test      # run unit tests
```

## Firebase setup

1. Create a Firebase web app.
2. Enable Email/Password and Google sign-in providers.
3. Create a Firestore database.
4. Copy the web app configuration into the `VITE_FIREBASE_*` variables.
5. Configure Firestore security rules for the authenticated roles used by the
   application before deploying.

The client configuration is read from Vite environment variables. Firebase API
keys identify a Firebase application but do not replace Firestore security rules.

## Deployment

The project produces a static `dist/` directory with `npm run build` and can be deployed to Firebase Hosting, Vercel, Netlify, or another static hosting
provider. Configure the same `VITE_FIREBASE_*` variables in the provider.
No deployment URL is included yet because deployment credentials and a target
hosting project are environment-specific.

## Quality status

Linting, type-checking, production builds, and unit tests are intended to run
locally and in CI. The repository currently has no hosted CI workflow; run the
commands above before publishing a release.
