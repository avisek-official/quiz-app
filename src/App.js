import AttemptQuiz from "./pages/attempt/AttemptQuiz";
import Dashboard from "./pages/dashboard/dashboard";
import QuizesCompleted from "./pages/completed/QuizesCompleted";
import QuizesInProgress from "./pages/inprogress/QuizesInProgress";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import ViewQuiz from "./pages/view/ViewQuiz";
import { getUsersFetch } from "./redux/userState";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersFetch());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create" element={<Dashboard create={true} />} />
      <Route path="/quizes" element={<Dashboard quizes={true} />} />
      <Route path="/view/:quizId" element={<ViewQuiz />} />
      <Route path="/attempt/:quizId" element={<AttemptQuiz />} />
      <Route path="/inprogress" element={<QuizesInProgress />} />
      <Route path="/completed" element={<QuizesCompleted />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
