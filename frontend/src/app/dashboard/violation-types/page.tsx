'use client';

import { ViolationTypeList } from '@/features/violation-types/components/ViolationTypeList';

export default function ViolationTypesPage() {
  return (
    <div className="h-full bg-gray-50 flex flex-col py-4 sm:py-6 lg:py-8">
      <ViolationTypeList />
    </div>
  );
}
