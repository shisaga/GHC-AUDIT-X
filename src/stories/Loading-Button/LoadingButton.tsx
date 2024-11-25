import React from "react";
import { Button, ButtonProps } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface LoadingButtonProps extends ButtonProps {}
/**
 * Primary UI component for user interaction
 */
export const LoadingButton = ({ ...props }: LoadingButtonProps) => {
  return <Button icon={<FontAwesomeIcon icon={faSpinner} spin />} {...props} />;
};
