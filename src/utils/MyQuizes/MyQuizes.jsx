import BrowseControls from "./BrowseControls";
import CoreUtils from "../Core/CoreUtils";
import CreateQuizCard from "./CreateQuizCard";
import NoQuiz from "../UI/NoQuiz";
import QuizCard from "./QuizCard";
import React, { useState } from "react";

export default function MyQuizes(props) {
  const [quizesToRender, setQuizesToRender] = useState(props.myQuizes);


  // ----------------------------------------------------------------
  // #region Functions
  // ----------------------------------------------------------------

  const filterQuizes = (filter) => {
    let filteredQuizes = [];
    if (filter.searchText.trim().length > 0) {
      if (filteredQuizes.length > 0) {
        filteredQuizes = filteredQuizes.filter((quiz) =>
          quiz.quizSettings.quizName
            .toLowerCase()
            .includes(filter.searchText.toLowerCase())
        );
      } else {
        filteredQuizes = props.myQuizes.filter((quiz) =>
          quiz.quizSettings.quizName
            .toLowerCase()
            .includes(filter.searchText.toLowerCase())
        );
      }
    }
    if (!CoreUtils.isNullOrUndefined(filter.filterCategory)) {
      if (filteredQuizes.length > 0) {
        filteredQuizes = filteredQuizes.filter(
          (quiz) => quiz.quizSettings.quizCategory === filter.filterCategory
        );
      } else {
        filteredQuizes = props.myQuizes.filter(
          (quiz) => quiz.quizSettings.quizCategory === filter.filterCategory
        );
      }
    }
    if (
      filter.searchText.trim().length > 0 ||
      !CoreUtils.isNullOrUndefined(filter.filterCategory)
    ) {
      setQuizesToRender(filteredQuizes);
    }
  };

  // #endregion Functions

  return (
    <div className="flex mx-auto max-w-screen-xl pt-5 flex-wrap">
      {props.userDetails.role === "Student" && props.myQuizes.length > 0 && (
        <BrowseControls onControlChange={filterQuizes} />
      )}
      {quizesToRender.length > 0
        ? quizesToRender.map((quiz, index) => {
            return (
              <QuizCard
                key={index}
                quizDetails={quiz}
                userDetails={props.userDetails}
                inProgress={props.inProgress}
                completed={props.completedQuizes}
              />
            );
          })
        : props.userDetails.role === "Student" && <NoQuiz />}
      {props.userDetails.role === "Teacher" && <CreateQuizCard />}
    </div>
  );
}
