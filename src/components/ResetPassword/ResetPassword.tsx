"use client";
import { useFormik } from "formik";
import Image from "next/image";
import * as Yup from "yup";
import React, { useState } from "react";
import { BiMailSend } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "@/stories/Button/Button";
import { Label } from "@/stories/Label/Label";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { sendVerificationLink } from "@/hooks/useRegister";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";

const ResetPassword = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Email is not valid")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email is not valid"
        )
        .max(50, "Maximum email length is 50")
        .required("Email is required"),
    }),
    onSubmit: async (values) => await sendVerificationEmail(values.email),
  });

  const sendVerificationEmail = async (values: string) => {
    setIsLoading(true);
    try {
      const response: any = await sendVerificationLink(values);
      // also BE should return proper flag for successful completion
      if (response) {
        successToast("Email Sent Successfully.");
        setIsLoading(false);
        router.push("/signin");
      }
    } catch (error: any) {
      errorToast(error.response?.data?.message as string);
      setIsLoading(false);
    }
    setIsLoading(false);
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
            <div className="flex items-center justify-center mb-10 w-7/12">
              <div className="px-4">
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
                Reset Your Password
              </h1>
              <div className="mb-4">
                <Label
                  label="We will email you the instructions to reset your password."
                  color="var(--color-darkGray)"
                />
              </div>
              <form className="pt-4" onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="email"
                    >
                      Email Address<span className="text-colorDanger">*</span>
                    </label>
                    <div className="relative">
                      <BiMailSend className="text-themePrimary pointer-events-none h-5 w-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                      <input
                        id="email"
                        className={`form-input border rounded-normal font-medium ${
                          formik.touched.email && Boolean(formik.errors.email)
                            ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                            : "border-colorLighter focus:border-themePrimary"
                        } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 or focus:outline-none`}
                        type="email"
                        max={75}
                        placeholder="Enter your email address"
                        value={formik.values.email}
                        onChange={(e) => {
                          formik.setFieldTouched(
                            e?.target?.name || e?.target?.id,
                            true
                          );
                          formik.handleChange(e);
                        }}
                      />
                    </div>
                    {formik.touched.email && Boolean(formik.errors.email) && (
                      <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                        {formik.touched.email && formik.errors.email}
                      </span>
                    )}
                  </div>
                </div>
                {isLoading ? (
                  <LoadingButton
                    label="Sending"
                    size="large"
                    className="w-full !font-semibold h-14 mt-8 whitespace-nowrap"
                  />
                ) : (
                  <Button
                    type="submit"
                    label="Send Reset Link"
                    size="large"
                    className="w-full !font-semibold h-14 mt-8 hover:opacity-90 whitespace-nowrap"
                  />
                )}

                <div
                  onClick={() => router.push("/signin")}
                  className="flex cursor-pointer mt-5 text-[14px] font-semibold text-themeSecondary items-center"
                >
                  <MdArrowBackIos />
                  <span className="ml-[5px]">Back To Sign In</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
