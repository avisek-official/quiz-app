import { Card, CardBody, Typography } from "@material-tailwind/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function CreateQuizCard() {
  return (
    <Card className="mt-6 w-[31%] min-w-[31%] h-fit m-2">
      <Link to={`/create`}>
        <CardBody className="flex flex-col justify-center items-center">
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Create New Quiz
          </Typography>
          <PlusCircleIcon className="w-16 h-16" color="#2191d1" />
        </CardBody>
      </Link>
    </Card>
  );
}
