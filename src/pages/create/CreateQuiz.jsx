import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  ArrowRightCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import CreateQuizSettings from "./CreateQuizSettings";
import CreateQuizAddQuestion from "./CreateQuizAddQuestion";
import { createQuiz, cleanCreatedQuiz } from "../../redux/quizState";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function CreateQuiz(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const createdQuiz = useSelector((state) => state.quizes.createdQuiz);
  const isLoading = useSelector((state) => state.quizes.isLoading);
  const [selectedTab, setSelectedTab] = useState("settings");
  const [quizSettings, setQuizSettings] = useState();
  const [quizQuestions, setQuizQuestions] = useState();
  const [createError, setCreateError] = useState(false);

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

  useEffect(() => {
    if (props.userDetails.role !== "Teacher") {
      navigate("/");
    }
  }, [props, navigate]);

  useEffect(() => {
    if (createdQuiz && !isLoading) {
      dispatch(cleanCreatedQuiz());
      navigate("/");
    }
  }, [createdQuiz, isLoading, navigate, dispatch, props]);

  // #endregion Side Effects

  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const handleQuizSettings = (quizSettings) => {
    setQuizSettings(quizSettings);
  };

  const handleQuestions = (questions) => {
    setQuizQuestions(questions);
  };

  const handleCreateQuiz = () => {
    if (
      quizSettings?.quizName.trim().length === 0 ||
      quizSettings?.quizCategory.trim().length === 0 ||
      quizSettings?.quizDescription.trim().length === 0 ||
      quizQuestions.length === 0
    ) {
      setCreateError(true);
    } else {
      setCreateError(false);
      const createQuizPayload = {
        createdAt: new Date().toLocaleString() + "",
        createdById: props.userDetails.id,
        createdByName: props.userDetails.name,
        enrolledStudents: [],
        quizSettings: quizSettings,
        quizQuestions: quizQuestions,
      };
      dispatch(createQuiz(createQuizPayload));
    }
  };

  // #endregion Functions

  // ----------------------------------------------------------------
  // #region Data
  // ----------------------------------------------------------------

  const data = [
    {
      label: "Quiz Settings",
      value: "settings",
      icon: Cog6ToothIcon,
      desc: <CreateQuizSettings quizSettings={handleQuizSettings} />,
    },
    {
      label: "Add Questions",
      value: "add-questions",
      icon: QuestionMarkCircleIcon,
      desc: (
        <CreateQuizAddQuestion
          quizSettings={quizSettings}
          questions={handleQuestions}
        />
      ),
    },
  ];

  // #endregion Data

  return (
    <Card className="relative w-[90%] mt-10 mb-4 left-[5%]">
      <CardHeader
        variant="gradient"
        color="blue"
        className="mb-4 grid h-10 place-items-center"
      >
        <Typography variant="h4" color="white">
          Create New Quiz
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Tabs value={selectedTab}>
          <TabsHeader
            onClick={() =>
              setSelectedTab(
                `${
                  (selectedTab === "settings" && "add-questions") ||
                  (selectedTab === "add-questions" && "settings")
                }`
              )
            }
          >
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2">
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {desc}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </CardBody>
      {selectedTab === "add-questions" && (
        <CardFooter className="flex flex-col w-full justify-center">
          {createError && (
            <>
              <Alert color="red" className="text-center">
                Please fill all required details. All fields in the settings tab
                are required and atleast one question need to be added.
              </Alert>
              <br />
            </>
          )}
          <span className="flex w-full justify-center items-center">
            <Button
              className="flex w-36 justify-center items-center"
              disabled={isLoading}
              onClick={handleCreateQuiz}
            >
              {isLoading ? (
                "Creating ..."
              ) : (
                <>
                  Create &nbsp; <ArrowRightCircleIcon className="w-6 h-6" />
                </>
              )}
            </Button>
          </span>
        </CardFooter>
      )}
    </Card>
  );
}

export default CreateQuiz;
