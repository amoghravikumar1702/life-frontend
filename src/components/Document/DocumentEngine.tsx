type Props = {
  companyName?: string;
  companyTagline?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyWebsite?: string;
};

export default function DocumentHeader({
  companyName = "NEXORA",
  companyTagline = "AI Financial Operating System",
  companyAddress = "Bengaluru, Karnataka",
  companyEmail = "hello@nexora.ai",
  companyPhone = "+91 XXXXX XXXXX",
  companyWebsite = "www.nexora.ai",
}: Props) {
  return (
    <div className="flex justify-between items-start border-b pb-8 mb-8">

      <div>

        <h1 className="text-4xl font-bold tracking-wide">
          {companyName}
        </h1>

        <p className="text-gray-500 mt-2">
          {companyTagline}
        </p>

      </div>

      <div className="text-right text-sm space-y-1">

        <p>{companyAddress}</p>

        <p>{companyEmail}</p>

        <p>{companyPhone}</p>

        <p>{companyWebsite}</p>

      </div>

    </div>
  );
}