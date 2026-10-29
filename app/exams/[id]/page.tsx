import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function submitExam(formData: FormData) {
  "use server";

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const examId = String(formData.get("examId") || "");
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true }
  });

  if (!exam) redirect("/courses");

  let score = 0;

  for (const question of exam.questions) {
    const answer = String(formData.get(`question_${question.id}`) || "");
    if (!answer) continue;

    if (question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") {
      if (answer === question.correctAnswer) score++;
    } else {
      if (answer.trim().toLowerCase() === (question.correctAnswer || "").trim().toLowerCase()) {
        score++;
      }
    }
  }

  const percentage = exam.questions.length ? (score / exam.questions.length) * 100 : 0;

  await prisma.examAttempt.create({
    data: {
      studentId: user.id,
      examId: exam.id,
      score,
      percentage,
      status: "SUBMITTED"
    }
  });

  redirect("/results");
}

export default async function ExamPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: { questions: true }
  });

  if (!exam) redirect("/courses");

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="container py-10">
        <div className="bg-white rounded-xl p-8 shadow">
          <h1 className="text-4xl font-bold mb-2">{exam.title}</h1>
          <p className="text-slate-600 mb-6">Duration: {exam.durationMins} mins • Total marks: {exam.totalMarks}</p>

          <form action={submitExam} className="space-y-6">
            <input type="hidden" name="examId" value={exam.id} />

            {exam.questions.map((question, index) => {
              const options = question.options ? JSON.parse(question.options) : [];

              return (
                <div key={question.id} className="border rounded-lg p-5">
                  <h3 className="font-bold mb-3">
                    {index + 1}. {question.text}
                  </h3>

                  {question.type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-2">
                      {options.map((option: string, optionIndex: number) => (
                        <label key={optionIndex} className="flex items-center gap-3">
                          <input type="radio" name={`question_${question.id}`} value={option} required />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <div className="space-y-2">
                      {["True", "False"].map((option) => (
                        <label key={option} className="flex items-center gap-3">
                          <input type="radio" name={`question_${question.id}`} value={option} required />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "SHORT_ANSWER" && (
                    <textarea
                      name={`question_${question.id}`}
                      className="w-full border rounded p-3"
                      rows={4}
                      placeholder="Enter your answer"
                      required
                    />
                  )}
                </div>
              );
            })}

            <button className="bg-blue-600 text-white px-6 py-3 rounded font-semibold">Submit Exam</button>
          </form>
        </div>
      </div>
    </main>
  );
}
