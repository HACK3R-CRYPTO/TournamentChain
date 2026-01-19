import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { caipAddress } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (caipAddress && isConnected) {
      // Extract email or identifier from CAIP address
      // CAIP format: eip155:1:0x... or email format
      const parts = caipAddress.split(':');
      if (parts.length > 2) {
        const identifier = parts[parts.length - 1];
        // Check if it looks like an email
        if (identifier.includes('@')) {
          setDisplayName(identifier);
        } else if (identifier.startsWith('0x')) {
          // It's a wallet address, format it
          setDisplayName(`${identifier.slice(0, 6)}...${identifier.slice(-4)}`);
        } else {
          // Use the identifier as-is (might be a username)
          setDisplayName(identifier);
        }
      } else if (address) {
        // Fallback to formatted address
        setDisplayName(`${address.slice(0, 6)}...${address.slice(-4)}`);
      }
    }
  }, [caipAddress, address, isConnected]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tournaments', label: 'Tournaments' },
    { path: '/mini-games', label: 'Mini Games' },
    { path: '/my-tournaments', label: 'My Tournaments' },
    { path: '/leaderboard', label: 'Leaderboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-4">
      <div className="max-w-[80%] mx-auto bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold transition-transform hover:scale-105 no-underline">
            <span className="text-3xl">⚡</span>
            <span className="text-gradient hidden sm:inline">GameArena</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 rounded-lg font-medium transition-all no-underline ${isActivePath(link.path)
                  ? 'text-white bg-white/10 border border-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 glass px-3 py-2 rounded-lg border border-white/10">
                  <span className="font-mono text-cyan-400 font-medium text-xs">
                    {displayName || formatAddress(address)}
                  </span>
                  <button
                    className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-500/30 transition-all"
                    onClick={() => disconnect()}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-600/40 transition-all"
                onClick={() => open()}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-[80%] mx-auto bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col gap-2 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 rounded-lg font-semibold transition-all no-underline ${isActivePath(link.path)
                  ? 'text-white bg-purple-600/20 border border-purple-600/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {isConnected ? (
            <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-lg border border-white/10">
              <span className="font-mono text-cyan-400 font-semibold text-sm">
                {displayName || formatAddress(address)}
              </span>
              <button
                className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-500/30 transition-all"
                onClick={() => {
                  disconnect();
                  setMobileMenuOpen(false);
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/40 transition-all"
              onClick={() => {
                open();
                setMobileMenuOpen(false);
              }}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navigation;
