import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const courseCount = await prisma.course.count();
  const studentCourses = await prisma.enrollment.findMany({
    where: { studentId: user.id },
    include: { course: true }
  });

  const attempts = await prisma.examAttempt.findMany({
    where: { studentId: user.id }
  });

  const averageScore = attempts.length
    ? attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length
    : 0;

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white">
        <div className="container flex justify-between items-center py-4">
          <div className="text-xl font-bold">Dashboard</div>
          <div className="flex gap-4 items-center">
            <Link href="/">Home</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/results">Results</Link>
            <form action="/api/auth/logout" method="POST">
              <button className="bg-red-500 px-3 py-2 rounded">Logout</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}</h1>
        <p className="text-slate-600 mb-8">Role: {user.role}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-slate-500">Courses</h3>
            <p className="text-3xl font-bold mt-2">{courseCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-slate-500">Enrolled</h3>
            <p className="text-3xl font-bold mt-2">{studentCourses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-slate-500">Study %</h3>
            <p className="text-3xl font-bold mt-2">{Math.min(100, Math.round(averageScore))}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            {studentCourses.length === 0 ? (
              <p className="text-slate-600">No courses enrolled yet.</p>
            ) : (
              <div className="space-y-3">
                {studentCourses.map((item) => (
                  <Link key={item.id} href={`/courses/${item.course.id}`} className="block border rounded-lg p-3 hover:bg-slate-50">
                    <div className="font-semibold">{item.course.title}</div>
                    <div className="text-sm text-slate-500">{item.course.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Exam Results</h2>
            {attempts.length === 0 ? (
              <p className="text-slate-600">No exam results yet.</p>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="border rounded-lg p-3">
                    <div className="font-semibold">Exam</div>
                    <div className="text-sm text-slate-500">Score: {attempt.score} • {attempt.percentage}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
