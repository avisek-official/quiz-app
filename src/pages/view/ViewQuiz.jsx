import { Card, Typography, Chip } from "@material-tailwind/react";
import ComplexNavbar from "../../utils/NavBar/ComplexNavbar";
import CoreUtils from "../../utils/Core/CoreUtils";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

function ViewQuiz() {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users.userDetails);
  const allQuizes = useSelector((state) => state.quizes.quizes);
  const [quizDetails, setQuizDetails] = useState();
  const [totalPoints, setTotalPoints] = useState(0);
  const { quizId } = useParams();

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

  useEffect(() => {
    if (!userDetails) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  useEffect(() => {
    if (!CoreUtils.isNullOrUndefined(allQuizes) && allQuizes.length > 0) {
      const quizDetails = allQuizes.find((quiz) => quiz.id === quizId);
      setQuizDetails(quizDetails);
    }
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
                Total Points:
              </Typography>
              <Chip
                color="amber"
                className="text-[14px] py-1 px-2 ml-2"
                size="lg"
                variant="gradient"
                value={totalPoints < 10 ? "0" + totalPoints : totalPoints}
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
                        className={`p-3 m-1 flex flex-row justify-between items-center-center border
                                                ${
                                                  option.isAnswer
                                                    ? "border-green-500"
                                                    : "border-red-500"
                                                }`}
                      >
                        <Typography>
                          {index + 1 + ") " + option.answerText}
                        </Typography>
                        {option.isAnswer && (
                          <Chip
                            color="green"
                            size="sm"
                            variant="gradient"
                            value="Answer"
                          />
                        )}
                      </Card>
                    );
                  })}
                  {question.explanation.trim().length > 0 && (
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
        </div>
      )}
    </div>
  );
}

export default ViewQuiz;
