import React from 'react';
import RegisterForm from '../components/RegisterForm';

export function RegisterFormPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <RegisterForm />
      </div>
    </div>
  );
}
