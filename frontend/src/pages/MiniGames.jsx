import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

function MiniGames() {
    const { isConnected } = useAccount();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const games = [
        {
            id: 1,
            title: 'Puzzle Master',
            description: 'Test your puzzle-solving skills in this challenging brain teaser',
            category: 'puzzle',
            players: '1,234',
            image: '🧩',
            difficulty: 'Medium'
        },
        {
            id: 2,
            title: 'Speed Racer',
            description: 'Race against time in this fast-paced arcade game',
            category: 'arcade',
            players: '2,456',
            image: '🏎️',
            difficulty: 'Easy'
        },
        {
            id: 3,
            title: 'Memory Match',
            description: 'Challenge your memory with this classic matching game',
            category: 'puzzle',
            players: '3,789',
            image: '🎴',
            difficulty: 'Easy'
        },
        {
            id: 4,
            title: 'Space Shooter',
            description: 'Defend the galaxy from alien invaders',
            category: 'action',
            players: '5,123',
            image: '🚀',
            difficulty: 'Hard'
        },
        {
            id: 5,
            title: 'Word Quest',
            description: 'Find words and expand your vocabulary',
            category: 'puzzle',
            players: '987',
            image: '📝',
            difficulty: 'Medium'
        },
        {
            id: 6,
            title: 'Tower Defense',
            description: 'Build towers and defend your base from waves of enemies',
            category: 'strategy',
            players: '4,567',
            image: '🏰',
            difficulty: 'Hard'
        }
    ];

    const categories = [
        { id: 'all', label: 'All Games' },
        { id: 'puzzle', label: 'Puzzle' },
        { id: 'arcade', label: 'Arcade' },
        { id: 'action', label: 'Action' },
        { id: 'strategy', label: 'Strategy' }
    ];

    const filteredGames = selectedCategory === 'all'
        ? games
        : games.filter(game => game.category === selectedCategory);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gradient mb-4">
                        🎮 Mini Games
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Take a break and enjoy our collection of fun mini games. Play solo or compete with friends!
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-purple-600 text-white border border-purple-500'
                                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map(game => (
                        <div
                            key={game.id}
                            className="glass rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105"
                        >
                            {/* Game Icon */}
                            <div className="text-6xl mb-4 text-center">
                                {game.image}
                            </div>

                            {/* Game Info */}
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {game.title}
                            </h3>
                            <p className="text-white/60 mb-4 text-sm">
                                {game.description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <span>👥</span>
                                    <span>{game.players} players</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(game.difficulty)}`}>
                                    {game.difficulty}
                                </span>
                            </div>

                            {/* Play Button */}
                            {isConnected ? (
                                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/40 transition-all">
                                    Play Now
                                </button>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-white/60 mb-2">Sign in to play</p>
                                    <Link
                                        to="/"
                                        className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-600/40 transition-all no-underline"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* No Games Message */}
                {filteredGames.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-2xl text-white/60">
                            No games found in this category
                        </p>
                    </div>
                )}

                {/* Coming Soon Section */}
                <div className="mt-16 text-center glass rounded-2xl p-8 border border-white/10">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        More Games Coming Soon! 🎉
                    </h2>
                    <p className="text-white/70 max-w-2xl mx-auto">
                        We're constantly adding new mini games to keep you entertained.
                        Check back regularly for updates!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MiniGames;
