import React from "react";
import "./textarea.scss";
import { Label } from "../Label/Label";

interface TextareaProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  disabled?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  error?: boolean;
  touched?: boolean;
  errorMessage?: string;
  autoComplete?: HTMLInputElement["autocomplete"];
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInput?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const SBTextarea: React.FC<TextareaProps> = ({
  id,
  name,
  label,
  value,
  error,
  disabled,
  wrapperClassName,
  inputClassName,
  touched,
  errorMessage = "",
  autoComplete = "off",
  onInput,
  onChange,
  onClick,
  onFocus,
  onKeyDown,
  onBlur,
}) => {
  const inputClasses = [
    "block",
    "w-full",
    "text-sm",
    "bg-transparent",
    "rounded-normal",
    "border-1",
    "appearance-none",
    "focus:outline-none",
    "focus:ring-0",
    "peer",
    "h-auto",
    "disabled:cursor-not-allowed",
    "disabled:opacity-70",
    touched && error && "form-error",
    inputClassName ?? "",
  ].join(" ");

  const wrapperClasses = ["storybook-input", wrapperClassName].join(" ");

  const labelClasses = [
    "absolute",
    "text-sm",
    "duration-300",
    "transform",
    "-translate-y-[1.15rem]",
    "scale-75",
    "top-2",
    "z-10",
    "origin-[0]",
    "bg-white",
    "px-2",
    "peer-focus:px-2",
    "peer-placeholder-shown:scale-100",
    "peer-placeholder-shown:-translate-y-1/2",
    "peer-placeholder-shown:top-1/4",
    "peer-focus:top-2",
    "peer-focus:scale-75",
    "peer-focus:-translate-y-[1.15rem]",
    "rtl:peer-focus:translate-x-1/4",
    "rtl:peer-focus:left-auto",
    "start-2",
    touched && error && "error-text",
  ].join(" ");

  return (
    <div className={wrapperClasses}>
      <div className="relative">
        <textarea
          id={id}
          name={name}
          className={inputClasses}
          placeholder=""
          disabled={disabled}
          value={value}
          onChange={onChange}
          onInput={onInput}
          onFocus={onFocus}
          autoComplete={autoComplete}
          onBlur={onBlur}
          rows={3}
        />
        <Label htmlFor={id} label={label} className={labelClasses} />
      </div>
      {touched && error && errorMessage && (
        <Label
          label={errorMessage}
          className="mt-1 px-1 error-text"
          size="small"
        />
      )}
    </div>
  );
};

export default SBTextarea;
