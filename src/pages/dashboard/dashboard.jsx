import ComplexNavbar from "../../utils/NavBar/ComplexNavbar";
import CoreUtils from "../../utils/Core/CoreUtils";
import CreateQuiz from "../create/CreateQuiz";
import CreateQuizCard from "../../utils/MyQuizes/CreateQuizCard";
import Loader from "../../utils/Loader/Loader";
import MyQuizes from "../../utils/MyQuizes/MyQuizes";
import NoQuiz from "../../utils/UI/NoQuiz";
import { getUsersFetch, setUserData } from "../../redux/userState";
import { getQuizesFetch } from "../../redux/quizState";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Dashboard(props) {
  const tokenID = window.sessionStorage.getItem("UserToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  const isLoading = useSelector((state) => state.users.isLoading);
  const isDeleting = useSelector((state) => state.quizes.isDeleting);
  const isQuizesLoading = useSelector((state) => state.quizes.isLoading);
  const allQuizes = useSelector((state) => state.quizes.quizes);
  const [userDetails, setUserDetails] = useState();
  const [userDetailsLoading, setUserDetailsLoading] = useState(true);
  const [myQuizes, setMyQuizes] = useState([]);
  const [availableForStudent, setAvailableForStudent] = useState();

  // ----------------------------------------------------------------
  // #region Side Effects
  // ----------------------------------------------------------------

  useEffect(() => {
    dispatch(getUsersFetch());
    dispatch(getQuizesFetch());
    // eslint-disable-next-line
  }, [props, isDeleting]);

  useEffect(() => {
    if (tokenID) {
      if (users.length > 0 && !isLoading) {
        const userData = users.find((user) => user.tokenID === tokenID);
        if (userData) {
          setUserDetails(userData);
          setUserDetailsLoading(false);
          dispatch(setUserData(userData));
        } else {
          navigate("/auth/sign-in");
        }
      }
    } else {
      navigate("/auth/sign-in");
    }
  }, [users, tokenID, navigate, isLoading, dispatch]);

  useEffect(() => {
    if (
      allQuizes.length > 0 &&
      !isQuizesLoading &&
      !CoreUtils.isNullOrUndefined(userDetails)
    ) {
      const allQuizesNew = [...allQuizes];

      setMyQuizes(
        allQuizesNew.filter((quiz) => quiz.createdById === userDetails.id)
      );
    } else if (
      allQuizes.length === 0 &&
      !isQuizesLoading &&
      !CoreUtils.isNullOrUndefined(userDetails)
    ) {
      setMyQuizes([]);
    }
  }, [allQuizes, isQuizesLoading, userDetails, isLoading, isDeleting]);

  useEffect(() => {
    if (userDetails && userDetails.role === "Student" && allQuizes.length > 0) {
      const filteredQuizes = [];
      allQuizes.forEach((quiz) => {
        if (quiz.enrolledStudents.length === 0) {
          filteredQuizes.push(quiz);
        } else if (
          quiz.enrolledStudents.length > 0 &&
          !quiz.enrolledStudents.find(
            (student) => student.studentId === userDetails.id
          )
        ) {
          filteredQuizes.push(quiz);
        }
      });
      setAvailableForStudent(filteredQuizes);
    }
  }, [userDetails, allQuizes]);

  // #endregion Side Effects

  return (
    <div className="h-max py-2">
      {(userDetailsLoading || isLoading || isQuizesLoading) && <Loader />}
      {!userDetailsLoading && !isLoading && !isQuizesLoading && (
        <ComplexNavbar userDetails={userDetails} />
      )}
      {/* Teacher Dashboard Items */}
      {!userDetailsLoading && userDetails.role === "Teacher" && (
        <>
          {!isLoading && myQuizes.length > 0 && !props.create ? (
            <MyQuizes myQuizes={myQuizes} userDetails={userDetails} />
          ) : (
            <div
              className={`flex w-full justify-center pt-4 ${
                (props.create || isQuizesLoading) && "hidden"
              }`}
            >
              <CreateQuizCard />
            </div>
          )}
          {props.create && <CreateQuiz userDetails={userDetails} />}
        </>
      )}
      {!userDetailsLoading && userDetails.role === "Student" && (
        <>
          {!CoreUtils.isNullOrUndefined(availableForStudent) ? (
            <MyQuizes
              myQuizes={availableForStudent}
              userDetails={userDetails}
            />
          ) : (
            <NoQuiz />
          )}
        </>
      )}
    </div>
  );
}
