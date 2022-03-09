import React from 'react';
import Sections from '../../components/Sections/sections';
import Header from '../../components/Header/header';

const homePage = (props) => {
    const professerDatas = props.professerDatas;

    return ( 
        <div>
            <Header />
            <section>
                <Sections />
                <Sections />
            </section>
        </div>
    );
};

export default homePage;