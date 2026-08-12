import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportPDFOptions {
  filename?: string;
  elementId?: string;
}

export async function exportToPDF({
  filename = "Executive_Report.pdf",
  elementId = "executive-report",
}: ExportPDFOptions = {}) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(
      "Executive report element not found."
    );
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const image = canvas.toDataURL(
    "image/png",
    1.0
  );

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;

  const imgHeight =
    (canvas.height * imgWidth) /
    canvas.width;

  let heightLeft = imgHeight;

  let position = 0;

  pdf.addImage(
    image,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight,
    "",
    "FAST"
  );

  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      image,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight,
      "",
      "FAST"
    );

    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}