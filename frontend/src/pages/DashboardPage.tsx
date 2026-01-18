import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AnalyticsCharts from '../components/AnalyticsCharts';

function DashboardPage() {
    const navigate = useNavigate();
    const [analyticsData, setAnalyticsData] = useState<{ daily_posts: any[], top_hashtags: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const analyticsResponse = await api.get('/analytics');
            setAnalyticsData(analyticsResponse.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChartClick = (hashtag: string) => {
        // Redirect to posts page with filter
        navigate(`/posts?hashtag=${hashtag}`);
    };

    return (
        <div className="page-dashboard w-full">
            <h1 className="page-title text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            {loading && <div className="loading-state text-center py-10">Loading analytics...</div>}

            {analyticsData && (
                <div className="dashboard-content space-y-8">
                    <AnalyticsCharts data={analyticsData} onHashtagClick={handleChartClick} />

                    <div className="dashboard-cta bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium text-indigo-900 mb-2">Ready to contribute?</h3>
                        <p className="text-indigo-700 mb-4">Jump into the conversation and start posting.</p>
                        <button
                            onClick={() => navigate('/posts')}
                            className="btn-go-to-feed bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Go to Feed
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;