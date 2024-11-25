"use client";
import SBInput from "@/stories/Input/Input";
import { Label } from "@/stories/Label/Label";
import { COMMISSIONTYPE } from "@/types/enums";
import { FormikValues } from "formik";
import { usePathname } from "next/navigation";

interface CommisionTypeProps {
  formik: FormikValues;
  type: string;
  commissionName: string;
}

const Commision = ({ formik, type, commissionName }: CommisionTypeProps) => {
  const pathname = usePathname();

  return (
    <>
      <div
        className="my-4 flex lg:items-center items-start justify-start lg:flex-row flex-col gap-4"
        id={`${type}${commissionName}`}
      >
        <div className="bg-themePrimary min-w-[40px] min-h-[40px] flex items-center justify-center rounded-[4px] box-around">
          <Label
            label={commissionName}
            size="large"
            color="var(--color-white)"
          />
        </div>
        <div className="lg:-mt-6">
          <div className="mb-1">
            <Label
              className="capitalize"
              size="extra-small"
              label={`${type} Type`}
              requiredLabel={true}
            />
          </div>
          <div className="border border-colorLighter flex rounded-md cursor-pointer">
            <div
              className={`border-r border-colorLighter px-4 py-[10px] text-sm  ${formik.values[`${type}${commissionName}`]?.type === COMMISSIONTYPE.FIXED ? "!bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
              onClick={() =>
                formik.setFieldValue(
                  `${type}${commissionName}.type`,
                  COMMISSIONTYPE.FIXED
                )
              }
            >
              Fixed
            </div>
            <div
              className={`px-4 py-[10px] text-sm ${formik.values[`${type}${commissionName}`]?.type === COMMISSIONTYPE.PERCENTAGE ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
              onClick={() =>
                formik.setFieldValue(
                  `${type}${commissionName}.type`,
                  COMMISSIONTYPE.PERCENTAGE
                )
              }
            >
              Percentage
            </div>
          </div>
        </div>

        {formik.values[`${type}${commissionName}`]?.type ===
          COMMISSIONTYPE.FIXED && (
          <div className="flex md:flex-row flex-col w-full">
            <SBInput
              inputClassName="!h-10"
              id={`${type}${commissionName}.CAD`}
              name={`${type}${commissionName}.CAD`}
              label="CAD"
              inputType="number"
              value={formik.values[`${type}${commissionName}`].CAD || ""}
              onChange={(e) => {
                formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                formik.handleChange(e);
              }}
              // error={Boolean(formik.errors[`commission${commissionName}`]?.CAD)}
              // touched={Boolean(
              //   formik.touched[`commission${commissionName}`]?.CAD
              // )}
              // errorMessage={formik.errors[`commission${commissionName}`]?.CAD}
            />
          </div>
        )}
        {formik.values[`${type}${commissionName}`]?.type ===
          COMMISSIONTYPE.PERCENTAGE && (
          <div className="w-full flex  md:justify-start justify-center lg:flex-row flex-col gap-4">
            {pathname.includes("auditor") && type !== "referral" && (
              <SBInput
                inputClassName="!h-10"
                id={`${type}${commissionName}.GHCLead`}
                name={`${type}${commissionName}.GHCLead`}
                label="GHC Lead (%)"
                inputType="number"
                value={
                  formik.values?.[`${type}${commissionName}`]?.GHCLead || 0
                }
                onChange={(e) => {
                  formik.setFieldTouched(
                    e?.target?.name || e?.target?.id,
                    true
                  );
                  formik.handleChange(e);
                }}
                error={Boolean(
                  formik.errors?.[`${type}${commissionName}`]?.GHCLead
                )}
                touched={Boolean(
                  formik.touched?.[`${type}${commissionName}`]?.GHCLead
                )}
                errorMessage={
                  formik.errors?.[`${type}${commissionName}`]?.GHCLead
                }
              />
            )}

            <SBInput
              inputClassName="!h-10"
              id={`${type}${commissionName}.EALead`}
              name={`${type}${commissionName}.EALead`}
              label={
                `${type}${commissionName}` === "referralD" ||
                `${type}${commissionName}` === "referralE"
                  ? "Referral (%)"
                  : "EA Lead (%)"
              }
              inputType="number"
              value={formik?.values?.[`${type}${commissionName}`]?.EALead || 0}
              onChange={(e) => {
                formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                formik.handleChange(e);
              }}
              error={Boolean(
                formik.errors?.[`${type}${commissionName}`]?.EALead
              )}
              touched={Boolean(
                formik.touched?.[`${type}${commissionName}`]?.EALead
              )}
              errorMessage={
                formik?.errors?.[`${type}${commissionName}`]?.EALead
              }
            />
          </div>
        )}
      </div>
      {(`${type}${commissionName}` === "commissionD" ||
        `${type}${commissionName}` === "commissionE") && (
        <div className="flex">
          <small className="text-xs text-colorDanger">
            {formik.errors[`${type}${commissionName}`]}
          </small>
        </div>
      )}
    </>
  );
};

export default Commision;
