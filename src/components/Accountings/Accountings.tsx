"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Heading } from "@/stories/Heading/Heading";
import { Label } from "@/stories/Label/Label";
import { useAuth } from "@/contexts/AuthProvider";

const GHCToSO = dynamic(() => import("./GHCToSO"));
const GHCToAuditor = dynamic(() => import("./GHCToAuditor"));
const GHCToContractor = dynamic(() => import("./GHCToContractor"));
const Transfers = dynamic(() => import("./Transfers"));

const Accountings = () => {
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    userInfo?.roles?.[0].name === "Contractor"
      ? "Contractors"
      : "Auditors"
  );

  const _renderContent = useMemo(() => {
    switch (activeTab) {
      case "Auditors": {
        return (
          <GHCToAuditor activeTab={activeTab} setActiveTab={setActiveTab} />
        );
      }
      case "Contractors": {
        return (
          <GHCToContractor activeTab={activeTab} setActiveTab={setActiveTab} />
        );
      }
      case "Service Organizations": {
        return <GHCToSO activeTab={activeTab} setActiveTab={setActiveTab} />;
      }
      // case "Transfers": {
      //   return <Transfers />;
      // }
    }
    return;
  }, [activeTab]);

  const tabNames =    userInfo?.roles?.[0].name === "Auditor" ||
  userInfo?.roles?.[0].name === "Contractor" ? [userInfo?.roles?.[0].name] :[
    "Auditors",
    "Contractors",
    "Service Organizations",
    // "Transfers",
  ];

  const AuditorOrContractor =
    userInfo?.roles?.[0].name === "Auditor" ||
    userInfo?.roles?.[0].name === "Contractor";


  return (
    <main className="h-full overflow-x-hidden grow">
      <div
        className={AuditorOrContractor ? "h-full" : "grid grid-cols-12 h-full"}
      >
        {AuditorOrContractor ? (
          ""
        ) : (
          <div className="col-span-full lg:col-span-3 xl:col-span-3 2xl:col-span-2 hidden lg:block">
            <div className="px-4 py-6 h-full bg-colorWhite border-r border-l-0 border-y-0 border-colorLighter">
              <div className="py-2 mb-3">
                <Heading label="Accounting" type="h3" />
              </div>
              <div className="flex flex-col">
                {tabNames.filter(Boolean).map((tabName, index: number) => (
                  <div
                    key={index}
                    className={`${activeTab === tabName ? "font-semibold !text-themePrimary underline underline-offset-2" : "text-colorLight"} py-1`}
                    onClick={() => setActiveTab(tabName)}
                  >
                    <Label
                      label={tabName}
                      className="cursor-pointer"
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="col-span-full lg:col-span-9 xl:col-span-9 2xl:col-span-10 max-w">
          <div className="md:p-6 p-4 flex flex-col lg:gap-5 gap-4">
            <div>{_renderContent}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Accountings;
