"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Users,
  Wallet,
  IndianRupee,
  UserCheck,
} from "lucide-react";

import { Customer } from "@/types/customer";
import { Invoice } from "@/types/invoice";

import {
  getCustomers,
  deleteCustomer,
} from "@/services/customerService";

import { getInvoices } from "@/services/invoiceService";

import PageHeader from "@/components/ui/PageHeader";
import MetricCard from "@/components/ui/MetricCard";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import Section from "@/components/ui/Section";

import CustomerCard from "./CustomerCard";

import {
  buildCustomerMetrics,
  customerMatchesSearch,
} from "./utils";

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [customerData, invoiceData] =
        await Promise.all([
          getCustomers(),
          getInvoices(),
        ]);

      setCustomers(customerData ?? []);
      setInvoices(invoiceData ?? []);
    } catch (error) {
      console.error(error);

      alert("Failed to load customer data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        "Delete this customer?"
      )
    ) {
      return;
    }

    try {
      await deleteCustomer(id);

      setCustomers((prev) =>
        prev.filter(
          (customer) =>
            customer.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to delete customer.");
      }
    }
  }

  const customerPortfolio =
    useMemo(() => {
      return customers.map((customer) => ({
        customer,

        metrics: buildCustomerMetrics(
          customer.id ?? 0,
          invoices
        ),
      }));
    }, [customers, invoices]);


  const filteredPortfolio =
    useMemo(() => {
      return customerPortfolio.filter(
        ({ customer }) =>
          customerMatchesSearch(
            customer,
            search
          )
      );
    }, [
      customerPortfolio,
      search,
    ]);

  const dashboardMetrics =
    useMemo(() => {
      const totalCustomers =
        customers.length;

      const activeCustomers =
        customerPortfolio.filter(
          ({ metrics }) =>
            metrics.invoiceCount > 0
        ).length;

      const totalRevenue =
        customerPortfolio.reduce(
          (sum, { metrics }) =>
            sum + metrics.revenue,
          0
        );

      const outstanding =
        customerPortfolio.reduce(
          (sum, { metrics }) =>
            sum +
            metrics.outstanding,
          0
        );

      const collected =
        customerPortfolio.reduce(
          (sum, { metrics }) =>
            sum +
            metrics.collected,
          0
        );

      const collectionRate =
        totalRevenue === 0
          ? 0
          : Math.round(
              (collected /
                totalRevenue) *
                100
            );

      return {
        totalCustomers,

        activeCustomers,

        totalRevenue,

        outstanding,

        collectionRate,
      };
    }, [customerPortfolio]);

  function formatCompactCurrency(
    value: number
  ) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        notation: "compact",
        maximumFractionDigits: 1,
      }
    ).format(value);
  }

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">

          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

          <p className="text-sm text-zinc-500">
            Loading executive portfolio...
          </p>

        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="space-y-10"
    >
      <PageHeader
        title="Customers"
        subtitle="Manage your executive client portfolio."
        actions={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-80">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search customers..."
              />
            </div>

            <Link
              href="/customers/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37] px-5 text-sm font-semibold text-[#090909] transition-all duration-200 hover:scale-[1.02] hover:brightness-105"
            >
              <Plus className="h-4 w-4" />

              New Customer
            </Link>
          </div>
        }
      />

      <section>
        <div className="flex gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-4">

          <div className="min-w-[250px] lg:min-w-0">
            <MetricCard
              title="Customers"
              value={
                dashboardMetrics.totalCustomers
              }
              subtitle="Total client portfolio"
              icon={
                <Users className="h-5 w-5" />
              }
            />
          </div>

          <div className="min-w-[250px] lg:min-w-0">
            <MetricCard
              title="Active"
              value={
                dashboardMetrics.activeCustomers
              }
              subtitle="With invoices"
              icon={
                <UserCheck className="h-5 w-5" />
              }
            />
          </div>

          <div className="min-w-[250px] lg:min-w-0">
            <MetricCard
              title="Revenue"
              value={formatCompactCurrency(
                dashboardMetrics.totalRevenue
              )}
              subtitle="Total invoiced"
              accent
              icon={
                <IndianRupee className="h-5 w-5" />
              }
            />
          </div>

          <div className="min-w-[250px] lg:min-w-0">
            <MetricCard
              title="Outstanding"
              value={formatCompactCurrency(
                dashboardMetrics.outstanding
              )}
              subtitle={`${dashboardMetrics.collectionRate}% collected`}
              icon={
                <Wallet className="h-5 w-5" />
              }
            />
          </div>

        </div>
      </section>

      <Section
        title="Executive Client Portfolio"
        subtitle={`${filteredPortfolio.length} client${
          filteredPortfolio.length === 1
            ? ""
            : "s"
        } in your portfolio`}
      >
                {filteredPortfolio.length === 0 ? (
          <EmptyState
            title="No customers found"
            description={
              search
                ? "Try adjusting your search to find a customer."
                : "Create your first customer to begin managing invoices and payments."
            }
            action={
              !search ? (
                <Link
                  href="/customers/new"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-[#090909] transition-all duration-200 hover:scale-[1.02] hover:brightness-105"
                >
                  <Plus className="h-4 w-4" />
                  Create Customer
                </Link>
              ) : undefined
            }
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredPortfolio.map(
              ({ customer, metrics }) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  metrics={metrics}
                  onDelete={handleDelete}
                />
              )
            )}
          </motion.div>
        )}
      </Section>
            <Section
        title="Portfolio Summary"
        subtitle="A quick snapshot of your customer base."
      >
        <div className="grid gap-5 lg:grid-cols-3">

          <div className="rounded-3xl border border-white/[0.06] bg-[#101214] p-6">

            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Average Revenue
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {formatCompactCurrency(
                dashboardMetrics.totalCustomers === 0
                  ? 0
                  : dashboardMetrics.totalRevenue /
                      dashboardMetrics.totalCustomers
              )}
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Average invoiced amount per customer.
            </p>

          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-[#101214] p-6">

            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Active Ratio
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {dashboardMetrics.totalCustomers === 0
                ? 0
                : Math.round(
                    (dashboardMetrics.activeCustomers /
                      dashboardMetrics.totalCustomers) *
                      100
                  )}
              %
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Customers that currently have invoices.
            </p>

          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-[#101214] p-6">

            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Collection Health
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#D4AF37]">
              {dashboardMetrics.collectionRate}%
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Percentage of invoiced revenue collected.
            </p>

          </div>

        </div>

        </Section>

        <Section>
        <div className="rounded-3xl border border-white/[0.06] bg-[#101214] p-8">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Executive Insights
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Portfolio Performance
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                Your customer portfolio currently includes{" "}
                <span className="font-medium text-white">
                  {dashboardMetrics.totalCustomers}
                </span>{" "}
                customers, with{" "}
                <span className="font-medium text-white">
                  {dashboardMetrics.activeCustomers}
                </span>{" "}
                actively generating invoices.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-6">

              <div className="text-right">

                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Revenue
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  {formatCompactCurrency(
                    dashboardMetrics.totalRevenue
                  )}
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Outstanding
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#D4AF37]">
                  {formatCompactCurrency(
                    dashboardMetrics.outstanding
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>
      </Section>
          </motion.div>
  );
}