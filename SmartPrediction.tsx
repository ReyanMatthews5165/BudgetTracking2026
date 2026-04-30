## 🚀 Feature: Smart Budget Prediction

### 📌 User Story
As a student, I want the app to predict my future spending based on my current habits so that I can avoid overspending and stay within my budget.

---

### 🎯 What was added
- Added a new “Predicted Spending” card to the dashboard
- Displays estimated weekly spending based on recent activity
- Shows warning message if user is likely to exceed budget
- Implemented color-based feedback:
  - 🟢 Green → Safe spending
  - 🟡 Yellow → Near limit
  - 🔴 Red → Overspending risk

---

### 🎨 UI Changes
- Designed a new prediction card with modern styling (rounded corners, shadow, clean layout)
- Positioned below Weekly Budget section
- Added icons and improved visual hierarchy for better user understanding

---

### 🧠 Impact
This feature improves the application by moving from passive expense tracking to proactive financial guidance. It helps users make better decisions before overspending occurs.

---

### 🔗 Related Issue
Closes #12  (replace with your actual Trello/GitHub issue ID)

---

### ✅ Checklist
- [x] Feature implemented
- [x] UI updated in Figma
- [x] Code follows naming conventions
- [x] Tested manually
- [x] Ready for review



import { Expense, Budget } from '@/app/App';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface SmartPredictionProps {
  expenses: Expense[];
  weeklyBudget?: Budget;
}

export default function SmartPrediction({ expenses, weeklyBudget }: SmartPredictionProps) {

  const calculatePrediction = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    // Get current week expenses
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const currentWeekExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);
    const currentWeekTotal = currentWeekExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate daily average from the last 14 days
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const recentExpenses = expenses.filter(e => new Date(e.date) >= twoWeeksAgo);

    if (recentExpenses.length === 0) {
      return { predicted: 0, daysLeft: 7 - dayOfWeek, confidence: 'low' };
    }

    const dailyAverage = recentExpenses.reduce((sum, e) => sum + e.amount, 0) / 14;

    // Calculate days left in the week (assuming week ends on Saturday)
    const daysLeft = 7 - dayOfWeek;

    // Predict remaining spending
    const predictedRemaining = dailyAverage * daysLeft;
    const predictedTotal = currentWeekTotal + predictedRemaining;

    return {
      predicted: predictedTotal,
      daysLeft,
      confidence: recentExpenses.length > 7 ? 'high' : 'medium'
    };
  };

  const prediction = calculatePrediction();
  const weeklyLimit = weeklyBudget ? weeklyBudget.amount : 250; // default to 250 if no budget
  const difference = prediction.predicted - weeklyLimit;
  const percentageOfBudget = (prediction.predicted / weeklyLimit) * 100;

  // Determine color state
  let colorState: 'safe' | 'warning' | 'danger';
  let bgColor: string;
  let textColor: string;
  let borderColor: string;
  let icon: JSX.Element;

  if (percentageOfBudget <= 75) {
    colorState = 'safe';
    bgColor = 'bg-gradient-to-br from-blue-50 to-sky-50';
    textColor = 'text-blue-800';
    borderColor = 'border-blue-200';
    icon = <CheckCircle className="h-6 w-6 text-blue-600" />;
  } else if (percentageOfBudget <= 95) {
    colorState = 'warning';
    bgColor = 'bg-gradient-to-br from-yellow-50 to-amber-50';
    textColor = 'text-yellow-800';
    borderColor = 'border-yellow-200';
    icon = <AlertTriangle className="h-6 w-6 text-yellow-600" />;
  } else {
    colorState = 'danger';
    bgColor = 'bg-gradient-to-br from-yellow-50 to-amber-50';
    textColor = 'text-yellow-800';
    borderColor = 'border-yellow-200';
    icon = <AlertTriangle className="h-6 w-6 text-yellow-600" />;
  }

  return (
    <div className={`${bgColor} p-5 rounded-xl shadow-md border-2 ${borderColor}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className={`font-semibold ${textColor} flex items-center gap-2`}>
          <TrendingUp className="h-5 w-5" />
          Predicted Spending This Week
        </h3>
        {icon}
      </div>

      <div className="mb-4">
        <p className={`text-4xl font-bold ${textColor}`}>
          ${prediction.predicted.toFixed(0)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Predicted total by end of week
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-500 ${
              colorState === 'safe' ? 'bg-blue-500' :
              colorState === 'warning' ? 'bg-yellow-500' :
              'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(percentageOfBudget, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-600">
            ${Math.round(percentageOfBudget)}% of budget
          </p>
          <p className="text-xs text-gray-600">
            ${weeklyLimit}
          </p>
        </div>
      </div>

      {/* Warning or Success Message */}
      <div className={`p-3 rounded-lg ${
        colorState === 'safe' ? 'bg-blue-100/50' :
        colorState === 'warning' ? 'bg-yellow-100/50' :
        'bg-yellow-100/50'
      }`}>
        {difference > 0 ? (
          <p className={`text-sm font-medium ${textColor}`}>
            ⚠️ You may exceed your budget by ${Math.abs(difference).toFixed(0)}
          </p>
        ) : difference > -50 ? (
          <p className={`text-sm font-medium ${textColor}`}>
            ✓ On track to stay within budget by ${Math.abs(difference).toFixed(0)}
          </p>
        ) : (
          <p className={`text-sm font-medium ${textColor}`}>
            🎉 Great job! You're on track to save ${Math.abs(difference).toFixed(0)} this week
          </p>
        )}
      </div>

      {prediction.daysLeft > 0 && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          {prediction.daysLeft} {prediction.daysLeft === 1 ? 'day' : 'days'} remaining this week
        </p>
      )}
    </div>
  );
}
