import React from 'react';
import ComingSoon from '../../../shared/components/ComingSoon';

const DoctorComingSoon: React.FC = () => {
  return (
    <ComingSoon
      title="Doctor Feature Coming Soon"
      description="This specific doctor feature is currently under development. The basic doctor portal with dashboard is available, and we're continuously adding more advanced features like patient management, AI diagnosis tools, and earnings analytics."
      phase="Phase 2 Development"
    />
  );
};

export default DoctorComingSoon;