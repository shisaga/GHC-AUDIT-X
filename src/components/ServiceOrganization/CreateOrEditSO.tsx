"use client";
import { Button } from "@/stories/Button/Button";
import React, { ChangeEvent, useEffect, useState } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";
import { FaRegUser } from "react-icons/fa";
import { Heading } from "@/stories/Heading/Heading";
import { Card } from "@/stories/Card/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AdminManagerInfo } from "@/types/user";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { getSpecificUser, useAddUser, useUpdateUser } from "@/hooks/useUser";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { USER_ROLE, getUserRole } from "@/types/roles";
import AddressInfoDetail from "../Common/AddressInfoDetail";
import PersonalInfoDetail from "../Common/PersonalInfoDetail";
import SBInput from "@/stories/Input/Input";

const CreateOrEditSO = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAdding, addUser } = useAddUser();
  const { isUpdating, updateUser } = useUpdateUser();
  const pathname = usePathname();
  const router = useRouter();
  const { userInfo } = useAuth();
  const editMode = pathname.includes("edit");

  const params = useParams();

  const handleAddUser = async (userData: AdminManagerInfo) => {
    await addUser(userData)
      .then((result: any) => {
        successToast(`SO Added Successfully`);
        router.push("/service-organization");
        formik.resetForm();
      })
      .catch((err: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        errorToast(err?.response?.data?.message || err);
      });
  };
  const handleUpdateUser = async (formData: AdminManagerInfo) => {
    await updateUser({ ...formData, id: params?.id as string })
      .then((result) => {
        successToast(`SO Updated Successfully`);
        router.push("/service-organization");
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message as string);
      });
  };

  const removePlusMinus = (value: string) => {
    return value.replaceAll("-", "").replaceAll("+", "");
  };

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      unit: "",
      streetAddress: "",
      city: "",
      province: "Ontario",
      country: "Canada",
      postalCode: "",
      role: getUserRole(USER_ROLE.SO),
      organizationId: userInfo?.organizationId,
      SOFee: 0,
    },
    validationSchema: Yup.object({
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
      email: Yup.string()
        .trim()
        .email("Email is not valid")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email is not valid"
        )
        .max(50, "Maximum email length is 50")
        .required("Email is required"),

      mobile: Yup.string()
        .trim()
        .matches(/^\d{10}$/, "Maximum Phone number length is 10"),
    }),
    onSubmit: editMode ? handleUpdateUser : handleAddUser,
  });

  useEffect(() => {
    const fetchSpecificUserData = async () => {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const data = await getSpecificUser(params?.id as string);
      if (data) {
        formik.setValues({
          email: data.email,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          mobile: data?.mobile,
          unit: data.unit || "",
          streetAddress: data?.streetAddress || "",
          city: data.city || "",
          province: data.province || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
          SOFee: data.SOFee || null,
        });
      }
      setIsLoading(false);
    };
    if (editMode) {
      fetchSpecificUserData();
    }
  }, [params?.id]);

  const autoFocus = (e: any) => {
    e.preventDefault();
    formik.handleSubmit();

    if (Object.keys(formik.errors)[0]) {
      return document
        ?.getElementById(`${Object.keys(formik.errors)[0]}`)
        ?.focus();
    }
  };

  return (
    <div className="md:p-6 p-4 space-y-6">
      {isAdding || isUpdating || isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center justify-start">
            <div className="bg-themePrimary w-12 h-12 flex items-center justify-center rounded-[4px] mr-4 box-around">
              <FaRegUser className="text-colorWhite text-xl" />
            </div>
            <Heading
              type="h3"
              label={`${editMode ? "Edit" : "Create"} Service Organization`}
            />
          </div>

          <Card className="p-6">
            <form onSubmit={autoFocus}>
              <div className="lg:w-3/5 w-full">
                <div className="mb-5">
                  <Heading type="h5" label=" Personal info" />
                </div>
                <PersonalInfoDetail formik={formik} />
              </div>

              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="lg:w-3/5 w-full">
                <div className="flex-1">
                  <div className="mb-5">
                    <Heading type="h5" label="Address info" />
                    <br />
                  </div>
                  <AddressInfoDetail formik={formik} />
                </div>
                <div className="flex-1"></div>
              </div>
              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="md:w-3/5 w-full">
                <SBInput
                  inputType="text"
                  id="SOFee"
                  name="SOFee"
                  label="SO Fee (%)"
                  value={formik.values.SOFee}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const newValue = removePlusMinus(e.target.value);
                    if (+newValue > -1) {
                      e.target.value = newValue;
                      formik?.handleChange(e);
                    } else {
                      return;
                    }
                  }}
                  requiredField={false}
                  inputClassName="disabled:bg-colorLightest w-full"
                  // error={Boolean(formik.errors.SOFee)}
                  // touched={Boolean(formik.touched.SOFee)}
                  // errorMessage={formik?.errors?.SOFee as string}
                />
                {/* <SBInput
                  id="SOFee"
                  name="SOFee"
                  label="SO Fee (%)"
                  inputType="number"
                  value={formik.values.SOFee}
                  onChange={(e) => {
                    formik.setFieldTouched(
                      e?.target?.name || e?.target?.id,
                      true
                    );
                    formik.handleChange(e);
                  }}
                  error={Boolean(formik.errors.SOFee)}
                  touched={Boolean(formik.touched.SOFee)}
                  errorMessage={formik?.errors?.SOFee as string}
                /> */}
              </div>
              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="flex md:flex-row flex-col gap-5">
                {isLoading ? (
                  <LoadingButton label="Saving" />
                ) : (
                  <Button
                    label="Save"
                    type="submit"
                    size="large"
                    className="hover:bg-hoverPrimary"
                    disabled={isAdding || isUpdating}
                  />
                )}

                <Button
                  label="Cancel"
                  size="large"
                  onClick={() => router.push("/service-organization")}
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

export default CreateOrEditSO;
