import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react";
import moment from "moment";
import { DATE_FORMAT } from "@/types/enums";
import { dateTimeFormatter } from "@/utils/CommonFunction";
import { Label } from "@/stories/Label/Label";
import { PRIORITY_STATUS_VALUE } from "@/utils/constant";

const ChangeHistoryDataDiv = ({
  data,
  open,
  setOpen,
  index,
  handleOpen,
}: {
  data: any;
  open: any;
  setOpen: any;
  index: number;
  handleOpen: any;
}) => {
  const [parsedDate, setParsedData] = useState<any>([]);

  function addSpaceBeforeCapital(str: any) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      if (i > 0 && str[i] === str[i].toUpperCase()) {
        result += " ";
      }
      result += str[i];
    }
    return result;
  }

  const flattenObject = (obj: any, prefix: string = "") => {
    let result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = addSpaceBeforeCapital(key);

      if (typeof value === "object" && value !== null) {
        const flattened = flattenObject(value, `(${newKey[0]})`);
        result = { ...result, ...flattened };
      } else {
        // Determine prefix based on the first character of the key

        result[`${prefix.toLocaleUpperCase()} ${newKey}`] = value;
      }
    }
    return result;
  };

  const convertToArray = (obj: any) => {
    const flattenedObj = flattenObject(obj);
    const result = [];
    for (const [key, value] of Object.entries(flattenedObj)) {
      const title = key.charAt(0).toUpperCase() + key.slice(1);
      const data =
        typeof value === "string" ? value.replace("|", " --> ") : value;
      result.push({ title, data });
    }
    return result;
  };

  useEffect(() => {
    if (data?.updatedData) {
      const parsedData = convertToArray(data.updatedData);
      setParsedData(parsedData);
    }
  }, []);

  const checkData = (data: any) => {
    if (data.title.includes("priority")) {
      return (
        PRIORITY_STATUS_VALUE[data.data.split(" --> ")[0]] ||
        "N/A" + " --> " + PRIORITY_STATUS_VALUE[data.data.split(" --> ")[1]] ||
        "N/A"
      );
    }
    if (data.title.includes("Date")) {
      const splitData = data?.data?.split(" --> ");

      // Format the first and second parts of the split data using the dateTimeFormatter function
      const formattedStartDate = dateTimeFormatter(
        DATE_FORMAT.DATE,
        +splitData?.[0]
      );
      const formattedEndDate = dateTimeFormatter(
        DATE_FORMAT.DATE,
        +splitData?.[1]
      );

      // Check if both formatted dates are valid
      const isStartDateValid =
        formattedStartDate !== "Invalid date" &&
        formattedStartDate.trim() != "-" &&
        formattedStartDate.trim() !== "";
      const isEndDateValid =
        formattedEndDate !== "Invalid date" &&
        formattedEndDate.trim() != "-" &&
        formattedEndDate.trim() !== "";
      // Build the return value based on the validity of the dates
      if (isStartDateValid && isEndDateValid) {
        return `${formattedStartDate} --> ${formattedEndDate}`;
      } else if (isEndDateValid) {
        return `N/A --> ${formattedEndDate}`;
      } else {
        return `N/A`;
      }
    } else if (data.title.includes("Time")) {
      const splitData = data?.data?.split(" --> ");

      // Format the first and second parts of the split data using the dateTimeFormatter function
      const formattedStartDate = dateTimeFormatter(
        DATE_FORMAT.TIME,
        +splitData?.[0]
      );
      const formattedEndDate = dateTimeFormatter(
        DATE_FORMAT.TIME,
        +splitData?.[1]
      );

      // Check if both formatted dates are valid
      const isStartDateValid =
        formattedStartDate !== "Invalid date" &&
        formattedStartDate.trim() != "-" &&
        formattedStartDate.trim() !== "";
      const isEndDateValid =
        formattedEndDate !== "Invalid date" &&
        formattedEndDate.trim() != "-" &&
        formattedEndDate.trim() !== "";
      // Build the return value based on the validity of the dates
      if (isStartDateValid && isEndDateValid) {
        return `${formattedStartDate} --> ${formattedEndDate}`;
      } else if (isEndDateValid) {
        return `N/A --> ${formattedEndDate}`;
      } else {
        return `N/A`;
      }
    } else {
      return data?.data;
    }
  };

  const checkTitle = (title: string) => {
    if (title.trim() == "d S O Notes") {
      return "(D) Notes";
    } else if (title.trim() == "e S O Notes") {
      return "(E) Notes";
    } else {
      return title;
    }
  };
  return (
    <div className="border rounded-normal">
      <Accordion open={open === index}>
        <AccordionHeader
          onClick={() => handleOpen(index)}
          className={`${
            open === index ? "border-none bg-colorLightest" : "bg-colorLightest"
          } text-sm font-Rubik`}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 px-4 py-2 w-full">
            <div>
              <Label label="Date" size="small" color="var(--color-primary)" />
              <br />
              <Label
                label={dateTimeFormatter(
                  DATE_FORMAT.DATE_AND_TIME,
                  data?.updatedAt
                )}
                size="extra-small"
                color="var(--color-black)"
              />
            </div>
            <div>
              <Label label="User" size="small" color="var(--color-primary)" />
              <br />
              <Label
                label={`${data.user.firstName} ${data.user.lastName}`}
                size="extra-small"
                color="var(--color-black)"
              />
            </div>
            <div>
              <Label
                label="# Of Fields Changed"
                size="small"
                color="var(--color-primary)"
              />
              <br />
              <Label
                label={data.modifiedColumnsCount}
                size="extra-small"
                color="var(--color-black)"
              />
            </div>
          </div>
        </AccordionHeader>
        <AccordionBody className="text-colorBlack text-sm font-Rubik">
          <div className="grid grid-cols-3 gap-4 px-4 py-2 w-full">
            {parsedDate
              ?.filter((d: any) => !d.title.includes("Id"))
              .filter((d: any) => !d.title.includes("is"))
              ?.map((data: any, index: number) => {
                return (
                  <div
                  title={checkData(data)}
                    key={index}
                    className="flex cursor-help flex-col gap-y-2 justify-center "
                  >
                    <Label
                      size="extra-small"
                      color="var(--color-neutral-700)"
                      label={checkTitle(data?.title)
                        .split(" ")
                        .map(
                          (string: any) =>
                            string.charAt(0).toUpperCase() + string.slice(1)
                        )
                        .join(" ")}
                    />
                    <div title={checkData(data)} className="flex cursor-auto items-center  text-wrap text-[0.75rem] flex-wrap justify-start font-normal">
                      {checkData(data).length < 40 ?checkData(data):[...checkData(data).slice(0,50).split(""),'...'].join("")}
                    </div>
                  </div>
                );
              })}
          </div>
        </AccordionBody>
      </Accordion>
    </div>
  );
};

export default ChangeHistoryDataDiv;
