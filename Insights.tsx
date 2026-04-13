// TODO: improve CSV export formatting to handle edge cases
import React from "react";

interface Insight {
title: string;
value: string | number;
}

const insightsData: Insight[] = [
{ title: "Total Expenses", value: 1250 },
{ title: "Average Daily Spend", value: 42 },
{ title: "Highest Expense", value: 300 },
];

const Insights: React.FC = () => {
return (
<div className="insights">
<h2>Budget Insights</h2>
<ul>
{insightsData.map((insight, index) => (
<li key={index}>
<strong>{insight.title}:</strong> {insight.value}
</li>
))}
</ul>
</div>
);
};
