import CustomerForm from "@/components/Customer/CustomerForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#030712] p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <CustomerForm
          mode="edit"
          customerId={Number(id)}
        />
      </div>
    </main>
  );
}