import {
  Alert,
  Button,
  Card,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Checkbox,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  PencilIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useState, useEffect, useRef } from "react";

export default function AddQuestionModal(props) {
  const questionStructure = {
    id: Date.now(),
    questionText: "",
    answerOptions: [],
    points: 0,
    explanation: "",
  };

  const [question, setQuestion] = useState(
    props.editQuestion ? props.editQuestion : questionStructure
  );
  const [answerOption, setAnswerOption] = useState("");
  const [isAnswer, setIsAnswer] = useState(false);
  const [isAnswerCheckDisabled, setIsAnswerCheckDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef();

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

  useEffect(() => {
    if (question.answerOptions.find((option) => option.isAnswer === true)) {
      setIsAnswerCheckDisabled(true);
    }
  }, [question]);

  useEffect(() => {
    alertRef.current?.scrollIntoView({ block: "nearest" });
  }, [showAlert]);

  // #endregion Side Effects

  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const addOption = () => {
    if (answerOption?.trim().length > 0) {
      setQuestion({
        ...question,
        answerOptions: [
          ...question.answerOptions,
          {
            id: Date.now(),
            answerText: answerOption,
            isAnswer: isAnswer,
          },
        ],
      });
      setAnswerOption("");
      setIsAnswer(false);
    }
  };

  const handleOptionEdit = (optionId) => {
    const selectedAnswerOption = question.answerOptions.find(
      (a) => a.id === optionId
    );
    setAnswerOption(selectedAnswerOption.answerText);
    if (selectedAnswerOption.isAnswer) {
      setIsAnswerCheckDisabled(false);
      setIsAnswer(true);
    }

    const updatedOptions = question.answerOptions.filter(
      (option) => option.id !== optionId
    );
    setQuestion({
      ...question,
      answerOptions: [...updatedOptions],
    });
  };

  const addQuestion = () => {
    setShowAlert(false);
    if (
      question.questionText.trim().length > 0 &&
      question.points !== null &&
      !isNaN(question.points) &&
      question.answerOptions.length > 1 &&
      question.answerOptions.find((option) => option.isAnswer === true)
    ) {
      props.addQuestion(question);
    } else {
      setShowAlert(true);
      alertRef.current?.scrollIntoView({ block: "nearest" });
    }
  };

  // #endregion Functions

  return (
    <Dialog
      open={props.open}
      size="lg"
      handler={props.handleOpen}
      aria-hidden="false"
      aria-modal="true"
    >
      <div className="flex items-center justify-between">
        <DialogHeader>Add New Question</DialogHeader>
        <XMarkIcon
          className="mr-3 h-5 w-5 cursor-pointer"
          onClick={props.handleOpen}
        />
      </div>
      <DialogBody divider className="max-h-[26rem] overflow-scroll">
        <div className="grid gap-6">
          {
            /* Show Requirement Alert */
            showAlert && (
              <Alert
                variant="gradient"
                ref={alertRef}
                color="red"
                icon={
                  <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                }
              >
                <Typography>Ensure that these requirements are met:</Typography>
                <ul className="mt-2 ml-2 list-disc list-inside text-sm">
                  <li>A valid question text is present</li>
                  <li>Points field has valid number</li>
                  <li>Minimum of two answer options added</li>
                  <li>One answer option must be set as 'Answer'</li>
                </ul>
              </Alert>
            )
          }
          <Input
            label="Question Text"
            value={question.questionText}
            onChange={(e) =>
              setQuestion({
                ...question,
                questionText: e.target.value,
              })
            }
          />

          {
            // Render Added Options
            question.answerOptions.length > 0 &&
              question.answerOptions.map((option, index) => {
                return (
                  <Card
                    key={option.id}
                    className={`p-3 flex flex-row justify-between items-center-center border
                                    ${
                                      option.isAnswer
                                        ? "border-green-500"
                                        : "border-red-500"
                                    }`}
                  >
                    <Typography>
                      {index + 1 + ") " + option.answerText}
                    </Typography>
                    <span className="flex gap-2 items-center">
                      {option.isAnswer && (
                        <Chip
                          color="green"
                          size="sm"
                          variant="gradient"
                          value="Answer"
                        />
                      )}
                      <Button
                        size="sm"
                        className="px-2"
                        title="Edit Option"
                        onClick={() => handleOptionEdit(option.id)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </span>
                  </Card>
                );
              })
          }
          <div className="w-full flex items-center">
            <Input
              label={`Answer Option ${question.answerOptions.length + 1}`}
              value={answerOption}
              onChange={(e) => setAnswerOption(e.target.value)}
            />
            <Checkbox
              label="Answer"
              checked={isAnswer}
              disabled={isAnswerCheckDisabled}
              onChange={(e) => setIsAnswer(e.target.checked)}
            />
          </div>
          <Button onClick={addOption}>Add Option</Button>
          <Input
            type="number"
            label="Points"
            value={question.points}
            onWheel={(e) => e.preventDefault}
            onChange={(e) =>
              setQuestion({
                ...question,
                points: Number(e.target.value),
              })
            }
          />
          <Textarea
            label="Explanation if Incorrect (Optional)"
            value={question.explanation}
            onChange={(e) =>
              setQuestion({
                ...question,
                explanation: e.target.value,
              })
            }
          />
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="outlined" color="red" onClick={props.handleOpen}>
          close
        </Button>
        <Button variant="gradient" color="green" onClick={addQuestion}>
          Add Question
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
