import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirmation) {
            return setError('Passwords do not match');
        }

        try {
            setLoading(true);
            await signup({ email, password, password_confirmation: passwordConfirmation });
            navigate('/dashboard');
        } catch (err: any) {
            // Simple error handling, could be improved based on backend response structure
            const backendMessage = err.response?.data?.message;
            const backendErrors = err.response?.data?.errors;
            let errorMessage = 'Failed to create an account';

            if (backendMessage) {
                errorMessage = backendMessage;
            } else if (Array.isArray(backendErrors)) {
                errorMessage = backendErrors.join(', ');
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
                {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="passwordConfirmation"
                            type="password"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;