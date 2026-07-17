import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join UniConnect to track admissions and more
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
