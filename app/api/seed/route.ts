import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const teacherPassword = await bcrypt.hash("teacher123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      name: "School Admin",
      email: "admin@school.com",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  await prisma.adminProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id }
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@school.com" },
    update: {},
    create: {
      name: "Demo Teacher",
      email: "teacher@school.com",
      passwordHash: teacherPassword,
      role: "TEACHER"
    }
  });

  const teacherProfile = await prisma.teacherProfile.upsert({
    where: { userId: teacher.id },
    update: {},
    create: {
      userId: teacher.id,
      qualification: "BSc Education",
      department: "Mathematics",
      bio: "Senior teacher"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@school.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@school.com",
      passwordHash: studentPassword,
      role: "STUDENT"
    }
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: { userId: student.id, className: "Grade 10" }
  });

  const course = await prisma.course.upsert({
    where: { id: "demo-course-1" },
    update: {},
    create: {
      id: "demo-course-1",
      title: "Introduction to Biology",
      description: "Learn the basic principles of biology and life science.",
      teacherId: teacherProfile.id
    }
  });

  await prisma.lesson.upsert({
    where: { id: "lesson-1" },
    update: {},
    create: {
      id: "lesson-1",
      title: "Cells Overview",
      content: "Cells are the basic units of life.",
      courseId: course.id
    }
  });

  const exam = await prisma.exam.upsert({
    where: { id: "exam-1" },
    update: {},
    create: {
      id: "exam-1",
      title: "Biology Quiz",
      courseId: course.id,
      teacherId: teacherProfile.id,
      durationMins: 20,
      totalMarks: 10
    }
  });

  const question = await prisma.question.findFirst({ where: { examId: exam.id } });
  if (!question) {
    await prisma.question.create({
      data: {
        examId: exam.id,
        text: "What is the basic unit of life?",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify(["Cell", "Atom", "Molecule", "Organ"]),
        correctAnswer: "Cell"
      }
    });
  }

  return NextResponse.json({ message: "Seeded demo users and content successfully." });
}
