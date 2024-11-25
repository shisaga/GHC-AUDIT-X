import React from "react";
import { FcCheckmark } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";

const PasswordCheckList = ({ password }: { password: string }) => {
  const checkPassword = () => {
    return {
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
      isMinimumLength: password.length >= 8,
    };
  };

  return (
    <>
      <p className="mt-2 text ">Your password must contain:</p>
      <div className="flex flex-wrap gap-x-10  gap-y-2 p-2">
        <div
          className="flex justify-center w-50 items-center   gap-2"
          style={{
            color: !checkPassword().hasUpperCase
              ? "var(--danger-red)"
              : "var(--color-green)",
          }}
        >
          {!checkPassword().hasUpperCase ? <GoDotFill /> : <FcCheckmark />}
          one uppercase character
        </div>
        <div
          className="flex justify-center w-50 items-center   gap-2"
          style={{
            color: !checkPassword().hasSpecialChar
              ? "var(--danger-red)"
              : "var(--color-green)",
          }}
        >
          {!checkPassword().hasSpecialChar ? <GoDotFill /> : <FcCheckmark />}
          one special character
        </div>

        <div
          className="flex justify-center w-50 items-center gap-2"
          style={{
            color: !checkPassword().hasLowerCase
              ? "var(--danger-red)"
              : "var(--color-green)",
          }}
        >
          {!checkPassword().hasLowerCase ? <GoDotFill /> : <FcCheckmark />}
          one lowercase character
        </div>
        <div
          className="flex justify-center w-50 items-center gap-2"
          style={{
            color: !checkPassword().isMinimumLength
              ? "var(--danger-red)"
              : "var(--color-green)",
          }}
        >
          {!checkPassword().isMinimumLength ? <GoDotFill /> : <FcCheckmark />}8
          character minimum
        </div>
        <div
          className="flex justify-center w-50 items-center  gap-2 "
          style={{
            color: !checkPassword().hasNumber
              ? "var(--danger-red)"
              : "var(--color-green)",
          }}
        >
          {!checkPassword().hasNumber ? <GoDotFill /> : <FcCheckmark />}
          one number
        </div>
      </div>
    </>
  );
};

export default PasswordCheckList;
