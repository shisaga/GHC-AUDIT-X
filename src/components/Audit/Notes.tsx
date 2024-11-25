"use client";
import {
  closeToast,
  errorToast,
  loadingToast,
  successToast,
} from "@/hooks/toaster/useCustomToaster";
import { useCreateNotes, useDeleteNoteFile } from "@/hooks/useAudit";
import { useUploadDocument } from "@/hooks/useDocument";
import { Each } from "@/stories/Each/Each";
import { Heading } from "@/stories/Heading/Heading";
import { Label } from "@/stories/Label/Label";
import SBTextarea from "@/stories/Textarea/TextArea";
import { fileUrlFormatter } from "@/utils/CommonFunction";
import { Card } from "@material-tailwind/react";
import { FormikValues } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaRegImages } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import ConformationDialog from "../Common/ConformationDialog";
import { Button } from "@/stories/Button/Button";
import { useQueryClient } from "react-query";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { LuRotateCcw } from "react-icons/lu";

const Notes = ({ formik,setRefetch }: { formik: FormikValues ,setRefetch:any }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [visible, setVisible] = useState<any>(false);
  const [index, setIndex] = useState<any>(0);
  const [deleteIndex, setDeletIndex] = useState<any>(null);

  const { isUploading, uploadDocument } = useUploadDocument();
  const { isDeleting, deleteNotesFile } = useDeleteNoteFile();
  const { isCreating, createNotes } = useCreateNotes();
  const [notesImages, setNotesImages] = useState<File[]>(
    formik.values?.notes?.files
  );

  const { id } = useParams();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    const previousFiles = formik.values?.notes?.files || [];
    // Concatenate previous files with newly selected files
    const allFiles = [...previousFiles, ...Array.from(selectedFiles)];

    setNotesImages(allFiles);
    formik.setFieldValue(`notes.files`, allFiles);
  };

  const handleRemoveFile = async (index: number) => {
    const updatedFiles = [...formik.values?.notes?.files];
    let selectedDoc = updatedFiles[index]?.fileUrl;
    if (selectedDoc) {
      setSelectedFile(selectedDoc);
      setOpenConfirmDeleteDialog(true);
    }
    if (!selectedDoc) {
      notesImages.splice(index, 1);
      updatedFiles.splice(index, 1);
      formik.setFieldValue(`notes.files`, updatedFiles);
      setDeletIndex(null);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (allFiles: any) => {
    const toastId = loadingToast("Uploading images...");
    try {
      let formData = new FormData();
      for (let i = 0; i < allFiles.length; i++) {
        formData.append("file", allFiles[i]);
      }
      const response = await uploadDocument(formData);
      const previousFiles = formik.values?.notes?.files || [];
      if (response) {
        const createNotesResponse = await createNotes({
          clientId: id,
          notes: {
            note: formik?.values?.notes?.note || "",
            files: [
              ...previousFiles.filter((d: any) => d.fileUrl),
              ...response,
            ] as any,
          },
        });
        formik.setFieldValue(`notes.files`, [
          ...formik.values?.notes?.files.filter((d: any) => d.fileUrl),
          ...response,
        ]);

        queryClient.invalidateQueries(["create-notes"]);

        closeToast(toastId);
        successToast("Images uploaded sucessfully");
      }
      setRefetch((d:any)=>!d)
    } catch (error) {
      closeToast(toastId);
      errorToast("Error Uploading Reports.");
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteFile = async (fileName: string, index?: any) => {
    if (fileName) {
      try {
        await deleteNotesFile({ id: id as string, fileName });
        setOpenConfirmDeleteDialog(false);
        formik.setFieldValue(
          `notes.files`,
          formik.values?.notes?.files.filter((d: any) => d.fileUrl !== fileName)
        );
        queryClient.invalidateQueries("audits");
        successToast("Image deleted successfully");
      } catch (error) {
        errorToast("Error deleting image");
        console.error("Error deleting image:", error);
      }
    }
  };

  const imageURL = (file: any) => {
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    return url;
  };

  return (
    <>
      <Card className="w-full md:mt-0 mt-20">
        <div className="w-full bg-colorLighter rounded-t-[10px] p-2">
          <Heading label="Note" type="h4" />
        </div>
        <div className="m-4">
          <div className="flex items-center justify-between gap-4 mb-4"></div>
          <SBTextarea
            id={"notes.note"}
            name={"notes.note"}
            label="Payments Note"
            value={formik?.values?.notes?.note || ""}
            onChange={(e) => {
              formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
              formik.handleChange(e);
            }}
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {formik.values?.notes?.files?.length > 0 && (
              <Each
                of={formik.values?.notes?.files}
                render={(image, index) => (
                  <button
                    className="relative h-28 w-28 border rounded-normal"
                    onClick={(e) => {
                      e.preventDefault();
                      setVisible(true);
                      setIndex(index);
                    }}
                  >
                    <img
                      // src={image.fileUrl}
                      src={
                        image?.fileUrl
                          ? fileUrlFormatter(image?.fileUrl)
                          : imageURL(image)
                      }
                      alt="Note"
                      className="w-full h-full object-cover cursor-pointer rounded-lg"
                    />
                    <button
                      className="cursor-pointer absolute top-[-10px] right-[-10px] w-[26px] h-[26px] flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemoveFile(index);
                      }}
                      aria-label="Remove Image"
                    >
                      <MdCancel
                        color="var(--danger-red)"
                        className="text-xl bg-colorWhite rounded-full"
                      />
                    </button>
                  </button>
                )}
              />
            )}

            <div
              className="h-28 w-28 flex flex-col items-center justify-center gap-2 border border-colorLighter rounded-lg cursor-pointer"
              onClick={openFileDialog}
            >
              <FaRegImages color="var(--color-primary)" size={25} />
              <Label
                label="+ Add"
                size="small"
                className="text-colorLight cursor-pointer"
              />
              <input
                type="file"
                multiple
                accept=".png, .jpg, .jpeg"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end pr-4 pb-4 md:pl-0 pl-4">
          <Button
            label="Upload"
            size="large"
            disabled={
              isUploading ||
              isCreating ||
              formik.values?.notes?.files.length <= 0
            }
            onClick={() => handleUpload(notesImages)}
            className="hover:bg-hoverPrimary w-full md:w-fit"
          />
        </div>
      </Card>
      <ConformationDialog
        open={openConfirmDeleteDialog}
        processing={isDeleting}
        onConfirm={() => {
          handleDeleteFile(selectedFile);
        }}
        setOpenModal={() => {
          setSelectedFile("");
          setOpenConfirmDeleteDialog(false);
        }}
      />
      <PhotoSlider
        visible={visible}
        images={formik.values?.notes?.files.map((image: any) => ({
          src: image?.fileUrl
            ? fileUrlFormatter(image?.fileUrl)
            : imageURL(image),
          key: image?.fileUrl,
        }))}
        onClose={() => setVisible(false)}
        index={index}
        onIndexChange={setIndex}
        toolbarRender={({ rotate, onRotate, onScale, scale }) => {
          return (
            <div className="flex gap-4 mr-[4rem]">
              <LuRotateCcw
                color="#fff"
                className="cursor-pointer"
                size={20}
                onClick={() => onRotate(rotate + 90)}
              />
              <FiZoomIn
                color="#fff"
                className="cursor-pointer"
                size={20}
                onClick={() => onScale(scale + 1)}
              />
              <FiZoomOut
                color="#fff"
                className="cursor-pointer"
                size={20}
                onClick={() => onScale(scale - 1)}
              />
            </div>
          );
        }}
        speed={() => 200}
        easing={(type) =>
          type === 2
            ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
            : "cubic-bezier(0.34, 1.56, 0.64, 1)"
        }
      />
    </>
  );
};

export default Notes;
