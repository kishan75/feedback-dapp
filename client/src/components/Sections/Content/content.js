import React from 'react';
import ProfessorBio from '../../ProfessorBio/professorBio';

export const SectionContent = (props) => {
  return (
    <div className="el" onClick={() => props.handleRenderOnClick(props.idx, true)}>
      <div className="el__overflow">
        <div className="el__inner">
          <div className="el__bg"></div>
          <div className="el__preview-cont">
            <h2 className="el__heading">{props.profName}</h2>
          </div>
          <div className="el__content">
            <div className="el__text">{props.profName}</div>
            <div className="el__close-btn" onClick={() => props.handleRenderOnClick(props.idx, false)}></div>
            {props.show && <ProfessorBio profDetails={props.profsDetails[props.profsEmails[props.idx]]} courses={props.courses[props.profsEmails[props.idx]]} />}
          </div>
        </div>
      </div>
      <div className="el__index">
        <div className="el__index-back">{props.profEmail}</div>
        <div className="el__index-front">
          <div className="el__index-overlay" data-index={props.profEmail}>{props.idx + 1}</div>
        </div>
      </div>
    </div>
  );
}


export const SectionContent2 = (props) => {
  return (
    <div className="el2" onClick={() => props.handleRenderOnClick(props.idx, true)}>
      <div className="el2__overflow">
        <div className="el2__inner">
          <div className="el2__bg"></div>
          <div className="el2__preview-cont2">
            <h2 className="el2__heading">{props.profName}</h2>
          </div>
          <div className="el2__content">
            <div className="el2__text">{props.profName}</div>
            <div className="el2__close-btn" onClick={() => props.handleRenderOnClick(props.idx, false)}></div>
            {props.show && <ProfessorBio profDetails={props.profsDetails[props.profsEmails[props.idx + props.n]]} courses={props.courses[props.profsEmails[props.idx + props.n]]} />}
          </div>
        </div>
      </div>
      <div className="el2__index">
        <div className="el2__index-back">{props.profEmail}</div>
        <div className="el2__index-front">
          <div className="el2__index-overlay" data-index={props.profEmail}>{props.idx + 1}</div>
        </div>
      </div>
    </div>
  );
}

