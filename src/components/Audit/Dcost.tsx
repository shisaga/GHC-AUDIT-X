import { useAuth } from "@/contexts/AuthProvider";
import SBInput from "@/stories/Input/Input";
import SBSelect from "@/stories/Select/Select";
import { PAID_BY, PAID_TO } from "@/types/enums";
import { FormikValues } from "formik";
import React, { ChangeEvent } from "react";

const Dcost = ({ formik, auditMode }: FormikValues) => {
  const { userInfo } = useAuth();
  const auditType = auditMode === "D" ? "dCost" : "eCost";
  const removePlusMinus = (value: string) => {
    return value.replaceAll("-", "").replaceAll("+", "");
  };

  return (
    <div
      className={`mt-4 space-y-6 ${userInfo?.roles?.[0]?.name === "Auditor" ? "pointer-events-none opacity-70 !cursor-not-allowed" : ""} `}
    >
      <div
        className={`${formik.values?.auditType === "single" ? "flex md:flex-row flex-col md:gap-8 gap-6" : " grid md:grid-cols-2 grid-cols-1 gap-4"}`}
      >
        {[
          {
            id: "auditCost",
            label: "Cost (CAD)",
          },
        ].map((data, index) => {
          return (
            <div key={index}>
              <SBInput
                inputType="number"
                id={auditMode + data.id}
                name={`${auditType}.${data.id}`}
                label={data.label}
                disabled={data.id === "totalCost"}
                value={formik?.values[`${auditType}`][`${data.id}`]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newValue = removePlusMinus(e.target.value);
                  if (+newValue > -1) {
                    e.target.value = newValue;
                    formik?.handleChange(e);
                  } else {
                    return;
                  }
                }}
                inputClassName="disabled:bg-colorLightest w-full "
              />
            </div>
          );
        })}
        <div className=" min-w-[20%]">
          <div className="flex gap-[3rem]">
            <div className="flex-1">
              <SBSelect
                id={`paidBy`}
                label="Paid By"
                value={formik.values[auditType].paidBy}
                onChange={(data) =>
                  formik.setFieldValue(`${auditType}.paidBy`, data)
                }
                options={[
                  { value: PAID_BY.HOMEOWNER, label: PAID_BY.HOMEOWNER },
                  {
                    value: PAID_BY.CONTRACTOR,
                    label: PAID_BY.CONTRACTOR,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dcost;
