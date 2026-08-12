import PageContainer from "@/components/ui/PageContainer";
import ExpenseForm from "@/components/Expense/ExpenseForm";

export default function NewExpensePage() {
  return (
    <PageContainer>
      <div className="mt-8">
        <ExpenseForm />
      </div>
    </PageContainer>
  );
}