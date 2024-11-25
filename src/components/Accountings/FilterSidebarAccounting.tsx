import { Sidebar } from "@/stories/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import SBSelect from "@/stories/Select/Select";
import SBInput from "@/stories/Input/Input";
import { getAllUsers } from "@/hooks/useUser";
import { getUserRole } from "@/types/roles";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/stories/Button/Button";
import { useQueryClient } from "react-query";
import moment from "moment";

interface FilterSidebarProps {
  open: boolean;
  close: () => void;
  id?: string;
  formik?: any;
}

const FilterSidebarAccounting = ({
  open,
  close,
  formik,
  id,
}: FilterSidebarProps) => {
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();
  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    const getAuditorContractor = async () => {
      const allAuditor = await getAllUsers({
        roleId: getUserRole(formik?.values?.userType),
        orgId: userInfo?.organizationId || "",
      });
      setUserList(allAuditor);
    };
    if (formik?.values?.userType) {
      getAuditorContractor();
    }
  }, [formik?.values?.userType]);

  const closeSidebar = () => {
    formik.resetForm();
    close();
  };

  return (
    <Sidebar
      open={open}
      sidebarWidth="max-w-[30rem]"
      close={() => closeSidebar()}
      title={"Filters"}
      headerClassName={"!border-t-8"}
      contentClassName="!px-0 pb-0 pt-4 !bg-colorWhite"
    >
      <form className="w-full relative p-5 grid grid-cols-2 gap-4" id={id}>
        <div>
          <SBSelect
            id={`auditMode`}
            label={"Audit Type"}
            value={formik?.values?.auditMode}
            onChange={(data) => {
              formik.setFieldValue("auditMode", data);
            }}
            hideOptionalOption={true}
            options={[
              { value: "", label: "All" },
              { value: "D", label: "D" },
              { value: "E", label: "E" },
            ]}
          />
        </div>
        {!(
          userInfo?.roles?.[0]?.name === "Auditor" ||
          userInfo?.roles?.[0]?.name === "Contractor"
        ) && (
          <div>
            <SBSelect
              id="assignee"
              label={formik?.values?.userType}
              value={formik?.value?.assignee}
              options={userList?.map((element: any) => ({
                value: element.id,
                label: `${element.firstName} ${element.lastName}`,
              }))}
              onChange={(data) => {
                formik.setFieldValue("assignee", data);
              }}
            />
          </div>
        )}

        <div>
          <SBInput
            id="startDate"
            name="startDate"
            label="Start Date"
            inputType="date"
            value={Number(moment(formik.values?.startDate))}
            onChange={(e) => {
              formik.setFieldValue("startDate", Number(moment(e.target.value)));
              formik.setFieldValue("endDate", "");
            }}
          />
        </div>
        <div>
          <SBInput
            id="endDate"
            name="endDate"
            label="End Date"
            inputType="date"
            minDate={Number(moment(formik.values?.startDate)) as any}
            value={Number(moment(formik.values?.endDate))}
            onChange={(e) => {
              formik.setFieldValue("endDate", Number(moment(e.target.value)));
            }}
          />
        </div>
        <div>
          <SBSelect
            id="paid"
            label="Paid Status"
            value={formik?.value?.paid}
            options={[
              { value: "true", label: "Paid" },
              { value: "false", label: "Unpaid" },
            ]}
            onChange={(data) => {
              const dataValue = data === "true" ? true : false;
              formik.setFieldValue("paid", dataValue);
            }}
          />
        </div>
        <div>
          <SBInput
            id="summaryInvoiceId"
            name="summaryInvoiceId"
            label="Summary Invoice Id"
            value={formik.values.summaryInvoiceId}
            onChange={(e) => {
              formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
              formik.handleChange(e);
            }}
            error={Boolean(formik.errors.summaryInvoiceId)}
            touched={Boolean(formik.touched.summaryInvoiceId)}
            errorMessage={formik.errors.summaryInvoiceId}
          />
        </div>
      </form>
      <div
        className={
          "flex-none  fixed bottom-0 left-0 right-0  flex gap-2 bg-white px-4 py-3 justify-end"
        }
        style={{ boxShadow: "0px -1px 0px 0px rgba(0, 0, 0, 0.15)" }}
      >
        <Button
          label="Cancel"
          size="large"
          onClick={() => closeSidebar()}
          variant="outline-gray"
          className="hover:bg-colorLightest"
        />
        <Button
          label="Apply"
          type="submit"
          size="large"
          onClick={() => formik.handleSubmit()}
          className="hover:bg-hoverPrimary"
        />
      </div>
    </Sidebar>
  );
};

export default FilterSidebarAccounting;
