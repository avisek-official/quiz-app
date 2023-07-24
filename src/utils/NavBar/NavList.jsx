import { Typography, MenuItem } from "@material-tailwind/react";
import {
  BookmarkIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import React from "react";

// nav list component
const navListItemsTeacher = [
  {
    label: "Dashboard",
    icon: PresentationChartLineIcon,
    path: "/",
  },
  {
    label: "My Quizes",
    icon: QuestionMarkCircleIcon,
    path: "/quizes",
  },
  {
    label: "Create New Quiz",
    icon: PlusCircleIcon,
    path: "/create",
  },
];

const navListItemsStudent = [
  {
    label: "All Quizes",
    icon: QueueListIcon,
    path: "/",
  },
  {
    label: "Quizes In Progress",
    icon: BookmarkIcon,
    path: "/inprogress",
  },
  {
    label: "Quizes Completed",
    icon: ClipboardDocumentListIcon,
    path: "/completed",
  },
];

export default function NavList(props) {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {(props.userDetails.role === "Teacher"
        ? navListItemsTeacher
        : navListItemsStudent
      ).map(({ label, icon, path }, key) => (
        <NavLink to={path} key={label}>
          {({ isActive }) => (
            <Typography
              variant="small"
              color="blue-gray"
              className={`${isActive ? "font-bold text-blue-800" : ""}`}
            >
              <MenuItem className="flex items-center gap-2 lg:rounded-full">
                {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
                {label}
              </MenuItem>
            </Typography>
          )}
        </NavLink>
      ))}
    </ul>
  );
}
