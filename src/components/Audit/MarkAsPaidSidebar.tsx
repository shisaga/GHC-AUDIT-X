import { Sidebar } from "@/stories/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import SBSelect from "@/stories/Select/Select";
import SBInput from "@/stories/Input/Input";
import { useAuth } from "@/contexts/AuthProvider";
import { PAYMENT_METHOD } from "@/utils/constant";
import { Button } from "@/stories/Button/Button";
import { useFormik } from "formik";
import { Label } from "@/stories/Label/Label";
import moment from "moment";
import { useMarkAsPaid } from "@/hooks/useAudit";
import { errorToast, successToast } from "@/hooks/toaster/useCustomToaster";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { useQueryClient } from "react-query";

interface MarkAsPaidSidebarProps {
  open: boolean;
  close: () => void;
  ids?: string[];
}

const MarkAsPaidSidebar = ({ open, close, ids }: MarkAsPaidSidebarProps) => {
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();
  const { isUpdating, markAsPaid } = useMarkAsPaid();

  const handleUpdatePaidStatus = async (formData: any) => {
    try {
      const response = await markAsPaid({
        auditIds: ids as string[],
        auditData: formData,
      });
      if (response?.success) {
        closeSidebar();
        queryClient.invalidateQueries(["audits"]);
        successToast(response?.message);
      }
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      paid: false,
      paymentType: "",
      paymentDate: null || 0,
    },
    onSubmit: handleUpdatePaidStatus,
  });

  const closeSidebar = () => {
    formik.resetForm();
    close();
  };

  return (
    <Sidebar
      open={open}
      sidebarWidth="max-w-[30rem]"
      close={() => closeSidebar()}
      title={"Mark As Paid"}
      headerClassName={"!border-t-8"}
      contentClassName="!px-0 pb-0 pt-4 !bg-colorWhite"
    >
      <form
        className="w-full h-full overflow-auto p-5 flex flex-col gap-6"
        onSubmit={formik.handleSubmit}
      >
        <div className="lg:-mt-6">
          <div className="mb-1">
            <Label size="extra-small" label="Paid?" />
          </div>
          <div
            onClick={() => formik.setFieldValue("paid", !formik.values?.paid)}
            className={`border border-colorLighter flex rounded-md cursor-pointer`}
          >
            <div
              className={`border-r border-colorLighter text-center w-1/2 px-4 py-[10px] text-sm ${!formik.values?.paid ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
            >
              No
            </div>
            <div
              className={`px-4 py-[10px] w-1/2 text-center text-sm ${formik.values?.paid ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
            >
              Yes
            </div>
          </div>
        </div>
      {  formik.values?.paid &&<>
      
        <div className=" min-w-[20%]">
          <div className="flex gap-[3rem]">
            <div className="flex-1">
              <SBSelect
                id={`PaymentType`}
                label={"Payment Type"}
                value={formik.values.paymentType}
                onChange={(data) => formik.setFieldValue(`paymentType`, data)}
                options={PAYMENT_METHOD.map((element) => {
                  return { value: element.value, label: element.label };
                })}
              />
            </div>
          </div>
        </div>
        <div className=" min-w-[20%]">
          <SBInput
            id="paymentDate"
            name="paymentDate"
            label="Payment Date"
            inputType="date"
            showTimeSelect
            value={formik?.values?.paymentDate}
            onChange={(e) =>
              formik.setFieldValue(
                "paymentDate",
                Number(moment(e.target.value))
              )
            }
          />
        </div>

      
      </>}
             </form>
      <div
        className={"flex-none flex gap-2 bg-white px-4 py-3 justify-end"}
        style={{ boxShadow: "0px -1px 0px 0px rgba(0, 0, 0, 0.15)" }}
      >
        <Button
          label="Cancel"
          size="large"
          onClick={() => close()}
          variant="outline-gray"
          className="hover:bg-colorLightest"
        />
        {isUpdating ? (
          <LoadingButton label="Updating" />
        ) : (
          <Button
            label="Update"
            type="submit"
            size="large"
            onClick={formik.handleSubmit}
            className="hover:bg-hoverPrimary"
          />
        )}
      </div>
    </Sidebar>
  );
};

export default MarkAsPaidSidebar;
