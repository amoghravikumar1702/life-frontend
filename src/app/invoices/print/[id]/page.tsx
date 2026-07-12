import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import { getCompany } from "@/services/companyService";

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
  const company = await getCompany();

  return (
    <PrintInvoice
      company={company}
      invoice={invoice}
      items={items ?? []}
    />
  );
}