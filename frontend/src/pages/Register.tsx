import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      navigate('/login');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF2F2] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-[#7F1D1D]/10">
        <h1 className="text-2xl font-bold text-[#1F2937] mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <div className="bg-[#DC2626]/10 border border-[#DC2626] text-[#DC2626] px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#1F2937]/60 text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] text-[#1F2937] border border-[#7F1D1D]/20 focus:outline-none focus:border-[#7F1D1D]"
            />
          </div>

          <div>
            <label className="block text-[#1F2937]/60 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] text-[#1F2937] border border-[#7F1D1D]/20 focus:outline-none focus:border-[#7F1D1D]"
            />
          </div>

          <div>
            <label className="block text-[#1F2937]/60 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 rounded bg-[#FEF2F2] text-[#1F2937] border border-[#7F1D1D]/20 focus:outline-none focus:border-[#7F1D1D]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7F1D1D] hover:bg-[#991B1B] text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-[#1F2937]/60 text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#DC2626] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;