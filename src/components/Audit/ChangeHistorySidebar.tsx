import { Sidebar } from "@/stories/Sidebar/Sidebar";
import { Button } from "@/stories/Button/Button";
import { useChangeHistory } from "@/hooks/useAudit";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChangeHistoryDataDiv from "./ChangeHistoryDataDiv";

interface ChangeHistorySidebarProps {
  open: boolean;
  close: () => void;
}

const ChangeHistorySidebar = ({ open, close }: ChangeHistorySidebarProps) => {
  const [openAccordion, setOpenAccordion] = useState<number>(1);
  const handleOpen = (value: number) =>
    setOpenAccordion(openAccordion === value ? 0 : value);
  const params = useParams();
  const {
    data: historyList,
    isFetching,
    refetch,
  } = useChangeHistory(params?.id as string);

  useEffect(() => {
    if (open) refetch();
    return () => {
      setOpenAccordion(1);
    };
  }, [open]);
 

  return (
    <Sidebar
      open={open}
      sidebarWidth="max-w-[40rem]"
      close={() => close()}
      title={"Change History"}
      headerClassName={"!border-t-8"}
      contentClassName="px-0 pb-0 !bg-colorWhite "
    >
      <div className="flex flex-col h-full overflow-auto p-5 gap-4">
        {historyList &&
          historyList?.length > 0 &&
          historyList?.filter((d:any)=>d?.modifiedColumnsCount >0).map((data: any, index: any) => {
            return (
              <ChangeHistoryDataDiv
                open={openAccordion}
                index={index + 1}
                setOpen={setOpenAccordion}
                handleOpen={handleOpen}
                key={index + 1}
                data={data}
              />
            );
          })}
      </div>
      <div
        className={"flex-none flex gap-2 bg-white px-4 py-3 justify-end"}
        style={{ boxShadow: "0px -1px 0px 0px rgba(0, 0, 0, 0.15)" }}
      >
        <Button
          label="Close"
          size="large"
          onClick={() => close()}
          variant="outline-gray"
          className="hover:bg-colorLightest"
        />
      </div>
    </Sidebar>
  );
};

export default ChangeHistorySidebar;
