'use client';

import Link from 'next/link';

// Mock data - replace with actual data from your database later
const mockData = {
  totalGames: 12,
  avgPoints: 1.8,
  avgConfidence: 7.2,
  avgSleep: 7.5,
  insights: [
    {
      title: 'High Confidence Impact',
      description: 'You average 2.4 points per game when confidence is 8+ vs 1.1 points when confidence is 5 or below',
    },
    {
      title: 'Sleep Impact',
      description: 'You average 2.2 points per game with 8+ hours sleep vs 1.3 points with less than 7 hours',
    },
  ],
  recentGames: [
    {
      id: '1',
      date: '2024-11-02',
      opponent: 'Rangers',
      result: 'W',
      points: 3,
      plusMinus: 2,
    },
    {
      id: '2',
      date: '2024-10-30',
      opponent: 'Bruins',
      result: 'L',
      points: 1,
      plusMinus: -1,
    },
    {
      id: '3',
      date: '2024-10-27',
      opponent: 'Maple Leafs',
      result: 'W',
      points: 2,
      plusMinus: 1,
    },
    {
      id: '4',
      date: '2024-10-24',
      opponent: 'Canadiens',
      result: 'W',
      points: 2,
      plusMinus: 3,
    },
    {
      id: '5',
      date: '2024-10-21',
      opponent: 'Senators',
      result: 'L',
      points: 0,
      plusMinus: -2,
    },
  ],
};

export default function DashboardPage() {
  const { totalGames, avgPoints, avgConfidence, avgSleep, insights, recentGames } = mockData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section - Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Games Played */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Games Played</h3>
            <p className="text-4xl font-bold text-blue-600">{totalGames}</p>
          </div>

          {/* Card 2: Avg Points */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Points</h3>
            <p className="text-4xl font-bold text-blue-600">{avgPoints.toFixed(1)}</p>
          </div>

          {/* Card 3: Avg Confidence */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Confidence</h3>
            <p className="text-4xl font-bold text-blue-600">{avgConfidence.toFixed(1)}</p>
            <p className="text-xs text-gray-400 mt-1">out of 10</p>
          </div>

          {/* Card 4: Avg Sleep */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Sleep</h3>
            <p className="text-4xl font-bold text-blue-600">{avgSleep.toFixed(1)}</p>
            <p className="text-xs text-gray-400 mt-1">hours</p>
          </div>
        </div>

        {/* Middle Section - Performance Insights */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg border border-blue-200 p-6"
              >
                <h3 className="text-base font-semibold text-blue-900 mb-2">
                  {insight.title}
                </h3>
                <p className="text-sm text-blue-800">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Recent Games Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Games</h2>
            <Link
              href="/games/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add Game
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opponent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    +/-
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentGames.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => (window.location.href = `/games/${game.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(game.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {game.opponent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          game.result === 'W'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {game.result === 'W' ? 'Win' : 'Loss'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {game.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          game.plusMinus > 0
                            ? 'text-green-600'
                            : game.plusMinus < 0
                            ? 'text-red-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {game.plusMinus > 0 ? '+' : ''}
                        {game.plusMinus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {recentGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{game.opponent}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(game.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      game.result === 'W'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {game.result === 'W' ? 'Win' : 'Loss'}
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Points: </span>
                    <span className="font-medium text-gray-900">{game.points}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">+/-: </span>
                    <span
                      className={`font-medium ${
                        game.plusMinus > 0
                          ? 'text-green-600'
                          : game.plusMinus < 0
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {game.plusMinus > 0 ? '+' : ''}
                      {game.plusMinus}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
