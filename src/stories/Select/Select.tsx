import React from "react";
import { Label } from "../Label/Label";
import Image from "next/image";

interface SBSelectProps {
  id: string;
  label: string;
  options: Array<{ value: string; label: string; image?: string }>;
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  wrapperClassName?: string;
  error?: boolean;
  requiredField?: boolean;
  success?: boolean;
  warning?: boolean;
  touched?: boolean;
  optionLabel?:string;
  errorMessage?: string;
  hideOptionalOption?: boolean;
  disabledOptionalOption?: boolean;
}

const SBSelect: React.FC<SBSelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  optionLabel,
  hideOptionalOption,
  disabledOptionalOption,
  wrapperClassName,
  error,
  requiredField,
  touched,
  errorMessage = "",
}) => {
  const selectClasses = [
    "block",
    "w-full",
    "text-sm",
    "",
    "rounded-lg",
    "border-1",
    "appearance-none",
    "focus:outline-none",
    "focus:ring-0",
    "peer",
    "h-12",
    "disabled:cursor-not-allowed",
    "disabled:opacity-70",
    touched && error && "form-error",
  ].join(" ");

  const wrapperClasses = [
    "storybook-select",
    "input-field",
    wrapperClassName,
  ].join(" ");

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
    "peer-placeholder-shown:top-1/2",
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
        <select
          id={id}
          className={selectClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {!hideOptionalOption && (
            <option key="select" value="" disabled={disabledOptionalOption}>
              Select {optionLabel||label}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option?.image && (
                <Image
                  width={20}
                  height={20}
                  src={option?.image}
                  alt={option.value}
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}

              {option.label}
            </option>
          ))}
        </select>
        <label htmlFor={id} className={labelClasses}>
          {label}
          {requiredField && <span className="text-colorDanger">*</span>}
        </label>
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

export default SBSelect;
