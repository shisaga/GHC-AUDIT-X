/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";
import React, { useEffect, useState } from "react";
import SBInput from "@/stories/Input/Input";
import { Label } from "@/stories/Label/Label";
import { FormikValues } from "formik";
import SBSelect from "@/stories/Select/Select";
import { getAllUsers } from "@/hooks/useUser";
import { USER_ROLE, getUserRole } from "@/types/roles";
import { useAuth } from "@/contexts/AuthProvider";
import { UserInfo } from "@/types/user";
import {
  AUDIT_STATUS,
  AUDIT_STATUS_FOR_EDIT,
  PRIORITY,
} from "@/utils/constant";
import { LEADTYPE } from "@/types/enums";
import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { fullNameFormatter } from "@/utils/CommonFunction";

const Daudit = ({ formik, auditMode, specificUserData }: FormikValues) => {
  const { userInfo } = useAuth();
  const pathname = usePathname();
  const editMode = pathname.includes("edit");
  const auditType = auditMode === "D" ? "dAudit" : "eAudit";
  const [auditorList, setAuditorList] = useState<any>([]);
  const [contractorList, setContractorList] = useState<any>([]);
  const [SOList, setSOList] = useState<any>([]);
  const [auditorEA, setAuditorEA] = useState("");
  const serchQuery = useSearchParams()
  const converted = serchQuery.get("type") === "converted";
  

  const startDateValue = new Date(formik.values[`${auditType}`].auditDate);

  const startDateWithoutTime = new Date(
    startDateValue.getFullYear(),
    startDateValue.getMonth(),
    startDateValue.getDate()
  );

  useEffect(() => {
    const getDifferentUsers = async () => {
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

      const allSO = await getAllUsers({
        roleId: getUserRole(USER_ROLE.SO),
        orgId: userInfo?.organizationId || "",
      });
      setSOList(allSO);
    };
    getDifferentUsers();
  }, []);

  const getAuditorEANumber = (value: number) => {
    if (value) {
      const data = auditorList.find((data: any) => data.id === +value);
      let EA = "";
      if (data?.EANumber) {
        EA = data?.EANumber + auditMode;
        setAuditorEA(EA);
      }
    }
    else{
      setAuditorEA('')
    }
  };
  useEffect(() => {
     formik.values[`${auditType}`].auditorId ? getAuditorEANumber(formik.values[`${auditType}`].auditorId) : getAuditorEANumber(formik.values[`${auditType}`].auditorId)
  }, [formik , formik.values.dAudit.auditorId, formik.values.eAudit.auditorId,auditorList , formik.values.auditMode]);

  const convertStartTime = (startTimestamp: number) => {
    const startTime = new Date(startTimestamp);

    const combinedStartTimestamp = new Date(startDateWithoutTime);
    combinedStartTimestamp.setHours(startTime.getHours());
    combinedStartTimestamp.setMinutes(startTime.getMinutes());
    combinedStartTimestamp.setSeconds(startTime.getSeconds());
    combinedStartTimestamp.setMilliseconds(startTime.getMilliseconds());

    if (startTime) {
      formik.setFieldValue(
        `${auditType}.startTime`,
        combinedStartTimestamp.valueOf()
      );
    }
  };

  const convertEndTime = (endTimestamp: number) => {
    const endTime = new Date(endTimestamp);

    const combinedEndTimestamp = new Date(startDateWithoutTime);
    combinedEndTimestamp.setHours(endTime.getHours());
    combinedEndTimestamp.setMinutes(endTime.getMinutes());
    combinedEndTimestamp.setSeconds(endTime.getSeconds());
    combinedEndTimestamp.setMilliseconds(endTime.getMilliseconds());

    if (endTime) {
      formik.setFieldValue(
        `${auditType}.endTime`,
        combinedEndTimestamp.valueOf()
      );
    }
  };


//  useEffect(()=>{
//   if(formik?.values[`${auditType}`]?.auditorId){
//     if(auditorList.filter((d:any)=>d.id == formik?.values[`${auditType}`]?.auditorId).length ==0){
//       formik.setFieldValue(`${auditType}.auditorId`, '')
//     }
//     if(contractorList.filter((d:any)=>d.id == formik.values[`${auditType}`].contractorId).length ==0){
//       formik.setFieldValue(`${auditType}.auditorId`, '')
//     }
//     if(SOList.filter((d:any)=>d.id == formik.values[`${auditType}`].SOId).length ==0){
//       formik.setFieldValue(`${auditType}.auditorId`, '')
//     }
 
//   }
//  },[]) 

  return (
    <div className="mt-4 md:space-y-6 space-y-4">
      <div
        className={` ${formik.values?.auditType === "single" ? "flex justify-between flex-col md:flex-row gap-4" : "grid md:grid-cols-3 grid-cols-1 gap-4"}`}
      >
        <div className="flex-1 flex">
          {auditorEA && (
            <SBInput
              id={`${auditType}.audit1`}
              name={`${auditType}.audit`}
              label=""
              value={auditorEA}
              onChange={() => console.log(auditorEA)}
              disabled
              inputClassName="!w-[75px] !rounded-e-[0px]  !bg-blue-gray-50 "
            />
          )}
          <SBInput
            id={`${auditType}.audit`}
            name={`${auditType}.audit`}
            label="Audit#"
            requiredField ={true}
            value={formik.values[`${auditType}`].audit}
            onChange={(e) => {
              if (e.target.value.length >= 6) return;
              formik.handleChange(e);
            }}
            disabled={
              (editMode && userInfo?.roles?.[0]?.name === "Auditor" &&!converted) ||
              AUDIT_STATUS_FOR_EDIT.includes(
                `${specificUserData?.[`${auditType}`]?.auditStatus}`
              )
            }
            inputClassName={auditorEA ? "!rounded-s-[0px] " : ""}
            error={Boolean(formik.errors[`${auditType}`]?.audit)}
            touched={Boolean(formik.touched[`${auditType}`]?.audit)}
            errorMessage={formik.errors[`${auditType}`]?.audit}
          />
        </div>

        <div
          className={`flex-1 ${
            userInfo?.roles?.[0]?.name === "Auditor" ||
            AUDIT_STATUS_FOR_EDIT.includes(
              `${specificUserData?.[`${auditType}`]?.auditStatus}`
            )
              ? "pointer-events-none opacity-70 cursor-not-allowed"
              : ""
          }`}
        >
          <div className="mt-0 lg:-mt-6">
            <div className="mb-1">
              <Label size="extra-small" label="Lead Type" />
            </div>
            <div className="border border-colorLighter flex rounded-md cursor-pointer">
              <div
                className={`border-r border-colorLighter flex-1 px-4 py-[10px] text-center text-sm  ${formik.values[`${auditType}`].leadType === LEADTYPE.GHC ? "bg-themePrimary text-colorWhite rounded-l-[5px]" : ""}`}
                onClick={() =>
                  formik.setFieldValue(`${auditType}.leadType`, LEADTYPE.GHC)
                }
              >
                GHC
              </div>
              <div
                className={`px-4 py-[10px] flex-1 text-center text-sm ${formik.values[`${auditType}`].leadType === LEADTYPE.EA ? "bg-themePrimary text-colorWhite rounded-r-[5px]" : ""}`}
                onClick={() =>
                  formik.setFieldValue(`${auditType}.leadType`, LEADTYPE.EA)
                }
              >
                EA
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <SBSelect
            id={`${auditType}.auditStatus`}
            label={"Audit Status"}
            value={formik.values[`${auditType}`].auditStatus}
            options={AUDIT_STATUS.map((element) => {
              return { value: element, label: element };
            })}
            onChange={(data) =>
              formik.setFieldValue(`${auditType}.auditStatus`, data)
            }
          />
        </div>

        <div className="flex-1">
          <SBInput
            id="auditDate"
            name="auditDate"
            label="Audit Date"
            inputType="date"
            disabled={AUDIT_STATUS_FOR_EDIT.includes(
              `${specificUserData?.[`${auditType}`]?.auditStatus}`
            )}
            value={Number(moment(formik.values[`${auditType}`].auditDate))}
            onChange={(e) => {
              formik.setFieldValue(
                `${auditType}.auditDate`,
                Number(moment(e.target.value))
              );
              formik.setFieldValue(`${auditType}.endTime`, "");
              formik.setFieldValue(`${auditType}.startTime`, "");
            }}
          />
        </div>
        <div className="flex-1">
          <SBInput
            id="startTime"
            name="startTime"
            label="Start Time"
            inputType="date"
            showTimeSelect={true}
            showTimeSelectOnly={true}
            disabled={AUDIT_STATUS_FOR_EDIT.includes(
              `${specificUserData?.[`${auditType}`]?.auditStatus}`
            )}
            value={formik.values[`${auditType}`].startTime}
            onChange={(e) => {
              convertStartTime(Number(moment(e.target.value)));
              formik.setFieldValue(`${auditType}.endTime`, "");
            }}
          />
        </div>
        <div className="flex-1">
          <SBInput
            id="endTime"
            name="endTime"
            label="End Time"
            inputType="date"
            minTime={formik.values[`${auditType}`].startTime + 1.8e6}
            showTimeSelect={true}
            showTimeSelectOnly={true}
            disabled={AUDIT_STATUS_FOR_EDIT.includes(
              `${specificUserData?.[`${auditType}`]?.auditStatus}`
            )}
            value={formik.values[`${auditType}`].endTime}
            onChange={(e) => convertEndTime(Number(moment(e.target.value)))}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
        <div className="flex-1">
          <SBSelect
            id={`${auditType}.priority`}
            label={"Audit Priority"}
            value={formik.values[`${auditType}`].priority}
            options={PRIORITY}
            disabled={userInfo?.roles?.[0]?.name === "Auditor"}
            onChange={(data) =>
              formik.setFieldValue(`${auditType}.priority`, data)
            }
          />
        </div>
        <div className="flex-1">
          <SBInput
            id={`${auditType}.application`}
            label="Application"
            name={`${auditType}.application`}
            value={formik.values[`${auditType}`].application}
            onChange={formik.handleChange}
            disabled={
              userInfo?.roles?.[0]?.name === "Auditor" ||
              AUDIT_STATUS_FOR_EDIT.includes(
                `${specificUserData?.[`${auditType}`]?.auditStatus}`
              )
            }
            error={Boolean(formik.errors[`${auditType}`]?.application)}
            touched={Boolean(formik.touched[`${auditType}`]?.application)}
            errorMessage={ formik.errors[`${auditType}`]?.application}
          />
        </div>
        <div>
          <SBSelect
            id={`${auditType}.auditorId`}
            label={"Auditor"}
            requiredField ={true}
            value={formik?.values[`${auditType}`]?.auditorId}
            options={auditorList?.map((element: UserInfo) => {
              return {
                value: element.id,
                label: fullNameFormatter(element?.firstName, element?.lastName),
              };
            })}
            disabled={
              userInfo?.roles?.[0]?.name === "Auditor" ||
              AUDIT_STATUS_FOR_EDIT.includes(
                `${specificUserData?.[`${auditType}`]?.auditStatus}`
              )
            }
            onChange={(data) =>
              formik.setFieldValue(`${auditType}.auditorId`, data)
            }
            error={Boolean(formik.errors[`${auditType}`]?.auditorId)}
            touched={Boolean(formik.touched[`${auditType}`]?.auditorId)}
            errorMessage={ formik.errors[`${auditType}`]?.auditorId}
          />
        </div>
        <div>
          <SBSelect
            id={`${auditType}.contractorId`}
            label={"Contractor"}
            value={formik.values[`${auditType}`].contractorId}
            options={contractorList?.map((element: UserInfo) => {
              return {
                value: element.id,
                label: fullNameFormatter(element?.firstName, element?.lastName),
                image: element?.imgUrl || "",
              };
            })}
            disabled={
              userInfo?.roles?.[0]?.name === "Auditor" ||
              AUDIT_STATUS_FOR_EDIT.includes(
                `${specificUserData?.[`${auditType}`]?.auditStatus}`
              )
            }
            onChange={(data) =>
              formik.setFieldValue(`${auditType}.contractorId`, data)
            }
            error={Boolean(formik.errors[`${auditType}`]?.contractorId)}
            touched={Boolean(formik.errors[`${auditType}`]?.contractorId)}
            errorMessage={formik.errors[`${auditType}`]?.contractorId}
          />
        </div>
        <div>
          <SBSelect
            id={`${auditType}.SOId`}
            label={"SO"}
            value={formik.values[`${auditType}`].SOId}
            options={SOList?.map((element: UserInfo) => {
              return {
                value: element.id,
                label: fullNameFormatter(element?.firstName, element?.lastName),
                image: element?.imgUrl || "",
              };
            })}
            disabled={
              userInfo?.roles?.[0]?.name === "Auditor" ||
              AUDIT_STATUS_FOR_EDIT.includes(
                `${specificUserData?.[`${auditType}`]?.auditStatus}`
              )
            }
            onChange={(data) => formik.setFieldValue(`${auditType}.SOId`, data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Daudit;
