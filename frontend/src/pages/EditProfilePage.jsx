import React from 'react';
import EditProfileForm from '../components/EditProfileForm/EditForm';
import PageTitle from '../components/PageTitle/PageTitle';


export function EditProfilePage() {
  return (
    <div>
      <PageTitle title="Editar perfil" />
      <EditProfileForm/>
    </div>
  );
}