import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, TOURNAMENT_PLATFORM_ABI } from '../config/contracts';
import { formatEther, parseEther } from 'viem';

function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [activeTab, setActiveTab] = useState('overview');
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);

  const SEPOLIA_CHAIN_ID = 11155111;

  // Fetch tournament data
  const { data: tournamentData, isLoading: tournamentLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.TOURNAMENT_PLATFORM,
    abi: TOURNAMENT_PLATFORM_ABI,
    functionName: 'getTournament',
    args: id ? [BigInt(id)] : undefined,
    chainId: SEPOLIA_CHAIN_ID,
  });

  // Fetch participants
  const { data: participantsData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOURNAMENT_PLATFORM,
    abi: TOURNAMENT_PLATFORM_ABI,
    functionName: 'getTournamentParticipants',
    args: id ? [BigInt(id)] : undefined,
    chainId: SEPOLIA_CHAIN_ID,
  });

  // Check if user has joined
  const { data: hasJoinedData } = useReadContract({
    address: CONTRACT_ADDRESSES.TOURNAMENT_PLATFORM,
    abi: TOURNAMENT_PLATFORM_ABI,
    functionName: 'hasJoined',
    args: (id && address) ? [BigInt(id), address] : undefined,
    chainId: SEPOLIA_CHAIN_ID,
  });

  useEffect(() => {
    if (tournamentData) {
      const statusMap = ['UPCOMING', 'LIVE', 'ENDED', 'CANCELLED'];
      setTournament({
        id: Number(tournamentData.id),
        name: tournamentData.name,
        description: tournamentData.description,
        creator: tournamentData.creator,
        entryFee: formatEther(tournamentData.entryFee),
        prizePool: formatEther(tournamentData.prizePool),
        maxParticipants: Number(tournamentData.maxParticipants),
        currentParticipants: participantsData?.length || 0,
        status: statusMap[tournamentData.status] || 'UPCOMING',
        startTime: new Date(Number(tournamentData.startTime) * 1000).toISOString(),
        endTime: new Date(Number(tournamentData.endTime) * 1000).toISOString(),
        resultsSubmitted: tournamentData.resultsSubmitted,
      });
    }
  }, [tournamentData, participantsData]);

  useEffect(() => {
    if (participantsData) {
      setParticipants(participantsData.map((addr, i) => ({
        id: `p${i + 1}`,
        address: addr,
        rank: i + 1,
        joinedAt: new Date().toISOString(),
      })));
    }
  }, [participantsData]);

  const hasJoined = hasJoinedData || false;

  if (tournamentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
        <div className="max-w-2xl mx-auto my-16 text-center p-12 bg-white/5 rounded-xl border border-white/10">
          <h2 className="mb-4 text-2xl">⏳ Loading Tournament...</h2>
        </div>
      </div>
    );
  }

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

  const handleJoin = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!tournament) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.TOURNAMENT_PLATFORM,
        abi: TOURNAMENT_PLATFORM_ABI,
        functionName: 'joinTournament',
        args: [BigInt(id)],
        value: parseEther(tournament.entryFee),
      });
      alert('Successfully joined tournament!');
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

            {!hasJoined && (tournament.status === 'LIVE' || tournament.status === 'UPCOMING') && (
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
                  <h3 className="mb-4 text-xl font-semibold">Prize Pool</h3>
                  <div className="p-6 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-lg border border-purple-500/30 text-center">
                    <div className="mb-3 text-5xl">🏆</div>
                    <p className="mb-2 text-white/60">Total Prize Pool</p>
                    <p className="text-4xl font-bold text-gradient">
                      {tournament.prizePool} ETH
                    </p>
                    <p className="mt-3 text-sm text-white/50">
                      Prize distribution will be determined by the tournament creator
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">
                  Registered Participants ({participants.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-left font-semibold text-white/80">#</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Address</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Status</th>
                        <th className="py-3 px-4 text-left font-semibold text-white/80">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant, index) => (
                        <tr
                          key={participant.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4 font-mono">{participant.address}</td>
                          <td className="py-4 px-4 font-semibold text-cyan-400">Joined</td>
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
                <h3 className="mb-4 text-xl font-semibold">Tournament Participants</h3>
                <p className="mb-4 text-white/60">Scores will be displayed once submitted by participants</p>
                <div className="space-y-3">
                  {participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-5 rounded-lg border bg-white/5 border-white/10"
                      >
                        <div className="flex items-center gap-6">
                          <div className="text-2xl min-w-[50px] text-center font-bold">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-mono font-semibold mb-1">{participant.address}</p>
                            <p className="text-white/60 text-sm">Tournament participant</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <p>No participants yet. Be the first to join!</p>
                    </div>
                  )}
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
