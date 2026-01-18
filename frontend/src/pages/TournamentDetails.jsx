import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract } from 'wagmi';

const mockTournaments = [
  {
    id: '1',
    name: 'Weekly Blitz Challenge',
    description: 'Fast-paced survival tournament. 10-minute rounds, highest score wins!',
    entryFee: 0.05,
    prizePool: 2.5,
    maxParticipants: 100,
    currentParticipants: 67,
    status: 'LIVE',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() + 3 * 86400000).toISOString(),
    creator: '0x1234...5678',
    prizes: { first: 1.25, second: 0.75, third: 0.375, others: 0.125 },
    participants: Array.from({ length: 10 }, (_, i) => ({
      id: `p${i + 1}`,
      address: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      score: Math.floor(Math.random() * 5000) + 1000,
      rank: i + 1,
      joinedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
    })),
    leaderboard: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      address: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      score: 5000 - i * 450,
      prize: i === 0 ? 1.25 : i === 1 ? 0.75 : i === 2 ? 0.375 : 0.125
    }))
  }
];

function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [activeTab, setActiveTab] = useState('overview');

  const tournament = mockTournaments.find(t => t.id === id);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
        <div className="max-w-2xl mx-auto my-16 text-center p-12 bg-white/5 rounded-xl border border-white/10">
          <h2 className="mb-4 text-2xl">❌ Tournament Not Found</h2>
          <p className="mb-6 text-white/70">The tournament you're looking for doesn't exist.</p>
          <button
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 transition-all"
            onClick={() => navigate('/tournaments')}
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  const hasJoined = tournament.participants.some(p => p.address.toLowerCase() === address?.toLowerCase());

  const handleJoin = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      console.log('Joining tournament:', tournament.id);
      alert('Successfully joined tournament! (Mock)');
    } catch (error) {
      console.error('Error joining tournament:', error);
      alert('Failed to join tournament: ' + error.message);
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(tournament.endTime);
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h remaining`;
  };

  const getStatusColor = () => {
    switch (tournament.status) {
      case 'LIVE': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'UPCOMING': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500';
      case 'ENDED': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-8 flex items-center gap-8">
        <button
          className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-lg hover:bg-white/15 transition-all"
          onClick={() => navigate('/tournaments')}
        >
          ← Back
        </button>
        <h1 className="m-0 text-3xl font-bold text-gradient">{tournament.name}</h1>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8 bg-white/5 rounded-xl p-8 border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-1.5 border rounded-full text-sm font-semibold ${getStatusColor()}`}>
                  {tournament.status}
                </span>
                <span className="text-white/70">Created by {tournament.creator}</span>
              </div>
              <p className="text-white/80 text-lg max-w-2xl">{tournament.description}</p>
            </div>

            {!hasJoined && tournament.status === 'LIVE' && (
              <button
                className="min-w-[200px] px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleJoin}
                disabled={isPending}
              >
                {isPending ? 'Joining...' : `Join (${tournament.entryFee} ETH)`}
              </button>
            )}
            {hasJoined && (
              <div className="px-8 py-3.5 bg-green-500/20 border-2 border-green-500 text-green-400 rounded-lg font-semibold">
                ✓ Joined
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm mb-2">Prize Pool</p>
              <p className="text-2xl font-bold text-gradient">{tournament.prizePool} ETH</p>
            </div>
            <div className="bg-white/5 p-5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm mb-2">Entry Fee</p>
              <p className="text-2xl font-bold text-gradient">{tournament.entryFee} ETH</p>
            </div>
            <div className="bg-white/5 p-5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm mb-2">Participants</p>
              <p className="text-2xl font-bold text-gradient">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
            </div>
            <div className="bg-white/5 p-5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm mb-2">Time Left</p>
              <p className="text-2xl font-bold text-gradient">{getTimeRemaining()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex border-b border-white/10">
            {['overview', 'participants', 'leaderboard'].map(tab => (
              <button
                key={tab}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div>
                <div className="mb-8">
                  <h3 className="mb-4 text-xl font-semibold">Tournament Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-3xl">🚀</span>
                      <div>
                        <p className="text-white/60 text-sm">Start Time</p>
                        <p className="font-semibold">{new Date(tournament.startTime).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-3xl">🏁</span>
                      <div>
                        <p className="text-white/60 text-sm">End Time</p>
                        <p className="font-semibold">{new Date(tournament.endTime).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold">Prize Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { emoji: '🥇', label: '1st Place', prize: tournament.prizes.first, color: 'from-yellow-600 to-yellow-800' },
                      { emoji: '🥈', label: '2nd Place', prize: tournament.prizes.second, color: 'from-gray-400 to-gray-600' },
                      { emoji: '🥉', label: '3rd Place', prize: tournament.prizes.third, color: 'from-amber-600 to-amber-800' },
                      { emoji: '🏆', label: 'Others', prize: tournament.prizes.others, color: 'from-purple-600 to-purple-800' }
                    ].map(({ emoji, label, prize, color }) => (
                      <div key={label} className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
                        <div className="mb-3 text-5xl">{emoji}</div>
                        <p className="mb-2 text-white/60">{label}</p>
                        <p className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                          {prize} ETH
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">
                  Registered Participants ({tournament.participants.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-left font-semibold text-white/80">#</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Address</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Current Score</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.participants.map((participant, index) => (
                        <tr
                          key={participant.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4 font-mono">{participant.address}</td>
                          <td className="py-4 px-4 font-semibold text-cyan-400">{participant.score.toLocaleString()}</td>
                          <td className="py-4 px-4 text-white/60">{new Date(participant.joinedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">Current Rankings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Rank</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Player</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Score</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Prize</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.leaderboard.map((entry) => (
                        <tr
                          key={entry.rank}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            entry.rank <= 3 ? 'bg-white/5' : ''
                          }`}
                        >
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                              entry.rank === 1 ? 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-white' :
                              entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                              entry.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white' :
                              'bg-white/10 text-white/70'
                            }`}>
                              {entry.rank}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono">{entry.address}</td>
                          <td className="py-4 px-4 font-semibold text-cyan-400">{entry.score.toLocaleString()}</td>
                          <td className="py-4 px-4 font-semibold text-gradient">{entry.prize} ETH</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentDetails;
