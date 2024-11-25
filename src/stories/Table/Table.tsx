import React, { ReactNode } from "react";

import "./Table.scss";
import { Label } from "../Label/Label";
import { Pagination, PaginationProps } from "../Pagination/Pagination";
import { isNumber } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownLong,
  faArrowUpLong,
} from "@fortawesome/free-solid-svg-icons";

export interface TableColumnProps {
  /**
   * Column name
   */
  label: string | ReactNode;
  /**
   * Column data key
   */
  value: string;
  /**
   * Optional column class name
   */
  className?: string;
  /**
   * Optional data class name
   */
  dataClassName?: string;
  /**
   * Optional hide column
   */
  hide?: boolean;
  /**
   * Optional sortable?
   */
  sortable?: boolean;
  /**
   * Optional if sort is active on particular column?
   */
  isActiveSort?: boolean;
  /**
   * Optional if sort is active then sort type of column?
   */
  sortType?: "asc" | "desc";
  /**
   * Optional sort function
   */
  sortFunction?: VoidFunction;
}

interface TableProps {
  /**
   * Table column
   */
  columns: TableColumnProps[];
  /**
   * Table data
   */
  data: any[];
  /**
   * Optional table classes
   */
  headerClassName?: string;
  /**
   * Optional table classes
   */
  bodyClassName?: string;
  /**
   * Optional table classes
   */
  className?: string;
  /**
   * Optional table classes
   */
  pagination?: PaginationProps;
}

/**
 * Primary UI component for user interaction
 */
export const Table = ({
  data,
  columns,
  className,
  headerClassName,
  bodyClassName,
  pagination,
}: TableProps) => {
  const {
    activePage,
    setActivePage,
    numberOfPage,
    numberOfRecords,
    itemsPerPage,
    setItemsPerPage,
    hidePagination,
  } = pagination || {};

  return (
    <>
      <div className="overflow-auto">
        <table className={["storybook--table", "w-full", className].join(" ")}>
          <thead
            className={[
              "storybook--table-head",
              "bg-colorLightest text-colorBlack text-left",
              headerClassName,
            ].join(" ")}
          >
            <tr>
              {columns.map(
                (column, index) =>
                  !column.hide && (
                    <th
                      key={index}
                      className={[
                        "py-2 px-3 first:px-5 last:px-5 whitespace-nowrap",
                        column.className,
                      ].join(" ")}
                      onClick={() =>
                        column?.sortable &&
                        column?.sortFunction &&
                        column.sortFunction()
                      }
                    >
                      <div
                        className={[
                          column.sortable &&
                            "flex items-center justify-between cursor-pointer gap-4",
                        ].join(" ")}
                      >
                        {typeof column.label === "string" ? (
                          <Label
                            label={column.label}
                            className={[
                              column.sortable && "cursor-pointer",
                              "w-full block",
                            ].join(" ")}
                          />
                        ) : (
                          column.label
                        )}
                        {column.sortable && (
                          <div className="m-3 flex">
                            <FontAwesomeIcon
                              icon={faArrowDownLong}
                              style={{
                                color: `${
                                  column.sortType === "desc"
                                    ? "var(--color-primary)"
                                    : "var(--color-neutral-700)"
                                }`,
                              }}
                            />
                            <FontAwesomeIcon
                              icon={faArrowUpLong}
                              style={{
                                color: `${
                                  column.sortType === "asc"
                                    ? "var(--color-primary)"
                                    : "var(--color-neutral-700)"
                                }`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className={["storybook--table-body", bodyClassName].join(" ")}>
            {data?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={[
                  "hover:bg-colorLightest border-b border-colorLighter",
                ].join(" ")}
              >
                {columns.map(
                  (column, colIndex) =>
                    !column.hide && (
                      <td
                        key={colIndex}
                        className={[
                          "py-2 px-3 first:px-5 last:px-5",
                          column.dataClassName,
                        ].join(" ")}
                      >
                        {typeof row[column?.value] === "string" ? (
                          <Label label={row[column?.value]} />
                        ) : (
                          row[column?.value]
                        )}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!hidePagination && setActivePage && isNumber(numberOfPage) && (
        <div className="p-5">
          <Pagination
            activePage={activePage || 0}
            setActivePage={setActivePage}
            numberOfPage={numberOfPage}
            className={pagination?.className}
            numberOfRecords={numberOfRecords}
            itemsPerPage={itemsPerPage || 10}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
    </>
  );
};
