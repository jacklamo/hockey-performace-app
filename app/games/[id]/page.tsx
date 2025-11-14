'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// Mock data - replace with actual data from database/API
const mockGameData = {
  id: '1',
  date: '2024-11-15',
  opponent: 'Boston College',
  homeAway: 'home',
  result: 'win',
  goals: 2,
  assists: 1,
  shots: 5,
  plusMinus: 2,
  iceTime: 18,
  mentalState: {
    confidence: 8,
    sleepHours: 7.5,
    sleepQuality: 8,
    stressLevel: 4,
    physicalEnergy: 9,
    notes: 'Felt great today. Got a good night sleep and stayed focused.',
  },
};

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // In production, fetch game data using params.id
  const game = mockGameData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this game? This cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log('Game deleted:', params.id);
      router.push('/dashboard');
    }, 500);
  };

  const points = game.goals + game.assists;
  const hasmentalState = game.mentalState !== null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

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
            hasmentalState ? 'bg-blue-50' : 'bg-white'
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Mental State
          </h2>

          {hasmentalState ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Confidence */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState.confidence}
                    <span className="text-lg text-gray-500 ml-1">/10</span>
                  </p>
                </div>

                {/* Sleep */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sleep</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState.sleepHours}
                    <span className="text-lg text-gray-500 ml-1">hours</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ({game.mentalState.sleepQuality}/10 quality)
                  </p>
                </div>

                {/* Stress */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Stress</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState.stressLevel}
                    <span className="text-lg text-gray-500 ml-1">/10</span>
                  </p>
                </div>

                {/* Physical Energy */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Physical Energy</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {game.mentalState.physicalEnergy}
                    <span className="text-lg text-gray-500 ml-1">/10</span>
                  </p>
                </div>
              </div>

              {/* Notes */}
              {game.mentalState.notes && (
                <div className="pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Notes:</p>
                  <p className="text-gray-900">{game.mentalState.notes}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                No mental state logged for this game
              </p>
              <Link
                href={`/games/${params.id}/mental`}
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
            href={`/games/${params.id}/edit`}
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
