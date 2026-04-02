# import { Expense, Budget } from '@/app/App';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Lightbulb, TrendingUp, PieChart as PieChartIcon, BarChart3, Award, DollarSign, Calendar, Download } from 'lucide-react';

interface InsightsProps {
  expenses: Expense[];
  budgets: Budget[];
  weeklyAverage: number;
}

export default function Insights({ expenses, budgets, weeklyAverage }: InsightsProps) {
  
  // Export expenses to CSV
  const exportToCSV = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }

    // Create CSV header
    const headers = ['Date', 'Category', 'Amount', 'Description', 'Payment Method'];
    
    // Create CSV rows
    const rows = expenses.map(expense => {
      return [
        expense.date,
        expense.category,
        expense.amount.toFixed(2),
        `"${expense.description}"`, // Wrap in quotes to handle commas
        expense.paymentMethod || 'N/A'
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Category breakdown for pie chart
  const getCategoryData = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);
    
    const categoryTotals: { [key: string]: number } = {};
    weeklyExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(2))
    }));
  };

  // Trend data for line chart
  const getTrendData = () => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return date;
    });

    return last14Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = expenses.filter(e => e.date === dateStr);
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: parseFloat(total.toFixed(2))
      };
    });
  };

  // Category comparison data for bar chart
  const getCategoryComparison = () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const lastWeekExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= twoWeeksAgo && date < weekAgo;
    });

    const thisWeekExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);

    const categories = ['food', 'transport', 'entertainment', 'shopping', 'dining'];

    return categories.map(category => {
      const lastWeekTotal = lastWeekExpenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);

      const thisWeekTotal = thisWeekExpenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        'Last Week': parseFloat(lastWeekTotal.toFixed(2)),
        'This Week': parseFloat(thisWeekTotal.toFixed(2))
      };
    }).filter(item => item['Last Week'] > 0 || item['This Week'] > 0);
  };

  // Top spending categories
  const getTopCategories = () => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, total]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        total: parseFloat(total.toFixed(2)),
        count: expenses.filter(e => e.category === category).length
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  };

  // Average transaction size
  const getAverageTransaction = () => {
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return total / expenses.length;
  };

  // Monthly comparison
  const getMonthlyComparison = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonth = expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonth = expenses.filter(e => {
      const date = new Date(e.date);
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      return date.getMonth() === lastMonthDate.getMonth() &&
             date.getFullYear() === lastMonthDate.getFullYear();
    });

    const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonth.reduce((sum, e) => sum + e.amount, 0);
    const difference = thisMonthTotal - lastMonthTotal;
    const percentChange = lastMonthTotal > 0 ? (difference / lastMonthTotal) * 100 : 0;

    return {
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      difference,
      percentChange,
      isIncrease: difference > 0
    };
  };

  // Generate recommendations
  const getRecommendations = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeekExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);
    const lastWeekExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= twoWeeksAgo && date < weekAgo;
    });

    const recommendations = [];

    // Category-based recommendations
    const thisWeekByCategory: { [key: string]: number } = {};
    const lastWeekByCategory: { [key: string]: number } = {};

    thisWeekExpenses.forEach(e => {
      thisWeekByCategory[e.category] = (thisWeekByCategory[e.category] || 0) + e.amount;
    });

    lastWeekExpenses.forEach(e => {
      lastWeekByCategory[e.category] = (lastWeekByCategory[e.category] || 0) + e.amount;
    });

    // Compare categories
    Object.entries(thisWeekByCategory).forEach(([category, amount]) => {
      const lastWeekAmount = lastWeekByCategory[category] || 0;
      const percentChange = lastWeekAmount > 0 ? ((amount - lastWeekAmount) / lastWeekAmount) * 100 : 100;

      if (percentChange > 20) {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        recommendations.push({
          type: 'warning',
          message: `You've spent ${percentChange.toFixed(0)}% more on ${categoryName} this week. Consider ${
            category === 'dining' ? 'a home-cooked meal' :
            category === 'transport' ? 'carpooling or public transit' :
            category === 'entertainment' ? 'free activities on campus' :
            category === 'shopping' ? 'waiting for sales' :
            'cutting back'
          } to stay under your Weekly Budget.`
        });
      }
    });

    // Weekly budget check
    const weeklyTotal = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
    const weeklyBudget = budgets.find(b => b.periodType === 'weekly' && !b.category);
    
    if (weeklyBudget) {
      const weeklyPercentage = (weeklyTotal / weeklyBudget.amount) * 100;

      if (weeklyPercentage < 50) {
        recommendations.push({
          type: 'success',
          message: `Excellent! You're only at ${weeklyPercentage.toFixed(0)}% of your weekly budget. Keep up the great spending habits!`
        });
      } else if (weeklyPercentage > 90) {
        const daysLeft = 7 - new Date().getDay();
        recommendations.push({
          type: 'warning',
          message: `You have ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left this week and only $${(weeklyBudget.amount - weeklyTotal).toFixed(2)} remaining. Plan your spending carefully!`
        });
      }
    }

    // Default recommendation
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'info',
        message: 'Track your expenses daily to build better spending awareness and stay within your budget goals.'
      });
    }

    return recommendations;
  };

  const categoryData = getCategoryData();
  const trendData = getTrendData();
  const categoryComparison = getCategoryComparison();
  const topCategories = getTopCategories();
  const averageTransaction = getAverageTransaction();
  const monthlyComparison = getMonthlyComparison();
  const recommendations = getRecommendations();

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  return (
    <div className="p-4 space-y-4">
      {/* Spending Patterns - Pie Chart */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-blue-600" />
          Spending Patterns (Last 7 Days)
        </h2>
        
        {categoryData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No spending data available</p>
            <p className="text-xs mt-1">Add expenses to see your patterns</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart margin={{left: 85, right: 65 }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Category Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-700">
                    {entry.name}: ${entry.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Trend Analysis - Line Chart */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Spending Trend (14 Days)
        </h2>
        
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Comparison - Bar Chart */}
      {categoryComparison.length > 0 && (
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Category Comparison
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Last Week" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="This Week" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Comparison */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-xl text-white shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Monthly Overview
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs opacity-90 mb-1">This Month</p>
            <p className="text-2xl font-bold">${monthlyComparison.thisMonth.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Last Month</p>
            <p className="text-2xl font-bold">${monthlyComparison.lastMonth.toFixed(0)}</p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur rounded-lg p-3">
          <div className="flex items-center gap-2">
            {monthlyComparison.isIncrease ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5 rotate-180" />
            )}
            <div>
              <p className="text-sm font-medium">
                {monthlyComparison.isIncrease ? 'Spending increased' : 'Spending decreased'}
              </p>
              <p className="text-xs opacity-90">
                {monthlyComparison.isIncrease ? '+' : ''}{monthlyComparison.percentChange.toFixed(1)}%
                ({monthlyComparison.isIncrease ? '+' : ''}${Math.abs(monthlyComparison.difference).toFixed(2)})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Spending Categories */}
      {topCategories.length > 0 && (
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Top Spending Categories
          </h2>

          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div key={category.category} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{category.category}</p>
                  <p className="text-xs text-gray-600">{category.count} transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${category.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Average Transaction */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-xl text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Average Transaction</p>
            <p className="text-3xl font-bold">${averageTransaction.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-1">Across {expenses.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Decision Support - Recommendations */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Recommendations
        </h2>
        
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.type === 'success' ? 'bg-green-50 border-green-500' :
                rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <p className="text-sm text-gray-800">{rec.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
          <p className="text-xs opacity-90 mb-1">Weekly Spending</p>
          <p className="text-2xl font-bold">${weeklyAverage.toFixed(0)}</p>
          <p className="text-xs opacity-75 mt-1">Last 7 days</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
          <p className="text-xs opacity-90 mb-1">Remaining</p>
          <p className="text-2xl font-bold">
            ${((budgets.find(b => b.periodType === 'weekly' && !b.category)?.amount || 0) - weeklyAverage).toFixed(0)}
          </p>
          <p className="text-xs opacity-75 mt-1">This week</p>
        </div>
      </div>

      {/* Export Button */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          Export Data
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Download all your expense data as a CSV file for your records or external analysis.
        </p>
        <button
          onClick={exportToCSV}
          disabled={expenses.length === 0}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
            expenses.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Download className="h-5 w-5" />
          Export {expenses.length} Expense{expenses.length !== 1 ? 's' : ''} to CSV
        </button>
        {expenses.length === 0 && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Add expenses to enable export
          </p>
        )}
      </div>
    </div>
  );
}
