import { Sidebar } from "@/stories/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import SBSelect from "@/stories/Select/Select";
import SBInput from "@/stories/Input/Input";
import { getAllUsers } from "@/hooks/useUser";
import { USER_ROLE, getUserRole } from "@/types/roles";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/stories/Button/Button";
import moment from "moment";
import { FormikValues } from "formik";

interface FilterSidebarProps {
  open: boolean;
  close: () => void;
  id?: string;
  formik: FormikValues;
}

const DashboardFilterSidebar = ({
  open,
  close,
  formik,
  id,
}: FilterSidebarProps) => {
  const { userInfo } = useAuth();
  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    const getAllAuditor = async () => {
      const allAuditor = await getAllUsers({
        roleId: getUserRole(USER_ROLE.AUDITOR),
        orgId: userInfo?.organizationId || "",
      });
      setUserList(allAuditor);
    };
    getAllAuditor();
  }, []);

  return (
    <Sidebar
      open={open}
      sidebarWidth="max-w-[30rem]"
      close={() => close()}
      title={"Filters"}
      headerClassName={"!border-t-8"}
      contentClassName="!px-0 pb-0 pt-4 !bg-colorWhite"
    >
      <div className="px-5">
        <SBSelect
          id="assignee"
          label="Auditor"
          value={formik?.values?.assignee}
          options={userList?.map((element: any) => ({
            value: element.id,
            label: `${element.firstName} ${element.lastName}`,
          }))}
          onChange={(data) => {
            formik.setFieldValue("assignee", data);
          }}
        />
      </div>
      <form className="w-full relative p-5 grid grid-cols-2 gap-4" id={id}>
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
          onClick={() => close()}
          variant="outline-gray"
          className="hover:bg-colorLightest"
        />
        <Button
          label="Apply"
          type="submit"
          size="large"
          onClick={formik.handleSubmit}
          className="hover:bg-hoverPrimary"
        />
      </div>
    </Sidebar>
  );
};

export default DashboardFilterSidebar;
