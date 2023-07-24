import ComplexNavbar from "../../utils/NavBar/ComplexNavbar";
import MyQuizes from "../../utils/MyQuizes/MyQuizes";
import NoQuiz from "../../utils/UI/NoQuiz";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function QuizesCompleted() {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users.userDetails);
  const allQuizes = useSelector((state) => state.quizes.quizes);
  const [quizesCompleted, setQuizesCompleted] = useState([]);

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

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
          quiz.enrolledStudents.find(
            (student) => student.studentId === userDetails.id
          ).isFinished
      );
      setQuizesCompleted(filteredQuizes);
    }
  }, [allQuizes, userDetails]);

  // #endregion Side Effects

  return (
    <div className="h-max py-2">
      {userDetails && <ComplexNavbar userDetails={userDetails} />}
      {quizesCompleted.length > 0 ? (
        <MyQuizes
          myQuizes={quizesCompleted}
          userDetails={userDetails}
          completedQuizes={true}
        />
      ) : (
        <NoQuiz />
      )}
    </div>
  );
}

export default QuizesCompleted;
