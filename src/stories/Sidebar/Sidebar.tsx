import React, { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "./Sidebar.scss";
import { Heading } from "../Heading/Heading";
import { FaTimes } from "react-icons/fa";

interface SidebarProps {
  /**
   * Sidebar title
   */
  title: string;
  /**
   * Sidebar title
   */
  children: ReactNode;
  /**
   * Optional sidebar class
   */
  className?: string;
  /**
   * Optional sidebar width
   */
  sidebarWidth?: string;
  /**
   * Optional sidebar header class
   */
  headerClassName?: string;
  /**
   * Optional sidebar header style
   */
  headerStyle?: object;
  /**
   * Optional sidebar content class
   */
  contentClassName?: string;
  /**
   * Open sidebar
   */
  open: boolean;
  /**
   * If true then sidebar wasn't close on outside click
   */
  staticModal?: boolean;
  /**
   * Sidebar close handler
   */
  close: VoidFunction;
}

/**
 * Primary UI component for user interaction
 */
export const Sidebar = ({
  className,
  sidebarWidth,
  open,
  close,
  staticModal,
  title,
  children,
  headerClassName,
  contentClassName,
  headerStyle,
}: SidebarProps) => {
  return (
    <Transition.Root as={Fragment} show={open}>
      <Dialog
        as="div"
        className={["relative z-50", className].join(" ")}
        onClose={() => {
          !staticModal && close();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none flex-1 fixed inset-y-0 right-0 flex max-w-full sm:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={`flex flex-col pointer-events-auto relative w-screen h-full ${sidebarWidth ? `${sidebarWidth}` : "max-w-md"} bg-white`}
                >
                  <div
                    className={[
                      "flex flex-none relative p-3  justify-between items-center z-30",
                      headerClassName,
                    ].join(" ")}
                    style={headerStyle}
                  >
                    <Heading label={title} type="h4" />
                    <FaTimes
                      size={"25px"}
                      onClick={close}
                      className="cursor-pointer"
                    />
                  </div>
                  <div
                    className={[
                      "relative flex grow flex-col shadow-xl overflow-y-auto p-4",
                      contentClassName,
                    ].join(" ")}
                  >
                    {children}
                  </div>


                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
