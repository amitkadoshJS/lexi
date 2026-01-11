# Lexi Admin

React + TypeScript admin panel for managing Firestore data.

## Features

- Firebase Auth (Google Sign-In) with admin authorization
- Firestore CRUD for categories, words, worlds, users, langs
- Nested CRUD for `worlds/{worldId}/games` and `users/{userId}/Profiles`
- React Query caching + pagination for words and users
- CSV import/export for words
- MUI layout with sidebar + topbar

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` with Firebase config values:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Run the app

```bash
npm run dev
```

## Authorization

Admins are documents under `admins/{email}`. The document ID must match the user's email.
If the doc exists, the user is authorized. If not, the UI blocks access and shows a Not Authorized screen.

## Firestore Rules Snippet

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }

    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

> For production, consider custom claims or stricter per-collection rules, but this app uses the
> document-based `admins/{email}` approach as required.

## Notes

- Words CSV import expects headers like `id`, `title_en`, `title_he`, `category`, `img`, `corr_img`,
  `voice_record_en`, `voice_record_he`, `test_order_id`.
- `category` can be a comma-separated string or an array.
- The admin app intentionally does **not** use or reference any `appleCredentials` collection.
