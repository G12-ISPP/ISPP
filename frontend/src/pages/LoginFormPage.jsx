import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import PageTitle from '../components/PageTitle/PageTitle';

export function LoginFormPage() {
  return (
    <div>
      <PageTitle title="Iniciar sesión" />
      <LoginForm />
    </div>
  );
}
