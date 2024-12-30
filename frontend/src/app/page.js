import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to Train Reservation System
      </h1>
      <div className="flex space-x-4">
        <Link
          href="/auth/signup"
          className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Signup
        </Link>
        <Link
          href="/auth/login"
          className="px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
