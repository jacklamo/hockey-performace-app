'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

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

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(true); // Toggle for demo mode
  const [gameId, setGameId] = useState<string>('');

  useEffect(() => {
    params.then(p => setGameId(p.id));
  }, [params]);

  const fetchGame = useCallback(async () => {
    if (!gameId) return;

    try {
      // Use mock data for demonstration
      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundGame = MOCK_GAMES.find(g => g.id === gameId);

        if (!foundGame) {
          setError('Game not found');
          setIsLoading(false);
          return;
        }

        setGame(foundGame);
        setIsLoading(false);
        return;
      }

      // Real API call
      const response = await fetch(`/api/games/${gameId}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (response.status === 404) {
          setError('Game not found');
          return;
        }
        throw new Error('Failed to fetch game');
      }

      const data = await response.json();
      setGame(data.game);
    } catch (err) {
      setError('Failed to load game');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [useMockData, gameId, router]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this game? This cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // If using mock data, just navigate back
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard');
        return;
      }

      // Real API call
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      router.push('/dashboard');
    } catch (err) {
      alert('Failed to delete game. Please try again.');
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Game not found'}</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const points = game.goals + game.assists;
  const hasMentalState = game.mentalState !== null && game.mentalState !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Toggle */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => {
              setUseMockData(!useMockData);
              setIsLoading(true);
              setGame(null);
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            {useMockData ? 'Using Mock Data' : 'Using Real Data'}
          </button>
        </div>

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            vs {game.opponent} - {formatDate(game.date)}
          </h1>
          <p className="text-xl text-gray-600">
            <span
              className={`font-semibold ${
                game.result === 'win' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {game.result === 'win' ? 'Win' : 'Loss'}
            </span>
            {' - '}
            <span className="capitalize">{game.homeAway}</span>
          </p>
        </div>

        {/* Section 1 - Game Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Goals */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Goals</p>
              <p className="text-3xl font-bold text-gray-900">{game.goals}</p>
            </div>

            {/* Assists */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Assists</p>
              <p className="text-3xl font-bold text-gray-900">{game.assists}</p>
            </div>

            {/* Points */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Points</p>
              <p className="text-3xl font-bold text-gray-900">{points}</p>
            </div>

            {/* Shots */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Shots</p>
              <p className="text-3xl font-bold text-gray-900">{game.shots}</p>
            </div>

            {/* Plus/Minus */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Plus/Minus</p>
              <p
                className={`text-3xl font-bold ${
                  game.plusMinus > 0
                    ? 'text-green-600'
                    : game.plusMinus < 0
                    ? 'text-red-600'
                    : 'text-gray-900'
                }`}
              >
                {game.plusMinus > 0 ? '+' : ''}
                {game.plusMinus}
              </p>
            </div>

            {/* Ice Time */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Ice Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {game.iceTime}
                <span className="text-lg text-gray-500 ml-1">min</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 - Mental State */}
        <div
          className={`rounded-lg shadow-md p-6 mb-6 ${
            hasMentalState ? 'bg-blue-50' : 'bg-white'
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Mental State
          </h2>

          {hasMentalState ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Confidence */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState!.confidence}
                    <span className="text-lg text-gray-500 ml-1">/10</span>
                  </p>
                </div>

                {/* Sleep */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sleep</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState!.sleepHours}
                    <span className="text-lg text-gray-500 ml-1">hours</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ({game.mentalState!.sleepQuality}/10 quality)
                  </p>
                </div>

                {/* Stress */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Stress</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState!.stressLevel}
                    <span className="text-lg text-gray-500 ml-1">/10</span>
                  </p>
                </div>

                {/* Physical Energy */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Physical Energy</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState!.physicalEnergy}
                    <span className="text-lg text-gray-500 ml-1">/10</span>
                  </p>
                </div>
              </div>

              {/* Notes */}
              {game.mentalState!.notes && (
                <div className="pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Notes:</p>
                  <p className="text-gray-900">{game.mentalState!.notes}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                No mental state logged for this game
              </p>
              <Link
                href={`/games/${gameId}/mental`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Add Mental State
              </Link>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/games/${gameId}/edit`}
            className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Edit Game
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Game'}
          </button>
        </div>
      </div>
    </div>
  );
}
