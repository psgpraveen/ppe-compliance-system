import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import Link from 'next/link';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token as string;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 tracking-tight">PPE Compliance Monitor</h1>
      </div>
      
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
          <p className="text-gray-600 mb-6">
            The password reset link is invalid or missing the reset token. Please request a new password reset link.
          </p>
          <Link href="/forgot-password" className="text-blue-600 font-medium hover:underline">
            Request new reset link
          </Link>
        </div>
      )}
    </div>
  );
}
