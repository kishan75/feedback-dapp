import React from 'react';
import Sections from '../../components/Sections/sections';
import Header from '../../components/Header/header';
import AdminBar from '../../components/AdminBar/adminBar';

const homePage = (props) => {
    const professerDatas = props.professerDatas;

    return (
        <div>
            <AdminBar />
            <Header mainState={props.mainState} />
            <section>
                <Sections />
                <Sections />
            </section>
        </div>
    );
};

export default homePage;