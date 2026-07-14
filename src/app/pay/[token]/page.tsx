interface PaymentPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function PaymentPage({
  params,
}: PaymentPageProps) {
  const { token } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          FINZURA Pay
        </h1>

        <p className="mt-6 text-gray-500">
          Payment Token
        </p>

        <code className="mt-2 block rounded-lg bg-slate-100 px-4 py-2 text-blue-600 font-mono">
          {token}
        </code>
      </div>
    </main>
  );
}