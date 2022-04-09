import React from 'react';
import Sections from '../../components/Sections/sections';
import Sections2 from '../../components/Sections/sections2';
import Header from '../../components/Header/header';
import AdminBar from '../../components/AdminBar/adminBar';

const homePage = (props) => {

  return (
    <div>
      <AdminBar {...props} />
      <Header {...props} />
      <section>
        {props.profsEmails && props.profsDetails && props.courses ? < Sections {...props} /> : null}
        {props.profsEmails && props.profsDetails && props.courses ? < Sections2 {...props} /> : null}
      </section>
    </div>
  );
};

export default homePage;