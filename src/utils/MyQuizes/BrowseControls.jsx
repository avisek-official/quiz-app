import {
  Navbar,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { QuizCategories } from "../Core/QuizCategories";
import React, { useEffect, useState } from "react";

function BrowseControls(props) {
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);

  useEffect(() => {
    props.onControlChange({ searchText, filterCategory });
    // eslint-disable-next-line
  }, [searchText, filterCategory]);

  return (
    <Navbar
      variant="gradient"
      color="white"
      className="mx-auto max-w-screen-xl px-4 py-3 z-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="lg:w-[70%] w-full">
          <Input
            type="text"
            label="Search by Quiz Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="lg:w-[25%] w-full">
          <Select
            label="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e)}
          >
            {QuizCategories.map((category, index) => (
              <Option value={category} key={index}>
                {category}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Navbar>
  );
}

export default BrowseControls;
