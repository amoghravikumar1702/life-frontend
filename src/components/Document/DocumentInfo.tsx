type Props = {
  documentType: string;
  documentNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
};

export default function DocumentInfo({
  documentType,
  documentNumber,
  issueDate,
  dueDate,
  status,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-10 mb-10">

      <div>
        <h2 className="text-xl font-semibold">
          {documentType}
        </h2>

        <p>{documentNumber}</p>
      </div>

      <div className="text-right">

        <p>
          <strong>Issue Date:</strong> {issueDate}
        </p>

        <p>
          <strong>Due Date:</strong> {dueDate}
        </p>

        <p>
          <strong>Status:</strong> {status}
        </p>

      </div>

    </div>
  );
}