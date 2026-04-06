import { useState, useEffect } from 'react';
import api from '../api/axios';
import AnalyticsCharts from '../components/AnalyticsCharts';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import { MessageSquare, Hash, FileText, TrendingUp } from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';

function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [hashtag, setHashtag] = useState('');

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {
                start_date: startDate,
                end_date: endDate,
                hashtag: hashtag,
            };
            const response = await api.get('/analytics', { params });
            setAnalyticsData(response.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleHashtagClick = (clickedHashtag: string) => {
        setHashtag(clickedHashtag);
        // Auto-fetch with new hashtag
        setTimeout(() => fetchData(), 0);
    };

    // Compute some derived stats
    const totalPosts = analyticsData?.totals?.posts ?? 0;
    const totalComments = analyticsData?.totals?.comments ?? 0;
    const totalHashtags = analyticsData?.totals?.hashtags ?? 0;
    const engagementRate = totalPosts > 0
        ? ((totalComments / totalPosts) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="w-full px-4 lg:px-6 py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                <div className="text-sm text-gray-500">
                    Deep dive into your content performance
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Posts"
                    value={totalPosts}
                    icon={FileText}
                    color="bg-blue-500"
                    loading={loading}
                />
                <SummaryCard
                    title="Total Comments"
                    value={totalComments}
                    icon={MessageSquare}
                    color="bg-emerald-500"
                    loading={loading}
                />
                <SummaryCard
                    title="Active Hashtags"
                    value={totalHashtags}
                    icon={Hash}
                    color="bg-amber-500"
                    loading={loading}
                />
                <SummaryCard
                    title="Engagement Rate"
                    value={`${engagementRate}%`}
                    icon={TrendingUp}
                    color="bg-purple-500"
                    loading={loading}
                />
            </div>

            {/* Charts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {analyticsData && (
                    <AnalyticsCharts
                        data={{
                            daily_posts: analyticsData.daily_stats,
                            top_hashtags: analyticsData.top_hashtags,
                        }}
                        onHashtagClick={handleHashtagClick}
                    />
                )}
                {loading && !analyticsData && (
                    <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
                )}
            </div>

            {/* Top Hashtags Table */}
            {analyticsData?.top_hashtags?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Hashtag Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Rank</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Hashtag</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Posts</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData.top_hashtags.map((tag: { name: string; count: number }, i: number) => {
                                    const maxCount = analyticsData.top_hashtags[0]?.count || 1;
                                    const pct = ((tag.count / maxCount) * 100).toFixed(0);
                                    return (
                                        <tr key={tag.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-gray-400 font-medium">{i + 1}</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleHashtagClick(tag.name)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                                >
                                                    #{tag.name}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{tag.count}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                                                        <div
                                                            className="h-full bg-indigo-500 rounded-full"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500">{pct}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalyticsPage;
