"use client";
import React, { ChangeEvent, DragEvent, useRef } from "react";
import { FaRegFileAlt, FaRegImages } from "react-icons/fa";
import { Each } from "@/stories/Each/Each";
import { Label } from "@/stories/Label/Label";
import { IoMdCloseCircle } from "react-icons/io";

interface DragAndDropProps {
  images?: string[];
  handleImageChange: (files: File[]) => void;
  handleRemoveImage: (index: number) => void;
  disabled?: boolean;
}

const DragAndDrop = ({
  images,
  handleImageChange,
  handleRemoveImage,
  disabled,
}: DragAndDropProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!disabled) {
      const files = e.dataTransfer.files;

      if (files.length > 0) {
        handleImageChange(Array.from(files));
      }
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;

    if (files && files.length > 0) {
      handleImageChange(Array.from(files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.files = null;
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <button
      type="button"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleInputClick}
      disabled={disabled}
    >
      {(images || []).length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 border border-theme-gray rounded-lg p-3">
            <Each
              of={images || []}
              render={(image, index) => (
                <button
                  className="relative h-28 w-[24%]"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`${image}`, "_blank");
                  }}
                >
                  <img
                    src={image}
                    alt="Note"
                    className="w-full h-full object-cover cursor-pointer rounded-lg"
                  />
                  <button
                    className="cursor-pointer absolute top-[-5px] right-[-5px] w-[26px] h-[26px] flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index || 0);
                    }}
                    aria-label="Remove Image"
                  >
                    <IoMdCloseCircle
                      className="text-base"
                      color="var(--color-danger)"
                    />
                    {/* <RedCloseIcon /> */}
                  </button>
                </button>
              )}
            />
          </div>
          <Label
            label="* Drag and drop image into the box or click in to the box for select."
            size="small"
            className="text-[#606060] w-fit"
          />
        </div>
      ) : (
        <div className="h-24 flex flex-col items-center justify-center gap-2 border border-theme-gray rounded-lg p-3">
          <FaRegFileAlt color="var(--color-primary)" size={25} />
          <Label
            label="Click to upload file."
            size="small"
            className="text-colorLight cursor-pointer"
          />
        </div>
      )}
      <input
        type="file"
        className="hidden"
        multiple
        onChange={handleFileInput}
        ref={fileInputRef}
      />
    </button>
  );
};

export default DragAndDrop;
