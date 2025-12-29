'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MentalState {
  confidence: number;
  sleepHours: number;
  sleepQuality: number;
  stressLevel: number;
  physicalEnergy: number;
  notes?: string;
}

interface Game {
  id: string;
  date: string;
  opponent: string;
  homeAway: string;
  result: string;
  goals: number;
  assists: number;
  shots: number;
  plusMinus: number;
  iceTime: number;
  mentalState?: MentalState;
}

// Mock data for demonstration
const MOCK_GAMES: Game[] = [
  {
    id: '1',
    date: '2024-01-15',
    opponent: 'Red Wings',
    homeAway: 'home',
    result: 'win',
    goals: 2,
    assists: 1,
    shots: 5,
    plusMinus: 2,
    iceTime: 18.5,
    mentalState: {
      confidence: 9,
      sleepHours: 8.5,
      sleepQuality: 9,
      stressLevel: 3,
      physicalEnergy: 8,
      notes: 'Felt great, well rested'
    }
  },
  {
    id: '2',
    date: '2024-01-12',
    opponent: 'Bruins',
    homeAway: 'away',
    result: 'loss',
    goals: 0,
    assists: 1,
    shots: 3,
    plusMinus: -1,
    iceTime: 16.2,
    mentalState: {
      confidence: 5,
      sleepHours: 6,
      sleepQuality: 5,
      stressLevel: 7,
      physicalEnergy: 5,
      notes: 'Tired from travel'
    }
  },
  {
    id: '3',
    date: '2024-01-10',
    opponent: 'Maple Leafs',
    homeAway: 'home',
    result: 'win',
    goals: 1,
    assists: 2,
    shots: 6,
    plusMinus: 3,
    iceTime: 19.8,
    mentalState: {
      confidence: 8,
      sleepHours: 8,
      sleepQuality: 8,
      stressLevel: 4,
      physicalEnergy: 9,
      notes: 'Good energy, team played well'
    }
  },
  {
    id: '4',
    date: '2024-01-08',
    opponent: 'Canadiens',
    homeAway: 'away',
    result: 'win',
    goals: 3,
    assists: 0,
    shots: 7,
    plusMinus: 2,
    iceTime: 20.5,
    mentalState: {
      confidence: 9,
      sleepHours: 7.5,
      sleepQuality: 8,
      stressLevel: 3,
      physicalEnergy: 8,
      notes: 'Hat trick game!'
    }
  },
  {
    id: '5',
    date: '2024-01-05',
    opponent: 'Rangers',
    homeAway: 'home',
    result: 'loss',
    goals: 0,
    assists: 0,
    shots: 2,
    plusMinus: -2,
    iceTime: 14.3,
    mentalState: {
      confidence: 4,
      sleepHours: 6.5,
      sleepQuality: 6,
      stressLevel: 8,
      physicalEnergy: 4,
      notes: 'Felt off all game'
    }
  },
  {
    id: '6',
    date: '2024-01-03',
    opponent: 'Penguins',
    homeAway: 'away',
    result: 'win',
    goals: 1,
    assists: 1,
    shots: 4,
    plusMinus: 1,
    iceTime: 17.9,
    mentalState: {
      confidence: 7,
      sleepHours: 7,
      sleepQuality: 7,
      stressLevel: 5,
      physicalEnergy: 7,
      notes: 'Solid performance'
    }
  },
  {
    id: '7',
    date: '2024-01-01',
    opponent: 'Flyers',
    homeAway: 'home',
    result: 'win',
    goals: 2,
    assists: 2,
    shots: 8,
    plusMinus: 3,
    iceTime: 21.2,
    mentalState: {
      confidence: 9,
      sleepHours: 9,
      sleepQuality: 9,
      stressLevel: 2,
      physicalEnergy: 9,
      notes: 'New year, great start!'
    }
  },
  {
    id: '8',
    date: '2023-12-28',
    opponent: 'Devils',
    homeAway: 'away',
    result: 'loss',
    goals: 1,
    assists: 0,
    shots: 5,
    plusMinus: 0,
    iceTime: 18.1,
    mentalState: {
      confidence: 6,
      sleepHours: 6.5,
      sleepQuality: 6,
      stressLevel: 6,
      physicalEnergy: 6,
      notes: 'Average game'
    }
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(true); // Toggle for demo mode

  const fetchGames = useCallback(async () => {
    try {
      // Use mock data for demonstration
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setGames(MOCK_GAMES);
        setIsLoading(false);
        return;
      }

      // Real API call
      const response = await fetch('/api/games');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      setGames(data.games || []);
    } catch (err) {
      setError('Failed to load games');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [useMockData, router]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Calculate statistics
  const totalGames = games.length;

  const avgPoints = totalGames > 0
    ? games.reduce((sum, game) => sum + game.goals + game.assists, 0) / totalGames
    : 0;

  const gamesWithMentalState = games.filter(g => g.mentalState);

  const avgConfidence = gamesWithMentalState.length > 0
    ? gamesWithMentalState.reduce((sum, game) => sum + (game.mentalState?.confidence || 0), 0) / gamesWithMentalState.length
    : 0;

  const avgSleep = gamesWithMentalState.length > 0
    ? gamesWithMentalState.reduce((sum, game) => sum + (game.mentalState?.sleepHours || 0), 0) / gamesWithMentalState.length
    : 0;

  // Calculate insights
  const highConfidenceGames = gamesWithMentalState.filter(g => (g.mentalState?.confidence || 0) >= 8);
  const lowConfidenceGames = gamesWithMentalState.filter(g => (g.mentalState?.confidence || 0) <= 5);

  const avgPointsHighConfidence = highConfidenceGames.length > 0
    ? highConfidenceGames.reduce((sum, game) => sum + game.goals + game.assists, 0) / highConfidenceGames.length
    : 0;

  const avgPointsLowConfidence = lowConfidenceGames.length > 0
    ? lowConfidenceGames.reduce((sum, game) => sum + game.goals + game.assists, 0) / lowConfidenceGames.length
    : 0;

  const highSleepGames = gamesWithMentalState.filter(g => (g.mentalState?.sleepHours || 0) >= 8);
  const lowSleepGames = gamesWithMentalState.filter(g => (g.mentalState?.sleepHours || 0) < 7);

  const avgPointsHighSleep = highSleepGames.length > 0
    ? highSleepGames.reduce((sum, game) => sum + game.goals + game.assists, 0) / highSleepGames.length
    : 0;

  const avgPointsLowSleep = lowSleepGames.length > 0
    ? lowSleepGames.reduce((sum, game) => sum + game.goals + game.assists, 0) / lowSleepGames.length
    : 0;

  const recentGames = games.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchGames}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
            <button
              onClick={() => {
                setUseMockData(!useMockData);
                setIsLoading(true);
                setGames([]);
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              {useMockData ? 'Using Mock Data' : 'Using Real Data'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {totalGames === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Games Yet</h2>
            <p className="text-gray-600 mb-6">Start tracking your performance by adding your first game!</p>
            <Link
              href="/games/add"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Your First Game
            </Link>
          </div>
        ) : (
          <>
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
                <p className="text-4xl font-bold text-blue-600">
                  {gamesWithMentalState.length > 0 ? avgConfidence.toFixed(1) : '-'}
                </p>
                <p className="text-xs text-gray-400 mt-1">out of 10</p>
              </div>

              {/* Card 4: Avg Sleep */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Sleep</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {gamesWithMentalState.length > 0 ? avgSleep.toFixed(1) : '-'}
                </p>
                <p className="text-xs text-gray-400 mt-1">hours</p>
              </div>
            </div>

            {/* Middle Section - Performance Insights */}
            {gamesWithMentalState.length >= 3 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Insights</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {highConfidenceGames.length > 0 && lowConfidenceGames.length > 0 && (
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                      <h3 className="text-base font-semibold text-blue-900 mb-2">
                        High Confidence Impact
                      </h3>
                      <p className="text-sm text-blue-800">
                        You average {avgPointsHighConfidence.toFixed(1)} points per game when confidence is 8+
                        vs {avgPointsLowConfidence.toFixed(1)} points when confidence is 5 or below
                      </p>
                    </div>
                  )}
                  {highSleepGames.length > 0 && lowSleepGames.length > 0 && (
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                      <h3 className="text-base font-semibold text-blue-900 mb-2">
                        Sleep Impact
                      </h3>
                      <p className="text-sm text-blue-800">
                        You average {avgPointsHighSleep.toFixed(1)} points per game with 8+ hours sleep
                        vs {avgPointsLowSleep.toFixed(1)} points with less than 7 hours
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                              game.result === 'win'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {game.result === 'win' ? 'Win' : 'Loss'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {game.goals + game.assists}
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
                          game.result === 'win'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {game.result === 'win' ? 'Win' : 'Loss'}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Points: </span>
                        <span className="font-medium text-gray-900">{game.goals + game.assists}</span>
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
          </>
        )}
      </main>
    </div>
  );
}
