import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-center gap-3">
        <img src="/icon.svg" alt="PPE Compliance Monitor Logo" className="w-16 h-16 rounded-2xl shadow-lg" />
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">PPE Compliance Monitor</h1>
      </div>
      <LoginForm />
    </div>
  );
}
