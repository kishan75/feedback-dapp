import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import './sections.scss';

const Sections = (props) => {
  // Local variables, to be deleted
  const n = 5
  const initRenders = new Array(n).fill(false);
  const professers = Array.from({ length: n }, (_, k) => `Professor ${k}`);
  const abouts = Array.from({ length: n }, (_, k) => `About ${k}`);

  // State variables, to also be deleted
  const [renderSections, setRenderSections] = useState(initRenders);

  let { pathname } = useLocation();


  // Handlers
  const handleRenderOnClick = (idx, bool) => {
    let renders = renderSections;
    renders[idx] = bool;
    setRenderSections(renders);
  }

  useEffect(() => {
    setTimeout(() => {
      var $cont = document.querySelector('.cont2');
      var $elsArr = [].slice.call(document.querySelectorAll('.el2'));
      var $closeBtnsArr = [].slice.call(document.querySelectorAll('.el2__close-btn'));

      setTimeout(function () {
        $cont.classList.remove('s2--inactive');
      }, 200);
      $elsArr.forEach(function ($el) {
        $el.addEventListener('click', function () {
          if (this.classList.contains('s2--active')) return;
          $cont.classList.add('s2--el2-active');
          this.classList.add('s2--active');
        });
      });

      $closeBtnsArr.forEach(function ($btn) {
        $btn.addEventListener('click', function (e) {
          e.stopPropagation();
          $cont.classList.remove('s2--el2-active');
          document.querySelector('.el2.s2--active').classList.remove('s2--active');
        });
      });
    }, 1000)
  }, [pathname]);


  const SectionContent = (props) => {
    return (
      <div className="el2" onClick={() => handleRenderOnClick(props.idx, true)}>
        <div className="el2__overflow">
          <div className="el2__inner">
            <div className="el2__bg"></div>
            <div className="el2__preview-cont2">
              <h2 className="el2__heading">{props.professer}</h2>
            </div>
            <div className="el2__content">
              <div className="el2__text">{props.professer}</div>
              <div className="el2__close-btn" onClick={() => handleRenderOnClick(props.idx, false)}></div>
              {/*renderSections[props.idx] && <Gallery filter="leather"/>*/}
            </div>
          </div>
        </div>
        <div className="el2__index">
          <div className="el2__index-back">{props.about}</div>
          <div className="el2__index-front">
            <div className="el2__index-overlay" data-index={props.about}>{props.idx + 1}</div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div className="cont2 s2--inactive">
        {/* <!-- cont inner start --> */}
        <div className="cont2__inner">
          {renderSections.map((_, idx) => <SectionContent key={idx} idx={idx} professer={professers[idx]} about={abouts[idx]} />)};
        </div>
        {/* <!-- cont inner end --> */}
      </div>
    </div>
  );
};

export default Sections;

