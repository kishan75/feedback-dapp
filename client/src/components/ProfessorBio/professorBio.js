import React from 'react';
import { styled } from '@mui/material/styles';
import { PieChart } from 'react-minimal-pie-chart';
import Rating from '@mui/material/Rating';
import ScienceIcon from '@mui/icons-material/Science';
import ScienceBorderIcon from '@mui/icons-material/ScienceOutlined';
import NavigationIcon from '@mui/icons-material/Navigation';

import './professorBio.scss';
import { Link } from 'react-router-dom';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ee2a35',
  },
  '& .MuiRating-iconEmpty': {
    color: '#ff3d47',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

const ProfessorBio = (props) => {
  const skills = props.profDetails.skillsUpvote;
  console.log(props.profDetails)
  const skillKeys = skills ? Object.keys(skills) : [];
  const years = [2019, 2010, 2011];

  return (
    <div className="secParent">
      <div className="profStats">
        <ul className="profStatsNumerical">
          {skills ? skillKeys.map((k, i) => (
            <li key={i}>
              {k} &nbsp; <StyledRating
                value={skills[k] + 4} readOnly
                icon={<ScienceIcon fontSize="inherit" />}
                emptyIcon={<ScienceBorderIcon fontSize="inherit" />} />
            </li>
          )) : null}
        </ul>
        <div className="profStatsPie">
          {skills ? <PieChart lineWidth={60} paddingAngle={5} label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`} labelPosition={70}
            data={[
              { title: skillKeys[0], value: 3, color: '#E38627' },
              { title: skillKeys[1], value: 4, color: '#C13C37' },
              { title: skillKeys[2], value: 5, color: '#6B2125' },
              { title: skillKeys[3], value: 6, color: '#6A2115' },
              { title: skillKeys[4], value: 2, color: '#6D2137' },
            ]}
          /> : null}
        </div>
      </div>

      <div className="profYears">
        {years.map((y, i) => (
          <Link key={i} to={y}>
            <NavigationIcon size='large' sx={{ mr: 1 }} />
            {y}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProfessorBio;