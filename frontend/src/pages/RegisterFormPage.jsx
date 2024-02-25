import React from 'react';
import RegisterForm from '../components/RegisterForm';

export function RegisterFormPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h1>Registro de usuario</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
