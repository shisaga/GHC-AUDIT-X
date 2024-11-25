/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useAuth } from "@/contexts/AuthProvider";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./Common/LoadingSpinner";
import { Label } from "@/stories/Label/Label";
import { Heading } from "@/stories/Heading/Heading";
import { Card } from "@/stories/Card/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../styles/customstyle.scss";
import { UserInfo } from "@/types/user";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { FaRegUser } from "react-icons/fa";
import { IoCamera } from "react-icons/io5";
import { Button } from "@/stories/Button/Button";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import AddressInfoDetail from "./Common/AddressInfoDetail";
import PersonalInfoDetail from "./Common/PersonalInfoDetail";
import { useRouter } from "next/navigation";
import ChangePasswordSidebar from "@/partials/ChangePasswordSidebar";

const Profile = () => {
  const { userInfo, handleRefetch, isFetchingUserInfo } = useAuth();
  const [image, setImageObject] = useState<any>();
  const inputRef = useRef<any>(null);
  const router = useRouter();
  const { updateUserProfile, isProfileUpdating: isUpdatingUserInfo } =
    useUpdateUserProfile();
  const [openChangePasswordSidebar, setOpenChangePasswordSidebar] =
    useState<boolean>(false);

  const handleUpdateProfile = async (formData: UserInfo) => {
    // Construct formData object
    const updatedFormData: any = {
      ...formData,
      id: userInfo?.id || "",
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

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await updateUserProfile(formDataToSend);
      successToast("Profile Updated Successfully");
      if (!isFetchingUserInfo) {
        handleRefetch();
      }
    } catch (e) {
      errorToast("Error uploading image ");
    }
  };

  const formik = useFormik<UserInfo>({
    validateOnChange: true,
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      unit: "",
      streetAddress: "",
      city: "",
      imgUrl: "",
      province: "Ontario",
      country: "Canada",
      postalCode: "",
      roles: [{ name: "AUDITOR" }],
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
      firstName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
        .min(3, "Mininum first name length is 3")
        .max(15, "Maximum first name length is 15")
        .required("First name is required")
        .trim(),
      lastName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
        .min(3, "Mininum last name length is 3")
        .max(15, "Maximum last name length is 15")
        .required("Last name is required")
        .trim(),
      mobile: Yup.string()
        .trim()
        .matches(/^\d{10}$/, "Maximum Phone number length is 10")
        .required(`Phone number is required`),
    }),
    onSubmit: (values) => handleUpdateProfile(values),
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (userInfo) {
        formik.setValues({
          email: userInfo.email,
          firstName: userInfo.firstName ? userInfo.firstName : ``,
          lastName: userInfo.lastName ? userInfo.lastName : ``,
          mobile: userInfo?.mobile || "",
          imgUrl: userInfo.imgUrl || "",
          unit: userInfo?.unit || "",
          streetAddress: userInfo?.streetAddress || "",
          city: userInfo?.city || "",
          province: userInfo?.province || "Ontario",
          country: userInfo?.country || "Canada",
          postalCode: userInfo.postalCode || "",
        });
      }
    }
    return () => {
      mounted = false;
    };
  }, [userInfo]);

  const handleFileChange = async (event: any) => {
    const fileObj: any = event.target.files?.[0];
    if (!fileObj) return "";

    const userEmail = userInfo?.email;
    const userId = userInfo?.id;

    // Extract file extension
    const extension = fileObj.name.split(".").pop();

    // Construct new file name with user email, user ID, and file extension
    const newFileName = `${userEmail}_${userId}.${extension}`;

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
  const autoFocus = (e:any) => {
    e.preventDefault()
    if (Object.keys(formik.errors)[0]) {
      document?.getElementById(`${Object.keys(formik.errors)[0]}`)?.focus();

    } 
    return formik.handleSubmit();
  };

  return (
    <div className="md:p-6 p-4 space-y-6">
      {!userInfo || isFetchingUserInfo ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center justify-start">
            <div className="bg-themePrimary w-12 h-12 flex items-center justify-center rounded-[4px] mr-4 box-around">
              <FaRegUser className="text-colorWhite text-xl" />
            </div>
            <Heading type="h3" label="Edit Profile" />
          </div>

          <Card className="p-6">
            <form onSubmit={autoFocus}>
              <div className="lg:w-3/5 w-full">
                <div className="mb-5">
                  <Heading type="h5" label=" Profile info" />
                  <br />
                  <Label
                    size="small"
                    label="Update your account profile details."
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
                        alt="nature image"
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
                <PersonalInfoDetail formik={formik} isEmailDisable={true} />
              </div>

              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="lg:w-3/5 w-full">
                <div className="flex-1">
                  <div className="mb-5">
                    <Heading type="h5" label=" Profile info" />
                    <br />
                    <Label
                      size="small"
                      label="Update your personal and address details."
                      className="text-colorLight"
                    />
                  </div>
                  <AddressInfoDetail formik={formik} />
                </div>
                <div className="flex-1"></div>
              </div>
              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="lg:w-4/5 w-full">
                <div className="flex md:items-center items-start justify-between mb-5">
                  <div>
                    <Heading type="h6" label="Change passoword" />
                    <br />
                    <Label
                      size="small"
                      label="Set new password or reset your current password"
                      className="text-colorLight"
                    />
                  </div>
                  <div>
                    <Button
                      label="Change"
                      variant="outline-gray"
                      className="hover:bg-colorLightest"
                      onClick={() => setOpenChangePasswordSidebar(true)}
                    />
                  </div>
                </div>
              </div>
              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="flex md:flex-row flex-col gap-5">
                {isUpdatingUserInfo ? (
                  <LoadingButton label="Saving" />
                ) : (
                  <Button
                    label="Save"
                    type="submit"
                    size="large"
                    className="hover:bg-hoverPrimary"
                    disabled={isUpdatingUserInfo}
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
          <ChangePasswordSidebar
            open={openChangePasswordSidebar}
            close={() => {
              setOpenChangePasswordSidebar(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
