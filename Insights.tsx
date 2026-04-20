     // Logic for Filtering Empty States
      {insightsData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4 animate-bounce">😬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Uh oh!</h3>
            <p className="text-gray-600 mb-6">
              No expenses found for this range. Try adjusting your filters!
            </p>
            <button
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <ul>
          {insightsData.map((insight, index) => (
            <li key={index}>
              <strong>{insight.title}:</strong> {insight.value}
            </li>
          ))}
        </ul>
      )}
