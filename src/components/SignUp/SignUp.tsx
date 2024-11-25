"use client";
import "../../styles/toaster.scss";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useRegister } from "@/hooks/useRegister";
import PasswordCheckList from "@/partials/PasswordCheckList";
import { TremsCondition } from "@/partials/TremsCondition";
import { Button } from "@/stories/Button/Button";
import { Label } from "@/stories/Label/Label";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { UserInfo } from "@/types/user";
import {
  formatPhoneNumber,
  removeSpecialCharacters,
} from "@/utils/CommonFunction";
import { Checkbox } from "@material-tailwind/react";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiMailSend } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbLock } from "react-icons/tb";
import * as Yup from "yup";
import PasswordVisibilityToggle from "../Common/PasswordVisibilityToggle";
import { useCookie } from "@/hooks/auth/useCookie";

const Signup = () => {
  const [authKey, setAuthKey] = useCookie<string>("authKey", "");
  const { isRegistering, register } = useRegister();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async (values: UserInfo) => {
    await register({
      ...values,
    })
      .then(() => {
        successToast("Please check your mail for email verification.");
        router.push("/signin");
        formik.resetForm();
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message as string);
      });
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      accountType: "Service Organization",
      SOPrefix: "",
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      companyName: "",
      password: "",
      confirmPassword: "",
      hasAcceptedTerm: false,
    },
    validationSchema: Yup.object({
      SOPrefix: Yup.string()
        .min(3, "Mininum SO prefix length is 3")
        .max(50, "Maximum SO prefix length is 50")
        .required("SO prefix is required")
        .trim(),
      email: Yup.string()
        .trim()
        .email("Email is not valid")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email is not valid"
        )
        .max(50, "Maximum email length is 50")
        .required("Email is required"),
      firstName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
        .min(3, "Mininum first name length is 3")
        .max(15, "Maximum first name length is 15")
        .required("First name is required")
        .trim(),
      lastName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Last name must contain only letters")
        .min(3, "Mininum last name length is 3")
        .max(15, "Maximum last name length is 15")
        .required("Last name is required")
        .trim(),
      companyName: Yup.string()
        .min(3, "Mininum company name length is 3")
        .max(75, "Maximum company name length is 75")
        .required("Company name is required")
        .trim(),
      mobile: Yup.string()
        .trim()
        .matches(/^\d{10}$/, "Maximum Phone number length is 10"),
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
      hasAcceptedTerm: Yup.boolean().oneOf(
        [true],
        "Please accept the terms and conditions"
      ),
    }),
    onSubmit: async (values) => await handleRegister(values),
  });

  // const handleClickTerm = () => {
  //   window.open("https://www.brilworks.com/", "_blank");
  // }
  // useEffect(()=>{
  //   if( authKey) {
  
  //      router.push(`/dashboard`);
  //   }else{
  //    router.push(`/`);
  //   }
  //  },[])

  return (
    <main>
      <div className="relative md:flex h-full">
        <div
          className="hidden md:flex bg-themeSecondary top-0 bottom-0 left-0 md:w-1/2 flex-col items-center justify-center px-20 h-screen overflow-hidden"
          aria-hidden="true"
        >
          <h1 className="xl:text-4xl lg:text-3xl sm:text-2xl font-normal pb-7 text-white text-center">
            Empowering audits with advanced technology.
          </h1>
        </div>
        <div className="bg-white md:w-1/2 h-screen overflow-auto">
          <div className="min-h-screen h-full">
            <div className="flex flex-col justify-center items-center mt-5">
              <div className="flex items-center justify-center px-4 sm:w-full w-auto max-w-md mb-8 sm:px-6 lg:px-4 mt-1 md:mt-9">
                <Image
                  src={"/images/logo.png"}
                  draggable="false"
                  alt="Logo"
                  className=" "
                  height={45}
                  width={300}
                />
              </div>
            </div>

            <div className="m-auto px-4 py-8 xs:w-7/12">
              <>
                <h1 className="text-themeSecondary text-2xl mb-4 sm:text-left text-center font-bold">
                  Sign Up
                </h1>
                <div className="mb-4">
                  <Label
                    label="We will email you the instructions to verify your account."
                    color="var(--color-neutral-700)"
                  />
                </div>

                {/* Form */}
                <form className="pt-4" onSubmit={formik.handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="SOPrefix"
                      >
                        SO Prefix<span className="text-colorDanger">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineBuildingOffice2 className="text-themePrimary h-5 w-5 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" />
                        {/* <FaRegUser className="text-themePrimary pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" /> */}
                        <input
                          id="SOPrefix"
                          className={`form-input border rounded-normal font-medium ${
                            formik.touched.SOPrefix &&
                            Boolean(formik.errors.SOPrefix)
                              ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                              : "border-colorLighter  focus:border-themePrimary"
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
                          type="text"
                          value={formik.values.SOPrefix}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          placeholder="Enter SO Prefix"
                        />
                      </div>

                      {formik.touched.SOPrefix &&
                        Boolean(formik.errors.SOPrefix) && (
                          <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                            {formik.touched.SOPrefix && formik.errors.SOPrefix}
                          </span>
                        )}
                    </div>
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
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
                          type="email"
                          value={formik.values.email}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
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
                        htmlFor="name"
                      >
                        First Name<span className="text-colorDanger">*</span>
                      </label>
                      <div className="relative">
                        <FaRegUser className="text-themePrimary pointer-events-none h-[18px] w-[18px] absolute top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                          id="firstName"
                          className={`form-input border rounded-normal font-medium ${
                            formik.touched.firstName &&
                            Boolean(formik.errors.firstName)
                              ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                              : "border-colorLighter focus:border-themePrimary"
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
                          type="text"
                          value={formik.values.firstName}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          placeholder="Enter First Name"
                        />
                      </div>

                      {formik.touched.firstName &&
                        Boolean(formik.errors.firstName) && (
                          <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                            {formik.touched.firstName &&
                              formik.errors.firstName}
                          </span>
                        )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="name"
                      >
                        Last Name<span className="text-colorDanger">*</span>
                      </label>
                      <div className="relative">
                        <FaRegUser className="text-themePrimary pointer-events-none absolute h-[18px] w-[18px] top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                          id="lastName"
                          className={`form-input border rounded-normal font-medium ${
                            formik.touched.lastName &&
                            Boolean(formik.errors.lastName)
                              ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                              : "border-colorLighter focus:border-themePrimary"
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
                          type="text"
                          value={formik.values.lastName}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          placeholder="Enter Last Name"
                        />
                      </div>

                      {formik.touched.lastName &&
                        Boolean(formik.errors.lastName) && (
                          <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                            {formik.touched.lastName && formik.errors.lastName}
                          </span>
                        )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="mobile"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="text-themePrimary pointer-events-none absolute h-5 w-5 top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                          id="mobile"
                          className={`form-input border rounded-normal font-medium ${
                            formik.touched.mobile &&
                            Boolean(formik.errors.mobile)
                              ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                              : "border-colorLighter focus:border-themePrimary"
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
                          type="text"
                          value={formatPhoneNumber(formik.values.mobile)}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            e.target.value = removeSpecialCharacters(
                              e.target.value
                            );
                            formik.handleChange(e);
                          }}
                          placeholder="Enter Phone Number"
                        />
                      </div>

                      {formik.touched.mobile &&
                        Boolean(formik.errors.mobile) && (
                          <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                            {formik.touched.mobile && formik.errors.mobile}
                          </span>
                        )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="SOPrefix"
                      >
                        Company Name<span className="text-colorDanger">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineBuildingOffice2 className="text-themePrimary pointer-events-none absolute h-5 w-5 top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                          id="companyName"
                          className={`form-input border rounded-normal font-medium ${
                            formik.touched.companyName &&
                            Boolean(formik.errors.companyName)
                              ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                              : "border-colorLighter focus:border-themePrimary"
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
                          type="text"
                          value={formik.values.companyName}
                          onChange={(e) => {
                            formik.setFieldTouched(
                              e?.target?.name || e?.target?.id,
                              true
                            );
                            formik.handleChange(e);
                          }}
                          placeholder="Enter Company Name"
                        />
                      </div>

                      {formik.touched.companyName &&
                        Boolean(formik.errors.companyName) && (
                          <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                            {formik.touched.companyName &&
                              formik.errors.companyName}
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
                        <TbLock className="text-themePrimary pointer-events-none absolute top-1/2 h-5 w-5 transform -translate-y-1/2 left-3" />
                        <input
                          id="password"
                          className={`form-input border rounded-normal font-medium ${
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                              ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                              : "border-colorLighter focus:border-themePrimary"
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
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
                          <PasswordCheckList
                            password={formik.values.password}
                          />
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
                        <TbLock className="text-themePrimary pointer-events-none h-5 w-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                        <input
                          id="confirmPassword"
                          className={`form-input border rounded-normal font-medium ${
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                              ? "!border-colorDanger hover:border-colorDanger focus:border-colorDanger"
                              : "border-colorLighter focus:border-themePrimary"
                          } py-3 px-4 bg-white text-sm appearance-none w-full block pl-14 focus:outline-none`}
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
                  <div className="flex items-center justify-between mt-6">
                    <Checkbox
                      containerProps={{
                        className: "p-0.5 mr-2 inline-flex rounded-md",
                      }}
                      id="hasAcceptedTerm"
                      onChange={formik.handleChange}
                      label="Terms and conditions"
                      labelProps={{
                        className: "text-themeSecondary text-sm font-normal",
                      }}
                    />
                  </div>
                  {formik.touched.hasAcceptedTerm &&
                    Boolean(formik.errors.hasAcceptedTerm) && (
                      <span className="flex items-center font-normal tracking-wide text-colorDanger text-xs mt-1 ml-1">
                        {formik.touched.hasAcceptedTerm &&
                          formik.errors.hasAcceptedTerm}
                      </span>
                    )}
                  {isRegistering ? (
                    <LoadingButton
                      label="Loading"
                      className="w-full !font-semibold h-14 mt-8"
                      size="large"
                      disabled={isRegistering}
                    />
                  ) : (
                    <Button
                      type="submit"
                      label=" Sign Up"
                      size="large"
                      className="w-full !font-semibold h-14 mt-8 hover:opacity-90"
                    />
                  )}
                </form>

                <div className=" mt-6 text-center font-normal">
                  <div className="text-sm">
                    Already have an account?&nbsp;
                    <Link
                      className="text-themePrimary font-medium !cursor-pointer hover:underline"
                      href="/signin"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
      <TremsCondition></TremsCondition>
    </main>
  );
};

export default Signup;
