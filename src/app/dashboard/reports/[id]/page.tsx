import ReportViewer from "../../../../components/reports/ReportViewer";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <ReportViewer
      reportId={id}
    />
  );
}