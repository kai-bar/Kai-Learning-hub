import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ResultsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const attempts = await prisma.examAttempt.findMany({
    where: { studentId: user.id },
    include: { exam: true }
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white">
        <div className="container flex justify-between py-4">
          <div className="text-xl font-bold">Results</div>
          <a href="/dashboard">Dashboard</a>
        </div>
      </nav>

      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-8">Your Results</h1>

        {attempts.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">No results yet.</div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{attempt.exam.title}</h2>
                  <span className="text-lg font-semibold">{attempt.percentage}%</span>
                </div>
                <p className="mt-2 text-slate-600">Score: {attempt.score} • Status: {attempt.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
