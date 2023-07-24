import { Card, Typography, Chip, Button } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import AddQuestionCard from "./AddQuestionCard";
import AddQuestionModal from "./AddQuestionModal";
import React, { useEffect, useState } from "react";

function CreateQuizAddQuestion(props) {
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);

  useEffect(() => {
    props.questions(questions);
  }, [props, questions]);

  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const handleOpen = () => {
    setShowAddQuestionModal(false);
    setEditQuestion(null);
  };

  const addQuestion = (question) => {
    let updatedList = [...questions];
    if (updatedList.find((q) => q.id === question.id)) {
      const index = updatedList.indexOf(
        updatedList.find((q) => q.id === question.id)
      );
      updatedList.splice(index, 1, question);
    } else {
      updatedList.push(question);
    }
    setQuestions(updatedList);
    handleOpen();
    setEditQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setEditQuestion(question);
    setShowAddQuestionModal(true);
  };

  // #endregion Functions

  const totalPoints = questions.reduce(
    (total, question) => total + Number(question.points),
    0
  );
  const settingsAddMessage = (
    <span className="text-xs text-red-500 italic">
      Please add required quiz details in the settings tab
    </span>
  );

  return (
    <React.Fragment>
      <div className="w-full flex flex-col justify-center items-center mb-5">
        <Card className="lg:w-[75%] w-[90%] p-4 m-2 flex flex-row justify-between items-center">
          <Typography>
            Quiz Name:{" "}
            {props.quizSettings?.quizName.trim().length
              ? props.quizSettings.quizName
              : settingsAddMessage}
          </Typography>
          <span className="flex justify-center items-center">
            <Typography>Total Points: </Typography>
            <Chip
              color="amber"
              className="text-[14px] py-1 px-2"
              size="lg"
              variant="gradient"
              value={totalPoints < 10 ? "0" + totalPoints : totalPoints}
            />
          </span>
        </Card>
        {questions.length > 0 &&
          questions.map((question, index) => {
            return (
              <Card key={question.id} className="lg:w-[75%] w-[90%] p-4 m-2">
                <span className="w-full flex justify-between items-center">
                  <Typography className="font-semibold text-lg mb-4">{`Q ${
                    index + 1
                  }:  ${question.questionText}`}</Typography>
                  <span className="flex gap-2 items-center">
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
                    <Button
                      size="sm"
                      className="px-2"
                      title="Edit Question"
                      onClick={() => handleEditQuestion(question)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </span>
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
      <div className="w-full min-h-fit max-h-max flex justify-center items-center">
        <AddQuestionCard onAddQuestion={() => setShowAddQuestionModal(true)} />
      </div>
      {showAddQuestionModal && (
        <AddQuestionModal
          open={showAddQuestionModal}
          handleOpen={handleOpen}
          addQuestion={addQuestion}
          editQuestion={editQuestion}
        />
      )}
    </React.Fragment>
  );
}

export default CreateQuizAddQuestion;
