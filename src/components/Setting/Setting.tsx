/* eslint-disable @typescript-eslint/promise-function-async */
"use client";
import { useAuth } from "@/contexts/AuthProvider";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Heading } from "@/stories/Heading/Heading";
import { Card } from "@/stories/Card/Card";
import { Label } from "@/stories/Label/Label";
import { CompanyInfo } from "@/types/company";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../styles/customstyle.scss";
import {
  availableCountriesList,
  formatPhoneNumber,
  removeSpecialCharacters,
} from "@/utils/CommonFunction";
import { Button } from "@/stories/Button/Button";
import { IoCamera } from "react-icons/io5";
import SBInput from "@/stories/Input/Input";
import SBSelect from "@/stories/Select/Select";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import {
  useGetCompanySetting,
  useUpdateCompanySetting,
} from "@/hooks/useCompany";
import { useRouter } from "next/navigation";
import { APLHA_NUMERIC_REGEX, CANADA_PROVINCES } from "@/utils/constant";

const Setting = () => {
  const { userInfo, handleRefetch } = useAuth();
  const router = useRouter();
  const { isFetchingCompanyInfo, getCompanyInfo } = useGetCompanySetting();
  const { isUpdatingCompanySetting, updateCompanySetting } =
    useUpdateCompanySetting();
  const [image, setImageObject] = useState<any>();
  const inputRef = useRef<any>(null);

  const handleUpdateSetting = async (formData: CompanyInfo) => {
    try {
      const updatedFormData: any = {
        ...formData,
        id: userInfo?.organizationId || "",
      };

      // Create a new FormData object
      const formDataToSend: any = new FormData();

      // Append formData to FormData object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.keys(updatedFormData).forEach((key: any) => {
        formDataToSend.append(key, updatedFormData[key]);
      });

      // Append image to FormData object if it exists
      if (image) {
        formDataToSend.append("image", image);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await updateCompanySetting(formDataToSend);
      successToast("Setting Updated Successfully");
      if (!isUpdatingCompanySetting) {
        handleRefetch();
      }
    } catch (e) {
      errorToast("Error uploading image ");
    }
  };

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount:true,
    initialValues: {
      companyName: "",
      companyEmail: "",
      SOPrefix: "",
      branchName: "",
      mobile: "",
      unit: "",
      streetAddress: "",
      city: "",
      imgUrl: "",
      province: "Ontario",
      country: "Canada",
      postalCode: "",
      businessNumber: "",
      bankName: "",
      bankAccountNumber: "",
      transitNumber: "",
      institution: "",
    },
    validationSchema: Yup.object({
      companyName: Yup.string()
        .max(100, "Maximum company name length is 100")
        .required("Company name is required")
        .trim()
        .min(3, "Minimum 3 character required"),
      mobile: Yup.string()
        .trim()
        .matches(/^\d{10}$/, "Maximum Phone number length is 10"),
      companyEmail: Yup.string()
        .trim()
        .email("Email is not valid")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email is not valid"
        )
        .max(50, "Maximum email length is 50")
        .required("Email is required"),
      SOPrefix: Yup.string()
        .max(50, "Maximum SO prefix length is 50")
        .required("SO prefix is required")
        .trim()
        .min(3, "Minimum 3 character required"),
      province: Yup.string().trim().required("Province is required"),
      streetAddress: Yup.string()
        .trim()
        .required("Street address is required")
        .min(3, "Minimum 3 character required"),
      country: Yup.string().trim().required("Country is required"),
      city: Yup.string().trim().required("City is required"),
      postalCode: Yup.string()
        .trim()
        .min(6, "Postal code must be 6 digit")
        .required("Postal code is required"),
      businessNumber: Yup.string()
        .trim()
        .matches(
          APLHA_NUMERIC_REGEX,
          "GST/HST  number only alphanumeric characters"
        )
        .required(`GST/HST number is required`),
    }),
    onSubmit: (values) => handleUpdateSetting(values),
  });

  const handleFileChange = async (event: any) => {
    const fileObj: any = event.target.files?.[0];
    if (!fileObj) return "";

    const companyName = "company";
    const organizationId = userInfo?.organizationId;

    // Extract file extension
    const extension = fileObj.name.split(".").pop();

    // Construct new file name with user email, user ID, and file extension
    const newFileName = `${companyName}_${organizationId}.${extension}`;

    // Create a new File object with the modified name
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const modifiedFile = new File([fileObj], newFileName, {
      type: fileObj.type,
    });

    // Create a URL for the selected image to display it if needed
    const imageUrl = URL.createObjectURL(modifiedFile);

    // Update formik values with the file and imageUrl
    formik.setValues({
      ...formik.values,
      imgUrl: imageUrl,
    });

    // Set the modified file object to state
    setImageObject(modifiedFile);
  };

  useEffect(() => {
    if (userInfo?.organizationId) {
      getCompanyInfo(userInfo?.organizationId)
        .then((orgInfo) => {
          formik.setValues({
            imgUrl: orgInfo?.imgUrl || "",
            companyEmail: orgInfo?.companyEmail || "",
            companyName: orgInfo?.companyName || "",
            SOPrefix: orgInfo?.SOPrefix || "",
            branchName: orgInfo?.branchName || "",
            mobile: orgInfo?.mobile || "",
            unit: orgInfo?.unit || "",
            streetAddress: orgInfo?.streetAddress || "",
            city: orgInfo?.city,
            province: orgInfo?.province || "Ontario",
            country: orgInfo?.country || "Canada",
            postalCode: orgInfo?.postalCode || "",
            businessNumber: orgInfo?.businessNumber || "",
            bankName: orgInfo?.bankName || "",
            bankAccountNumber: orgInfo?.bankAccountNumber || "",
            transitNumber: orgInfo?.transitNumber || "",
            institution: orgInfo?.institution || "",
          });
        })
        .catch((error) => console.log(error));
    }
  }, [userInfo]);

  const autoFocus = () => {
    formik.handleSubmit();
    if (Object.keys(formik.errors)[0]) {
      document?.getElementById(`${Object.keys(formik.errors)[0]}`)?.focus();

      return;
    } 
     
    
  };

  const removePlusMinus = (value: string) => {
    return value.replaceAll("-", "").replaceAll("+", "");
  };

  return (
    <div className="md:p-6 p-4 space-y-6">
      {isFetchingCompanyInfo || isUpdatingCompanySetting ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center justify-start">
            <div className="bg-themePrimary w-12 h-12 flex items-center justify-center rounded-[4px] mr-4 box-around">
              <HiOutlineBuildingOffice2 className="text-colorWhite text-xl" />
            </div>
            <Heading type="h3" label="Edit Business" />
          </div>

          <Card className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                autoFocus();
              }}
            >
              <div className="w-full">
                <div className="mb-5">
                  <Heading type="h5" label="Company info" />
                  <br />
                  <Label
                    size="small"
                    label="Update your company profile details."
                    className="text-colorLight"
                  />
                </div>
                <div className="mb-5">
                  <div className=" max-w-[150px] h-[150px]">
                    <figure className="profile-image">
                      <img
                        className="rounded-md h-[150px] w-[150px]  object-cover object-center"
                        src={
                          formik.values.imgUrl ||
                          "/images/user-icon-placeholder.webp"
                        }
                        alt="Company image"
                      />
                      <div
                        onClick={() => {
                          if (inputRef?.current) {
                            inputRef.current.click();
                          }
                        }}
                        className="change-profile cursor-pointer w-full justify-center items-center rounded-br-lg rounded-bl-lg py-2"
                      >
                        <Button
                          icon={<IoCamera className="text-lg" />}
                          label="Change Photo"
                          variant="icon"
                          className="!text-colorWhite"
                          backgroundColor=""
                        />
                      </div>
                      <input
                        className="hidden"
                        ref={inputRef}
                        type="file"
                        accept=".png, .jpg, .jpeg,"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onChange={handleFileChange}
                      />
                    </figure>
                  </div>
                </div>
                <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                  <SBInput
                    id="companyName"
                    name="companyName"
                    label="Company Name"
                    requiredField
                    value={formik.values.companyName}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.companyName)}
                    touched={Boolean(formik.touched.companyName)}
                    errorMessage={formik.errors.companyName}
                  />
                  <SBInput
                    id="mobile"
                    name="mobile"
                    label="Phone Number"
                    value={formatPhoneNumber(formik.values.mobile)}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      e.target.value = removeSpecialCharacters(e.target.value);
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.mobile)}
                    touched={Boolean(formik.touched.mobile)}
                    errorMessage={formik.errors.mobile}
                  />
                  <SBInput
                    id="companyEmail"
                    name="companyEmail"
                    label="Company Email"
                    value={formik.values.companyEmail}
                    disabled
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                  />
                  <SBInput
                    id="SOPrefix"
                    name="SOPrefix"
                    label="SO Prefix"
                    requiredField
                    value={formik.values.SOPrefix}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.SOPrefix)}
                    touched={Boolean(formik.touched.SOPrefix)}
                    errorMessage={formik.errors.SOPrefix}
                  />

                  <SBInput
                    id="branchName"
                    name="branchName"
                    label="Branch Name"
                    value={formik.values.branchName}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                  />
                </div>
              </div>

              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="w-full">
                <div className="flex-1">
                  <div className="mb-5">
                    <Heading type="h5" label="Address info" />
                    <br />
                    <Label
                      size="small"
                      label="Update your company address details."
                      className="text-colorLight"
                    />
                  </div>
                  <div className="grid xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 my-5">
                    <SBInput
                      id="unit"
                      name="unit"
                      label="Unit#"
                      value={formik.values.unit}
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      error={Boolean(formik.errors.unit)}
                      touched={Boolean(formik.touched.unit)}
                      errorMessage={formik.errors.unit}
                    />
                    <SBInput
                      id="streetAddress"
                      name="streetAddress"
                      label="Street Address"
                      requiredField
                      value={formik.values.streetAddress}
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      error={Boolean(formik.errors.streetAddress)}
                      touched={Boolean(formik.touched.streetAddress)}
                      errorMessage={formik.errors.streetAddress}
                    />
                    <SBInput
                      id="city"
                      name="city"
                      label="City"
                      value={formik.values.city}
                      requiredField
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      error={Boolean(formik.errors.city)}
                      touched={Boolean(formik.touched.city)}
                      errorMessage={formik.errors.city}
                    />
                    {formik.values.country === "Canada" ? (
                      <SBSelect
                        id="province"
                        label="Province"
                        value={formik.values.province}
                        hideOptionalOption={true}
                        requiredField
                        onChange={(data) => {
                          formik.setFieldValue("province", data);
                        }}
                        options={CANADA_PROVINCES.map((element: string) => {
                          return { value: element, label: element };
                        })}
                        error={Boolean(formik.errors.province)}
                        touched={Boolean(formik.touched.province)}
                        errorMessage={formik.errors.province}
                      />
                    ) : (
                      <SBInput
                        id="province"
                        name="province"
                        label="Province"
                        value={formik.values.province}
                        requiredField
                        onChange={(e) => {
                          if (e.target.value.length > 6) return;
                          formik.setFieldTouched(
                            e?.target?.name || e?.target?.id,
                            true
                          );
                          formik.handleChange(e);
                        }}
                        error={Boolean(formik.errors.province)}
                        touched={Boolean(formik.touched.province)}
                        errorMessage={formik.errors.province}
                      />
                    )}
                    <SBInput
                      id="postalCode"
                      name="postalCode"
                      label="Postal Code"
                      requiredField
                      value={
                        formik.values?.postalCode.length < 6
                          ? formik.values?.postalCode.replaceAll(" ", "")
                          : formik.values?.postalCode.slice(0, 3) +
                            " " +
                            formik.values?.postalCode.slice(
                              3,
                              formik.values?.postalCode.length
                            )
                      }
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(" ", "");
                        if (e.target.value.length > 6) return;
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      error={Boolean(formik.errors.postalCode)}
                      touched={Boolean(formik.touched.postalCode)}
                      errorMessage={formik.errors.postalCode}
                    />
                    <SBSelect
                      id="country"
                      label="Country"
                      options={availableCountriesList.map((element: string) => {
                        return { value: element, label: element };
                      })}
                      value={formik?.values?.country}
                      onChange={(value: string) => {
                        formik.setFieldTouched("country", true);
                        formik.setFieldValue("country", value);
                      }}
                      touched={Boolean(formik.touched.country)}
                    />
                  </div>
                </div>
              </div>
              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="w-full">
                <div className="flex-1">
                  <div className="mb-5">
                    <Heading type="h5" label=" Payment info" />
                    <br />
                    <Label
                      size="small"
                      label="Update your payment details."
                      className="text-colorLight"
                    />
                  </div>
                  <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 my-5">
                    <SBInput
                      id="businessNumber"
                      name="businessNumber"
                      label="GST/HST Number"
                      requiredField
                      value={formik.values.businessNumber}
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      error={Boolean(formik.errors.businessNumber)}
                      touched={Boolean(formik.touched.businessNumber)}
                      errorMessage={formik.errors.businessNumber}
                    />
                    <SBInput
                      id="bankName"
                      name="bankName"
                      label="Bank Name"
                      value={formik.values.bankName}
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      // error={Boolean(formik.errors.bankName)}
                      // touched={Boolean(formik.touched.bankName)}
                      // errorMessage={formik.errors.bankName}
                    />
                    <SBInput
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      label="Bank Account Number"
                      inputType="number"
                      value={formik.values.bankAccountNumber}
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      // error={Boolean(formik.errors.bankAccountNumber)}
                      // touched={Boolean(formik.touched.bankAccountNumber)}
                      // errorMessage={formik.errors.bankAccountNumber}
                    />
                    <SBInput
                      id="transitNumber"
                      name="transitNumber"
                      label="Transit"
                      value={formik.values?.transitNumber}
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      // error={Boolean(formik.errors.transitNumber)}
                      // touched={Boolean(formik.touched.transitNumber)}
                      // errorMessage={formik.errors.transitNumber}
                    />
                    <SBInput
                      id="institution"
                      name="institution"
                      label="Institution"
                      value={formik.values?.institution}
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      // error={Boolean(formik.errors.institution)}
                      // touched={Boolean(formik.touched.institution)}
                      // errorMessage={formik.errors.institution}
                    />
                  </div>
                </div>
                <div className="flex-1"></div>
              </div>
              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="flex md:flex-row flex-col gap-5">
                {isUpdatingCompanySetting ? (
                  <LoadingButton label="Saving" />
                ) : (
                  <Button
                    label="Save"
                    type="submit"
                    size="large"
                    className="hover:bg-hoverPrimary"
                    disabled={isUpdatingCompanySetting}
                  />
                )}

                <Button
                  label="Cancel"
                  size="large"
                  onClick={() => router.push("/dashboard")}
                  variant="outline-gray"
                  className="hover:bg-colorLightest"
                />
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
};

export default Setting;
