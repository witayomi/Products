import { redirect } from "next/navigation";
import { createSession, createUser, getCurrentUser, verifyUser } from "@/lib/auth";

async function signIn(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await verifyUser(email, password);
  if (!user) throw new Error("Invalid credentials");
  await createSession(user.id);
  redirect("/dashboard");
}

async function signUp(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await createUser(email, password);
  await createSession(user.id);
  redirect("/dashboard");
}

export default async function AuthPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
      <div className="grid w-full gap-8 rounded-2xl bg-white p-10 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-brand-500">CreatorX</p>
          <h1 className="mt-4 text-3xl font-semibold">Sign in to build your next digital product.</h1>
          <p className="mt-2 text-sm text-slate-600">
            Fast, claim-safe product creation workflows for professionals and educators.
          </p>
        </div>
        <div className="space-y-6">
          <form action={signIn} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input className="input" name="email" id="email" type="email" required />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input className="input" name="password" id="password" type="password" required />
            </div>
            <button className="button w-full" type="submit">Sign in</button>
          </form>
          <div className="border-t border-slate-100 pt-6">
            <form action={signUp} className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">New here? Create an account.</p>
              <div>
                <label className="label" htmlFor="signup-email">Email</label>
                <input className="input" name="email" id="signup-email" type="email" required />
              </div>
              <div>
                <label className="label" htmlFor="signup-password">Password</label>
                <input className="input" name="password" id="signup-password" type="password" required />
              </div>
              <button className="button-secondary w-full" type="submit">Create account</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
