'use client';

import { IoTSimulatorPage } from '@/features/iot-simulator/components/IoTSimulatorPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <IoTSimulatorPage />
    </ProtectedRoute>
  );
}
