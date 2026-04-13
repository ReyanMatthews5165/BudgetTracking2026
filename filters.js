export function filterExpenses(expenses, category, maxAmount) {
  return expenses.filter(expense => {
    const matchCategory = !category || expense.category === category;
    const matchAmount = !maxAmount || expense.amount <= maxAmount;

    return matchCategory && matchAmount;
  });
}
