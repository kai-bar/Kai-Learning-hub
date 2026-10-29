import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const users = await prisma.user.findMany();
  const courses = await prisma.course.findMany();
  const exams = await prisma.exam.findMany();

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Total Users</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Total Courses</h3>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3>Total Exams</h3>
            <p className="text-3xl font-bold">{exams.length}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
