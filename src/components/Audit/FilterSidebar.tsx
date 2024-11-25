import { Sidebar } from "@/stories/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import SBSelect from "@/stories/Select/Select";
import { getAllUsers } from "@/hooks/useUser";
import { USER_ROLE, getUserRole } from "@/types/roles";
import { UserInfo } from "@/types/user";
import { useAuth } from "@/contexts/AuthProvider";
import { AUDIT_STATUS, CANADA_PROVINCES, DAY_FILTER } from "@/utils/constant";
import { Button } from "@/stories/Button/Button";

interface FilterSidebarProps {
  open: boolean;
  close: () => void;
  id?: string;
  formik: any;
}

const FilterSidebar = ({ open, close, id, formik }: FilterSidebarProps) => {
  const { userInfo } = useAuth();
  const [auditorList, setAuditorList] = useState<any>([]);
  const [contractorList, setContractorList] = useState<any>([]);

  useEffect(() => {
    const getAuditorContractor = async () => {
      const allAuditor = await getAllUsers({
        roleId: getUserRole(USER_ROLE.AUDITOR),
        orgId: userInfo?.organizationId || "",
      });
      setAuditorList(allAuditor);

      const allContractor = await getAllUsers({
        roleId: getUserRole(USER_ROLE.CONTRACTOR),
        orgId: userInfo?.organizationId || "",
      });
      setContractorList(allContractor);
    };
    getAuditorContractor();
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
      <form
        className="w-full h-full overflow-auto p-5 grid grid-cols-2 gap-4"
        onSubmit={formik.handleSubmit}
      >
        <div>
          <SBSelect
            id={`auditMode`}
            label={"Audit Type"}
            value={formik.values.auditMode}
            onChange={(data) => {
              formik.setFieldValue("auditMode", data);
            }}
            hideOptionalOption
            options={[
              { value: "", label: "All" },
              { value: "D", label: "D" },
              { value: "E", label: "E" },
            ]}
          />
        </div>
        <div>
          <SBSelect
            id="auditor"
            label="Auditor"
            value={formik.values.auditor}
            hideOptionalOption
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...auditorList.map((element: UserInfo) => ({
                value: element.id,
                label: `${element.firstName} ${element.lastName}`,
              })),
            ]}
            onChange={(data) => {
              formik.setFieldValue("auditor", data);
            }}
          />
        </div>
        <div>
          <SBSelect
            id="contractor"
            label="Contractor"
            value={formik.values.contractor}
            hideOptionalOption
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...contractorList.map((element: UserInfo) => ({
                value: element.id,
                label: `${element.firstName} ${element.lastName}`,
              })),
            ]}
            onChange={(data) => {
              formik.setFieldValue("contractor", data);
            }}
          />
        </div>
        <div>
          <SBSelect
            id={`province`}
            label={"Province"}
            value={formik.values.province}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("province", data);
            }}
            options={[
              { value: "", label: "All" },
              ...CANADA_PROVINCES.map((element: string) => ({
                value: element,
                label: element,
              })),
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={"auditStatus"}
            label={"Audit Status"}
            value={formik.values.auditStatus}
            hideOptionalOption
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...AUDIT_STATUS.map((element) => ({
                value: element,
                label: element,
              })),
            ]}
            onChange={(data) => {
              formik.setFieldValue("auditStatus", data);
            }}
          />
        </div>
        <div>
          <SBSelect
            id={`leadType`}
            label={"Lead Type"}
            value={formik.values.leadType}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("leadType", data);
            }}
            options={[
              { value: "", label: "All" },
              { value: "EA", label: "EA" },
              { value: "GHC", label: "GHC" },
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`createdDate`}
            label={"Created Date"}
            value={formik.values.createdDate}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("createdDate", data);
            }}
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...DAY_FILTER.map((element) => ({
                value: element.value,
                label: element.label,
              })),
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`auditDate`}
            label={"Audit Date"}
            value={formik.values.auditDate}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("auditDate", data);
            }}
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...DAY_FILTER.map((element) => ({
                value: element.value,
                label: element.label,
              })),
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`lastStatusChangeDate`}
            label={"Last Status Change Date"}
            value={formik.values.lastStatusChangeDate}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("lastStatusChangeDate", data);
            }}
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...DAY_FILTER.map((element) => ({
                value: element.value,
                label: element.label,
              })),
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`paymentDate`}
            label={"Payment Date"}
            value={formik.values.paymentDate}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("paymentDate", data);
            }}
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...DAY_FILTER.map((element) => ({
                value: element.value,
                label: element.label,
              })),
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`lastStatusChangeUser`}
            label={"Last Status Change User"}
            value={formik.values.lastStatusChangeUser}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("lastStatusChangeUser", data);
            }}
            options={[
              { value: "", label: "All" }, // Adding the "All" option
              ...DAY_FILTER.map((element) => ({
                value: element.value,
                label: element.label,
              })),
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`paid`}
            label={"Paid"}
            value={formik.values.paid}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("paid", data);
            }}
            options={[
              { value: "", label: "All" },
              { value: true as any, label: "Yes" },
              { value: false as any, label: "No" },
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`invoice`}
            label={"Invoice Sent"}
            value={formik.values.invoice}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("invoice", data);
            }}
            options={[
              { value: "", label: "All" },
              { value: true as any, label: "Yes" },
              { value: false as any, label: "No" },
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`report`}
            label={"Report"}
            value={formik.values.report}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("report", data);
            }}
            options={[
              { value: "", label: "All" },
              { value: true as any, label: "Yes" },
              { value: false as any, label: "No" },
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`EABalancedClear`}
            label={"EA Paid"}
            hideOptionalOption
            value={formik.values.EABalancedClear}
            onChange={(data) => {
              formik.setFieldValue("EABalancedClear", data);
            }}
            options={[
              { value: "", label: "All" },
              { value: true as any, label: "Yes" },
              { value: false as any, label: "No" },
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`contractorBalanceCleared`}
            label={"Contractor Paid"}
            value={formik.values.contractorBalanceCleared}
            hideOptionalOption
            onChange={(data) => {
              formik.setFieldValue("contractorBalanceCleared", data);
            }}
            options={[
              { value: "", label: "All" },
              { value: true as any, label: "Yes" },
              { value: false as any, label: "No" },
            ]}
          />
        </div>
        <div>
          <SBSelect
            id={`SOBalanceCleared`}
            label={"SO Paid"}
            hideOptionalOption
            value={formik.values.SOBalanceCleared}
            onChange={(data) => {
              formik.setFieldValue("SOBalanceCleared", data);
            }}
            options={[
              { value: "", label: "All" },
              { value: true as any, label: "Yes" },
              { value: false as any, label: "No" },
            ]}
          />
        </div>
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

export default FilterSidebar;
