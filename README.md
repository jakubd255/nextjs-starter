# NextJS Starter
Starter NextJS application providing login/registration system, account management and admin dashboard.

## Features
- Login and registration
- OAuth2 with GitHub and Google
- Email verification (verification code in console.log)
- Account management
- Profile image upload (local disk or Vercel Blob)
- Admin dashboard with URL-state pagination, sorting and search params (deep linking)
- File upload (images, videos and other files) with reordering, URL import and undoable removal
  - Standard upload via server actions for small files
  - Direct-to-storage upload with a progress bar for large files
  - Ready to use, but not linked in the app UI; available at `/album`

## Tech Stack
- NextJS
- TypeScipt
- Tailwind CSS
- Shadcn UI
- Drizzle ORM
- PostgreSQL
- Lucia Auth
- Arctic