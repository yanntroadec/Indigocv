// Root layout — required by Next.js App Router.
// The actual HTML structure lives in app/[locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement
}
