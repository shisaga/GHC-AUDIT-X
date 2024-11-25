import { Sidebar } from "@/stories/Sidebar/Sidebar";
import { useFormik } from "formik";
import SBInput from "@/stories/Input/Input";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/stories/Button/Button";
import { LoadingButton } from "@/stories/Loading-Button/LoadingButton";
import { FaPaperPlane } from "react-icons/fa";
import { Label } from "@/stories/Label/Label";
import { useAddComment, useComments } from "@/hooks/useComment";
import { usePathname } from "next/navigation";
import { errorToast } from "@/hooks/toaster/useCustomToaster";
import { AddComment } from "@/types/comment";

import {
  fullNameFormatter,
  getDateInFormat,
  getTimestamp,
} from "@/utils/CommonFunction";
import moment from "moment";
import { useEffect } from "react";

interface CommentSidebarProps {
  open: boolean;
  close: () => void;
  id?: string;
}

const CommentSidebar = ({ open, close, id }: CommentSidebarProps) => {
  const { userInfo } = useAuth();
  const pathname = usePathname();
  const clientId: any = pathname.split("/").pop();
  const { data, isFetching, refetch } = useComments(clientId as string);
  const { addComment, isAdding } = useAddComment();

  const handleAdd = async (comment: AddComment) => {
    if (comment) {
      await addComment(comment)
        .then(() => {
          formik.setFieldValue("comment", "");
        })
        .catch((err) => {
          errorToast(err?.message as string);
        });
    }
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      comment: "",
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
      userId: userInfo?.id || "",
      clientId,
    },
    onSubmit: handleAdd,
  });

  const scrollToElement = () => {
    const container = document.getElementById("last-message");
    container?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToElement();
  }, [data]);

  const closeSidebar = () => {
    close();
    formik.resetForm();
  };

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  return (
    <Sidebar
      open={open}
      close={() => closeSidebar()}
      title={"Comments"}
      headerClassName={"!border-t-8"}
      contentClassName="!p-0 !bg-colorWhite"
    >
      <>
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="overflow-y-auto h-full space-y-2 mb-2">
            <>
              {data?.length ? (
                data?.map((detail) => (
                  <div key={`comments-${detail.createdAt}`} className="px-4">
                    <div className="text-center flex items-center px-4">
                      <hr className="w-[30%]" />
                      <span className="text-sm w-[30%] mx-3">
                        {getDateInFormat(moment(detail.createdAt).valueOf())}
                      </span>
                      <hr className="w-[30%]" />
                    </div>
                    <div className="flex gap-2">
                      <span className="w-[40px] h-[36px] text-sm text-center bg-themePrimary text-colorWhite rounded-full pt-[8px] font-medium">
                        {detail?.firstName?.charAt(0)}
                        {detail?.lastName?.charAt(0)}
                      </span>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-col gap-2 bg-[#F5F6FA] px-3 py-2 rounded-xl relative">
                          <div className="flex xs:gap-3 flex-row items-center justify-between">
                            <Label
                              label={fullNameFormatter(
                                detail?.firstName,
                                detail?.lastName
                              )}
                              color="var(--color-neutral-700)"
                              className="font-semibold capitalize"
                            />
                            <Label
                              size="small"
                              color="var(--color-neutral-700)"
                              label={moment(
                                getTimestamp(detail?.createdAt)
                              ).fromNow()}
                            />
                          </div>
                          <Label label={detail.comment} className="break-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center flex-col gap-2 py-10">
                  <Label
                    label="No Comments Found"
                    className="font-semibold text-colorLight text-center"
                  />
                </div>
              )}
              <div id="last-message" />
            </>
          </div>
          <div>
            <hr className="mb-4" />
            <form onSubmit={formik.handleSubmit}>
              <div className="p-4 pt-0 flex gap-2">
                <SBInput
                  id="comment"
                  name="comment"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  label="Comment"
                  wrapperClassName="w-full"
                  disabled={isAdding}
                />
                {isAdding ? (
                  <LoadingButton label="" disabled />
                ) : (
                  <Button
                    type="submit"
                    label=""
                    icon={<FaPaperPlane className="text-lg" />}
                    disabled={
                      isAdding || formik.values.comment.trim().length < 2
                    }
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </>
    </Sidebar>
  );
};

export default CommentSidebar;
