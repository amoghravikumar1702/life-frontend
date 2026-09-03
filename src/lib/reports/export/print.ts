interface PrintReportOptions {
  elementId?: string;
  title?: string;
}

export async function printReport({
  elementId = "executive-report",
  title = "DhanarkOS Executive Report",
}: PrintReportOptions = {}) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(
      "Executive report element not found."
    );
  }

  const style = document.createElement("style");

  style.setAttribute(
    "data-DhanarkOS-print",
    "true"
  );

  style.innerHTML = `
    @page {
      size: A4 portrait;
      margin: 16mm;
    }

    @media print {

      html,
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }

      body * {
        visibility: hidden !important;
      }

      #${elementId},
      #${elementId} * {
        visibility: visible !important;
      }

      #${elementId} {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      nav,
      aside,
      button,
      .no-print {
        display: none !important;
      }

      * {
        box-shadow: none !important;
        text-shadow: none !important;
      }

      section,
      table,
      .report-card {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      h1,
      h2,
      h3,
      h4 {
        break-after: avoid;
      }

      table {
        width: 100%;
      }

      tr {
        page-break-inside: avoid;
      }
    }
  `;

  document.head.appendChild(style);

  const previousTitle = document.title;

  document.title = title;

  window.print();

  document.title = previousTitle;

  setTimeout(() => {
    style.remove();
  }, 500);
}