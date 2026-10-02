import Link from "next/link";
import { AlertOctagon, Link2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { RiskGauge } from "@/components/risk-gauge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5">
      <header className="flex items-center justify-between py-6">
        <Logo />
        <nav className="flex items-center gap-2">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Create account</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">Find out if an email is phishing before you click anything.</h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Paste the subject, sender and body. ThreatGuard scores the message with a trained model and shows exactly which links, phrases and sender details raised the alarm.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={user ? "/analyze" : "/register"}>{user ? "Analyze an email" : "Start scanning"}</Link>
            </Button>
            {!user && (
              <Button asChild size="lg" variant="outline">
                <Link href="/login">I have an account</Link>
              </Button>
            )}
          </div>
          <ul className="mt-10 grid max-w-xl gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              Every scan is saved to your private history, searchable and filterable.
            </li>
            <li className="flex gap-3">
              <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              Spots look-alike domains, URL shorteners and raw IP links.
            </li>
          </ul>
        </section>

        <section aria-label="Example result" className="rounded-xl border bg-card/80 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <AlertOctagon className="h-7 w-7 text-danger" />
            <div>
              <p className="text-xs text-muted-foreground">Example scan</p>
              <p className="text-lg font-semibold text-danger">Phishing</p>
            </div>
          </div>
          <div className="mt-4">
            <RiskGauge score={94} level="critical" />
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2">Sender paypal-support@paypa1-secure.xyz is not paypal.com</li>
            <li className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2">Link points to a raw IP address over http</li>
            <li className="rounded-md border border-warn/30 bg-warn/10 px-3 py-2">Account will be suspended within 24 hours</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
