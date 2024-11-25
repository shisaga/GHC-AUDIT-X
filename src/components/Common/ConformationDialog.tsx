import React, { ReactNode } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { Modal } from "@/stories/Modal/Modal";
import { Button } from "@/stories/Button/Button";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { Label } from "@/stories/Label/Label";

export interface ConformationDialogProps {
  open: boolean;
  setOpenModal: (val: boolean) => void;
  onConfirm: any;
  processing: boolean;
  message?: ReactNode | string;
  buttonText?: string;
  loadingText?: string;
  buttonClass?: string;
  whiteButtonText?: string;
  iconColor?: string;
  variant?:string;
  userToDelete?: string;
}
const ConformationDialog = ({
  open,
  setOpenModal,
  onConfirm,
  processing,
  message,
  buttonText,
  userToDelete,
  buttonClass,
  variant,
  iconColor,
  loadingText,
  whiteButtonText,
}: ConformationDialogProps) => {
  return (
    <Modal
      open={open}
      close={() => setOpenModal(false)}
      hideCloseButton
      className="z-[100] !rounded-normal"
    >
      <div className="flex flex-col items-center w-full gap-5">
        <RiErrorWarningLine className="text-colorDanger text-5xl" color={iconColor||''} />
        <div className="text-lg font-semibold text-colorBlack text-center">
          <Label label={message ?? "Are you sure you want to delete?"} />
          {userToDelete && (
            <>
              <br />
              <Label color="var(--color-primary)" label={userToDelete} />
            </>
          )}
        </div>
        <div
          className={`grid mt-5 ${
            processing ? "grid-cols-1" : "sm:grid-cols-2 grid-cols-1"
          } gap-2 w-full`}
        >
          {processing ? (
            <LoadingButton
              size="large"
              variant="danger"
              label={loadingText ?? "Deleting"}
            />
          ) : (
            <>
              <Button
                size="large"
                variant="outline-gray"
                label={whiteButtonText ?? "Cancel"}
                onClick={() => {
                  setOpenModal(false);
                }}
                disabled={processing}
                className="hover:bg-colorLightest"
              />
              <Button
                size="large"
                variant={variant as any ?? 'danger'}
               
                label={buttonText ?? "Delete"}
                onClick={onConfirm}
                className="hover:opacity-90"
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConformationDialog;
