import {
  Card,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { QuizCategories } from "../../utils/Core/QuizCategories";
import React, { useState, useEffect } from "react";

export default function CreateQuizSettings(props) {
  const [quizName, setQuizName] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [quizDescription, setQuizDescription] = useState("");

  useEffect(() => {
    props.quizSettings({
      quizName,
      quizCategory,
      quizDescription,
    });
    // eslint-disable-next-line
  }, [quizName, quizCategory, quizDescription]);

  return (
    <Card
      color="transparent"
      shadow={false}
      className="w-full flex justify-center items-center"
    >
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-4 flex flex-col gap-6">
          <Select
            label="Quiz Category"
            size="lg"
            onChange={(e) => setQuizCategory(e)}
          >
            {QuizCategories.map((category, index) => (
              <Option value={category} key={index}>
                {category}
              </Option>
            ))}
          </Select>
          <Input
            size="lg"
            label="Name of the Quiz"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
          <Textarea
            size="lg"
            rows={8}
            label="Description of the Quiz"
            onChange={(e) => setQuizDescription(e.target.value)}
          />
        </div>
      </form>
    </Card>
  );
}
