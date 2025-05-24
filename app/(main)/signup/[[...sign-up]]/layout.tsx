export function generateStaticParams() {
  return [
    // Base path (empty params)
    { "sign-up": [] },
    // Common Clerk auth paths
    { "sign-up": ["sso-callback"] },
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