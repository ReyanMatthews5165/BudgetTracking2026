// Validation Logic
export const validateExpenseData = (amount, description) => {
  let newErrors = {};

  // Validate amount
  if (!amount || amount.trim() === '') {
    newErrors.amount = 'This field cannot be blank';
  } else if (parseFloat(amount) <= 0) {
    newErrors.amount = 'Amount must be greater than 0';
  }

  // Validate description
  if (!description.trim()) {
    newErrors.description = 'This field cannot be blank';
  } else if (/[@#$%^&*()+=[]{}';"\\|<>?]/.test(description)) {
    newErrors.description = 'Special characters like @ or # are not allowed';
  }

  return newErrors;
};

// Existing filter function
export function filterExpenses(expenses, category, maxAmount) {
  return expenses.filter(expense => {
    const matchCategory = !category || expense.category === category;
    const matchAmount = !maxAmount || expense.amount <= maxAmount;

    return matchCategory && matchAmount;
  });
}
