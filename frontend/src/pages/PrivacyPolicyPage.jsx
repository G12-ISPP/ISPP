import React from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import Text, { TEXT_TYPES } from "../components/Text/Text";
import PrivacyPolicy from '../components/PrivacyPolicy/PrivacyPolicy';

const PrivacyPolicyPage = () => {
  return (
    <div>
      <PageTitle title="Política de privacidad" />
      <PrivacyPolicy />
    </div>
  )
}

export default PrivacyPolicyPage;