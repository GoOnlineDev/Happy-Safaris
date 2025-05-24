export const siteConfig = {
  name: "Happy African Safaris",
  description: "Experience the magic of Uganda with Happy Safaris Tours and Travels",
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: process.env.NEXT_PUBLIC_APP_URL + "/og.jpg",
  links: {
    twitter: "https://twitter.com/happyafricansafaris",
    github: "https://github.com/happyafricansafaris",
  },
} as const;

export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  afterSignInUrl: "/portal",
  afterSignUpUrl: "/portal",
  signInUrl: "/login",
  signUpUrl: "/signup",
} as const;

export const convexConfig = {
  url: process.env.NEXT_PUBLIC_CONVEX_URL,
} as const; 