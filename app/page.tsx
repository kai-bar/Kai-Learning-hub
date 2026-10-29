import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white">
        <div className="container flex justify-between items-center py-4">
          <div className="text-xl font-bold">Kai Learning Hub</div>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <form action="/api/auth/logout" method="POST">
                  <button className="bg-red-500 px-3 py-2 rounded">Logout</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">Learn online. Grow smarter.</h1>
            <p className="text-lg text-slate-600 mb-8">
              A full school platform where students learn, teachers manage courses, and admins track academic performance.
            </p>
            <div className="flex gap-4">
              <Link href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                Get Started
              </Link>
              <Link href="/login" className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold">
                Login
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">What&rsquo;s included</h2>
            <ul className="space-y-4 text-slate-700">
              <li>• Student and teacher login</li>
              <li>• Course creation and enrollment</li>
              <li>• Live class scheduling</li>
              <li>• Exams and instant results</li>
              <li>• Study percentage tracking</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
