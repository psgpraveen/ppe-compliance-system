import { ProfileForm } from '@/features/auth/components/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile & Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your personal details and change your security credentials</p>
      </div>

      <ProfileForm />
    </div>
  );
}
