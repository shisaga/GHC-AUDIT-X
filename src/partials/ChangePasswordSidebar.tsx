"use client";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Button } from "@/stories/Button/Button";
import { Label } from "@/stories/Label/Label";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { TbLock } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import PasswordCheckList from "./PasswordCheckList";
import { Sidebar } from "@/stories/Sidebar/Sidebar";
import { useUpdatePassword } from "@/hooks/auth/useUpdatePassword";
import PasswordVisibilityToggle from "@/components/Common/PasswordVisibilityToggle";

interface ChangePasswordSidebarProps {
  open: boolean;
  close: () => void;
  id?: string;
}

const ChangePasswordSidebar = ({
  open,
  close,
  id,
}: ChangePasswordSidebarProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const { isUpdating, updatePassword } = useUpdatePassword();

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(),
      password: Yup.string()
        .matches(/^\S*$/g, "Cannot contain only blank spaces")
        .matches(/^(?=.*[a-z])/, "Password must include lowercase letter")
        .matches(/^(?=.*[A-Z])/, "Password must include uppercase letter")
        .matches(/^(?=.*[0-9])/, "Password must include digit")
        .matches(
          /^(?=.*[!@#\$%\^&\*])/,
          "Password must include special character @#$%^&*"
        )
        .min(8, "Minimum password length is 8")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .matches(/^\S*$/g, "Cannot contain only blank spaces")
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password")], "Password does not match."),
    }),
    onSubmit: async (values) => await handleSetNewPassword(values),
  });
  const handleSetNewPassword = async (values: FormikValues) => {
    try {
      const result = await updatePassword({
        oldPassword: formik.values.currentPassword,
        newPassword: formik.values.password,
      });
      successToast(result?.message as string);
      close();
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      errorToast(error?.response?.data?.message || "Failed to reset password");
    }
  };

  const closeSidebar = () => {
    close();
    formik.resetForm();
  };

  return (
    <Sidebar
      open={open}
      close={() => closeSidebar()}
      title={" Change Your Password"}
      headerClassName={"!border-t-8"}
      contentClassName="!p-0 !bg-colorWhite"
    >
      <form className="flex h-full flex-col gap-4 px-4">
        <div className="my-5">
          <Label
            size="small"
            label="To initiate the password change process, please provide your current password followed by the new password you wish to set."
            className="text-colorGray"
          />
        </div>
        <div className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="currentPassword"
            >
              Current Password
              <span className="text-colorDanger">*</span>
            </label>
            <div className="relative">
              <TbLock className="text-themePrimary pointer-events-none absolute w-5 h-5 top-1/2 transform -translate-y-1/2 left-3" />
              <input
                id="currentPassword"
                className={`form-input border rounded-normal font-medium ${
                  formik.touched.currentPassword &&
                  Boolean(formik.errors.currentPassword)
                    ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                    : "border-colorLightGray focus:border-themePrimary"
                } py-3 px-4 bg-white text-sm  appearance-none w-full block pl-14 focus:outline-none`}
                type={!showPassword ? "password" : "text"}
                autoComplete="off"
                value={formik.values.currentPassword.trim()}
                onChange={(e) => {
                  formik.setFieldTouched(
                    e?.target?.name || e?.target?.id,
                    true
                  );
                  formik.handleChange(e);
                }}
                placeholder="Enter Current Password"
              />
              <PasswordVisibilityToggle
                isVisible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            </div>
            {formik.touched.currentPassword &&
              Boolean(formik.errors.currentPassword) && (
                <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                  {formik.touched.currentPassword &&
                    formik.errors.currentPassword?.replace(
                      "currentPassword",
                      "Current Password"
                    )}
                </span>
              )}
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              New Password
              <span className="text-colorDanger">*</span>
            </label>
            <div className="relative">
              <TbLock className="text-themePrimary pointer-events-none absolute w-5 h-5 top-1/2 transform -translate-y-1/2 left-3" />
              <input
                id="password"
                className={`form-input border rounded-normal font-medium ${
                  formik.touched.password && Boolean(formik.errors.password)
                    ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                    : "border-colorLightGray focus:border-themePrimary"
                } py-3 px-4 bg-white text-sm  appearance-none w-full block pl-14 focus:outline-none`}
                type={!showNewPassword ? "password" : "text"}
                autoComplete="on"
                value={formik.values.password.trim()}
                onChange={(e) => {
                  formik.setFieldTouched(
                    e?.target?.name || e?.target?.id,
                    true
                  );
                  formik.handleChange(e);
                }}
                placeholder="Enter New Password"
              />
              <PasswordVisibilityToggle
                isVisible={showNewPassword}
                onToggle={() => setShowNewPassword(!showNewPassword)}
              />
            </div>
            {formik.touched.password &&
              (Boolean(formik.errors.password) ? (
                <PasswordCheckList password={formik.values.password} />
              ) : (
                <span className="flex items-center font-normal tracking-wide text-colorGreen text-xs mt-1 ml-1">
                  Your password strenth is strong.
                </span>
              ))}
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
              <span className="text-colorDanger">*</span>
            </label>
            <div className="relative">
              <TbLock className="text-themePrimary pointer-events-none absolute top-1/2 w-5 h-5 transform -translate-y-1/2 left-3" />
              <input
                id="confirmPassword"
                className={`form-input border rounded-normal font-medium ${
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                    ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                    : "border-colorLightGray focus:border-themePrimary"
                } py-3 px-4 bg-white text-sm  appearance-none w-full block pl-14 focus:outline-none`}
                type={!showConfirmPassword ? "password" : "text"}
                autoComplete="on"
                value={formik.values.confirmPassword.trim()}
                onChange={(e) => {
                  formik.setFieldTouched(
                    e?.target?.name || e?.target?.id,
                    true
                  );
                  formik.handleChange(e);
                }}
                placeholder="Enter Confirm Password"
              />
              <PasswordVisibilityToggle
                isVisible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword) && (
                <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </span>
              )}
          </div>
        </div>
      </form>
      <div
        className={"flex-none flex gap-2 bg-white px-4 py-3 justify-end"}
        style={{ boxShadow: "0px -1px 0px 0px rgba(0, 0, 0, 0.15)" }}
      >
        {isUpdating ? (
          <LoadingButton size="large" label="Updating" />
        ) : (
          <>
            <Button
              label="Cancel"
              size="large"
              onClick={() => closeSidebar()}
              variant="outline-gray"
              className="hover:bg-colorLightest"
            />
            <Button
              label="Update"
              type="submit"
              onClick={() => formik.handleSubmit()}
              size="large"
              className="hover:bg-hoverPrimary"
              disabled={isUpdating}
            />
          </>
        )}
      </div>
    </Sidebar>
  );
};
export default ChangePasswordSidebar;
