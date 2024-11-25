import React from "react";
import { Label } from "@/stories/Label/Label";
import SBInput from "@/stories/Input/Input";
import SBSelect from "@/stories/Select/Select";
import { FormikValues } from "formik";
import { PAYMENT_METHOD } from "@/utils/constant";
import moment from "moment";
import { useAuth } from "@/contexts/AuthProvider";

interface DpaymentProps {
  formik: FormikValues;
  auditMode: string;
}

const Dpayment = ({ formik, auditMode }: DpaymentProps) => {
  const { userInfo } = useAuth();
  const auditType = auditMode === "D" ? "dPayment" : "ePayment";

  const userRoleNotAdmin = userInfo?.roles?.[0].name !== "Admin";

  return (
    <div
      className={`mt-4 space-y-6 ${userRoleNotAdmin ? "pointer-events-none opacity-70 !cursor-not-allowed" : ""}`}
    >
      <div className="flex flex-wrap flx-col md:flex-row md:gap-8 gap-4">
        <div className="md:min-w-[10%] min-w-[47%]">
          <div className="lg:-mt-6">
            <div className="mb-1">
              <Label size="extra-small" label="Paid?" />
            </div>
            <div
               
              onClick={() =>
                formik.setFieldValue(
                  `${auditType}.paid`,
                  !formik.values[auditType]?.paid
                )
              }
               title={formik.values[`${auditMode.toLocaleLowerCase()}Cost`]?.auditCost > 0 ? '':'Add Audit Ammount before marking it as paid' }
              className={`border border-colorLighter flex rounded-md cursor-pointer ${formik.values[`${auditMode.toLocaleLowerCase()}Cost`]?.auditCost > 0 ?'':'!pointer-events-none !cursor-not-allowed opacity-60'}`}
            >
              <div
                className={`border-r border-colorLighter w-1/2 px-4 text-center py-[10px] text-sm ${!formik.values[auditType]?.paid ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
              >
                No
              </div>
              <div
                className={`px-4 py-[10px] w-1/2 text-center text-sm ${formik.values[auditType]?.paid ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
        {formik.values[auditType].paid ? (
          <>
            <div className="md:min-w-[10%] min-w-[47%]">
              <div className="lg:-mt-6">
                <div className="mb-1">
                  <Label size="extra-small" label="EA Paid" />
                </div>
                <div
                  onClick={() =>
                    formik.setFieldValue(
                      `${auditType}.EABalanceCleared`,
                      !formik.values[auditType]?.EABalanceCleared
                    )
                  }
                  className="border border-colorLighter flex rounded-md cursor-pointer"
                >
                  <div
                    className={`border-r border-colorLighter w-1/2 px-4 py-[10px] text-center text-sm  ${!formik.values[auditType]?.EABalanceCleared ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
                  >
                    No
                  </div>
                  <div
                    className={`px-4 py-[10px] w-1/2 text-center text-sm ${formik.values[auditType]?.EABalanceCleared ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
                  >
                    Yes
                  </div>
                </div>
              </div>
            </div>
            <div className="md:min-w-[10%] min-w-[47%]">
              <div className="lg:-mt-6">
                <div className="mb-1">
                  <Label size="extra-small" label="Contractor Paid" />
                </div>
                <div
                  onClick={() =>
                    formik.setFieldValue(
                      `${auditType}.contractorBalanceCleared`,
                      !formik.values[auditType]?.contractorBalanceCleared
                    )
                  }
                  className="border border-colorLighter flex rounded-md cursor-pointer"
                >
                  <div
                    className={`border-r border-colorLighter w-1/2 px-4 py-[10px] text-center text-sm  ${!formik.values[auditType]?.contractorBalanceCleared ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
                  >
                    No
                  </div>
                  <div
                    className={`px-4 py-[10px] w-1/2 text-center flex-1 text-sm ${formik.values[auditType]?.contractorBalanceCleared ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
                  >
                    Yes
                  </div>
                </div>
              </div>
            </div>

            <div className="md:min-w-[10%] min-w-[47%]">
              <div className="lg:-mt-6">
                <div className="mb-1">
                  <Label size="extra-small" label="SO Paid" />
                </div>
                <div
                  onClick={() =>
                    formik.setFieldValue(
                      `${auditType}.SOBalanceCleared`,
                      !formik.values[auditType]?.SOBalanceCleared
                    )
                  }
                  className="border border-colorLighter flex rounded-md cursor-pointer"
                >
                  <div
                    className={`border-r border-colorLighter w-1/2 px-4 py-[10px] text-center text-sm  ${!formik.values[auditType]?.SOBalanceCleared ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
                  >
                    No
                  </div>
                  <div
                    className={`px-4 py-[10px] w-1/2  text-center text-sm ${formik.values[auditType]?.SOBalanceCleared ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
                  >
                    Yes
                  </div>
                </div>
              </div>
            </div>
            <div className="md:min-w-[20%] min-w-full">
              <div className="flex gap-[3rem]">
                <div className="flex-1">
                  <SBSelect
                    id={`PaymentType`}
                    label={"Payment Type"}
                    value={formik.values[auditType].paymentType}
                    onChange={(data) =>
                      formik.setFieldValue(`${auditType}.paymentType`, data)
                    }
                    options={PAYMENT_METHOD.map((element) => {
                      return { value: element.value, label: element.label };
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="md:min-w-[20%] min-w-full">
              <SBInput
                id="paymentDate"
                name="paymentDate"
                label="Payment Date"
                inputType="date"
                showTimeSelect
                value={formik.values[auditType].paymentDate}
                onChange={(e) =>
                  formik.setFieldValue(
                    `${auditType}.paymentDate`,
                    Number(moment(e.target.value))
                  )
                }
              />
            </div>
          </>
        ) : null}

        <div className="md:min-w-[10%] min-w-[47%]">
          <div className="lg:-mt-6">
            <div className="mb-1">
              <Label size="extra-small" label="Report Sent?" />
            </div>
            <div
              onClick={() =>
                formik.setFieldValue(
                  `${auditType}.reportSent`,
                  !formik.values[auditType]?.reportSent
                )
              }
              className="border border-colorLighter flex rounded-md cursor-pointer"
            >
              <div
                className={`border-r border-colorLighter w-1/2 px-4 text-center py-[10px] text-sm  ${!formik.values[auditType]?.reportSent ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
              >
                No
              </div>
              <div
                className={`px-4 py-[10px] w-1/2 text-center text-sm ${formik.values[auditType]?.reportSent ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
        <div className="md:min-w-[10%] min-w-[47%]">
          <div className="lg:-mt-6">
            <div className="mb-1">
              <Label size="extra-small" label="Invoice Sent?" />
            </div>
            <div
              onClick={() =>
                formik.setFieldValue(
                  `${auditType}.invoiceSent`,
                  !formik.values[auditType]?.invoiceSent
                )
              }
              className="border border-colorLighter flex rounded-md cursor-pointer"
            >
              <div
                className={`border-r border-colorLighter w-1/2 text-center px-4 py-[10px] text-sm  ${!formik.values[auditType]?.invoiceSent ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
              >
                No
              </div>
              <div
                className={`px-4 py-[10px] w-1/2 text-center text-sm ${formik.values[auditType]?.invoiceSent ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dpayment;
