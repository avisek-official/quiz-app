import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { getQuizesFetch, deleteQuiz } from "../../redux/quizState";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function QuizCard(props) {
  const dispatch = useDispatch();
  const [showLongDesc, setShowLongDesc] = useState(false);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [submittedDate, setSubmittedDate] = useState("");
  const deletedQuiz = useSelector((state) => state.quizes.deletedQuiz);
  const isDeleting = useSelector((state) => state.quizes.isDeleting);
  const quizDescLong = props.quizDetails.quizSettings.quizDescription;
  const quizDescShort =
    quizDescLong.length > 120
      ? quizDescLong.slice(0, 120) + "..."
      : quizDescLong;

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

  useEffect(() => {
    dispatch(getQuizesFetch());
    // eslint-disable-next-line
  }, [deletedQuiz]);

  useEffect(() => {
    if (props.completed && props.quizDetails) {
      const findStudent = props.quizDetails.enrolledStudents.find(
        (student) => student.studentId === props.userDetails.id
      );
      setScoreEarned(findStudent.score);
      setSubmittedDate(findStudent.finishedAt);
    }
  }, [props]);

  // #endregion Side Effects

  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const handleDeleteQuiz = () => {
    dispatch(deleteQuiz({ id: props.quizDetails.id }));
  };

  // #endregion Functions

  return (
    <Card className="mt-6 w-96 m-2">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {props.quizDetails.quizSettings.quizName}
        </Typography>
        <span className="flex flex-wrap justify-between mb-2">
          <Typography color="black">
            <span className="font-bold">Category:</span>{" "}
            {props.quizDetails.quizSettings.quizCategory}
          </Typography>
          {props.userDetails.role === "Teacher" && (
            <Typography color="black">
              <span className="font-bold">Students Enrolled:</span>{" "}
              {props.quizDetails.enrolledStudents.length}
            </Typography>
          )}
          {props.userDetails.role === "Student" && (
            <Typography color="black">
              <span className="font-bold">
                {props.completed ? "Score Earned:" : "Total Points:"}
              </span>{" "}
              {props.completed && scoreEarned + " / "}
              {props.quizDetails.quizQuestions.reduce(
                (total, question) => total + Number(question.points),
                0
              )}
            </Typography>
          )}
        </span>
        <span
          className="cursor-pointer"
          onClick={() => setShowLongDesc(!showLongDesc)}
        >
          <Typography>{showLongDesc ? quizDescLong : quizDescShort}</Typography>
        </span>
      </CardBody>
      <CardFooter className="pt-0">
        {props.userDetails.role === "Teacher" && (
          <>
            <Link to={`/view/${props.quizDetails.id}`}>
              <Button>View Quiz</Button>
            </Link>
            <Button
              color="red"
              className="ml-2"
              disabled={isDeleting}
              onClick={handleDeleteQuiz}
            >
              {"Delete Quiz"}
            </Button>
          </>
        )}
        {props.userDetails.role === "Student" && (
          <>
            <span className="w-full flex justify-between items-center">
              <Link to={`/attempt/${props.quizDetails.id}`}>
                <Button className="w-36">
                  {!props.inProgress && !props.completed
                    ? "Start Quiz"
                    : props.inProgress
                    ? "Continue Quiz"
                    : "View Details"}
                </Button>
              </Link>
              {props.completed && (
                <Typography className="flex w-full justify-center items-center text-sm text-black">
                  <CheckBadgeIcon color="green" className="h-6 w-6 mr-1" />{" "}
                  Submitted on {submittedDate.split(",")[0]}
                </Typography>
              )}
            </span>
            <Typography className="text-xs italic pt-4">
              Quiz Created By: {props.quizDetails.createdByName}
            </Typography>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
