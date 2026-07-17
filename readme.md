# Vyoma 🚀✈️

An educational Instagram-style social app built with **React + Firebase**. Real accounts, a
real-time feed, stories, direct messages, notifications, and explore — all backed by live
Firestore data, not mocks.

> Built for learning purposes: authentication, real-time databases, file storage, and
> security rules, using a social-feed app as the vehicle. Not affiliated with Instagram/Meta.

## What's included

- **Auth** — email/password sign up & login (Firebase Authentication)
- **Feed** — real-time posts (Firestore `onSnapshot`), like/unlike, comments
- **Stories** — 24-hour expiring stories with a progress-bar viewer
- **Explore** — grid of all posts
- **Messages** — real-time 1:1 chat, deterministic thread IDs so reopening a
  conversation always resumes the same thread
- **Notifications** — real-time list, data model ready for likes/comments/follows
- **Profile** — your posts, stats, logout
- **Image uploads** — Firebase Storage for post photos

## 1. Create your Firebase project

1. Go to https://console.firebase.google.com → **Add project**
2. Inside the project, click the **`</>`** (web) icon to register a web app — copy the config object it gives you
3. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**
4. **Build → Firestore Database → Create database** (start in test mode while developing)
5. **Build → Storage → Get started**

## 2. Configure the app

Open `src/firebase/config.js` and paste your config:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

## 3. Install & run

```bash
npm install
npm run dev
```

Open the printed local URL. Sign up for an account, then open a second browser
(or incognito window) and sign up as a second user — you'll see likes, comments,
and messages sync between them in real time.

## 4. Deploy your security rules

Once you're happy with test mode, tighten access using the rules already written
for you in this project:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage   # point it at this project, keep existing rules files
firebase deploy --only firestore:rules,storage:rules
```

`firestore.rules` and `storage.rules` in the project root already encode sensible
defaults: only the post/comment/story author can edit or delete their content,
anyone signed in can read and like, and chat messages are restricted to the two
members of a conversation.

## 5. Deploy the app itself (optional)

```bash
npm run build
firebase init hosting   # choose the dist/ folder as your public directory
firebase deploy --only hosting
```

## Data model reference

| Collection | Shape |
|---|---|
| `users/{uid}` | `{ uid, name, handle, bio, photoURL, followers[], following[], createdAt }` |
| `posts/{id}` | `{ authorId, authorHandle, authorName, authorPhoto, caption, imageURL, likedBy[], createdAt }` |
| `posts/{id}/comments/{id}` | `{ text, authorId, authorHandle, createdAt }` |
| `stories/{id}` | `{ authorId, authorName, authorPhoto, imageURL, createdAt }` |
| `conversations/{id}` | `{ members[2], memberInfo, lastMessage, updatedAt }` — id is `[uidA,uidB].sort().join('_')` |
| `conversations/{id}/messages/{id}` | `{ senderId, text, createdAt }` |
| `notifications/{id}` | `{ toUserId, fromUserId, fromName, fromHandle, fromPhoto, type, createdAt }` |

## Where to extend next

- Write `notifications` docs automatically from a **Cloud Function** triggered on
  new likes/comments/follows, instead of writing them from the client
- Add a `follows` collection and filter the feed to followed accounts only
- Add typing indicators and read receipts to `conversations` using a
  `typing: { [uid]: boolean }` field updated on keypress
- Add pagination to Feed/Explore with Firestore's `startAfter`
- Swap in Firebase Cloud Messaging for push notifications on mobile

## Tech stack

React 18 · React Router · Firebase (Auth, Firestore, Storage) · Tailwind CSS · Vite · lucide-react icons