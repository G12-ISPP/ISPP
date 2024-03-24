import React from 'react';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import PageTitle from '../components/PageTitle/PageTitle';

export function RegisterFormPage() {
  return (
    <div>
      <PageTitle title="Registrarse" />
      <RegisterForm />
    </div>
  );
}
