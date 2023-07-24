import { Card, Typography } from "@material-tailwind/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

function AddQuestionCard(props) {
  return (
    <Card
      className="p-5 flex flex-col gap-2 justify-center items-center cursor-pointer active:scale-95"
      onClick={props.onAddQuestion}
    >
      <PlusCircleIcon className="w-16 h-16" color="#2191d1" />
      <Typography className="font-medium">Add Question</Typography>
    </Card>
  );
}

export default AddQuestionCard;
