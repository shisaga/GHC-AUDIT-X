/* eslint-disable @typescript-eslint/promise-function-async */
"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import { TbLock } from "react-icons/tb";
import { useAuth } from "../../contexts/AuthProvider";
import { BiMailSend } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { Label } from "@/stories/Label/Label";
import { Button } from "@/stories/Button/Button";
import { errorToast } from "@/hooks/toaster/useCustomToaster";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import PasswordVisibilityToggle from "../Common/PasswordVisibilityToggle";
import { useCookie } from "@/hooks/auth/useCookie";

const SignIn = () => {
  const [authKey, setAuthKey] = useCookie<string>("authKey", "");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { isLoggingIn, login, userInfo, isFetchingUserInfo } = useAuth();

  useEffect(() => {
    if (!isFetchingUserInfo && userInfo) {
      userInfo?.roles?.[0].name === "Contractor"
        ? router.push(`/audits`)
        : router.push(`/dashboard`);
    }
  }, [isFetchingUserInfo, userInfo]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
      .then((res) => {
        router.push(`/dashboard`);
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message as string);
      });
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      email: "",
      password: "",
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
      password: Yup.string().required("Password required"),
    }),
    onSubmit: (values) => handleLogin(values.email, values.password),
  });


// useEffect(()=>{
//  if( authKey) {
//     router.push(`/dashboard`);
//  }else{
//   router.push(`/`);
//  }
// },[])

  return (
    <main className="w-full h-full">
      <div className="relative md:flex">
        <div className="bg-white md:w-1/2">
          <div className="min-h-screen h-full flex flex-col justify-center items-center">
            <div className="flex items-center justify-center px-4 sm:w-full w-auto max-w-md pb-[30px] mb-10 sm:px-6 lg:px-4">
              <Image
                src={"/images/logo.png"}
                draggable="false"
                className=" "
                height={45}
                width={300}
                alt="Logo"
              />
            </div>
            <div className="max-w-md sm:w-[75%] w-[90%] md:px-4">
              <h1 className="text-themeSecondary font-bold text-2xl mb-4 sm:text-left text-center">
                Sign In
              </h1>
              <div className="mb-4">
                <Label
                  label="Welcome back, sign in with your credentials below"
                  color="var(--color-neutral-700)"
                />
              </div>

              <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="email"
                    >
                      Email<span className="text-colorDanger">*</span>
                    </label>
                    <div className="relative">
                      <BiMailSend className="text-themePrimary pointer-events-none h-5 w-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                      <input
                        id="email"
                        className={`form-input border font-medium rounded-normal ${
                          formik.touched.email && Boolean(formik.errors.email)
                            ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                            : "border-colorLighter focus:border-themePrimary"
                        } py-3 px-4 bg-white text-sm  appearance-none w-full block pl-14 focus:outline-none`}
                        value={formik.values.email}
                        onChange={(e) => {
                          formik.setFieldTouched(
                            e?.target?.name || e?.target?.id,
                            true
                          );
                          formik.handleChange(e);
                        }}
                        type="email"
                        placeholder="Enter Email"
                      />
                    </div>
                    {formik.touched.email && Boolean(formik.errors.email) && (
                      <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                        {formik.touched.email && formik.errors.email}
                      </span>
                    )}
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="password"
                    >
                      Password<span className="text-colorDanger">*</span>
                    </label>
                    <div className="relative">
                      <TbLock className="text-themePrimary pointer-events-none h-5 w-5 absolute top-1/2 transform -translate-y-1/2 left-3" />

                      <input
                        id="password"
                        className={`form-input rounded-normal border font-medium ${
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                            ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                            : "border-colorLighter focus:border-themePrimary"
                        } py-3 px-4 bg-white text-sm  appearance-none w-full block pl-14 focus:outline-none `}
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password.trim()}
                        onChange={(e) => {
                          formik.setFieldTouched(
                            e?.target?.name || e?.target?.id,
                            true
                          );
                          formik.handleChange(e);
                        }}
                        autoComplete="on"
                        placeholder="Enter Password"
                      />
                      <PasswordVisibilityToggle
                        isVisible={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />
                    </div>

                    {formik.touched.password &&
                      Boolean(formik.errors.password) && (
                        <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                          {formik.touched.password && formik.errors.password}
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex items-end justify-end mt-6">
                  <Link
                    className="text-base text-themePrimary font-medium hover:underline"
                    href="/reset-password"
                  >
                    Forgot Password?
                  </Link>
                  <br />
                </div>
                {isLoggingIn ? (
                  <LoadingButton
                    label="Loading"
                    size="large"
                    className="w-full !font-semibold h-14 mt-8"
                    disabled={isLoggingIn}
                  />
                ) : (
                  <Button
                    type="submit"
                    label="Sign in"
                    size="large"
                    className="w-full !font-semibold h-14 mt-8 hover:opacity-90"
                  />
                )}
              </form>

              {/* <div className="flex items-center mt-6">
                <hr className="w-2/5 border-colorLighter" />
                <Label
                  label="Or"
                  className="w-1/6 font-bold text-colorLight text-center"
                />
                <hr className="w-2/5 border-colorLighter" />
              </div> */}

              {/* <div className="mt-6 text-center font-normal">
                <div className="text-sm">
                  Don’t you have an account yet?&nbsp;
                  <Link
                    className="text-themePrimary font-medium cursor-pointer hover:underline"
                    href="/signup"
                  >
                    Sign Up
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div
          className="hidden md:flex bg-themeSecondary top-0 bottom-0 left-0 md:w-1/2 flex-col items-center justify-center px-20"
          aria-hidden="true"
        >
          <h1 className="xl:text-4xl lg:text-3xl sm:text-2xl font-normal pb-7 text-white text-center">
            Empowering audits with advanced technology.
          </h1>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
