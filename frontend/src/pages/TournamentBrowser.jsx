import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';

function TournamentBrowser() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [tournaments, setTournaments] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    minEntryFee: '',
    maxEntryFee: '',
    searchTerm: ''
  });

  const TOURNAMENT_CONTRACT_ADDRESS = '0x...';

  useEffect(() => {
    const mockTournaments = [
      {
        id: 1,
        name: 'Weekly Survival Challenge',
        description: 'Compete for the highest survival score',
        entryFee: '0.01',
        prizePool: '0.5',
        maxParticipants: 100,
        currentParticipants: 45,
        startTime: Date.now() + 86400000,
        endTime: Date.now() + 604800000,
        status: 'upcoming',
        creator: '0x1234...5678'
      },
      {
        id: 2,
        name: 'Elite Shooter Tournament',
        description: 'High stakes competition for experienced players',
        entryFee: '0.05',
        prizePool: '2.5',
        maxParticipants: 50,
        currentParticipants: 38,
        startTime: Date.now() - 3600000,
        endTime: Date.now() + 82800000,
        status: 'active',
        creator: '0xabcd...efgh'
      },
      {
        id: 3,
        name: 'Beginner Friendly Match',
        description: 'Perfect for new players to practice',
        entryFee: '0.001',
        prizePool: '0.05',
        maxParticipants: 200,
        currentParticipants: 156,
        startTime: Date.now() + 172800000,
        endTime: Date.now() + 432000000,
        status: 'upcoming',
        creator: '0x9876...4321'
      }
    ];
    setTournaments(mockTournaments);
  }, []);

  const filteredTournaments = tournaments.filter(tournament => {
    if (filters.status !== 'all' && tournament.status !== filters.status) return false;
    const entryFee = parseFloat(tournament.entryFee);
    if (filters.minEntryFee && entryFee < parseFloat(filters.minEntryFee)) return false;
    if (filters.maxEntryFee && entryFee > parseFloat(filters.maxEntryFee)) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return tournament.name.toLowerCase().includes(searchLower) || tournament.description.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const formatTimeRemaining = (timestamp) => {
    const now = Date.now();
    const diff = timestamp - now;
    if (diff < 0) return 'Ended';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-500/20 text-green-400 border-green-500',
      upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500'
    };
    const text = { active: 'LIVE', upcoming: 'UPCOMING', completed: 'ENDED' };
    return (
      <span className={`px-3 py-1 rounded-xl text-xs font-bold tracking-wider border ${badges[status] || badges.upcoming}`}>
        {text[status] || text.upcoming}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1419] text-white particle-bg">
      {!isConnected && (
        <div className="glass bg-orange-500/10 border border-orange-500/30 p-6 text-center text-orange-400 mx-8 mt-6 rounded-xl animate-slide-up">
          <p className="text-lg font-semibold">⚠️ Connect your wallet to create or join tournaments</p>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-black text-gradient m-0">🏆 Tournaments</h1>
          <button
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-7 py-3.5 rounded-xl font-bold hover:scale-105 hover:shadow-2xl hover:shadow-purple-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => navigate('/create-tournament')}
            disabled={!isConnected}
          >
            ✨ Create Tournament
          </button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="glass rounded-xl p-6 h-fit lg:sticky lg:top-28 animate-slide-up">
            <h3 className="mt-0 mb-6 text-xl font-semibold">Filters</h3>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-white/70 font-medium">Search</label>
              <input
                type="text"
                placeholder="Search tournaments..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full px-2.5 py-2.5 bg-white/10 border border-white/20 rounded-md text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-white/70 font-medium">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-2.5 py-2.5 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              >
                <option value="all">All Tournaments</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>


            <div className="mb-6">
              <label className="block text-sm mb-2 text-white/70 font-medium">Entry Fee Range</label>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  placeholder="Min (ETH)"
                  step="0.001"
                  min="0"
                  value={filters.minEntryFee}
                  onChange={(e) => setFilters({ ...filters, minEntryFee: e.target.value })}
                  className="w-full px-2.5 py-2.5 bg-white/10 border border-white/20 rounded-md text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                />
                <input
                  type="number"
                  placeholder="Max (ETH)"
                  step="0.001"
                  min="0"
                  value={filters.maxEntryFee}
                  onChange={(e) => setFilters({ ...filters, maxEntryFee: e.target.value })}
                  className="w-full px-2.5 py-2.5 bg-white/10 border border-white/20 rounded-md text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                />
              </div>
            </div>

            <button
              className="w-full px-2.5 py-2.5 bg-white/10 border border-white/20 rounded-md text-white hover:bg-white/15 transition-all"
              onClick={() => setFilters({ status: 'all', minEntryFee: '', maxEntryFee: '', searchTerm: '' })}
            >
              Clear Filters
            </button>
          </aside>

          <main className="min-h-[500px]">
            <div className="mb-6">
              <p className="text-white/70 text-sm">{filteredTournaments.length} tournaments found</p>
            </div>

            {filteredTournaments.length === 0 ? (
              <div className="text-center py-16 px-8 text-white/50">
                <p>No tournaments match your filters</p>
                <button
                  className="mt-4 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all"
                  onClick={() => setFilters({ status: 'all', minEntryFee: '', maxEntryFee: '', searchTerm: '' })}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
                {filteredTournaments.map((tournament, index) => (
                  <div
                    key={tournament.id}
                    className="glass rounded-2xl p-6 transition-all hover:-translate-y-2 hover:glass-strong hover:shadow-2xl hover:shadow-purple-600/30 hover:border-purple-500/50 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="m-0 text-xl font-semibold flex-1">{tournament.name}</h3>
                      {getStatusBadge(tournament.status)}
                    </div>

                    <p className="text-white/70 text-sm mb-6 leading-relaxed">{tournament.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-white/50 uppercase tracking-wider">Entry Fee</span>
                        <span className="text-base font-semibold text-white">{tournament.entryFee} ETH</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-white/50 uppercase tracking-wider">Prize Pool</span>
                        <span className="text-base font-semibold text-white">{tournament.prizePool} ETH</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-white/50 uppercase tracking-wider">Participants</span>
                        <span className="text-base font-semibold text-white">
                          {tournament.currentParticipants}/{tournament.maxParticipants}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-white/50 uppercase tracking-wider">
                          {tournament.status === 'active' ? 'Ends In' : 'Starts In'}
                        </span>
                        <span className="text-base font-semibold text-white">
                          {formatTimeRemaining(tournament.status === 'active' ? tournament.endTime : tournament.startTime)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <button
                        className="w-full px-3 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold hover:scale-105 hover:shadow-2xl hover:shadow-purple-600/50 transition-all"
                        onClick={() => navigate(`/tournament/${tournament.id}`)}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default TournamentBrowser;
