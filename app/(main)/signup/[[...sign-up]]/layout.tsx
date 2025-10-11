export function generateStaticParams() {
  return [
    // Base path (empty params)
    { "sign-up": [] },
    // Common Clerk auth paths
    { "sign-up": ["factor-one"] },
    { "sign-up": ["continue"] },
    { "sign-up": ["verify"] },
    { "sign-up": ["verify-email"] },
  ];
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 

export const metadata = {
  title: 'Create Account – Happy African Safaris',
  description: 'Sign up to plan and manage your Uganda safari trips.',
  robots: { index: false, follow: true },
};