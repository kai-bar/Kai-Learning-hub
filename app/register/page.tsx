import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function register(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "STUDENT");

  if (!name || !email || !password) {
    redirect("/register?error=Please fill all fields");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    redirect("/register?error=User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role as "ADMIN" | "TEACHER" | "STUDENT"
    }
  });

  if (role === "STUDENT") {
    await prisma.studentProfile.create({ data: { userId: user.id, className: "Grade 1" } });
  }

  if (role === "TEACHER") {
    await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        qualification: "Not specified",
        department: "General",
        bio: "New teacher"
      }
    });
  }

  if (role === "ADMIN") {
    await prisma.adminProfile.create({ data: { userId: user.id } });
  }

  redirect("/login");
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        <form action={register} className="space-y-4">
          <input name="name" type="text" placeholder="Full Name" className="w-full border p-3 rounded" required />
          <input name="email" type="email" placeholder="Email" className="w-full border p-3 rounded" required />
          <input name="password" type="password" placeholder="Password" className="w-full border p-3 rounded" required />
          <select name="role" className="w-full border p-3 rounded" defaultValue="STUDENT">
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold">Register</button>
        </form>

        <p className="mt-4 text-center text-slate-600">
          Already have an account? <Link href="/login" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </div>
    </main>
  );
}
