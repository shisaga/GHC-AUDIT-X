"use client";
import SBInput from "@/stories/Input/Input";
import {
  formatPhoneNumber,
  removeSpecialCharacters,
} from "@/utils/CommonFunction";
import { FormikValues } from "formik";
import { usePathname } from "next/navigation";
import React from "react";

interface PersonalInfoProps {
  isEmailDisable?: boolean;
  formik: FormikValues;
}

const PersonalInfoDetail = ({ formik, isEmailDisable }: PersonalInfoProps) => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
      <SBInput
        id="firstName"
        name="firstName"
        label="First Name"
        requiredField
        value={formik.values.firstName}
        onChange={(e) => {
          formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
          formik.handleChange(e);
        }}
        error={Boolean(formik.errors.firstName)}
        touched={Boolean(formik.touched.firstName)}
        errorMessage={formik.errors.firstName}
      />
      <SBInput
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formik.values.lastName}
        requiredField
        onChange={(e) => {
          formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
          formik.handleChange(e);
        }}
        error={Boolean(formik.errors.lastName)}
        touched={Boolean(formik.touched.lastName)}
        errorMessage={formik.errors.lastName}
      />
      <SBInput
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        requiredField
        onChange={(e) => {
          formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
          formik.handleChange(e);
        }}
        error={Boolean(formik.errors.email)}
        touched={Boolean(formik.touched.email)}
        errorMessage={formik.errors.email}
        disabled={isEmailDisable}
      />

      <SBInput
        id="mobile"
        name="mobile"
        label="Phone Number"
        value={formatPhoneNumber(formik.values.mobile as string)}
        onChange={(e) => {
          formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
          e.target.value = removeSpecialCharacters(e.target.value);
          formik.handleChange(e);
        }}
        error={Boolean(formik.errors.mobile)}
        touched={Boolean(formik.touched.mobile)}
        errorMessage={formik.errors.mobile}
      />
    </div>
  );
};

export default PersonalInfoDetail;
