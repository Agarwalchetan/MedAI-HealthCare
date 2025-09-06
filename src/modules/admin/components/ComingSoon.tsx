import React from 'react';
import ComingSoon from '../../../shared/components/ComingSoon';

const AdminComingSoon: React.FC = () => {
  return (
    <ComingSoon
      title="Admin Feature Coming Soon"
      description="This specific admin feature is currently under development. The main admin portal with dashboard, user management, and doctor approvals is available. Additional features like lab and insurance management are being added in future phases."
      phase="Phase 5 Development - Partial Implementation"
    />
  );
};

export default AdminComingSoon;