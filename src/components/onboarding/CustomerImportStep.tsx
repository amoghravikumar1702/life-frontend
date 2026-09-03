"use client";

import {
  useRef,
  useState,
  DragEvent,
  ChangeEvent,
} from "react";

import {
  ArrowRight,
  Check,
  FileSpreadsheet,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";

interface CustomerImportStepProps {
  onComplete: () => void;
}

type SelectedFile = {
  file: File;
  type: "spreadsheet" | "image";
};

type ImportResponse = {
  success?: boolean;
  imported?: number;
  skipped?: number;
  message?: string;
  error?: string;
};

export default function CustomerImportStep({
  onComplete,
}: CustomerImportStepProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<SelectedFile | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isImporting, setIsImporting] =
    useState(false);

  const [importResult, setImportResult] =
    useState<{
      imported: number;
      skipped: number;
    } | null>(null);

  function validateFile(file: File): SelectedFile | null {
    const name = file.name.toLowerCase();

    const isSpreadsheet =
      name.endsWith(".csv") ||
      name.endsWith(".xlsx") ||
      name.endsWith(".xls");

    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|heic)$/i.test(name);

    if (!isSpreadsheet && !isImage) {
      setError(
        "Please upload a CSV, Excel file, or image of your customer list."
      );

      return null;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Please choose a file smaller than 10 MB."
      );

      return null;
    }

    setError("");
    setImportResult(null);

    return {
      file,
      type: isSpreadsheet
        ? "spreadsheet"
        : "image",
    };
  }

  function handleFile(file: File) {
    const result = validateFile(file);

    if (result) {
      setSelectedFile(result);
    }
  }

  function handleSpreadsheetChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    event.target.value = "";
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    event.target.value = "";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setIsDragging(false);

    if (isImporting) {
      return;
    }

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  function removeFile() {
    if (isImporting) {
      return;
    }

    setSelectedFile(null);
    setError("");
    setImportResult(null);
  }

  async function handleContinue() {
    if (isImporting) {
      return;
    }

    if (!selectedFile) {
      onComplete();
      return;
    }

    if (selectedFile.type === "image") {
      setError(
        "Photo import is coming next. For now, please use a CSV or Excel file."
      );

      return;
    }

    try {
      setIsImporting(true);
      setError("");
      setImportResult(null);

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile.file
      );

      const response = await fetch(
        "/api/customers/import",
        {
          method: "POST",
          body: formData,
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) ?? "";

      let result: ImportResponse;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        result = await response.json();
      } else {
        throw new Error(
          `Import service returned an unexpected response (${response.status}).`
        );
      }

      if (
        !response.ok ||
        result.success === false
      ) {
        throw new Error(
          result.error ||
            result.message ||
            "Customer import failed."
        );
      }

      const imported =
        Number(result.imported ?? 0);

      const skipped =
        Number(result.skipped ?? 0);

      setImportResult({
        imported,
        skipped,
      });

      setTimeout(() => {
        onComplete();
      }, 700);
    } catch (error) {
      console.error(
        "[CustomerImport] Import failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to import your customers. Please try again."
      );

      setIsImporting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      {/* ==========================================================
          HEADER
      ========================================================== */}

      <div className="mb-8 text-center">
        <div
          className="
            mx-auto
            mb-5
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-[#D4AF37]/20
            bg-[#D4AF37]/[0.07]
          "
        >
          <UsersIcon />
        </div>

        <p
          className="
            mb-3
            text-[10px]
            font-medium
            uppercase
            tracking-[0.32em]
            text-[#D4AF37]
          "
        >
          Almost ready
        </p>

        <h1
          className="
            text-2xl
            font-semibold
            tracking-tight
            text-white
            sm:text-3xl
          "
        >
          Bring your customers
          into DhanarkOS
        </h1>

        <p
          className="
            mx-auto
            mt-3
            max-w-xl
            text-sm
            leading-6
            text-zinc-500
          "
        >
          Import your existing customer
          list and DhanarkOS will organize
          it for you.
        </p>
      </div>

      {/* ==========================================================
          MAIN CARD
      ========================================================== */}

      <div
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.08]
          bg-[#111214]
          shadow-[0_30px_100px_rgba(0,0,0,0.35)]
        "
      >
        {/* ========================================================
            DROP ZONE
        ======================================================== */}

        {!selectedFile && (
          <div
            onDragOver={(event) => {
              event.preventDefault();

              if (!isImporting) {
                setIsDragging(true);
              }
            }}
            onDragLeave={() =>
              setIsDragging(false)
            }
            onDrop={handleDrop}
            className={`
              m-4
              rounded-[22px]
              border
              border-dashed
              px-6
              py-12
              text-center
              transition-all
              duration-200
              sm:m-5
              sm:py-14
              ${
                isDragging
                  ? "border-[#D4AF37]/50 bg-[#D4AF37]/[0.06]"
                  : "border-white/[0.10] bg-white/[0.015]"
              }
            `}
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.03]
              "
            >
              <Upload
                size={20}
                strokeWidth={1.7}
                className="text-[#D4AF37]"
              />
            </div>

            <h2 className="mt-5 text-base font-medium text-white">
              Drop your customer list here
            </h2>

            <p className="mt-2 text-xs text-zinc-600">
              CSV, Excel, or a clear photo
              of your customer list
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isImporting}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                  flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/[0.10]
                  bg-white/[0.04]
                  px-5
                  text-sm
                  font-medium
                  text-zinc-200
                  transition
                  hover:border-[#D4AF37]/30
                  hover:bg-white/[0.06]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <FileSpreadsheet
                  size={16}
                  className="text-[#D4AF37]"
                />

                Upload Excel / CSV
              </button>

              <button
                type="button"
                disabled={isImporting}
                onClick={() =>
                  imageInputRef.current?.click()
                }
                className="
                  flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#D4AF37]
                  px-5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-[#E2C04A]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <ImageIcon size={16} />

                Upload a photo
              </button>
            </div>

            <p className="mt-5 text-[10px] text-zinc-700">
              Maximum file size: 10 MB
            </p>
          </div>
        )}

        {/* ========================================================
            SELECTED FILE
        ======================================================== */}

        {selectedFile && (
          <div
            className="
              m-4
              rounded-[22px]
              border
              border-[#D4AF37]/15
              bg-[#D4AF37]/[0.025]
              p-5
              sm:m-5
              sm:p-6
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D4AF37]/15
                  bg-[#D4AF37]/[0.07]
                "
              >
                {selectedFile.type ===
                "spreadsheet" ? (
                  <FileSpreadsheet
                    size={18}
                    className="text-[#D4AF37]"
                  />
                ) : (
                  <ImageIcon
                    size={18}
                    className="text-[#D4AF37]"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {selectedFile.file.name}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {formatFileSize(
                    selectedFile.file.size
                  )}
                  {" · "}
                  {selectedFile.type ===
                  "spreadsheet"
                    ? "Spreadsheet"
                    : "Customer list image"}
                </p>
              </div>

              {!isImporting && (
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove file"
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-zinc-600
                    transition
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {importResult ? (
              <div className="mt-5 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37]">
                    <Check
                      size={15}
                      className="text-black"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#D4AF37]">
                      Customers imported
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {importResult.imported}{" "}
                      customer
                      {importResult.imported ===
                      1
                        ? ""
                        : "s"}{" "}
                      added
                      {importResult.skipped >
                      0
                        ? ` · ${importResult.skipped} skipped`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                {isImporting ? (
                  <Loader2
                    size={15}
                    className="shrink-0 animate-spin text-[#D4AF37]"
                  />
                ) : (
                  <Check
                    size={15}
                    className="shrink-0 text-[#D4AF37]"
                  />
                )}

                <p className="text-xs text-zinc-500">
                  {isImporting
                    ? "DhanarkOS is importing your customer list..."
                    : selectedFile.type ===
                      "image"
                    ? "Photo selected. Photo-based customer import is coming next."
                    : "File selected. Review the file name, then continue to import."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            PHOTO FALLBACK
        ======================================================== */}

        {!selectedFile && (
          <div
            className="
              mx-4
              mb-4
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.015]
              px-5
              py-4
              sm:mx-5
              sm:mb-5
            "
          >
            <div className="flex gap-3">
              <ImageIcon
                size={17}
                className="mt-0.5 shrink-0 text-[#D4AF37]"
              />

              <div>
                <p className="text-xs font-medium text-zinc-300">
                  Don't have an Excel or CSV?
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  No problem. Upload a clear
                  photo of your customer list.
                  Photo import will be connected
                  in the next step.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="mx-4 mb-4 rounded-xl border border-red-500/10 bg-red-500/[0.05] px-4 py-3 sm:mx-5">
            <p className="text-xs text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* ========================================================
            FOOTER
        ======================================================== */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-white/[0.06]
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >
          <button
            type="button"
            disabled={isImporting}
            onClick={onComplete}
            className="
              min-h-10
              px-2
              text-xs
              font-medium
              text-zinc-600
              transition
              hover:text-zinc-300
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            I'll do this later
          </button>

          <button
            type="button"
            disabled={isImporting}
            onClick={handleContinue}
            className="
              flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#D4AF37]
              px-5
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[#E2C04A]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isImporting ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Importing customers...
              </>
            ) : importResult ? (
              <>
                Setup complete

                <Check size={16} />
              </>
            ) : selectedFile ? (
              <>
                {selectedFile.type ===
                "image"
                  ? "Continue without import"
                  : "Continue with import"}

                <ArrowRight size={16} />
              </>
            ) : (
              <>
                Continue

                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==========================================================
          FOOTER NOTE
      ========================================================== */}

      <p className="mt-5 text-center text-[10px] leading-5 text-zinc-700">
        Your customer data will only be
        imported after you review and
        confirm it.
      </p>

      {/* ==========================================================
          FILE INPUTS
      ========================================================== */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleSpreadsheetChange}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,.heic"
        className="hidden"
        onChange={handleImageChange}
      />
    </section>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function UsersIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#D4AF37]"
    >
      <path
        d="M16 21V19C16 16.7909 14.2091 15 12 15H6C3.79086 15 2 16.7909 2 19V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="9"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M22 21V19C21.9986 17.1771 20.765 15.5857 19 15.13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M16 3.13C17.7699 3.58317 19.0074 5.1762 19.0074 7C19.0074 8.8238 17.7699 10.4168 16 10.87"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}