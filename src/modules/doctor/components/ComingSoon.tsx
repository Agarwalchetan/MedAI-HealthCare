import React from 'react';
import ComingSoon from '../../../shared/components/ComingSoon';

const DoctorComingSoon: React.FC = () => {
  return (
    <ComingSoon
      title="Doctor Portal Coming Soon"
      description="We're building a comprehensive doctor interface with patient management, appointment scheduling, telemedicine capabilities, and advanced diagnostic tools. This module will revolutionize how healthcare providers interact with patients and manage their practice."
      phase="Phase 2 Development"
    />
  );
};

export default DoctorComingSoon;