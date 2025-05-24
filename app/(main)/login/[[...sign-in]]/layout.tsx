export function generateStaticParams() {
  return [
    // Base path (empty params)
    { "sign-in": [] },
    // Common Clerk auth paths
    { "sign-in": ["sso-callback"] },
    { "sign-in": ["factor-one"] },
    { "sign-in": ["factor-two"] },
    { "sign-in": ["continue"] },
    { "sign-in": ["reset-password"] },
    { "sign-in": ["verify"] },
  ];
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 