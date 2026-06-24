"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/constants";
import { ROLES } from "@/lib/roles";

/** Dead-code-eliminated in production builds — test credentials and quick-login shortcuts only exist for local testing. */
const SHOW_QUICK_SIGN_IN = process.env.NODE_ENV !== "production";

/**
 * One throwaway email/password per role, valid only while
 * `SHOW_QUICK_SIGN_IN` is true. There's no real backend yet, so these just
 * let the Email/Password fields above double as a working test login
 * instead of always showing the "not connected" toast.
 */
const TEST_CREDENTIALS: Record<string, { email: string; password: string }> = {
  "Department-Head": { email: "dept.head@rupp.edu.kh", password: "DeptHead123!" },
  "Program-Coordinator": { email: "coordinator@rupp.edu.kh", password: "Coord123!" },
  Lecturer: { email: "lecturer@rupp.edu.kh", password: "Lecturer123!" },
};

/**
 * Sign-in page at "/". The actual authentication flow isn't built yet, so
 * "Sign in" checks the typed email/password against `TEST_CREDENTIALS`
 * (dev builds only) and routes straight into the matching role on a hit;
 * otherwise it shows a toast. The "Quick Sign In" section below is
 * dev-only too — it jumps straight into a role's dashboard for testing,
 * and disappears entirely from production builds via `SHOW_QUICK_SIGN_IN`.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const roles = Object.values(ROLES);

  function handleSignIn() {
    if (SHOW_QUICK_SIGN_IN) {
      const matchedRole = roles.find((role) => {
        const creds = TEST_CREDENTIALS[role.key];
        return creds && creds.email === email && creds.password === password;
      });
      if (matchedRole) {
        router.push(matchedRole.navItems[0].href);
        return;
      }
    }
    toast.message("Sign in not connected yet", {
      description: SHOW_QUICK_SIGN_IN
        ? "No match — use a test credential below, or pick Quick Sign In."
        : "Authentication hasn't been built yet.",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <Card className="rounded-2xl border-border/60 shadow-xl">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- static raster logo, no benefit from next/image's optimizer */}
              <img src="/logo/logo&title_login.png" alt={`${BRAND.name} logo`} className="h-16 w-auto rounded-xl" />
            </div>

            <h1 className="text-center text-xl font-bold tracking-tight text-foreground">Sign in</h1>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                Remember me
              </label>

              <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-500" onClick={handleSignIn}>
                Sign in
              </Button>
            </div>
          </CardContent>
        </Card>

        {SHOW_QUICK_SIGN_IN ? (
          <Card className="rounded-2xl border-dashed border-border/80 shadow-none">
            <CardContent className="space-y-3 p-5">
              <p className="text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Quick Sign In — development only
              </p>
              <div className="space-y-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const creds = TEST_CREDENTIALS[role.key];
                  return (
                    <div key={role.key} className="space-y-1">
                      <Link
                        href={role.navItems[0].href}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <Icon className="size-4" /> Continue as {role.label}
                      </Link>
                      {creds ? (
                        <p className="text-center font-mono text-[11px] text-muted-foreground">
                          {creds.email} / {creds.password}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[11px] text-muted-foreground">
                Type a credential above into Email/Password, or click a button. Hidden automatically in production builds.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
