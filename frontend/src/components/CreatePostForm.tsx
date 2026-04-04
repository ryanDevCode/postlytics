import { useState } from 'react';
import api from '../api/axios';

interface CreatePostFormProps {
    onPostCreated: (post: any) => void;
}

function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setLoading(true);
            setError('');
            const response = await api.post('/posts', { post: { content } });
            onPostCreated(response.data);
            setContent('');
        } catch (err) {
            console.error('Failed to create post:', err);
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">{error}</div>}
            <textarea
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors"
                rows={3}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
            />
            <div className="flex justify-end mt-3">
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-5 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium text-sm transition-colors"
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
}

export default CreatePostForm;
