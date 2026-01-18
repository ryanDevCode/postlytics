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
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow">
            {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
            <textarea
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
            />
            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
}

export default CreatePostForm;
