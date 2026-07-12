type Props = {
  title: string;
  description: string;
};

export default function CompanyHeader({
  title,
  description,
}: Props) {
  return (
    <div className="mb-10 flex items-center justify-between">

      <div>
        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        <p className="mt-2 text-gray-400">
          {description}
        </p>
      </div>

    </div>
  );
}