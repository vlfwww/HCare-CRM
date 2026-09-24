# HCare CRM

An SPA for healthcare and clinic management: patient profiles, medical staff,
appointments, activities, surveys, feedback, authentication, and WebSocket chat.

## Features

- Email/password and Google Authentication through Firebase.
- Role-based access for patients and doctors.
- Patient profiles with personal data, contacts, insurance, and care plans.
- Searchable medical staff list with appointment booking.
- Doctor dashboard with appointments and status updates.
- Patient activities: tasks, notes, and posts.
- Surveys and feedback for completed appointments.
- User notifications through Firestore realtime listeners.
- WebSocket echo chat in the patient profile using `wss://ws.ifelse.io`.
- Responsive desktop and mobile interface.

## Technology Stack

- React 19 + TypeScript 6
- Vite 8
- TanStack Router
- TanStack Query
- Firebase Authentication and Cloud Firestore
- Tailwind CSS 4
- Lucide React
- ESLint

## Project Structure

```text
src/
├── app/       # Firebase provider, router, protected routes, lazy pages
├── entities/  # domain entity types and query hooks
├── features/  # auth, profile, appointments, and other feature modules
├── shared/    # shared API, hooks, utilities, and UI
└── widgets/   # layout, header, and sidebar
```

Components are responsible for presentation. State, data fetching, and side
effects are extracted into hooks in `model` and `shared/lib`.

## Requirements

- Node.js 20+
- npm 10+
- A Firebase project with Authentication and Firestore enabled

## Local Development

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux:

```bash
cp .env.example .env
npm run dev
```

Fill `.env` with the Firebase Web App configuration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

`.env` is excluded from Git. `firebase.ts` contains a fallback public Firebase
Web App configuration. Data security is enforced by Firestore rules, not by
hiding the Firebase API key.

## Commands

```bash
npm run dev       # start the local development server
npm run lint      # run ESLint
npm run build     # run the TypeScript check and create a production build
npm run preview   # preview the production build
```

## Data and Firebase

Reads, mutations, and realtime subscriptions use TanStack Query:

- `usePatientData` — patient profile query;
- `usePatientList` — patient list query;
- `useStaffQuery` — medical staff query;
- `useAppointments` — appointment mutation;
- edit hooks invalidate the relevant query keys;
- `useFirestoreRealtimeQuery` performs the initial fetch, subscribes to
  Firestore `onSnapshot`, and writes every update to the TanStack Query cache.

Activities, profiles, surveys, and notifications use Firestore
`onSnapshot` listeners with cleanup. These subscriptions are connected through
the shared TanStack Query cache layer, so the UI reads current data from Query.

Access rules are stored in [firestore.rules](./firestore.rules). A doctor
document in the `medical-staff` collection must use the doctor's Firebase Auth
UID as its document ID and contain `role: "Doctor"`.

Deploy the rules:

```bash
firebase use hcare-8158
firebase deploy --only firestore:rules
```

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/#/` | public | home page |
| `/#/login` | public | sign in |
| `/#/register` | public | registration |
| `/#/profile` | authenticated | patient profile or doctor dashboard |
| `/#/patients` | doctors only | patient list |
| `/#/patients/:patientId` | doctors only | patient profile |
| `/#/medical-staff` | patients only | medical staff |
| `/#/feedback` | patients only | feedback |

The app uses `createHashHistory` because it is deployed to GitHub Pages without
a separate server-side SPA rewrite configuration.

## WebSocket Chat

The [ChatTab](./src/features/patient-profile/ui/tabs/ChatTab.tsx) component:

- connects to `wss://ws.ifelse.io`;
- displays the connection state;
- sends text messages;
- displays server echo responses;
- reconnects three seconds after a disconnection;
- closes the WebSocket and reconnect timer on unmount.

The server is an echo/demo service. Messages are not stored in Firestore.

## Deployment

The project is deployed to GitHub Pages by the
[deploy-pages.yml](./.github/workflows/deploy-pages.yml) workflow on every push
to `main`.

URL: **https://vlfwww.github.io/HCare-CRM/**

To enable the workflow:

1. Open **Settings → Pages** in GitHub and select **GitHub Actions**.
2. Add the following repository secrets:
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
   `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
   `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, and
   `VITE_FIREBASE_MEASUREMENT_ID`.
3. Push to `main` or run the workflow manually.

The workflow creates `dist/404.html` from `dist/index.html` for GitHub Pages
fallback support.

### Quality Assurance & Performance

The project meets high standards of optimization, accessibility, and code quality across all application pages:

    Google Lighthouse: Scores ≥ 90 across all categories (Performance, Accessibility, Best Practices, and SEO).

    Code Validation: Complete absence of HTML/CSS validation errors, ensuring strict compliance with web standards.