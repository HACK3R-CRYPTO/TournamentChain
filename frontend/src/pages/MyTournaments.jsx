import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const mockTournaments = {
  joined: [
    {
      id: '1',
      name: 'Weekly Blitz Challenge',
      entryFee: 0.05,
      prizePool: 2.5,
      status: 'LIVE',
      myRank: 3,
      myScore: 4250,
      participants: 67,
      endTime: new Date(Date.now() + 3 * 86400000).toISOString(),
      potentialPrize: 0.375
    },
    {
      id: '2',
      name: 'Monthly Masters',
      entryFee: 0.1,
      prizePool: 5.0,
      status: 'LIVE',
      myRank: 12,
      myScore: 2890,
      participants: 50,
      endTime: new Date(Date.now() + 10 * 86400000).toISOString(),
      potentialPrize: 0.05
    },
    {
      id: '3',
      name: 'Summer Championship',
      entryFee: 0.08,
      prizePool: 4.0,
      status: 'ENDED',
      myRank: 1,
      myScore: 7650,
      participants: 50,
      endTime: new Date(Date.now() - 2 * 86400000).toISOString(),
      potentialPrize: 2.0,
      claimed: true
    }
  ],
  created: [
    {
      id: '4',
      name: 'Friday Night Fights',
      entryFee: 0.03,
      prizePool: 1.5,
      status: 'UPCOMING',
      participants: 28,
      maxParticipants: 100,
      startTime: new Date(Date.now() + 5 * 86400000).toISOString(),
      endTime: new Date(Date.now() + 7 * 86400000).toISOString()
    },
    {
      id: '5',
      name: 'Beginner\'s Cup',
      entryFee: 0.01,
      prizePool: 0.5,
      status: 'LIVE',
      participants: 42,
      maxParticipants: 50,
      startTime: new Date(Date.now() - 1 * 86400000).toISOString(),
      endTime: new Date(Date.now() + 2 * 86400000).toISOString()
    }
  ]
};

function MyTournaments() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('joined');

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
        <div className="max-w-2xl mx-auto my-16 text-center p-12 bg-white/5 rounded-xl border border-white/10">
          <h2 className="mb-4 text-2xl">🔒 Wallet Connection Required</h2>
          <p className="mb-6 text-white/70">Please connect your wallet to view your tournaments</p>
          <button
            className="mt-6 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 transition-all"
            onClick={() => navigate('/tournaments')}
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'UPCOMING': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500';
      case 'ENDED': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const handleClaimPrize = (tournamentId) => {
    console.log('Claiming prize for tournament:', tournamentId);
    alert('Prize claimed successfully! (Mock)');
  };

  const handleCancelTournament = (tournamentId) => {
    if (window.confirm('Are you sure you want to cancel this tournament?')) {
      console.log('Canceling tournament:', tournamentId);
      alert('Tournament canceled successfully! (Mock)');
    }
  };

  const tournaments = activeTab === 'joined' ? mockTournaments.joined : mockTournaments.created;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-8">
        <h1 className="m-0 text-3xl font-bold text-gradient">My Tournaments</h1>
        <p className="mt-2 text-white/70">Track your tournament participation and performance</p>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              className={`flex-1 px-8 py-4 font-semibold transition-all ${
                activeTab === 'joined'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setActiveTab('joined')}
            >
              Joined Tournaments ({mockTournaments.joined.length})
            </button>
            <button
              className={`flex-1 px-8 py-4 font-semibold transition-all ${
                activeTab === 'created'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setActiveTab('created')}
            >
              Created Tournaments ({mockTournaments.created.length})
            </button>
          </div>

          <div className="p-8">
            {tournaments.length === 0 ? (
              <div className="text-center py-16">
                <p className="mb-6 text-xl text-white/60">
                  {activeTab === 'joined' 
                    ? "You haven't joined any tournaments yet"
                    : "You haven't created any tournaments yet"}
                </p>
                <button
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 transition-all"
                  onClick={() => navigate(activeTab === 'joined' ? '/tournaments' : '/create')}
                >
                  {activeTab === 'joined' ? 'Browse Tournaments' : 'Create Tournament'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-600/20 transition-all cursor-pointer"
                    onClick={() => navigate(`/tournament/${tournament.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="m-0 mb-2 text-xl font-bold">{tournament.name}</h3>
                        <span className={`inline-block px-3 py-1 border rounded-full text-xs font-semibold ${getStatusColor(tournament.status)}`}>
                          {tournament.status}
                        </span>
                      </div>
                      {activeTab === 'joined' && tournament.myRank && (
                        <div className="text-center">
                          <div className="mb-1 text-3xl">{getRankBadge(tournament.myRank)}</div>
                          <div className="text-sm text-white/60">Rank {tournament.myRank}</div>
                        </div>
                      )}
                    </div>

                    <div className="mb-4 pb-4 border-b border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/60 text-sm mb-1">Prize Pool</p>
                          <p className="text-lg font-bold text-gradient">{tournament.prizePool} ETH</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm mb-1">Entry Fee</p>
                          <p className="text-lg font-bold text-gradient">{tournament.entryFee} ETH</p>
                        </div>
                      </div>
                    </div>

                    {activeTab === 'joined' ? (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-white/70">Your Score:</span>
                            <span className="font-semibold text-cyan-400">{tournament.myScore.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Potential Prize:</span>
                            <span className="font-semibold text-gradient">{tournament.potentialPrize} ETH</span>
                          </div>
                        </div>

                        {tournament.status === 'ENDED' && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            {tournament.claimed ? (
                              <div className="text-center py-3 bg-green-500/20 border border-green-500 text-green-400 rounded-lg font-semibold">
                                ✓ Prize Claimed
                              </div>
                            ) : tournament.potentialPrize > 0 ? (
                              <button
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClaimPrize(tournament.id);
                                }}
                              >
                                Claim Prize ({tournament.potentialPrize} ETH)
                              </button>
                            ) : (
                              <div className="text-center py-3 text-white/50">No prize won</div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-white/70">Participants:</span>
                            <span className="font-semibold">
                              {tournament.participants}/{tournament.maxParticipants}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">
                              {tournament.status === 'UPCOMING' ? 'Starts:' : tournament.status === 'LIVE' ? 'Ends:' : 'Ended:'}
                            </span>
                            <span className="font-semibold">
                              {new Date(tournament.status === 'UPCOMING' ? tournament.startTime : tournament.endTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {tournament.status === 'UPCOMING' && (
                          <button
                            className="w-full mt-4 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelTournament(tournament.id);
                            }}
                          >
                            Cancel Tournament
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-8 border border-white/10">
          <h2 className="mt-0 mb-6 text-2xl font-semibold">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
              <p className="text-white/60 mb-2">Total Tournaments</p>
              <p className="text-4xl font-bold text-gradient">{mockTournaments.joined.length}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
              <p className="text-white/60 mb-2">Total Winnings</p>
              <p className="text-4xl font-bold text-gradient">2.375 ETH</p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
              <p className="text-white/60 mb-2">Avg. Rank</p>
              <p className="text-4xl font-bold text-gradient">
                {Math.round(mockTournaments.joined.reduce((sum, t) => sum + (t.myRank || 0), 0) / mockTournaments.joined.length)}
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-center">
              <p className="text-white/60 mb-2">Win Rate</p>
              <p className="text-4xl font-bold text-gradient">
                {Math.round((mockTournaments.joined.filter(t => t.myRank === 1).length / mockTournaments.joined.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTournaments;
