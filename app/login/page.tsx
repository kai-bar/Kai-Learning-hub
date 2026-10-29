import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, signToken } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=Please fill all fields");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/login?error=Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    redirect("/login?error=Invalid email or password");
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  setSessionCookie(token);
  redirect("/dashboard");
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <form action={login} className="space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full border p-3 rounded" required />
          <input name="password" type="password" placeholder="Password" className="w-full border p-3 rounded" required />
          <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold">Login</button>
        </form>

        <p className="mt-4 text-center text-slate-600">
          Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-semibold">Register</Link>
        </p>
      </div>
    </main>
  );
}
