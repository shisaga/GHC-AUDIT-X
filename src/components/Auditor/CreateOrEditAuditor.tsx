"use client";
import { Button } from "@/stories/Button/Button";
import React, { useCallback, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { Heading } from "@/stories/Heading/Heading";
import { Card } from "@/stories/Card/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import {
  checkUniqEA,
  getSpecificUser,
  useAddUser,
  useUpdateUser,
} from "@/hooks/useUser";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import { AdminManagerInfo } from "@/types/user";
import { USER_ROLE, getUserRole } from "@/types/roles";
import AddressInfoDetail from "../Common/AddressInfoDetail";
import { COMMISSIONTYPE, COMMISSION_REFERRAL } from "@/types/enums";
import Commision from "../Common/Commision";
import PersonalInfoDetail from "../Common/PersonalInfoDetail";
import SBInput from "@/stories/Input/Input";

import { APLHA_NUMERIC_REGEX } from "@/utils/constant";

const CreateOrEditAuditor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAdding, addUser } = useAddUser();
  const { isUpdating, updateUser } = useUpdateUser();
  const pathname = usePathname();
  const router = useRouter();
  const { userInfo } = useAuth();
  const editMode = pathname.includes("edit");
  const params = useParams();

  const handleAddUser = async (userData: AdminManagerInfo) => {
    userData.type = COMMISSION_REFERRAL.COMMISSION;
    await addUser(userData)
      .then((result: any) => {
        successToast(`Auditor Added Successfully`);
        router.push("/auditors");
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
        successToast(`Auditor Updated Successfully`);
        router.push("/auditors");
      })
      .catch((err) => {
        errorToast(err?.response?.data?.message as string);
      });
  };

  const formik = useFormik({
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      EANumber: "",
      HSTNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      businessEmail: "",
      businessName: "",
      streetAddress: "",
      city: "",
      unit: "",
      province: "Ontario",
      country: "Canada",
      postalCode: "",
      role: getUserRole(USER_ROLE.AUDITOR),
      organizationId: userInfo?.organizationId,
      commissionD: {
        type: COMMISSIONTYPE.FIXED,
        CAD: 0,
        GHCLead: 0,
        EALead: 0,
      },
      commissionE: {
        type: COMMISSIONTYPE.FIXED,
        CAD: 0,
        GHCLead: 0,
        EALead: 0,
      },
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
    validationSchema: Yup.object({
      EANumber: Yup.string()
        .trim()
        .matches(
          APLHA_NUMERIC_REGEX,
          "EA number must contain only alphanumeric characters"
        )
        .min(4, "EA number must be 4 digit.")
        .required("EA number is required")
        .test("is-unique", "EA number must be unique", (value) =>
          !editMode && value.length === 4 ? checkUniq(value as any) : true
        ),
      HSTNumber: Yup.string()
        .trim()
        .matches(
          APLHA_NUMERIC_REGEX,
          "HST number only alphanumeric characters"
        ),
      lastName: Yup.string()
        .trim()
        .min(3, "Minimum last name length is 3")
        .max(15, "Maximum last name length is 15")
        .matches(/^[a-zA-Z\s]+$/, "Last name must contain only letters")
        .required("Last name is required"),
      firstName: Yup.string()
        .trim()
        .min(3, "Minimum first name length is 3")
        .max(15, "Maximum first name length is 15")
        .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")
       
        .required("First name is required"),

      email: Yup.string()
        .trim()
        .email("Email is not valid")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email is not valid"
        )
        .max(50, "Maximum email length is 50")
        .required("Email is required"),
      businessEmail: Yup.string()
        .trim()
        .email("Email is not valid")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Business email is not valid"
        )
        .max(50, "Maximum email length is 50"),
      businessName: Yup.string()
        .min(3, "Mininum business name length is 3")
        .trim(),

      mobile: Yup.string()
        .trim()
        .matches(/^\d{10}$/, "Maximum Phone number length is 10"),
      commissionD: Yup.object({
        GHCLead: Yup.number().min(0, "Mininum value is 0"),
        EALead: Yup.number().min(0, "Mininum value is 0"),
      }).test(
        "sum-of-leads",
        "Sum of GHC Lead and EA Lead for D cannot exceed 100%",
        function (value) {
          const { GHCLead, EALead } = value;
          const sum = (GHCLead || 0) + (EALead || 0);
          if (sum <= 100) {
            return true;
          }
        }
      ),
      commissionE: Yup.object({
        GHCLead: Yup.number().min(0, "Minimum value is 0"),
        EALead: Yup.number().min(0, "Minimum value is 0"),
      }).test(
        "sum-of-leads",
        "Sum of GHC Lead and EA Lead for E cannot exceed 100%",
        function (value) {
          const { GHCLead, EALead } = value;
          const sum = (GHCLead || 0) + (EALead || 0);
          if (sum <= 100) {
            return true;
          }
        }
      ),
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
    onSubmit: editMode ? handleUpdateUser : handleAddUser,
  });

  useEffect(() => {
    const fetchSpecificUserData = async () => {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const data = await getSpecificUser(params?.id as string);
      if (data) {
        const commissionData = data.commissionData || []; // Extract commission data array
        const commissions = commissionData.find(
          (item: any) => item.type === COMMISSION_REFERRAL.COMMISSION
        );
        const referrals = commissionData.find(
          (item: any) => item.type === COMMISSION_REFERRAL.REFERRAL
        );

        formik.setValues({
          EANumber: data.EANumber,
          email: data.email,
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          mobile: data?.mobile,
          businessEmail: data?.businessEmail || "",
          businessName: data?.businessName || "",
          unit: data?.unit || "",
          streetAddress: data?.streetAddress || "",
          city: data.city || "",
          province: data.province || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
          HSTNumber: data.HSTNumber || "",
          commissionD: {
            type: commissions?.commissionTypeD || "",
            CAD: commissions?.commissionDCAD || 0,
            GHCLead: commissions?.commissionDGHCLead || 0,
            EALead: commissions?.commissionDEALead || 0,
          },
          commissionE: {
            type: commissions?.commissionTypeE || "",
            CAD: commissions?.commissionECAD || 0,
            GHCLead: commissions?.commissionEGHCLead || 0,
            EALead: commissions?.commissionEEALead || 0,
          },
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

  const checkUniq: any = useCallback(
    async (value: any) => {
      {
        // Perform sync validation with Yup
        if (value?.length === 4) {
          const isValid: any = await checkUniqEA(value).then(
            (data: any) => data?.isUniq
          );
          return isValid;
        }
      }
    },
    [formik.values.EANumber]
  );

  const autoFocus = (e: any) => {
    e.preventDefault();
    if (Object.keys(formik.errors)[0]) {
      document?.getElementById(`${Object.keys(formik.errors)[0]}`)?.focus();
    }
    return formik.handleSubmit();
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
              label={`${editMode ? "Edit" : "Create"} Auditor`}
            />
          </div>

          <Card className="p-6">
            <form onSubmit={autoFocus}>
              <div className="lg:w-3/5 w-full">
                <div className="mb-5">
                  <Heading type="h5" label=" Personal info" />
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 my-5">
                  <SBInput
                    disabled={editMode}
                    id="EANumber"
                    name="EANumber"
                    label="EA#"
                    requiredField
                    value={(formik?.values?.EANumber || "").toUpperCase()}
                    onChange={(e) => {
                      if (e?.target?.value.length > 4) return;
                      e.target.value = e?.target?.value.toUpperCase();
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.EANumber)}
                    touched={Boolean(formik.touched.EANumber)}
                    errorMessage={formik?.errors?.EANumber as string}
                  />
                  <SBInput
                    id="HSTNumber"
                    name="HSTNumber"
                    label="GST/HST Number"
                    value={formik.values.HSTNumber || ""}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.HSTNumber)}
                    touched={Boolean(formik.touched.HSTNumber)}
                    errorMessage={formik?.errors?.HSTNumber as string}
                  />
                </div>

                <PersonalInfoDetail formik={formik} />
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 my-5">
                  <SBInput
                    id="businessEmail"
                    name="businessEmail"
                    label="Business Email"
                    value={formik.values.businessEmail || ""}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.businessEmail)}
                    touched={Boolean(formik.touched.businessEmail)}
                    errorMessage={formik?.errors?.businessEmail as string}
                  />
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
                    errorMessage={formik?.errors?.businessName as string}
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
              <div className="w-full flex lg:flex-row flex-col gap-4">
                <div className="md:w-1/2 w-full">
                  <div className="lg:mb-10 mb-5">
                    <Heading type="h5" label="Commission" />
                  </div>

                  <Commision
                    formik={formik}
                    type={"commission"}
                    commissionName={"D"}
                  />
                  <br />
                  <Commision
                    formik={formik}
                    type={"commission"}
                    commissionName={"E"}
                  />
                </div>
                <hr className="my-2 border-t border-colorLighter" />
                <div className="md:w-1/2 w-full">
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
                  onClick={() => router.push("/auditors")}
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

export default CreateOrEditAuditor;
