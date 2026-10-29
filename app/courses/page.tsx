import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function enrollCourse(formData: FormData) {
  "use server";

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const courseId = String(formData.get("courseId") || "");
  if (!courseId) return;

  const existing = await prisma.enrollment.findUnique({
    where: {
      courseId_studentId: {
        courseId,
        studentId: user.id
      }
    }
  });

  if (!existing) {
    await prisma.enrollment.create({
      data: {
        courseId,
        studentId: user.id
      }
    });
  }

  redirect("/dashboard");
}

export default async function CoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const courses = await prisma.course.findMany({
    include: {
      lessons: true,
      enrollments: true
    }
  });

  const enrolledIds = new Set((await prisma.enrollment.findMany({ where: { studentId: user.id } })).map((e) => e.courseId));

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white">
        <div className="container flex justify-between py-4">
          <div className="text-xl font-bold">Courses</div>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-6">Available Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrolled = enrolledIds.has(course.id);

            return (
              <div key={course.id} className="bg-white rounded-xl p-6 shadow">
                <h2 className="text-2xl font-bold">{course.title}</h2>
                <p className="text-slate-600 mt-3">{course.description}</p>
                <div className="mt-4 text-sm text-slate-500">{course.lessons.length} lessons</div>

                <div className="mt-6 flex gap-3">
                  <Link href={`/courses/${course.id}`} className="bg-slate-800 text-white px-4 py-2 rounded">
                    View
                  </Link>

                  {!enrolled && (
                    <form action={enrollCourse}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <button className="bg-blue-600 text-white px-4 py-2 rounded">Enroll</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
