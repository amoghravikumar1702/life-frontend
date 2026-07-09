type Props = {
  customer: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export default function DocumentCustomer({
  customer,
  company,
  email,
  phone,
  address,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-10 mb-10">

      <div>

        <h2 className="text-lg font-semibold mb-3">
          Bill To
        </h2>

        <p className="font-semibold">
          {customer}
        </p>

        {company && <p>{company}</p>}

        {email && <p>{email}</p>}

        {phone && <p>{phone}</p>}

        {address && <p>{address}</p>}

      </div>

    </div>
  );
}