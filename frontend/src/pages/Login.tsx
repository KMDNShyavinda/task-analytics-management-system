import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF2F2] dark:bg-[#1C0808] flex items-center justify-center px-4 relative transition-colors duration-200">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-[#2D1212] border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 text-[#1F2937] dark:text-[#FEF2F2] hover:bg-[#7F1D1D]/10 dark:hover:bg-[#7F1D1D]/20 transition-all duration-200"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.066.066A5.002 5.002 0 0112 17a5.002 5.002 0 01-3.232-1.228l-.066-.066z" />
          </svg>
        )}
      </button>

      <div className="bg-white dark:bg-[#2D1212] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#7F1D1D]/10 dark:border-[#7F1D1D]/30 transition-all duration-200">
        <h1 className="text-2xl font-bold text-[#1F2937] dark:text-[#FEF2F2] mb-6 text-center">
          Welcome Back
        </h1>

        {error && (
          <div className="bg-[#DC2626]/10 border border-[#DC2626] text-[#DC2626] px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none focus:border-[#7F1D1D] dark:focus:border-[#DC2626] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] dark:bg-[#1C0808] text-[#1F2937] dark:text-[#FEF2F2] border border-[#7F1D1D]/20 dark:border-[#7F1D1D]/40 focus:outline-none focus:border-[#7F1D1D] dark:focus:border-[#DC2626] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7F1D1D] hover:bg-[#991B1B] text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-[#1F2937]/60 dark:text-[#FEF2F2]/60 text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#DC2626] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;