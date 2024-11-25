"use client";
import { Sidebar } from "@/stories/Sidebar/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/stories/Button/Button";
import { useParams } from "next/navigation";
import { ImInfo } from "react-icons/im";
import {
  closeToast,
  errorToast,
  loadingToast,
  successToast,
} from "@/hooks/toaster/useCustomToaster";
import {
  useAllReports,
  useCreateDocument,
  useDeleteDocumentById,
  useDeleteDocumentByKey,
  useUploadDocument,
} from "@/hooks/useDocument";
import { FaPencilAlt, FaRegFileAlt } from "react-icons/fa";
import { Label } from "@/stories/Label/Label";
import { MdCancel } from "react-icons/md";
import ConformationDialog from "../Common/ConformationDialog";
import { SBTooltip } from "@/stories/Tooltip/Tooltip";
import { Heading } from "@/stories/Heading/Heading";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { HiOutlineDownload } from "react-icons/hi";
import { fileUrlFormatter } from "@/utils/CommonFunction";
import { userInfo } from "os";

interface ReportSidebarProps {
  open: boolean;
  close: () => void;
  data?: any;
}

interface FileObject {
  id?: string;
  title?: string;
  fileName?: string;
  fileUrl?: string;
}

const ReportSidebar = ({ open, close, data }: ReportSidebarProps) => {
  const { id: clientId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userInfo } = useAuth();

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>();
  const [fileTitles, setFileTitles] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const { isCreating, createDocument } = useCreateDocument();
  const { isUploading, uploadDocument } = useUploadDocument();
  const {
    data: reportData,
    isLoading,
    refetch,
  } = useAllReports(clientId as string);
  const { deleteDocumentByKey, isDeletingByKey } = useDeleteDocumentByKey();
  const { deleteDocumentById, isDeletingById } = useDeleteDocumentById();

  const handleUpload = async () => {
    const { files } = formik.values;
    if (!files || files.length === 0) return;
    const toastId = loadingToast("Uploading Report...");
    try {
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
      const response = await uploadDocument(formData);
      if (response) {
        const documentsWithTitles = response.map((doc: any, index: number) => ({
          title: fileTitles[index] || doc.fileName,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
        }));
        const createDocumentResponse = await createDocument({
          clientId,
          document: documentsWithTitles,
        });
        closeToast(toastId);
        closeSidebar();
        successToast("Report Added Sucessfully");
      }
    } catch (error:any) {
      closeToast(toastId);
      // console.log(error?.response?.data)
      console.log()
      errorToast( error?.response?.data.includes('allowed') && error?.response?.data.includes('not') && error?.response?.data.includes('File') ?'File type not allowed!':'Error Uploading Reports.');

      console.error("Error uploading files:", error);
    }
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      files: [],
    },
    onSubmit: handleUpload,
  });

  const [editableTitles, setEditableTitles] = useState<boolean[]>(
    Array.from({ length: formik.values.files.length }, () => false)
  );

  const closeSidebar = () => {
    formik.resetForm();
    setFileTitles([]);
    setEditableTitles([]);
    close();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    const previousFiles = formik.values.files || [];

    // Concatenate previous files with newly selected files
    const allFiles = [...previousFiles, ...Array.from(selectedFiles)];

    formik.setFieldValue("files", allFiles);
    // formik.setFieldValue("files", Array.from(selectedFiles));
  };

  const handleRemoveFile = async (index: number) => {
    const updatedFiles: FileObject[] = [...formik.values.files];
    updatedFiles.splice(index, 1);
    formik.setFieldValue("files", updatedFiles);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (reportData) {
      setUploadedFiles(reportData);
    }
    refetch();
  }, [open]);

  const handleDeleteById = async (id: string) => {
    try {
      await deleteDocumentById(id);
      closeSidebar();
      successToast("Document Deleted Successfully");
    } catch (error) {
      errorToast("Error deleting document by key");
      console.error("Error deleting document by key:", error);
    }
  };

  const handleDeleteByKey = async (fileName: string) => {
    try {
      await deleteDocumentByKey(fileName);
      successToast("Document deleted successfully by key");
    } catch (error) {
      errorToast("Error deleting document by key");
      console.error("Error deleting document by key:", error);
    }
  };

  const handleDownloadFile = async (fileName: string, title: string) => {
    const fileExtenstion = fileName.split(".").pop();
    const link = document.createElement("a");
    link.href = fileUrlFormatter(fileName as string);
    link.setAttribute("download", `${title}.${fileExtenstion}`);
    link.setAttribute("target", "_blank");

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the click event to start downloading the file
    link.click();
    // Clean up: remove the link element from the DOM
    document.body.removeChild(link);
  };

  return (
    <Sidebar
      open={open}
      close={() => closeSidebar()}
      title={"Report"}
      headerClassName={"!border-t-8"}
      contentClassName="px-0 pb-0 pt-4"
    >
      <form
        className="flex h-full flex-col gap-5"
        onSubmit={formik.handleSubmit}
      >
        <div className="overflow-auto h-full w-full space-y-2 mb-2 px-4">
          {(userInfo?.roles?.[0].name === "Admin"  || userInfo?.roles?.[0].name === "Auditor" ) && (
            <>
              <div
                className="h-24 flex flex-col items-center justify-center gap-2 border border-colorLighter rounded-lg p-3 cursor-pointer"
                onClick={openFileDialog}
              >
                <FaRegFileAlt color="var(--color-primary)" size={25} />
                <Label
                  label="Click to upload file (png, jpg, jpeg, xsv, csv, docx, pdf)."
                  size="small"
                  className="text-colorLight cursor-pointer"
                />

                <input
                  type="file"
                  multiple
                  accept=".png, .jpg, .jpeg, .xsv, .csv, .docx, .pdf"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              <div className="flex pl-2 gap-1">
                <ImInfo className="text-sm" color="var(--color-primary)" />
                <Label
                  label={`After selecting report files click on "Add Report" to upload files`}
                  size="small"
                  className="text-colorLight"
                />
              </div>
            </>
          )}
          <div className="file-list">
            {formik.values.files.length > 0 && (
              <Heading type="h6" label="Upload reports" />
            )}
            {formik.values.files.map((file: any, index: number) => (
              <div
                key={index}
                className="file-item flex items-center justify-between gap-4 py-1 pl-2 border-b"
              >
                <input
                  type="text"
                  value={
                    editableTitles[index]
                      ? fileTitles[index]?.replace(/ /g, "-")
                      : file?.name?.split(".")[0]
                  }
                  onChange={(e) => {
                    const newTitles = [...fileTitles];
                    newTitles[index] = e.target.value.replaceAll('.','');
                    setFileTitles(newTitles);
                  }}
                  
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                    }
                  }}
                  // readOnly={!editableTitles[index]}
                  className={`${editableTitles[index] ? "block" : "hidden"} whitespace-nowrap overflow-hidden w-32 flex-grow`}
                />
                <span
                  className={`${editableTitles[index] ? "hidden" : ""} whitespace-nowrap text-ellipsis overflow-hidden`}
                >
                  {file.name || file.fileName}
                </span>
                <div className="flex gap-2">
                  <div
                    className="bg-colorLighter p-[10px] items-center justify-center rounded-md"
                    id="clear-filter"
                    onClick={() => {
                      const newEditableTitles = [...editableTitles];
                      newEditableTitles[index] = true;
                      setEditableTitles(newEditableTitles);
                    }}
                  >
                    <FaPencilAlt
                      color="var(--color-primary)"
                      className="focus:outline-none "
                    />
                  </div>
                  <SBTooltip
                    place="bottom"
                    message="Edit filename"
                    id="clear-filter"
                    className="max-w-full !text-xs "
                  />
                  <div className="bg-[var(--light-red)] p-2 items-center rounded-md">
                    <MdCancel
                      color="var(--danger-red)"
                      className="text-lg"
                      onClick={() => handleRemoveFile(index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="file-list">
            {uploadedFiles?.length > 0 && (
              <Heading type="h6" label="Uploaded reports" />
            )}
            {uploadedFiles && uploadedFiles?.length > 0 ? (
              uploadedFiles?.map((file: any, index: number) => (
                <div
                  key={index}
                  className="file-item flex items-center justify-between gap-4 py-1 pl-2 border-b"
                >
                  <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                    {file?.title.split('.')[0]}.{(file?.fileUrl).split(".")[1]}
                  </span>

                  <div className="flex gap-2">
                    <div
                      className="bg-colorLighter p-2 items-center rounded-md cursor-pointer"
                      onClick={() =>
                        handleDownloadFile(file?.fileUrl, file?.title)
                      }
                    >
                      <HiOutlineDownload
                        color="var(--color-primary)"
                        className="text-lg"
                      />
                    </div>
                    <div
                      className="bg-[var(--light-red)] p-2 items-center rounded-md cursor-pointer"
                      onClick={() => {
                        setDocumentId(file?.id);
                        setOpenConfirmDeleteDialog(true);
                      }}
                    >
                      <RiDeleteBin5Fill
                        color="var(--danger-red)"
                        className="text-lg"
                        onClick={() => handleRemoveFile(index)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center flex-col gap-2 py-10">
                <Label
                  label="No reports uploaded yet."
                  className="font-semibold text-colorLight text-center"
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={"flex-none flex gap-2 bg-white px-4 py-3 justify-end"}
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
            label={"Add Report"}
            disabled={isUploading || isCreating || isLoading}
            size="large"
            type="submit"
            className="hover:bg-hoverPrimary"
          />
        </div>
        <ConformationDialog
          message="Are you sure you want to delete. Once deleted it cannot be retrieved"
          open={openConfirmDeleteDialog}
          processing={isDeletingById}
          onConfirm={() => {
            handleDeleteById(documentId as string);
            setOpenConfirmDeleteDialog(false);
          }}
          setOpenModal={() => {
            setDocumentId("");
            setOpenConfirmDeleteDialog(false);
          }}
        />
      </form>
    </Sidebar>
  );
};

export default ReportSidebar;
