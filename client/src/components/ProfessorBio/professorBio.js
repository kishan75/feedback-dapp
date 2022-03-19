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
  console.log(props.profDetails)
  const skills = props.profDetails.skillsUpvote;
  let rating = props.profDetails.rating;
  const skillKeys = skills ? Object.keys(skills) : [];
  let skillValues = skills ? Object.values(skills) : [];
  let showPieChart = false

  //skillValues = [2, 13, 0, 6, 10]; //dummy
  //rating = { preDecimal: '68' } //dummy

  skillValues = skillValues.map(Number);
  var maxSkill = Math.max.apply(Math, skillValues);
  var minSkill = Math.min.apply(Math, skillValues);

  if (maxSkill != 0) {
    showPieChart = true
    for (var i = 0; i < skillValues.length; i++)
      skillValues[i] = ((skillValues[i] - minSkill) / (maxSkill - minSkill)) * 5;
  }

  const years = props.courses ? Object.keys(props.courses) : [];

  return (
    <div className="secParent">
      <div className="profStats">
        <ul className="profStatsNumerical">
          {skills ? skillKeys.map((k, i) => (
            <li key={i}>
              {k} &nbsp; <StyledRating precision={0.5}
                value={skillValues[i]} readOnly
                icon={<ScienceIcon fontSize="inherit" />}
                emptyIcon={<ScienceBorderIcon fontSize="inherit" />} />
            </li>
          )) : null}
        </ul>

        {rating.preDecimal !== '0' ? <div className="profStatsRank">
          <p> Machine Rating </p>
          <PieChart
            data={[{ value: rating.preDecimal, color: 'red' }]}
            radius={14}
            totalValue={100}
            lineWidth={20}
            center={[50, 30]}
            label={({ dataEntry }) => dataEntry.value}
            labelStyle={{
              fontSize: '0.5rem',
              fontFamily: 'sans-serif',
              fill: 'red',
            }}
            labelPosition={0}
          />
        </div> : null}

        <div className="profStatsPie">
          {skills && showPieChart ? <PieChart lineWidth={60} paddingAngle={5} label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`} labelPosition={70}
            labelStyle={{ fill: 'white', }} data={[
              { title: skillKeys[0], value: skillValues[0], color: '#E38627' },
              { title: skillKeys[1], value: skillValues[1], color: '#C13C37' },
              { title: skillKeys[2], value: skillValues[2], color: '#6B2125' },
              { title: skillKeys[3], value: skillValues[3], color: '#6A2115' },
              { title: skillKeys[4], value: skillValues[4], color: '#6D2137' },
            ]}
          /> : null}
        </div>
      </div>

      {years.length > 0 ?
        [<h1> ACADEMIC YEARS </h1>,
        <div className="profYears">
          {years.map((y, i) => (
            <Link key={i} to={y.toString()}>
              <NavigationIcon size='large' sx={{ mr: 1 }} />
              {y}
            </Link>
          ))}
        </div>] : null}
    </div>
  )
}

export default ProfessorBio;