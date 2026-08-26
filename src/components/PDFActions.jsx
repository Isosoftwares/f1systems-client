import React, { useState } from "react";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { ArrowDownTrayIcon, EyeIcon } from "@heroicons/react/24/outline";
import { FaWhatsapp } from "react-icons/fa";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { toast } from "react-toastify";

const PDFActions = ({
  document,
  fileName,
  title,
  whatsappPhone,
  whatsappMessage,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isSharing, setIsSharing] = useState(false);

  const docProp = document?.props?.invoice || document?.props?.quote || document?.props?.appointment || {};
  const uniqueKey = `${docProp._id || ""}-${docProp.updatedAt || ""}-${docProp.vehicles?.length || 0}`;

  const handleWhatsAppShare = async () => {
    setIsSharing(true);
    try {
      const blob = await pdf(document).toBlob();
      const file = new File([blob], fileName, { type: "application/pdf" });

      // Try native share API first (works beautifully on mobile for attaching files)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: whatsappMessage || title,
        });
      } else {
        // Fallback for desktop browsers (WhatsApp Web doesn't support file attachments via URL)
        // So we trigger the download automatically, then open wa.me
        toast.info("Downloading PDF... Please attach it in WhatsApp.");

        const urlObj = URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = urlObj;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(urlObj);

        let waUrl = "https://wa.me/";
        if (whatsappPhone) {
          let cleaned = whatsappPhone.replace(/[^0-9]/g, "");
          if (cleaned.startsWith("0")) {
            cleaned = "254" + cleaned.substring(1);
          }
          waUrl += cleaned;
        }

        let textToSend = whatsappMessage || title;
        textToSend += "\n\n*(Please see the attached PDF document)*";

        waUrl += `?text=${encodeURIComponent(textToSend)}`;

        setTimeout(() => {
          window.open(waUrl, "_blank");
        }, 1000);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error sharing PDF:", error);
        toast.error("Failed to share document.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {/* Preview Button */}
        <button
          onClick={open}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-lighter/80 shadow-sm border border-gray-300 dark:border-gray-700 transition-colors w-full sm:w-auto text-sm font-medium"
        >
          <EyeIcon className="w-5 h-5" /> Preview PDF
        </button>

        {/* WhatsApp Forward Button */}
        {(whatsappPhone || whatsappMessage) && (
          <button
            onClick={handleWhatsAppShare}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] shadow-sm transition-colors text-sm font-medium disabled:opacity-50 w-full sm:w-auto"
          >
            <FaWhatsapp className="w-5 h-5" />{" "}
            {isSharing ? "Preparing..." : "Forward"}
          </button>
        )}

        {/* Download Button */}
        <PDFDownloadLink
          key={uniqueKey}
          document={document}
          fileName={fileName}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-md transition-colors w-full sm:w-auto text-sm font-medium"
        >
          {({ loading }) => (
            <>
              <ArrowDownTrayIcon className="w-5 h-5" />
              {loading ? "Generating..." : "Download PDF"}
            </>
          )}
        </PDFDownloadLink>
      </div>

      <Drawer
        opened={opened}
        onClose={close}
        title={<span className="font-bold text-lg">{title} Preview</span>}
        position="right"
        size="xl"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <div className="h-[calc(100vh-80px)] w-full">
          <PDFViewer
            width="100%"
            height="100%"
            className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {document}
          </PDFViewer>
        </div>
      </Drawer>
    </>
  );
};

export default PDFActions;
