"use client";
import { Button } from "@/stories/Button/Button";
import React, { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { Heading } from "@/stories/Heading/Heading";
import { Card } from "@/stories/Card/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { getSpecificUser, useAddUser, useUpdateUser } from "@/hooks/useUser";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { AdminManagerInfo } from "@/types/user";
import { USER_ROLE, getUserRole } from "@/types/roles";
import AddressInfoDetail from "../Common/AddressInfoDetail";
import PersonalInfoDetail from "../Common/PersonalInfoDetail";
import { COMMISSIONTYPE, COMMISSION_REFERRAL } from "@/types/enums";
import Commision from "../Common/Commision";
import SBInput from "@/stories/Input/Input";

const CreateOrEditContractor = () => {
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
        successToast(`Contractor Added Successfully`);
        router.push("/contractors");
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
        successToast(`Contractor Updated Successfully`);
        router.push("/contractors");
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message as string);
      });
  };

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      streetAddress: "",
      city: "",
      province: "Ontario",
      country: "Canada",
      postalCode: "",
      businessName: "",
      role: getUserRole(USER_ROLE.CONTRACTOR),
      organizationId: userInfo?.organizationId,
      referralD: {
        type: COMMISSIONTYPE.FIXED,
        CAD: 0,
        EALead: 0,
      },
      referralE: {
        type: COMMISSIONTYPE.FIXED,
        CAD: 0,
        EALead: 0,
      },
    },
    onSubmit: editMode ? handleUpdateUser : handleAddUser,
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
      referralD: Yup.object({
        EALead: Yup.number()
          .min(0, "Mininum value is 0")
          .max(100, "Maximum value is 100"),
      }),
      referralE: Yup.object({
        EALead: Yup.number()
          .min(0, "Mininum value is 0")
          .max(100, "Maximum value is 100"),
      }),
    }),
  });

  useEffect(() => {
    const fetchSpecificUserData = async () => {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const data = await getSpecificUser(params?.id as string);
      if (data) {
        const commissionData = data.commissionData || []; // Extract commission data array
        const referrals = commissionData.find(
          (item: any) => item.type === COMMISSION_REFERRAL.REFERRAL
        );
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
          businessName: data?.businessName,
          referralD: {
            type: referrals?.commissionTypeD || "",
            CAD: referrals?.commissionDCAD || 0,
            EALead: referrals?.commissionDEALead || 0,
          },
          referralE: {
            type: referrals?.commissionTypeE || "",
            CAD: referrals?.commissionECAD || 0,
            EALead: referrals?.commissionEEALead || 0,
          },
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
              label={`${editMode ? "Edit" : "Create"} Contractor`}
            />
          </div>

          <Card className="p-6">
            <form onSubmit={autoFocus}>
              <div className="lg:w-3/5 w-full">
                <div className="mb-5">
                  <Heading type="h5" label=" Personal info" />
                </div>
                <PersonalInfoDetail formik={formik} />
                <div className="grid grid-cols-1 gap-5 my-5">
                  <SBInput
                    id="businessName"
                    name="businessName"
                    label="Business Name"
                    value={formik.values.businessName || ""}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.businessName)}
                    touched={Boolean(formik.touched.businessName)}
                    errorMessage={formik.errors.businessName}
                  />
                </div>
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
              </div>
              <hr className="mt-4 mb-5 border-t border-colorLighter" />
              <div className="w-full">
                <div className="lg:mb-10 mb-5">
                  <Heading type="h5" label="Referral" />
                </div>

                <Commision
                  formik={formik}
                  type={"referral"}
                  commissionName={"D"}
                />
                <br />
                <Commision
                  formik={formik}
                  type={"referral"}
                  commissionName={"E"}
                />
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
                    // disabled={isUpdatingUserInfo}
                  />
                )}

                <Button
                  label="Cancel"
                  size="large"
                  onClick={() => router.push("/contractors")}
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

export default CreateOrEditContractor;