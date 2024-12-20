import { Header } from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Header />
      <SessionProvider session={session}>
        <Component {...pageProps} />;
      </SessionProvider>
    </>
  );
}
