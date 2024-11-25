/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";
import {
  ChangeEventHandler,
  useRef,
  useState,
  useEffect,
  RefObject,
} from "react";
import Downshift from "downshift";
import SBInput from "@/stories/Input/Input";

export interface iItemType {
  title: string;
  sub_title: string;
  key: any;
}
export interface SearchBarProps {
  label: string;
  isLoading: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeString: string;
  data: any[];
  onHandleSelect?: CallableFunction;
}
export default function SearchBar({
  label,
  isLoading,
  onChange,
  placeString,
  data,
  onHandleSelect = () => {}, // Keep this line,
}: SearchBarProps) {
  const [isOpenSearchBar, setIsOpenSearchBar] = useState(false);

  const refForHook = useRef(null);

  const handleClickOutside = () => {
    setIsOpenSearchBar(false);
  };

  useOnClickOutside(refForHook, handleClickOutside);

  return (
    <div ref={refForHook}>
      <Downshift itemToString={(item) => item || ""} isOpen={isOpenSearchBar}>
        {({
          getItemProps,
          getMenuProps,
          isOpen,
          highlightedIndex,
          setHighlightedIndex,
        }: any) => {
          const handleKeyNavigation = (e: any) => {
            const { key } = e;

            if (key == "ArrowUp") {
              setHighlightedIndex(
                highlightedIndex < 1 ? highlightedIndex : highlightedIndex - 1
              );
            }
            if (key == "ArrowDown") {
              setHighlightedIndex(
                highlightedIndex > data?.length - 1
                  ? highlightedIndex
                  : highlightedIndex + 1
              );
            }

            if (key == "Enter") {
              onHandleSelect(data[highlightedIndex]);
              setIsOpenSearchBar(false);
            }
          };

          return (
            <div tabIndex={1}>
              <SBInput
                id="search_address"
                name="search_address"
                label={label}
                value={placeString}
                inputType="search"
                onKeyDown={handleKeyNavigation}
                onChange={(e: any) => {
                  onChange(e);
                  setIsOpenSearchBar(true);
                }}
                onClick={() => {
                  setIsOpenSearchBar(true);
                }}
                onFocus={() => {
                  setIsOpenSearchBar(true);
                }}
              />
              <div className="relative">
                {data.filter(
                  ({ description }) =>
                    description.includes("Canada") ||
                    description.includes("canada")
                )?.length > 0 && (
                  <ul
                    className={`rounded absolute top-0 w-full bg-white border mt-2 md:mr-12 ${
                      !isOpen ? "hidden" : ""
                    } z-30`}
                    {...getMenuProps()}
                  >
                    {!isLoading && (
                      <>
                        {isOpen &&
                          data
                            .filter(
                              ({ description }) =>
                                description.includes("Canada") ||
                                description.includes("canada")
                            )
                            .map((item: any, index) => (
                              <li
                                tabIndex={index}
                                {...getItemProps({
                                  index,
                                  item,
                                  className: `py-2 px-2 cursor-pointer ${
                                    highlightedIndex === index
                                      ? "bg-themePrimary text-white font-normal"
                                      : "bg-white font-normal"
                                  }`,
                                })}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onHandleSelect(item);
                                  setIsOpenSearchBar(false);
                                }}
                              >
                                {item.description} {` `}
                              </li>
                            ))}
                      </>
                    )}
                  </ul>
                )}
              </div>
            </div>
          );
        }}
      </Downshift>
    </div>
  );
}

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event); // Call the handler only if the click is outside of the element passed.
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Reload only if ref or handler changes
};
