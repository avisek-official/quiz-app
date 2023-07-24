import ComplexNavbar from "../../utils/NavBar/ComplexNavbar";
import MyQuizes from "../../utils/MyQuizes/MyQuizes";
import NoQuiz from "../../utils/UI/NoQuiz";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function QuizesInProgress() {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users.userDetails);
  const allQuizes = useSelector((state) => state.quizes.quizes);
  const [quizesInProgress, setQuizesInProgress] = useState([]);

  useEffect(() => {
    if (!userDetails || (userDetails && userDetails.role !== "Student")) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  useEffect(() => {
    if (userDetails && userDetails.role === "Student" && allQuizes.length > 0) {
      const filteredQuizes = allQuizes.filter(
        (quiz) =>
          quiz.enrolledStudents.length > 0 &&
          quiz.enrolledStudents.find(
            (student) => student.studentId === userDetails.id
          ) &&
          !quiz.enrolledStudents.find(
            (student) => student.studentId === userDetails.id
          ).isFinished
      );
      setQuizesInProgress(filteredQuizes);
    }
  }, [allQuizes, userDetails]);

  return (
    <div className="h-max py-2">
      {userDetails && <ComplexNavbar userDetails={userDetails} />}
      {quizesInProgress.length > 0 ? (
        <MyQuizes
          myQuizes={quizesInProgress}
          userDetails={userDetails}
          inProgress={true}
        />
      ) : (
        <NoQuiz />
      )}
    </div>
  );
}

export default QuizesInProgress;
