// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./utils.sol";

contract FeedbackData {

    string[] public facultySkills = ["Diversity","Communication","Procedures","Philosophy","StudentLearning"];
    DateTime public dateTime;
    
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
        uint semester;      // 0 for even and 1 for odd
        uint256 studentCount;
        bool ticketGenerated;
        bytes32[] tickets;
    }

    struct SkillsUpvoteCount{
        string name;
        uint count;
    }

    struct Professor{
        string name;
        string email;
        address addressId;
        Float rating;
    }

    struct ProfessorCredsKey{
        string[] professorYearsCourses;
        string[] professorCourseFeedback;
    }

    string[] public professorEmails;
    
    mapping(string=>Professor) public professorDetail;
    mapping(string=>uint256) public professorSkillsUpvote; // email+skill
    
    //TODO change formate of prof skill upvotes
    
    mapping(string=>Course[]) public professorYearsCourses;  // email+year+sem
    mapping(string=>Feedback[]) public professorCourseFeedback;  // email+year+sem+course_code
   
    mapping(string=>ProfessorCredsKey) private profCredKeys;
    mapping(bytes32=>bool) public keysForProfReg;  

    uint256 private counterForProfReg ;

    constructor () {
        counterForProfReg = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }

    event professorCreated(Professor professor);
    event courseUpdated(string email,uint year,Course course);
    event tokenGenerated(bytes32 token);
    event ticketGenerated(string email,uint year,uint sem,string code,bytes32[] tickets);

    function generateTokenForProfReg() public 
    {
        counterForProfReg++;
        bytes32 id = keccak256(abi.encodePacked(block.timestamp, counterForProfReg));
        keysForProfReg[id]=true;
        emit tokenGenerated(id);
    }

    function getFacultySkills() public view returns(string[] memory)
    {
        return facultySkills;
    }
    
    function createProfessor(string calldata name, string calldata email,bytes32 secret) public  {
        require(
          bytes(name).length > 0,
          "Name can not be blank during professor creation"
        );
        require(
          bytes(email).length > 0,
          "Email can not be blank during professor creation"
        );
        require(msg.sender != address(0 * 0), "user address should exist");
        require(keysForProfReg[secret]==true, "provide valid secret");

        professorDetail[email] = Professor({
            name:name,
            email:email,
            addressId:msg.sender,
            rating: Float(0,0)
        });

        professorEmails.push(email);

        keysForProfReg[secret] = false;

        emit professorCreated(professorDetail[email]);
    }

    function getProfessorIds() public view returns (string[] memory) {
        return professorEmails;
    }

    function getProfessorsDetailsByIds(string[] calldata ids) public view returns (Professor[] memory) {
        Professor[] memory _professorList = new Professor[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
          _professorList[i] = professorDetail[ids[i]];
        }

        return _professorList;
    }

    function getProfesssorAllDetails(string calldata email) public view returns(SkillsUpvoteCount[] memory,Course[][] memory,Feedback[][] memory) 
    {
        Course[][] memory _courses = new Course[][](profCredKeys[email].professorYearsCourses.length);
        for (uint256 i = 0; i < profCredKeys[email].professorYearsCourses.length; i++) {
            _courses[i]=professorYearsCourses[profCredKeys[email].professorYearsCourses[i]];
        }

        Feedback[][] memory _feedbacks = new Feedback[][](profCredKeys[email].professorCourseFeedback.length);
        for (uint256 i = 0; i < profCredKeys[email].professorCourseFeedback.length; i++) {
            _feedbacks[i]=professorCourseFeedback[profCredKeys[email].professorCourseFeedback[i]];
        }

        SkillsUpvoteCount[] memory skillUpvotes = new SkillsUpvoteCount[](facultySkills.length);
        for (uint256 i = 0; i < facultySkills.length; i++) {
            string memory key = string(abi.encodePacked(email,facultySkills[i]));
            skillUpvotes[i] = SkillsUpvoteCount({
                name:facultySkills[i],
                count:professorSkillsUpvote[key]
            });
        }

        return (skillUpvotes,_courses,_feedbacks);
    }

    function addCourse(uint _year,string calldata _email,string calldata _name,string calldata _code,uint _sem,uint256 _studentCount) public {
        // uint _year = dateTime.getYear(block.timestamp);

        Course memory _course = Course(
            {
                name : _name,
                code : _code,
                semester : _sem,
                studentCount : _studentCount, 
                ticketGenerated : false,
                tickets : new bytes32[](0)
            }
        );   

        string memory _key = string(abi.encodePacked(_email,",", _year,",",_sem));
        updateProfessorYearsCoursesKey(_email,_key);
        updateProfessorCourseFeedback(_email, _year, _sem, _code);

        professorYearsCourses[_key].push(_course);    
        emit courseUpdated(_email, _year, professorYearsCourses[_key][professorYearsCourses[_key].length-1]);
    }  

    function updateProfessorYearsCoursesKey(string calldata email,string memory _key) private 
    {
       if(professorYearsCourses[email].length==0)
       {
           profCredKeys[email].professorYearsCourses.push(_key);
       }
    }

    function updateProfessorCourseFeedback(string calldata _email, uint256 _year, uint _sem, string calldata _code) private
    {
        string memory _key = string(abi.encodePacked(_email,",", _year,",",_sem,",",_code));
        profCredKeys[_email].professorCourseFeedback.push(_key);
    }

    function generateTickets(string calldata _email,uint _year,uint _sem,string calldata _code,string calldata _seed) public
    {
        uint pos = 0;
        string memory key = string(abi.encodePacked(_email,",", _year,",",_sem));
        for (uint256 i = 0; i < professorYearsCourses[key].length; i++) {
            if(compareStrings(professorYearsCourses[key][i].code,_code))
            {
                pos = i+1;
            }
        }

        require(pos!=0,"wrong credentials, course not found");
        pos--;
        require(pos!=professorYearsCourses[key].length,"wrong credentials, course not found");
        require(professorYearsCourses[key][pos].ticketGenerated==false,"tickets are already generated");

        professorYearsCourses[key][pos].ticketGenerated=true;

        for (uint256 i = 0; i < professorYearsCourses[key][pos].studentCount; i++) {
            bytes32 ticket = keccak256(abi.encodePacked(block.timestamp, _seed,counterForProfReg,block.difficulty));
            counterForProfReg++;
            professorYearsCourses[key][pos].tickets.push(ticket);
        }

        emit ticketGenerated(_email, _year, _sem, _code, professorYearsCourses[key][pos].tickets);
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) 
    {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
}