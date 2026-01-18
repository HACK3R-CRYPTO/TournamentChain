import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

function CreateTournament() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    entryFee: '',
    maxParticipants: '',
    startTime: '',
    endTime: '',
    prizeDistribution: { first: 50, second: 30, third: 15, others: 5 }
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePrizeChange = (position, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      prizeDistribution: { ...prev.prizeDistribution, [position]: numValue }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.entryFee || parseFloat(formData.entryFee) <= 0) newErrors.entryFee = 'Entry fee must be greater than 0';
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) < 2) newErrors.maxParticipants = 'Must allow at least 2 participants';
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    } else if (new Date(formData.startTime) <= new Date()) {
      newErrors.startTime = 'Start time must be in the future';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    const total = Object.values(formData.prizeDistribution).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.01) newErrors.prizeDistribution = 'Prize distribution must total 100%';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!validateForm()) return;
    try {
      console.log('Creating tournament:', formData);
      alert('Tournament created successfully! (Mock)');
      navigate('/tournaments');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament: ' + error.message);
    }
  };

  const calculateEstimatedPrizePool = () => {
    const entryFee = parseFloat(formData.entryFee) || 0;
    const maxParticipants = parseInt(formData.maxParticipants) || 0;
    const totalPool = entryFee * maxParticipants;
    const platformFee = totalPool * 0.05;
    const netPool = totalPool - platformFee;
    return { totalPool, platformFee, netPool };
  };

  const { totalPool, platformFee, netPool } = calculateEstimatedPrizePool();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
        <div className="max-w-2xl mx-auto my-16 text-center p-12 bg-white/5 rounded-xl border border-white/10">
          <h2 className="mb-4 text-2xl">🔒 Wallet Connection Required</h2>
          <p className="mb-6 text-white/70">Please connect your wallet to create a tournament</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-8 flex items-center gap-8">
        <button
          className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-lg hover:bg-white/15 transition-all"
          onClick={() => navigate('/tournaments')}
        >
          ← Back
        </button>
        <h1 className="m-0 text-3xl font-bold text-gradient">Create Tournament</h1>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-8 border border-white/10">
          <div className="mb-10 pb-8 border-b border-white/10">
            <h2 className="mt-0 mb-2 text-2xl font-semibold">Basic Information</h2>

            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 font-medium text-white/90">
                Tournament Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Weekly Survival Challenge"
                className={`w-full px-3.5 py-3.5 bg-white/10 border rounded-lg text-white transition-all focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 ${errors.name ? 'border-red-400' : 'border-white/20'}`}
              />
              {errors.name && <span className="block text-red-400 text-sm mt-2">{errors.name}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block mb-2 font-medium text-white/90">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your tournament..."
                rows="4"
                className={`w-full px-3.5 py-3.5 bg-white/10 border rounded-lg text-white resize-y min-h-[100px] transition-all focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 ${errors.description ? 'border-red-400' : 'border-white/20'}`}
              />
              {errors.description && <span className="block text-red-400 text-sm mt-2">{errors.description}</span>}
            </div>
          </div>

          <div className="mb-10 pb-8 border-b border-white/10">
            <h2 className="mt-0 mb-2 text-2xl font-semibold">Tournament Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="entryFee" className="block mb-2 font-medium text-white/90">
                  Entry Fee (ETH) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="entryFee"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleInputChange}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  className={`w-full px-3.5 py-3.5 bg-white/10 border rounded-lg text-white transition-all focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 ${errors.entryFee ? 'border-red-400' : 'border-white/20'}`}
                />
                {errors.entryFee && <span className="block text-red-400 text-sm mt-2">{errors.entryFee}</span>}
              </div>

              <div>
                <label htmlFor="maxParticipants" className="block mb-2 font-medium text-white/90">
                  Max Participants <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="2"
                  className={`w-full px-3.5 py-3.5 bg-white/10 border rounded-lg text-white transition-all focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 ${errors.maxParticipants ? 'border-red-400' : 'border-white/20'}`}
                />
                {errors.maxParticipants && <span className="block text-red-400 text-sm mt-2">{errors.maxParticipants}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block mb-2 font-medium text-white/90">
                  Start Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-3.5 bg-white/10 border rounded-lg text-white transition-all focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 ${errors.startTime ? 'border-red-400' : 'border-white/20'}`}
                />
                {errors.startTime && <span className="block text-red-400 text-sm mt-2">{errors.startTime}</span>}
              </div>

              <div>
                <label htmlFor="endTime" className="block mb-2 font-medium text-white/90">
                  End Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-3.5 bg-white/10 border rounded-lg text-white transition-all focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 ${errors.endTime ? 'border-red-400' : 'border-white/20'}`}
                />
                {errors.endTime && <span className="block text-red-400 text-sm mt-2">{errors.endTime}</span>}
              </div>
            </div>
          </div>

          <div className="mb-10 pb-8 border-b border-white/10">
            <h2 className="mt-0 mb-2 text-2xl font-semibold">Prize Distribution</h2>
            <p className="text-white/60 text-sm mb-6">
              Set the percentage of the prize pool each place receives (must total 100%)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {['first', 'second', 'third', 'others'].map((pos, i) => (
                <div key={pos} className="flex flex-col gap-2">
                  <label className="text-sm text-white/70">
                    {i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : 'Others'} Place (%)
                  </label>
                  <input
                    type="number"
                    value={formData.prizeDistribution[pos]}
                    onChange={(e) => handlePrizeChange(pos, e.target.value)}
                    min="0"
                    max="100"
                    className="px-3 py-3 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
              ))}
            </div>

            {errors.prizeDistribution && (
              <span className="block text-red-400 text-sm">{errors.prizeDistribution}</span>
            )}

            <div className="bg-purple-600/10 border border-purple-600/30 p-4 rounded-lg text-center mt-4">
              <p className="m-0 font-semibold text-lg">
                Total: {Object.values(formData.prizeDistribution).reduce((sum, val) => sum + val, 0)}%
              </p>
            </div>
          </div>

          <div className="bg-purple-600/5 p-6 rounded-lg border border-purple-600/20 mb-8">
            <h2 className="mt-0 mb-2 text-2xl font-semibold">Estimated Prize Pool</h2>
            <div className="mb-6">
              <div className="flex justify-between py-3 border-b border-white/10">
                <span>Entry Fee × Max Participants</span>
                <span className="font-semibold text-cyan-400">{totalPool.toFixed(4)} ETH</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/10">
                <span>Platform Fee (5%)</span>
                <span className="font-semibold text-cyan-400">- {platformFee.toFixed(4)} ETH</span>
              </div>
              <div className="flex justify-between py-3 pt-4 border-t-2 border-purple-600/50 font-bold text-lg">
                <span>Net Prize Pool</span>
                <span className="text-cyan-400">{netPool.toFixed(4)} ETH</span>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Prize Breakdown</h3>
              {[
                { emoji: '🥇', label: '1st Place', key: 'first' },
                { emoji: '🥈', label: '2nd Place', key: 'second' },
                { emoji: '🥉', label: '3rd Place', key: 'third' },
                { emoji: '🏆', label: 'Others', key: 'others' }
              ].map(({ emoji, label, key }) => (
                <div key={key} className="flex justify-between py-2.5 text-white/90">
                  <span>{emoji} {label} ({formData.prizeDistribution[key]}%)</span>
                  <span>{(netPool * formData.prizeDistribution[key] / 100).toFixed(4)} ETH</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-end pt-8 border-t border-white/10">
            <button
              type="button"
              className="px-8 py-3.5 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/15 transition-all"
              onClick={() => navigate('/tournaments')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-w-[200px] px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTournament;
