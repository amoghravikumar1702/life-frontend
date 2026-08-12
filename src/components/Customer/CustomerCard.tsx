"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Eye,
  FilePlus2,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Trash2,
  Wallet,
} from "lucide-react";

import { CustomerCardProps } from "./types";
import {
  formatCompactCurrency,
  getCustomerInitials,
} from "./utils";

import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import StatusBadge from "@/components/ui/StatusBadge";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
    },
  },
};

export default function CustomerCard({
  customer,
  metrics,
  onDelete,
}: CustomerCardProps) {
  const initials = getCustomerInitials(
    customer.customer_name
  );

  const healthVariant =
    metrics.health === "Excellent"
      ? "success"
      : metrics.health === "Good"
      ? "info"
      : metrics.health === "Average"
      ? "warning"
      : "danger";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card
        hover
        padding="lg"
        className="h-full"
      >
        {/* ---------- HEADER ---------- */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#14171B] text-lg font-semibold text-[#D4AF37]">
              {initials}
            </div>

            <div>

              <h3 className="text-lg font-semibold tracking-tight text-white">
                {customer.customer_name}
              </h3>

              <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">

                <Building2
                  size={14}
                  className="text-zinc-500"
                />

                <span>
                  {customer.business_name ||
                    "Individual Client"}
                </span>

              </div>

            </div>

          </div>

          <StatusBadge
            label={metrics.health}
            variant={healthVariant}
            size="sm"
          />

        </div>

        {/* ---------- CONTACT ---------- */}

        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-3">

            <Mail
              size={16}
              className="text-zinc-500"
            />

            <span className="truncate text-sm text-zinc-300">
              {customer.email || "No email"}
            </span>

          </div>

          <div className="flex items-center gap-3">

            <Phone
              size={16}
              className="text-zinc-500"
            />

            <span className="text-sm text-zinc-300">
              {customer.phone || "No phone"}
            </span>

          </div>

        </div>

        {/* ---------- METRICS ---------- */}

        <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Revenue
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {formatCompactCurrency(metrics.revenue)}
            </p>

          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Outstanding
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#D4AF37]">
              {formatCompactCurrency(metrics.outstanding)}
            </p>

          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Invoices
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {metrics.invoiceCount}
            </p>

          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Collection
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {metrics.collectionRate}%
            </p>

          </div>

        </div>

        {/* ---------- HEALTH SUMMARY ---------- */}

        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[#14171B] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Payment Health
              </p>

              <h4 className="mt-2 text-lg font-semibold text-white">
                {metrics.health}
              </h4>

            </div>

            <StatusBadge
              label={`${metrics.collectionRate}% Collected`}
              variant={healthVariant}
            />

          </div>

        </div>

        {/* ---------- ACTIONS ---------- */}

        <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2">

            <Link
              href={`/customers/edit/${customer.id}`}
              aria-label="View customer"
            >
              <IconButton
                icon={<Eye size={18} />}
                ariaLabel="View customer"
                title="View"
              />
            </Link>

            <Link
              href={`/customers/edit/${customer.id}`}
              aria-label="Edit customer"
            >
              <IconButton
                icon={<Pencil size={18} />}
                ariaLabel="Edit customer"
                title="Edit"
              />
            </Link>

            <Link
              href={`/invoices/new?customer=${customer.id}`}
              aria-label="Create invoice"
            >
              <IconButton
                icon={<FilePlus2 size={18} />}
                ariaLabel="Create invoice"
                title="Create Invoice"
              />
            </Link>

            {customer.phone && (
              <a
                href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open WhatsApp"
              >
                <IconButton
                  icon={<MessageCircle size={18} />}
                  ariaLabel="WhatsApp"
                  title="WhatsApp"
                />
              </a>
            )}

            <IconButton
              icon={<Trash2 size={18} />}
              ariaLabel="Delete customer"
              title="Delete"
              variant="danger"
              onClick={() => {
                if (customer.id) {
                  onDelete(customer.id);
                }
              }}
            />

          </div>

        
        </div>

        {/* ---------- FOOTER ---------- */}

        <div className="mt-8 border-t border-white/[0.06] pt-5">
                  <div className="flex items-center">

            <div>

              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Client Since
              </p>

              <p className="mt-2 text-sm font-medium text-zinc-300">
                {customer.created_at
                  ? new Date(
                      customer.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recently Added"}
              </p>

            </div>

            
          </div>

        </div>

      </Card>

    </motion.div>
      );
}

      
    
