import { Alert, Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

export default function NoQuiz() {
  return (
    <div className="w-full pt-10 flex justify-center items-center">
      <Alert color="light-blue" variant="gradient" className="w-1/3">
        <span className="w-full flex justify-center items-center">
          <InformationCircleIcon className="w-8 h-8" />
          <Typography className="ml-4 text-lg">No Quiz Available</Typography>
        </span>
      </Alert>
    </div>
  );
}
