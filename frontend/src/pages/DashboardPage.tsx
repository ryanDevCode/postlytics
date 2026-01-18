import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AnalyticsCharts from '../components/AnalyticsCharts';
import SummaryCard from '../components/dashboard/SummaryCard';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import DashboardTables from '../components/dashboard/DashboardTables';
import { MessageSquare, Hash, FileText } from 'lucide-react';

function DashboardPage() {
    const navigate = useNavigate();
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [hashtag, setHashtag] = useState('');

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only fetch on mount

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {
                start_date: startDate,
                end_date: endDate,
                hashtag: hashtag
            };
            const analyticsResponse = await api.get('/analytics', { params });
            setAnalyticsData(analyticsResponse.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleChartClick = (clickedHashtag: string) => {
        setHashtag(clickedHashtag);
    };

    return (
        <div className="page-dashboard w-full px-4 lg:px-6 py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Real-time insights for your content
                </div>
            </div>

            {/* Filters */}
            <DashboardFilters
                startDate={startDate}
                endDate={endDate}
                hashtag={hashtag}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onHashtagChange={setHashtag}
                onSearch={handleSearch}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Posts"
                    value={analyticsData?.totals?.posts ?? 0}
                    icon={FileText}
                    color="bg-blue-500"
                    loading={loading}
                />
                <SummaryCard
                    title="Total Comments"
                    value={analyticsData?.totals?.comments ?? 0}
                    icon={MessageSquare}
                    color="bg-emerald-500"
                    loading={loading}
                />
                <SummaryCard
                    title="Active Hashtags"
                    value={analyticsData?.totals?.hashtags ?? 0}
                    icon={Hash}
                    color="bg-amber-500"
                    loading={loading}
                />
            </div>

            {/* Charts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {/* Reusing existing component but passing new data structure */}
                {analyticsData && (
                    <AnalyticsCharts
                        data={{
                            daily_posts: analyticsData.daily_stats,
                            top_hashtags: analyticsData.top_hashtags
                        }}
                        onHashtagClick={handleChartClick}
                    />
                )}
                {loading && !analyticsData && <div className="h-64 animate-pulse bg-gray-100 rounded-lg"></div>}
            </div>

            {/* Tables */}
            <DashboardTables
                posts={analyticsData?.posts || []}
                comments={analyticsData?.comments || []}
                postsMeta={analyticsData?.posts_meta}
                commentsMeta={analyticsData?.comments_meta}
                loading={loading}
            />

            <div className="text-center pt-8 pb-4">
                <button
                    onClick={() => navigate('/posts')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                >
                    View Main Feed &rarr;
                </button>
            </div>
        </div>
    );
}

export default DashboardPage;