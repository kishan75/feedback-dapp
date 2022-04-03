// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./Utils.sol";
import "./BHUToken.sol";

contract FeedbackData {
    string[] public facultySkills = [
        "Diversity",
        "Communication",
        "Procedures",
        "Philosophy",
        "StudentLearning"
    ];
    Utils public util;

    struct Feedback {
        string code;
        uint256 semester; // 0 for even and 1 for odd
        uint256 year;
        string content;
        string[] skills;
    }

    struct Float {
        uint256 preDecimal;
        uint256 postDecimal;
    }

    struct Course {
        string name;
        string code;
        uint256 semester; // 0 for even and 1 for odd
        uint256 year;
        uint256 studentCount;
        bool ticketGenerated;
        bytes32[] tickets;
    }

    struct SkillsUpvoteCount {
        string name;
        uint256 count;
    }

    struct Professor {
        string name;
        string email;
        string profilePicture;
        address addressId;
        Float rating;
    }

    struct ProfessorCreds_Key {
        bytes32[] courses;
        bytes32[] feedbacks;
    }

    string[] public emails;

    mapping(string => Professor) public professorDetail;
    mapping(bytes32 => uint256) public skillsCount; // email+skill

    //TODO change formate of prof skill upvotes

    mapping(bytes32 => Course[]) public courses; // email+year+sem
    mapping(bytes32 => Feedback[]) public feedbacks; // email+year+sem+course_code

    mapping(string => ProfessorCreds_Key) private profCred_Keys;
    mapping(bytes32 => bool) public _keysForProfReg;

    uint256 private counterForProfReg;
    bytes32 private adminPassword;
    BHUToken private bhuToken;
    uint256 public earlyFeedbackCost = 5e18;
    uint256 public lateFeedbackCost = 3e18;

    constructor(string memory adminKey, address _bhuToken) {
        counterForProfReg = uint256(
            keccak256(abi.encodePacked(block.difficulty, block.timestamp))
        );
        adminPassword = keccak256(abi.encodePacked(adminKey));
        bhuToken = BHUToken(_bhuToken);
    }

    event professorCreated(Professor professor);
    event courseUpdated(string email, uint256 year, Course course);
    event tokenGenerated(bytes32 token);
    event ticketGenerated(
        string email,
        uint256 year,
        uint256 sem,
        string code,
        bytes32[] tickets
    );
    event feedbackSubmitted(string email, Feedback feedback);
    event skillsUpvoted(string email, SkillsUpvoteCount[] skills);
    event ratingUpdated(string email, Float rating);
    event balanceUpdated(address account, uint256 balance);
    event passwordUpdated(bool success);

    function generateTokenForProfReg(string memory adminKey) public {
        require(
            keccak256(abi.encodePacked(adminKey)) == adminPassword,
            "invalid password"
        );
        counterForProfReg++;
        bytes32 id = keccak256(
            abi.encodePacked(block.timestamp, counterForProfReg)
        );
        _keysForProfReg[id] = true;
        emit tokenGenerated(id);
    }

    function checkBalance(address _address) public view returns (uint256) {
        return bhuToken.balanceOf(_address);
    }

    function updatePassword(
        string calldata oldPassword,
        string calldata newPassword
    ) public {
        require(
            keccak256(abi.encodePacked(oldPassword)) == adminPassword,
            "invalid old password"
        );
        adminPassword = keccak256(abi.encodePacked(newPassword));
        emit passwordUpdated(true);
    }

    function getFacultySkills() public view returns (string[] memory) {
        return facultySkills;
    }

    function createProfessor(
        string calldata name,
        string calldata email,
        string calldata profilePicture,
        bytes32 secret
    ) public {
        require(
            bytes(name).length > 0,
            "Name can not be blank during professor creation"
        );
        require(
            bytes(email).length > 0,
            "Email can not be blank during professor creation"
        );
        require(msg.sender != address(0 * 0), "user address should exist");
        require(_keysForProfReg[secret] == true, "provide valid secret");

        professorDetail[email] = Professor({
            name: name,
            email: email,
            addressId: msg.sender,
            profilePicture: profilePicture,
            rating: Float(0, 0)
        });

        emails.push(email);

        _keysForProfReg[secret] = false;

        emit professorCreated(professorDetail[email]);
    }

    function getProfessorIds() public view returns (string[] memory) {
        return emails;
    }

    function getProfessorsDetailsByIds(string[] calldata ids)
        public
        view
        returns (Professor[] memory)
    {
        Professor[] memory _professorList = new Professor[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            _professorList[i] = professorDetail[ids[i]];
        }

        return _professorList;
    }

    function getFeedbacks(string calldata _email)
        public
        view
        returns (Feedback[][] memory)
    {
        Feedback[][] memory _feedbacks = new Feedback[][](
            profCred_Keys[_email].feedbacks.length
        );
        for (uint256 i = 0; i < profCred_Keys[_email].feedbacks.length; i++) {
            _feedbacks[i] = feedbacks[profCred_Keys[_email].feedbacks[i]];
        }
        return _feedbacks;
    }

    function getFeedbacksByEmails(string[] calldata _emails)
        public
        view
        returns (Feedback[][][] memory)
    {
        Feedback[][][] memory _feedbacks = new Feedback[][][](_emails.length);
        for (uint256 i = 0; i < _emails.length; i++) {
            _feedbacks[i] = getFeedbacks(_emails[i]);
        }
        return _feedbacks;
    }

    function getCourses(string calldata _email)
        public
        view
        returns (Course[][] memory)
    {
        Course[][] memory _courses = new Course[][](
            profCred_Keys[_email].courses.length
        );
        for (uint256 i = 0; i < profCred_Keys[_email].courses.length; i++) {
            _courses[i] = courses[profCred_Keys[_email].courses[i]];
        }

        return _courses;
    }

    function getCoursesByEmails(string[] calldata _emails)
        public
        view
        returns (Course[][][] memory)
    {
        Course[][][] memory _courses = new Course[][][](_emails.length);
        for (uint256 i = 0; i < _emails.length; i++) {
            _courses[i] = getCourses(_emails[i]);
        }
        return _courses;
    }

    function getSkillsUpvote(string calldata _email)
        public
        view
        returns (SkillsUpvoteCount[] memory)
    {
        SkillsUpvoteCount[] memory skillUpvotes = new SkillsUpvoteCount[](
            facultySkills.length
        );
        for (uint256 i = 0; i < facultySkills.length; i++) {
            bytes32 _key = keccak256(
                abi.encodePacked(_email, ",", facultySkills[i])
            );
            skillUpvotes[i] = SkillsUpvoteCount({
                name: facultySkills[i],
                count: skillsCount[_key]
            });
        }

        return skillUpvotes;
    }

    function getSkillsUpvotesByEmails(string[] calldata _emails)
        public
        view
        returns (SkillsUpvoteCount[][] memory)
    {
        SkillsUpvoteCount[][] memory skillUpvotes = new SkillsUpvoteCount[][](
            _emails.length
        );
        for (uint256 i = 0; i < _emails.length; i++) {
            skillUpvotes[i] = getSkillsUpvote(_emails[i]);
        }
        return skillUpvotes;
    }

    function addCourse(
        uint256 _year,
        string calldata _email,
        string calldata _name,
        string calldata _code,
        uint256 _sem,
        uint256 _studentCount
    ) public {
        // uint _year = util.getYear(block.timestamp);

        Course memory _course = Course({
            name: _name,
            code: _code,
            year: _year,
            semester: _sem,
            studentCount: _studentCount,
            ticketGenerated: false,
            tickets: new bytes32[](0)
        });

        bytes32 __key = keccak256(
            abi.encodePacked(_email, ",", _year, ",", _sem)
        );

        addCourseKey(_email, __key);
        addfeedbackKey(_email, _year, _sem, _code);

        courses[__key].push(_course);
        emit courseUpdated(
            _email,
            _year,
            courses[__key][courses[__key].length - 1]
        );
    }

    function addCourseKey(string calldata email, bytes32 __key) private {
        if (courses[__key].length == 0) {
            profCred_Keys[email].courses.push(__key);
        }
    }

    function addfeedbackKey(
        string calldata _email,
        uint256 _year,
        uint256 _sem,
        string calldata _code
    ) private {
        bytes32 __key = keccak256(
            abi.encodePacked(_email, ",", _year, ",", _sem, ",", _code)
        );
        profCred_Keys[_email].feedbacks.push(__key);
    }

    event test(bool);

    function generateTickets(
        string memory _email,
        uint256 _year,
        uint256 _sem,
        string memory _code,
        string memory _seed
    ) public {
        bytes32 _key = keccak256(
            abi.encodePacked(_email, ",", _year, ",", _sem)
        );
        uint256 coursePos = 0;
        bool courseFound = false;
        uint256 i = 0;
        for (; i < courses[_key].length; i++) {
            if (
                keccak256(abi.encodePacked(courses[_key][i].code)) ==
                keccak256(abi.encodePacked(_code))
            ) {
                coursePos = i;
                courseFound = true;
                break;
            }
        }

        require(courseFound == true, "wrong credentials, course not found");
        require(
            courses[_key][coursePos].ticketGenerated == false,
            "tickets are already generated"
        );

        courses[_key][coursePos].ticketGenerated = true;
        i = 0;
        for (; i < courses[_key][coursePos].studentCount; i++) {
            bytes32 ticket = keccak256(
                abi.encodePacked(
                    block.timestamp,
                    _seed,
                    counterForProfReg,
                    block.difficulty
                )
            );
            counterForProfReg++;
            courses[_key][coursePos].tickets.push(ticket);
        }

        emit ticketGenerated(
            _email,
            _year,
            _sem,
            _code,
            courses[_key][coursePos].tickets
        );
    }

    function submitFeedback(
        string calldata _email,
        bytes32 _ticket,
        Float calldata updatedRating,
        Feedback calldata _feedback
    ) public {
        bytes32 course_Key = keccak256(
            abi.encodePacked(
                _email,
                ",",
                _feedback.year,
                ",",
                _feedback.semester
            )
        );
        uint256 coursePos = 0;
        bool found = false;
        for (; coursePos < courses[course_Key].length; coursePos++) {
            if (
                keccak256(
                    abi.encodePacked(courses[course_Key][coursePos].code)
                ) == keccak256(abi.encodePacked(_feedback.code))
            ) {
                found = true;
                break;
            }
        }
        if (found == false) {
            revert("Course not found, invalid course detail");
        }

        found = false;
        uint256 ticketPos = 0;
        uint256 ticketsLen = courses[course_Key][coursePos].tickets.length;
        for (; ticketPos < ticketsLen; ticketPos++) {
            if (courses[course_Key][coursePos].tickets[ticketPos] == _ticket) {
                found = true;
                break;
            }
        }

        if (found == false) revert("TxN Error: Invalid ticket");

        courses[course_Key][coursePos].tickets[ticketPos] = courses[course_Key][
            coursePos
        ].tickets[ticketsLen - 1];
        courses[course_Key][coursePos].tickets.pop();

        bytes32 _feedback_Key = keccak256(
            abi.encodePacked(
                _email,
                ",",
                _feedback.year,
                ",",
                _feedback.semester,
                ",",
                _feedback.code
            )
        );

        feedbacks[_feedback_Key].push(_feedback);
        uint256 feedbackLen = feedbacks[_feedback_Key].length;

        emit feedbackSubmitted(
            _email,
            feedbacks[_feedback_Key][feedbackLen - 1]
        );

        for (uint256 j = 0; j < _feedback.skills.length; j++) {
            bytes32 skill_Key = keccak256(
                abi.encodePacked(_email, ",", _feedback.skills[j])
            );
            skillsCount[skill_Key]++;
        }

        emit skillsUpvoted(_email, getSkillsUpvote(_email));

        professorDetail[_email].rating = updatedRating;
        emit ratingUpdated(_email, updatedRating);

        uint256 percentage = 3;
        if (
            courses[course_Key][coursePos].studentCount <= 3 ||
            feedbackLen <=
            (courses[course_Key][coursePos].studentCount / percentage)
        ) bhuToken.transfer(msg.sender, earlyFeedbackCost);
        else bhuToken.transfer(msg.sender, lateFeedbackCost);
        emit balanceUpdated(msg.sender, bhuToken.balanceOf(msg.sender));
    }

    function buyItems(uint256 cost) public {
        //require(checkBalance(msg.sender) >= 1, "Insufficent tokens");
        bhuToken.transferFrom(msg.sender, address(this), cost);
        emit balanceUpdated(msg.sender, bhuToken.balanceOf(msg.sender));
    }
}
