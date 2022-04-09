import React, { useState } from 'react';
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
  const [selected, setSelected] = useState(0);
  const email = props.profDetails.email
  const skills = props.profDetails.skillsUpvote;
  let rating = props.profDetails.rating;
  const skillKeys = skills ? Object.keys(skills) : [];
  let skillValues = skills ? Object.values(skills).map((val) => Number(val)) : [];

  console.log(props.profDetails)
  console.log(skills)
  console.log(skillValues)

  let showPieChart = false

  //skillValues = [2, 13, 0, 6, 10]; //dummy
  //rating = { preDecimal: '68' } //dummy

  var maxSkill = Math.max.apply(Math, skillValues);
  var minSkill = Math.min.apply(Math, skillValues);

  if (maxSkill !== 0 && maxSkill !== minSkill) {
    showPieChart = true
    for (var i = 0; i < skillValues.length; i++)
      skillValues[i] = ((skillValues[i] - minSkill) / (maxSkill - minSkill)) * 5;
  }

  const years = props.courses ? Object.keys(props.courses) : [];

  return (
    <div className="secParent">
      <div className="profStats">
        <ul className="profStatsNumerical">
          <h1> TOP SKILLS </h1>
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
          <h1> RATING </h1>
          <PieChart
            data={[{ value: rating.preDecimal, color: 'red' }]}
            radius={30}
            totalValue={100}
            lineWidth={20}
            center={[50, 25]}
            label={({ dataEntry }) => dataEntry.value}
            labelStyle={{
              fontSize: '1rem',
              fontFamily: 'sans-serif',
              fill: 'red',
            }}
            labelPosition={0}
          />
        </div> : null}

        <div className="profStatsPie">
          {skills && showPieChart ? [<h1 className='sr'> SKILLS RATIO </h1>,
          <PieChart lineWidth={60} label={({ dataEntry }) => (
            Math.round(dataEntry.percentage) !== 0 ? `${Math.round(dataEntry.percentage)} %` : '')}
            labelPosition={70}
            radius={45}
            segmentsShift={(index) => (index === selected ? 6 : 1)}
            segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
            center={[50, 42]}
            //viewBoxSize={[100, 100]}
            labelStyle={{ fill: 'white', }}
            onClick={(_, index) => {
              setSelected(index === selected ? undefined : index);
            }}
            data={[
              { title: skillKeys[0], value: skillValues[0], color: '#E38627' },
              { title: skillKeys[1], value: skillValues[1], color: '#C13C37' },
              { title: skillKeys[2], value: skillValues[2], color: '#6B2125' },
              { title: skillKeys[3], value: skillValues[3], color: '#6A2115' },
              { title: skillKeys[4], value: skillValues[4], color: '#6D2137' },
            ]}
          />] : null}
        </div>
      </div>

      {years.length > 0 ?
        [<h1> ACADEMIC YEARS </h1>,
        <div className="profYears">
          {years.map((y, i) => (
            <Link key={i} to={`${email}/${y}`}>
              <NavigationIcon size='large' sx={{ mr: 1 }} />
              {y}
            </Link>
          ))}
        </div>] : <p style={{ color: 'gray' }}> Courses yet to be assigned... </p>}
    </div>
  )
}

export default ProfessorBio;