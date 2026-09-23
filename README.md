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

The project is deployed to GitHub Pages by
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on
every push to `main`. The workflow also supports manual runs from the
**Actions** tab.

Before the first deployment:

1. In **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Add the Firebase configuration as repository or environment secrets named
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
   `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
   `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, and
   `VITE_FIREBASE_MEASUREMENT_ID`.
3. Push to `main` and wait for the **Deploy to GitHub Pages** workflow.

The application URL is
`https://vlfwww.github.io/HCare-CRM/`. The Vite base path is enabled only in
GitHub Actions, so local development continues to use `/`. Client-side
navigation uses hash history, so refreshing a route such as
`/HCare-CRM/#/medical-staff` does not request a non-existent server path.

Firestore rules are stored in [`firestore.rules`](./firestore.rules) and must
be deployed to the same Firebase project separately from the Pages workflow.
The Pages workflow only builds and deploys the web application.

For a one-time manual deployment, use the Firebase CLI:

```bash
firebase use hcare-8158
firebase deploy --only firestore:rules
```

Each doctor document in `medical-staff` must use that doctor's Firebase Auth
UID as its document ID and contain `role: "Doctor"`. Appointments store the
doctor document ID in `doctorId`, which prevents a doctor from seeing another
doctor's appointments.

## Quality status

Linting, type-checking, production builds, and unit tests are intended to run
locally and in CI. Run the following before publishing:

```bash
npm run lint
npm run build
```

### Lighthouse results

The following results are recorded from Lighthouse desktop runs in Incognito
mode without browser extensions. Scores are on a 0–100 scale.

| Page | URL path | Performance | Accessibility | Best Practices | SEO | Status |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Home | `/#/` | 88 | 100 | 91 | 100 | Below target: Performance |
| Patient profile | `/#/profile` | 97 | 87 | 100 | 100 | Below target: Accessibility |
| Login | `/#/login` | Not measured | Not measured | Not measured | Not measured | No report recorded |
| Registration | `/#/register` | Not measured | Not measured | Not measured | Not measured | No report recorded |
| Medical staff | `/#/medical-staff` | Not measured | Not measured | Not measured | Not measured | No report recorded |
| Feedback | `/#/feedback` | Not measured | Not measured | Not measured | Not measured | No report recorded |
| Patient list | `/#/patients` | Not measured | Not measured | Not measured | Not measured | No report recorded |
| Patient detail | `/#/patients/:patientId` | Not measured | Not measured | Not measured | Not measured | No report recorded |

Target: every score must be **90 or higher**. The currently recorded reports
do not yet meet that target for Home Performance and Patient profile
Accessibility. The remaining routes do not have recorded Lighthouse results
and must not be represented as passing.

### Validation results

| Validation area | Result |
| --- | --- |
| HTML validation | No errors found |
| CSS validation | No errors found |
| Responsive desktop layout | No known horizontal page overflow or overlapping layout |
| Responsive mobile layout | No known horizontal page overflow or overlapping layout |
| Production build | Passed |
| ESLint | Passed |
