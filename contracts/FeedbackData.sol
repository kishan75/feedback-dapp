// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./utils.sol";


contract FeedbackData {

    string[] facultySkills = ["Diversity","Communication","Procedures","Philosophy","StudentLearning"];
    DateTime public dateTime;

    constructor(){

    }
    
    enum Semester {EVEN,ODD}

    struct Feedback{
        string content;
        string[] goodSklls;
    }

    struct Float{
        uint256 preDecimal;
        uint256 postDecimal;
    }

    struct Course{
        string name;
        string code;
        Semester semester;
        uint256 studentCount;
        bool ticketGenerated;
        bytes32[] tickets;
        Feedback[] feedbacks;
    }

    struct SkillsUpvoteCount{
        string name;
        uint count;
    }

    struct YearWiseCourse{
        uint year;
        Course[] courses;
    }

    struct Professor{
        string name;
        string email;
        address addressId;
        Float rating;
        SkillsUpvoteCount[] skillsUpvoteCount; 
        YearWiseCourse[] yearWiseCourse;
    }

    string[] public professorEmails;
    mapping(string=>Professor) public professors;
    string blankString = "";

    event professorCreated(Professor professor);
    event courseUpdated(uint year,Course course);
    
    function createProfessor(string memory name, string memory email) public  {
        require(
          bytes(name).length > 0,
          "Name can not be blank during professor creation"
        );
        require(
          bytes(email).length > 0,
          "Email can not be blank during professor creation"
        );
        require(msg.sender != address(0 * 0), "user address should exist");

        Professor memory professor = professors[email];
        professor.addressId = msg.sender;
        professor.name = name;
        professor.email = email;
        professor.rating.postDecimal = 0;
        professor.rating.preDecimal = 0;

        professorEmails.push(professor.email);

        emit professorCreated(professor);
    }

    function getProfessorIds() public view returns (string[] memory) {
        return professorEmails;
    }

    function getProfessorsByIds(string[] memory ids) public view returns (Professor[] memory) {
        Professor[] memory professorList = new Professor[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
          professorList[i] = professors[ids[i]];
        }
        return professorList;
    }

    function addCourse(uint _year,string memory _professorEmail,string memory _name,string memory _code,Semester _semester,uint256 _studentCount) public {
        bytes32[] memory _tickets;
        Feedback[] memory _feedbacks;
        // uint _year = dateTime.getYear(block.timestamp);
        YearWiseCourse[] memory _yearWiseCourse = professors[_professorEmail].yearWiseCourse;
        
        Course memory _course = Course({
            name:_name,
            code:_code,
            semester:_semester,
            studentCount:_studentCount,
            ticketGenerated:false,
            tickets:_tickets,
            feedbacks:_feedbacks
        });

        uint256 i = 0;

        for (; i < _yearWiseCourse.length; i++) {
            if(_yearWiseCourse[i].year == _year){
                break;
            }
        }

        if (i!=_yearWiseCourse.length) {
            _yearWiseCourse[i].courses[_yearWiseCourse[i].courses.length-1] =_course;
        } else {
            Course[] memory _courses;
            _courses[0]=_course;

            _yearWiseCourse[i]=YearWiseCourse({
                year:_year,
                courses: _courses
            });
        }
    }
    
    
}