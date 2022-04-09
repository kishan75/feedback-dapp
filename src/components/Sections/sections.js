import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { SectionContent } from './Content/content';

import './sections.scss';

const Sections = (props) => {
  // Local variables
  let n = 5  // Professors per sections
  let profNames = [];
  let profEmails = [];

  n = Math.min(n, props.profsEmails.length);
  const initRenders = new Array(n).fill(false);
  for (var i = 0; i < n; i++) {
    profNames.push(props.profsDetails[props.profsEmails[i]].name);
    profEmails.push(props.profsDetails[props.profsEmails[i]].email);
  }

  // State variables
  const [renderSections, setRenderSections] = useState(initRenders);

  let { pathname } = useLocation();

  // Handlers
  const handleRenderOnClick = (idx, bool) => {
    let renders = new Array(n).fill(false);
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
          if ($cont)
            $cont.classList.remove('s--el-active');
          if (document.querySelector('.el.s--active'))
            document.querySelector('.el.s--active').classList.remove('s--active');
        });
      });
      console.log("Homepage Rerendering...")
    }, 1000)
    // eslint-disable-next-line
  }, [pathname, props.profsEmails]);


  return (
    <div>
      <div className="cont s--inactive">
        {/* <!-- cont inner start --> */}
        <div className="cont__inner">
          {profEmails.map((_, idx) =>
            <SectionContent key={idx} idx={idx} show={renderSections[idx]}
              profName={profNames[idx]} profsDetails={props.profsDetails} courses={props.courses}
              profEmail={profEmails[idx]} handleRenderOnClick={handleRenderOnClick} profsEmails={props.profsEmails} />)
          }
        </div>
        {/* <!-- cont inner end --> */}
      </div>
    </div>
  );
};

export default Sections;

