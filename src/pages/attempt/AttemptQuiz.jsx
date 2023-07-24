import { Card, Typography, Chip, Button } from "@material-tailwind/react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import ComplexNavbar from "../../utils/NavBar/ComplexNavbar";
import CoreUtils from "../../utils/Core/CoreUtils";
import { updateQuiz } from "../../redux/quizState";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { flushSync } from "react-dom";
import React, { useEffect, useState } from "react";

function AttemptQuiz() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isUpdating = useSelector((state) => state.quizes.isUpdating);
  const userDetails = useSelector((state) => state.users.userDetails);
  const allQuizes = useSelector((state) => state.quizes.quizes);
  const [quizDetails, setQuizDetails] = useState();
  const [totalPoints, setTotalPoints] = useState(0);
  const { quizId } = useParams();
  const [attemptDetails, setAttemptDetails] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [submittedDate, setSubmittedDate] = useState("");

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

  useEffect(() => {
    if (!userDetails) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  useEffect(() => {});

  useEffect(() => {
    if (!CoreUtils.isNullOrUndefined(allQuizes) && allQuizes.length > 0) {
      const quizDetails = allQuizes.find((quiz) => quiz.id === quizId);
      setQuizDetails(quizDetails);
      if (quizDetails.enrolledStudents.length > 0) {
        const findStudent = quizDetails.enrolledStudents.find(
          (student) => student.studentId === userDetails.id
        );
        if (findStudent) {
          setAttemptDetails(findStudent.attemptDetails);
          setIsSubmitted(findStudent.isFinished);
          setScoreEarned(findStudent.score);
          setSubmittedDate(findStudent.finishedAt);
        }
      }
    }
    // eslint-disable-next-line
  }, [allQuizes, quizId]);

  useEffect(() => {
    if (quizDetails) {
      const totalPoints = quizDetails.quizQuestions.reduce(
        (total, question) => total + Number(question.points),
        0
      );
      setTotalPoints(totalPoints);
    }
  }, [quizDetails]);

  // #endregion Side Effects

  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const handleResponse = (questionId, responseId) => {
    if (!isSubmitted) {
      if (attemptDetails.length > 0) {
        const attemptDetailsNew = [...attemptDetails];
        const findQuestion = attemptDetailsNew.find(
          (question) => question.questionId === questionId
        );
        if (findQuestion) {
          const index = attemptDetailsNew.indexOf(findQuestion);
          attemptDetailsNew.splice(index, 1, {
            questionId: questionId,
            responseId: responseId,
          });
        } else {
          attemptDetailsNew.push({
            questionId: questionId,
            responseId: responseId,
          });
        }
        flushSync(() => {
          setAttemptDetails(attemptDetailsNew);
        });
        updateQuizDetails();
      } else {
        flushSync(() => {
          setAttemptDetails([
            { questionId: questionId, responseId: responseId },
          ]);
        });
        updateQuizDetails();
      }
    }
  };

  const isResponse = (questionId, responseId) => {
    const findQuestion = attemptDetails.find(
      (response) => response.questionId === questionId
    );
    if (findQuestion) {
      return findQuestion.responseId === responseId;
    } else {
      return false;
    }
  };

  const isCorrect = (questionId) => {
    const questionDetails = quizDetails.quizQuestions.find(
      (q) => q.id === questionId
    );

    const responseId = attemptDetails.find(
      (q) => q.questionId === questionId
    )?.responseId;

    if (responseId) {
      const responseDetails = questionDetails.answerOptions.find(
        (r) => r.id === responseId
      );

      return responseDetails.isAnswer;
    } else {
      return false;
    }
  };

  const updateQuizDetails = () => {
    if (quizDetails) {
      if (quizDetails.enrolledStudents.length > 0) {
        const newEnrolledStudents = [...quizDetails.enrolledStudents];
        const findStudent = quizDetails.enrolledStudents.find(
          (student) => student.studentId === userDetails.id
        );

        const newAttemptDetailsObject = {
          studentId: userDetails.id,
          attemptDetails: attemptDetails,
          isFinished: false,
          score: null,
          finishedAt: null,
        };

        if (findStudent) {
          const index = quizDetails.enrolledStudents.indexOf(findStudent);

          newEnrolledStudents.splice(index, 1, newAttemptDetailsObject);
          setQuizDetails({
            ...quizDetails,
            enrolledStudents: newEnrolledStudents,
          });
          dispatch(
            updateQuiz({
              ...quizDetails,
              enrolledStudents: newEnrolledStudents,
            })
          );
        } else {
          newEnrolledStudents.push(newAttemptDetailsObject);
          setQuizDetails({
            ...quizDetails,
            enrolledStudents: newEnrolledStudents,
          });
          dispatch(
            updateQuiz({
              ...quizDetails,
              enrolledStudents: newEnrolledStudents,
            })
          );
        }
      } else {
        const updatedEnrolledStudents = [
          {
            studentId: userDetails.id,
            attemptDetails: attemptDetails,
            isFinished: false,
            score: null,
            finishedAt: null,
          },
        ];
        setQuizDetails({
          ...quizDetails,
          enrolledStudents: updatedEnrolledStudents,
        });
        dispatch(
          updateQuiz({
            ...quizDetails,
            enrolledStudents: updatedEnrolledStudents,
          })
        );
      }
    }
  };

  const handleSubmitQuiz = () => {
    if (quizDetails) {
      let score = 0;
      const newEnrolledStudents = [...quizDetails.enrolledStudents];
      const findStudent = quizDetails.enrolledStudents.find(
        (student) => student.studentId === userDetails.id
      );
      const index = quizDetails.enrolledStudents.indexOf(findStudent);

      attemptDetails.forEach((question) => {
        const questionDetails = quizDetails.quizQuestions.find(
          (q) => q.id === question.questionId
        );
        const actualPoint = questionDetails.points;
        const responseDetails = questionDetails.answerOptions.find(
          (r) => r.id === question.responseId
        );
        const pointsEarned = responseDetails.isAnswer ? actualPoint : 0;
        score += pointsEarned;
      });

      const newAttemptDetailsObject = {
        studentId: userDetails.id,
        attemptDetails: attemptDetails,
        isFinished: true,
        score: score,
        finishedAt: new Date().toLocaleString() + "",
      };
      newEnrolledStudents.splice(index, 1, newAttemptDetailsObject);

      dispatch(
        updateQuiz({
          ...quizDetails,
          enrolledStudents: newEnrolledStudents,
        })
      );
      setQuizDetails({
        ...quizDetails,
        enrolledStudents: newEnrolledStudents,
      });
      setIsSubmitted(true);
      setScoreEarned(score);
      setSubmittedDate(new Date().toLocaleString() + "");
    }
  };

  // #endregion Functions

  return (
    <div className="h-max py-2">
      {userDetails && <ComplexNavbar userDetails={userDetails} />}
      {quizDetails && (
        <div className="w-full flex flex-col justify-center items-center my-5">
          <Card className="lg:w-[75%] w-[90%] p-4 m-2 flex flex-row justify-between items-center">
            <Typography className="font-bold text-black">
              Quiz Name: {quizDetails.quizSettings.quizName}
            </Typography>
            <span className="flex justify-center items-center">
              <Typography className="font-bold text-black">
                {isSubmitted ? "My Score:" : "Total Points:"}
              </Typography>
              <Chip
                color="amber"
                className="text-[14px] py-1 px-2 ml-2"
                size="lg"
                variant="gradient"
                value={`${isSubmitted ? scoreEarned + " /" : ""} ${
                  totalPoints < 10 ? "0" + totalPoints : totalPoints
                }`}
              />
            </span>
          </Card>
          {quizDetails.quizQuestions.length > 0 &&
            quizDetails.quizQuestions.map((question, index) => {
              return (
                <Card key={question.id} className="lg:w-[75%] w-[90%] p-4 m-2">
                  <span className="w-full flex justify-between items-center">
                    <Typography className="font-semibold text-lg mb-4">{`Q ${
                      index + 1
                    }:  ${question.questionText}`}</Typography>

                    <Chip
                      color="amber"
                      className="text-[14px] py-1 px-2"
                      size="lg"
                      variant="gradient"
                      value={
                        question.points < 10
                          ? "0" + question.points
                          : question.points
                      }
                    />
                  </span>
                  {question.answerOptions.map((option, index) => {
                    return (
                      <Card
                        key={option.id}
                        onClick={() => handleResponse(question.id, option.id)}
                        className={`p-3 m-1 flex flex-row justify-between items-center-center ${
                          isResponse(question.id, option.id)
                            ? isSubmitted
                              ? option.isAnswer
                                ? "border-4 border-green-400"
                                : "border-4 border-red-400"
                              : "border-4 border-blue-400"
                            : isSubmitted
                            ? "border border-blue-400"
                            : "border border-blue-400 hover:border-4 hover:border-yellow-700"
                        } cursor-pointer`}
                      >
                        <Typography>
                          {index + 1 + ") " + option.answerText}
                        </Typography>
                      </Card>
                    );
                  })}
                  {isSubmitted &&
                    !isCorrect(question.id) &&
                    question.explanation.trim().length > 0 && (
                      <Card
                        className={`p-3 mx-1 my-3 flex flex-col justify-center items-start border-2 border-blue-800`}
                      >
                        <Typography className="text-black font-bold">
                          Explanation if incorrect:
                        </Typography>
                        {question.explanation}
                      </Card>
                    )}
                </Card>
              );
            })}
          {isSubmitted ? (
            <Card className="mt-4 p-4">
              <Typography className="flex w-full justify-center items-center">
                <CheckBadgeIcon color="green" className="h-8 w-8 mr-2" />{" "}
                Submitted on {submittedDate}
              </Typography>
            </Card>
          ) : (
            <Button
              className="mt-4"
              disabled={isUpdating}
              onClick={handleSubmitQuiz}
            >
              {isUpdating ? "Submitting ..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default AttemptQuiz;
