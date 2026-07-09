import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import PrintInvoice from "@/components/Invoice/PrintInvoice";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrintInvoicePage({
  params,
}: Props) {
  const { id } = await params;

  const invoice = await getInvoiceById(Number(id));
  const items = await getInvoiceItems(Number(id));

  return (
    <PrintInvoice
      invoice={invoice}
      items={items ?? []}
    />
  );
}