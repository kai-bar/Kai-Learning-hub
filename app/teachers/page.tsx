import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TeachersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const teachers = await prisma.teacherProfile.findMany({ include: { user: true } });

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">Teachers</h1>

        <div className="space-y-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-2xl font-bold">{teacher.user.name}</h2>
              <p className="text-slate-600">{teacher.department}</p>
              <p className="mt-2">{teacher.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
