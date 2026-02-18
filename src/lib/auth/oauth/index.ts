import { GitHub, Google } from "arctic";

export const github = new GitHub(
    process.env.GITHUB_ID!,
    process.env.GITHUB_SECRET!,
    process.env.GITHUB_URL!
);

export const google = new Google(
    process.env.GOOGLE_ID!,
    process.env.GOOGLE_SECRET!,
    process.env.GOOGLE_URL!
);

export const AVAILABLE_PROVIDERS = [
    {
        key: "github",
        label: "GitHub",
        iconLight: "https://images.shadcnspace.com/assets/svgs/icon-github.svg",
        iconDark: "https://images.shadcnspace.com/assets/svgs/icon-github-white.svg",
        url: "/api/auth/github"
    },
    {
        key: "google",
        label: "Google",
        iconLight: "https://images.shadcnspace.com/assets/svgs/icon-google.svg",
        iconDark: null,
        url: "/api/auth/google"
    }
];