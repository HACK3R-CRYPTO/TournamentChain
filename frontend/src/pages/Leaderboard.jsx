import { useState, useEffect, useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, TOURNAMENT_PLATFORM_ABI } from '../config/contracts';

function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState('all-time');

  const SEPOLIA_CHAIN_ID = 11155111;

  // Fetch tournament counter
  const { data: tournamentCounter } = useReadContract({
    address: CONTRACT_ADDRESSES.TOURNAMENT_PLATFORM,
    abi: TOURNAMENT_PLATFORM_ABI,
    functionName: 'tournamentCounter',
    chainId: SEPOLIA_CHAIN_ID,
  });

  // For now, show placeholder leaderboard since we need to aggregate data from multiple tournaments
  // In production, you'd want a backend service to aggregate this data
  const leaderboard = useMemo(() => {
    // Static placeholder data to avoid React Compiler warnings about impure functions
    const placeholderData = [
      { rank: 1, address: '0xAbCd1234...5678', tournaments: 5, totalWinnings: '1.234', avgRank: 2, winRate: 75 },
      { rank: 2, address: '0xDeFg5678...9abc', tournaments: 4, totalWinnings: '0.892', avgRank: 3, winRate: 68 },
      { rank: 3, address: '0xHiJk9012...3def', tournaments: 3, totalWinnings: '0.567', avgRank: 4, winRate: 55 },
      { rank: 4, address: '0xLmNo3456...7ghi', tournaments: 4, totalWinnings: '0.445', avgRank: 5, winRate: 50 },
      { rank: 5, address: '0xPqRs7890...1jkl', tournaments: 2, totalWinnings: '0.334', avgRank: 6, winRate: 45 },
      { rank: 6, address: '0xTuVw1234...5mno', tournaments: 3, totalWinnings: '0.289', avgRank: 7, winRate: 40 },
      { rank: 7, address: '0xYzAb5678...9pqr', tournaments: 2, totalWinnings: '0.223', avgRank: 8, winRate: 38 },
      { rank: 8, address: '0xCdEf9012...3stu', tournaments: 1, totalWinnings: '0.178', avgRank: 9, winRate: 35 },
      { rank: 9, address: '0xGhIj3456...7vwx', tournaments: 2, totalWinnings: '0.156', avgRank: 10, winRate: 30 },
      { rank: 10, address: '0xKlMn7890...1yza', tournaments: 1, totalWinnings: '0.112', avgRank: 11, winRate: 25 },
    ];
    
    return tournamentCounter ? placeholderData : [];
  }, [tournamentCounter]);

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1419] text-white particle-bg">
      <div className="max-w-7xl mx-auto p-8">
        {/* Page Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="m-0 text-4xl md:text-5xl font-black text-gradient">🎯 Global Leaderboard</h1>
          <p className="mt-2 text-lg text-white/70">Top players ranked by their tournament performance</p>
          <div className="mt-4 glass rounded-lg p-4 border border-yellow-500/30">
            <p className="text-yellow-400">ℹ️ <strong>Note:</strong> Currently showing placeholder data. Full leaderboard aggregation requires a backend service to collect scores from all tournaments.</p>
          </div>
        </div>

        <div className="mb-8 flex justify-end animate-slide-up">
          <div className="inline-flex glass rounded-xl p-1.5 border border-white/10">
            {['all-time', 'monthly', 'weekly'].map(filter => (
              <button
                key={filter}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all ${timeFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-600/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter === 'all-time' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12 glass-strong rounded-2xl p-8 border border-purple-500/30 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="mt-0 mb-8 text-3xl font-black text-center">🏆 Top Champions 🏆</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* 2nd Place */}
            <div className="glass-strong rounded-2xl p-6 border-2 border-gray-400/50 text-center md:h-[280px] flex flex-col justify-end transform md:-translate-y-4 hover:scale-105 transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-4 text-6xl animate-float" style={{ animationDelay: '0.5s' }}>🥈</div>
              <div className="mb-2 text-5xl font-black text-gradient-silver">2</div>
              <div className="mb-3 font-mono text-lg">{topThree[1]?.address}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass p-3 rounded-lg">
                  <p className="text-white/60 mb-1">Winnings</p>
                  <p className="font-bold text-cyan-400">{topThree[1]?.totalWinnings} ETH</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <p className="text-white/60 mb-1">Tournaments</p>
                  <p className="font-bold">{topThree[1]?.tournaments}</p>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="glass-strong rounded-2xl p-6 border-2 border-yellow-400/70 text-center md:h-[320px] flex flex-col justify-end shadow-2xl shadow-yellow-600/40 hover:scale-105 transition-all animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="mb-4 text-7xl animate-float">👑</div>
              <div className="mb-2 text-6xl font-black text-gradient-gold">1</div>
              <div className="mb-3 font-mono text-xl font-bold">{topThree[0]?.address}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass p-3 rounded-lg">
                  <p className="text-white/60 mb-1">Winnings</p>
                  <p className="font-bold text-cyan-400">{topThree[0]?.totalWinnings} ETH</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <p className="text-white/60 mb-1">Tournaments</p>
                  <p className="font-bold">{topThree[0]?.tournaments}</p>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="glass-strong rounded-2xl p-6 border-2 border-amber-600/50 text-center md:h-[280px] flex flex-col justify-end transform md:-translate-y-4 hover:scale-105 transition-all animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <div className="mb-4 text-6xl animate-float" style={{ animationDelay: '1s' }}>🥉</div>
              <div className="mb-2 text-5xl font-black text-gradient-bronze">3</div>
              <div className="mb-3 font-mono text-lg">{topThree[2]?.address}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass p-3 rounded-lg">
                  <p className="text-white/60 mb-1">Winnings</p>
                  <p className="font-bold text-cyan-400">{topThree[2]?.totalWinnings} ETH</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <p className="text-white/60 mb-1">Tournaments</p>
                  <p className="font-bold">{topThree[2]?.tournaments}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="glass-strong">
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-left font-bold text-white/90">Rank</th>
                  <th className="py-4 px-6 text-left font-bold text-white/90">Player</th>
                  <th className="py-4 px-6 text-left font-bold text-white/90">Tournaments</th>
                  <th className="py-4 px-6 text-left font-bold text-white/90">Total Winnings</th>
                  <th className="py-4 px-6 text-left font-bold text-white/90">Avg. Rank</th>
                  <th className="py-4 px-6 text-left font-bold text-white/90">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((player, index) => (
                  <tr
                    key={player.rank}
                    className="border-b border-white/5 hover:bg-white/10 transition-all animate-fade-in"
                    style={{ animationDelay: `${0.4 + index * 0.02}s` }}
                  >
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center min-w-[40px] h-10 px-3 rounded-full glass font-black text-white/90">
                        {player.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold">{player.address}</td>
                    <td className="py-4 px-6 font-semibold">{player.tournaments}</td>
                    <td className="py-4 px-6 font-black text-gradient">{player.totalWinnings} ETH</td>
                    <td className="py-4 px-6 font-semibold">{player.avgRank}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 glass rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all"
                            style={{ width: `${player.winRate}%` }}
                          />
                        </div>
                        <span className="min-w-[45px] text-right font-bold">{player.winRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center text-white/60">
          <p>Showing {leaderboard.length} players • Aggregated from {tournamentCounter?.toString() || 0} tournaments</p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
