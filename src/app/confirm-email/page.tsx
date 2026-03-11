import Link from "next/link";

export const metadata = {
  title: "Confirm your email – Koda",
  description: "Check your inbox to confirm your account",
};

export default function ConfirmEmailPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-10">
      <div className="glass w-full max-w-[380px] space-y-6 rounded-2xl border border-border/60 p-8 text-center shadow-md sm:max-w-md animate-scale-in">
        <h1 className="text-xl font-semibold tracking-tight">
          Confirm your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your email. Click the link to activate your account, then sign in.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn’t get the email? Check spam or{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-2 hover:underline">
            try signing up again
          </Link>
          .
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
