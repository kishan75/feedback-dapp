import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import './sections2.scss';

const Sections = (props) => {
  // Local variables, to be deleted
  const n = 5
  const initRenders = new Array(n).fill(false);
  const professers = Array.from({ length: n }, (_, k) => `Professor ${k}`);
  const abouts = Array.from({ length: n }, (_, k) => `About ${k}`);

  // State variables, to also be deleted
  const [renderSections, setRenderSections] = useState(initRenders);

  let { pathname } = useLocation();

  const profAddresses = ['abcd', 'efgh', 'ijkl'] // dum dum
  const imgAddr = ['https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'] // dum dum

  // Handlers
  const handleRenderOnClick = (idx, bool) => {
    let renders = renderSections;
    renders[idx] = bool;
    setRenderSections(renders);
  }

  useEffect(() => {
    setTimeout(() => {
      var $cont = document.querySelector('.cont');
      var $elsArr = [].slice.call(document.querySelectorAll('.el'));
      var $closeBtnsArr = [].slice.call(document.querySelectorAll('.el__close-btn'));

      setTimeout(function () {
        $cont.classList.remove('s--inactive');
      }, 200);
      console.log($elsArr)
      $elsArr.forEach(function ($el) {
        $el.addEventListener('click', function () {
          if (this.classList.contains('s--active')) return;
          $cont.classList.add('s--el-active');
          this.classList.add('s--active');
        });
      });

      $closeBtnsArr.forEach(function ($btn) {
        $btn.addEventListener('click', function (e) {
          e.stopPropagation();
          $cont.classList.remove('s--el-active');
          document.querySelector('.el.s--active').classList.remove('s--active');
        });
      });
      console.log("Homepage Rerendering...")

      // let $bg_eles = document.getElementsByClassName('el__bg')
      // for (var i = 0; i < $bg_eles.length; i++) {
      //   $bg_eles[i].style.backgroundImage = `url(https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg)`
      // }

    }, 1000)
  }, [pathname]);


  const SectionContent = (props) => {
    return (
      <div className="el" onClick={() => handleRenderOnClick(props.key, true)}>
        <div className="el__overflow">
          <div className="el__inner">
            <div className="el__bg"></div>
            <div className="el__preview-cont">
              <h2 className="el__heading">{props.professer}</h2>
            </div>
            <div className="el__content">
              <div className="el__text">{props.professer}</div>
              <div className="el__close-btn" onClick={() => handleRenderOnClick(props.key, false)}></div>
              {/*renderSections[props.key] && <Gallery filter="leather"/>*/}
            </div>
          </div>
        </div>
        <div className="el__index">
          <div className="el__index-back">{props.about}</div>
          <div className="el__index-front">
            <div className="el__index-overlay" data-index={props.about}>{props.key + 1}</div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div className="cont s--inactive">
        {/* <!-- cont inner start --> */}
        <div className="cont__inner">
          {renderSections.map((_, idx) => <SectionContent key={idx} professer={professers[idx]} about={abouts[idx]} />)};
        </div>
        {/* <!-- cont inner end --> */}
      </div>
    </div>
  );
};

export default Sections;

