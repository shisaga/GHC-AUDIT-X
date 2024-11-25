"use client";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordVisibilityToggle = ({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) => {
  return (
    <>
      {isVisible ? (
        <AiOutlineEye
          onClick={onToggle}
          className="text-themePrimary bg-colorWhite cursor-pointer absolute top-1/2 w-5 h-5 transform -translate-y-1/2 right-3"
        />
      ) : (
        <AiOutlineEyeInvisible
          onClick={onToggle}
          className="text-themePrimary bg-colorWhite cursor-pointer absolute top-1/2 w-5 h-5 transform -translate-y-1/2 right-3"
        />
      )}
    </>
  );
};

export default PasswordVisibilityToggle;
