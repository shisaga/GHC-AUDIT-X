/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
"use client";
import { FormikValues, useFormik } from "formik";
import Image from "next/image";
import * as Yup from "yup";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "@/stories/Button/Button";
import { Label } from "@/stories/Label/Label";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { TbLock } from "react-icons/tb";
import { useResetNewPassword } from "@/hooks/auth/useResetPassword";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import PasswordCheckList from "@/partials/PasswordCheckList";
import PasswordVisibilityToggle from "../Common/PasswordVisibilityToggle";

const SetPassword = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const code = searchParams.get("token");

  const { isResetting, resetNewPassword } = useResetNewPassword();

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(/^\S*$/g, "Cannot contain only blank spaces")
        .matches(/^(?=.*[a-z])/, "Password must include lowercase letter")
        .matches(/^(?=.*[A-Z])/, "Password must include uppercase letter")
        .matches(/^(?=.*[0-9])/, "Password must include digit")
        .matches(
          // eslint-disable-next-line no-useless-escape
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
      const result = await resetNewPassword({
        code: code as string,
        newPassword: values.password,
      });
      if (result) {
        successToast("Password Saved Successfully");
        formik.resetForm();
        router.push("/signin");
      }
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      errorToast(error.response?.data?.message || "Failed to set password");
    }
  };

  return (
    <main>
      <div className="relative md:flex">
        <div
          className="hidden md:flex bg-themeSecondary top-0 bottom-0 left-0 md:w-1/2 flex-col items-center justify-center px-20"
          aria-hidden="true"
        >
          <h1 className="xl:text-4xl lg:text-3xl sm:text-2xl font-normal pb-7 text-white text-center">
            Empowering audits with advanced technology.
          </h1>
        </div>
        <div className="bg-white md:w-1/2">
          <div className="min-h-screen h-full flex flex-col justify-center items-center">
            <div className="w-7/12">
              <div className="flex items-center justify-center mb-10 px-4">
                <Image
                  className="text-center h-auto"
                  src={"/images/logo.png"}
                  height={45}
                  width={300}
                  alt="Authentication"
                  draggable={false}
                />
              </div>
            </div>

            <div className="px-4 py-8 xs:w-7/12">
              <h1 className="text-themeSecondary font-bold text-2xl mb-4">
                Set Your Password
              </h1>
              <div className="mb-4">
                <Label
                  label="set your credentials below"
                  color="var(--color-neutral-700)"
                />
              </div>
              <form className="pt-4" onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="password"
                    >
                      Password<span className="text-colorDanger">*</span>
                    </label>
                    <div className="relative">
                      <TbLock className="text-themePrimary pointer-events-none absolute w-5 h-5 top-1/2 transform -translate-y-1/2 left-3" />
                      <input
                        id="password"
                        className={`form-input border rounded-normal font-medium ${
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                            ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                            : "border-colorLighter focus:border-themePrimary"
                        } py-3 px-4 bg-white text-sm  appearance-none w-full block pl-14 focus:outline-none`}
                        type={!showPassword ? "password" : "text"}
                        autoComplete="on"
                        value={formik.values.password.trim()}
                        onChange={(e) => {
                          formik.setFieldTouched(
                            e?.target?.name || e?.target?.id,
                            true
                          );
                          formik.handleChange(e);
                        }}
                        placeholder="Enter Password"
                      />
                      <PasswordVisibilityToggle
                        isVisible={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />
                    </div>
                    {formik.touched.password &&
                      (Boolean(formik.errors.password) ? (
                        <>
                          <PasswordCheckList
                            password={formik.values.password}
                          />
                        </>
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
                      <TbLock className="text-themePrimary pointer-events-none absolute w-5 h-5 top-1/2 transform -translate-y-1/2 left-3" />
                      <input
                        id="confirmPassword"
                        className={`form-input border rounded-normal font-medium ${
                          formik.touched.confirmPassword &&
                          Boolean(formik.errors.confirmPassword)
                            ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                            : "border-colorLighter focus:border-themePrimary"
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
                        onToggle={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                {isResetting ? (
                  <LoadingButton
                    label="Saving"
                    size="large"
                    className="w-full !font-semibold h-14 mt-8 whitespace-nowrap"
                  />
                ) : (
                  <Button
                    type="submit"
                    label="Save Password"
                    size="large"
                    className="w-full !font-semibold h-14 mt-8 hover:opacity-90 whitespace-nowrap"
                  />
                )}

                {/* <div
                  onClick={() => router.push("/signin")}
                  className="flex cursor-pointer mt-5 text-[14px] font-[600] text-themeborder-themePrimary items-center"
                >
                  <MdArrowBackIos />
                  <span className="ml-[5px]">Back To Sign In</span>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SetPassword;
