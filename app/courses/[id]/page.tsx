import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      lessons: true,
      exams: true
    }
  });

  if (!course) redirect("/courses");

  const enrolled = await prisma.enrollment.findUnique({
    where: {
      courseId_studentId: {
        courseId: course.id,
        studentId: user.id
      }
    }
  });

  if (!enrolled && user.role !== "ADMIN" && user.role !== "TEACHER") {
    redirect("/courses");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white">
        <div className="container flex justify-between py-4">
          <div className="text-xl font-bold">Course Details</div>
          <Link href="/courses">Back</Link>
        </div>
      </nav>

      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-slate-600 mb-8">{course.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Lessons</h2>
            <div className="space-y-4">
              {course.lessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4">
                  <h3 className="font-bold">{lesson.title}</h3>
                  <p className="text-slate-600 mt-2 whitespace-pre-wrap">{lesson.content}</p>
                  {lesson.videoUrl && (
                    <a href={lesson.videoUrl} target="_blank" className="text-blue-600 mt-2 inline-block">
                      Watch Video
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Exams</h2>
            <div className="space-y-4">
              {course.exams.length === 0 ? (
                <p className="text-slate-600">No exams available yet.</p>
              ) : (
                course.exams.map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-4">
                    <div className="font-bold">{exam.title}</div>
                    <div className="text-sm text-slate-500 mt-2">
                      {exam.durationMins} mins • {exam.totalMarks} marks
                    </div>
                    <Link href={`/exams/${exam.id}`} className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded">
                      Start Exam
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
