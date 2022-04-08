import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { SectionContent2 } from './Content/content';

import './sections2.scss';

const Sections = (props) => {
  // Local variables
  const on = 5 // Original n
  let n = 5  // Extra n
  let profNames = [];
  let profEmails = [];
  let initRenders = []

  n = Math.min(n, props.profsEmails.length - on);

  for (var i = on; i < on + n; i++) {
    profNames.push(props.profsDetails[props.profsEmails[i]].name);
    profEmails.push(props.profsDetails[props.profsEmails[i]].email);
    initRenders.push(false);
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
    if (n <= 0)
      return null;
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
          if ($cont)
            $cont.classList.remove('s2--el2-active');
          if (document.querySelector('.el.s--active'))
            document.querySelector('.el2.s2--active').classList.remove('s2--active');
        });
      });
    }, 1000)
    // eslint-disable-next-line
  }, [pathname, props.profsEmails]);

  if (n <= 0)
    return null;

  return (
    <div>
      <div className="cont2 s2--inactive">
        {/* <!-- cont inner start --> */}
        <div className="cont2__inner">
          {profEmails.map((_, idx) =>
            <SectionContent2 key={idx} idx={idx} show={renderSections} n={on}
              profName={profNames[idx]} profsDetails={props.profsDetails} courses={props.courses}
              profEmail={profEmails[idx]} handleRenderOnClick={handleRenderOnClick} profsEmails={props.profsEmails} />)
          }        </div>
        {/* <!-- cont inner end --> */}
      </div>
    </div>
  );
};

export default Sections;

