interface ShareReportOptions {
  title: string;
  text: string;
  url?: string;
}

export async function shareReport({
  title,
  text,
  url = window.location.href,
}: ShareReportOptions) {
  try {
    // Native Share API (Mobile + Supported Desktop)
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
      });

      return;
    }

    // Clipboard Fallback
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);

      alert("Report link copied to clipboard.");

      return;
    }

    // Legacy Fallback
    const input = document.createElement("input");

    input.value = url;

    document.body.appendChild(input);

    input.select();

    document.execCommand("copy");

    document.body.removeChild(input);

    alert("Report link copied to clipboard.");
  } catch (error) {
    console.error(error);
  }
}