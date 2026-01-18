import { useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { Maximize2, X, BarChart2, TrendingUp, Activity } from 'lucide-react';

interface AnalyticsData {
    daily_posts: { date: string; count: number }[];
    top_hashtags: { name: string; count: number }[];
}

interface AnalyticsChartsProps {
    data: AnalyticsData;
    onHashtagClick?: (hashtag: string) => void;
}

// Updated Palette for better contrast
// Posts: Blue, Comments: Emerald Green
const CHART_COLORS = {
    posts: '#3B82F6',
    comments: '#10B981',
};

// Pie Chart Colors
const PIE_COLORS = ['#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#2563EB'];

type ChartType = 'bar' | 'line' | 'area';

function AnalyticsCharts({ data, onHashtagClick }: AnalyticsChartsProps) {
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

    const toggleSeries = (dataKey: string) => {
        setHiddenSeries(prev =>
            prev.includes(dataKey)
                ? prev.filter(k => k !== dataKey)
                : [...prev, dataKey]
        );
    };

    const formatXAxisResult = (str: string) => {
        const d = new Date(str);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    };

    const formatModalXAxis = (str: string) => {
        return new Date(str).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderChart = (isModal = false) => {
        const commonProps = {
            data: data.daily_posts,
            margin: { top: 10, right: 30, left: 0, bottom: 0 },
        };

        const XAxisProps = {
            dataKey: "date",
            tick: { fontSize: isModal ? 12 : 11, fill: '#6b7280' },
            tickFormatter: isModal ? formatModalXAxis : formatXAxisResult,
        };

        const YAxisProps = {
            tick: { fontSize: isModal ? 12 : 11, fill: '#6b7280' },
            allowDecimals: false
        };

        const TooltipProps = {
            contentStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
            cursor: { fill: '#f3f4f6' },
            labelFormatter: (label: string) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };

        const LegendProps = {
            onClick: (e: any) => toggleSeries(e.dataKey),
            wrapperStyle: { cursor: 'pointer', userSelect: 'none' as const }
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis {...XAxisProps} />
                        <YAxis {...YAxisProps} />
                        <Tooltip {...TooltipProps} />
                        <Legend {...LegendProps} />
                        <Line hide={hiddenSeries.includes('posts')} type="monotone" dataKey="posts" name="Posts" stroke={CHART_COLORS.posts} strokeWidth={isModal ? 3 : 2} dot={isModal} activeDot={{ r: 6 }} />
                        <Line hide={hiddenSeries.includes('comments')} type="monotone" dataKey="comments" name="Comments" stroke={CHART_COLORS.comments} strokeWidth={isModal ? 3 : 2} dot={isModal} activeDot={{ r: 6 }} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.posts} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={CHART_COLORS.posts} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.comments} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={CHART_COLORS.comments} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis {...XAxisProps} />
                        <YAxis {...YAxisProps} />
                        <Tooltip {...TooltipProps} />
                        <Legend {...LegendProps} />
                        <Area hide={hiddenSeries.includes('posts')} type="monotone" dataKey="posts" name="Posts" stroke={CHART_COLORS.posts} fillOpacity={1} fill="url(#colorPosts)" />
                        <Area hide={hiddenSeries.includes('comments')} type="monotone" dataKey="comments" name="Comments" stroke={CHART_COLORS.comments} fillOpacity={1} fill="url(#colorComments)" />
                    </AreaChart>
                );
            case 'bar':
            default:
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis {...XAxisProps} />
                        <YAxis {...YAxisProps} />
                        <Tooltip {...TooltipProps} cursor={{ fill: 'transparent' }} />
                        <Legend {...LegendProps} />
                        <Bar hide={hiddenSeries.includes('posts')} dataKey="posts" name="Posts" fill={CHART_COLORS.posts} radius={[4, 4, 0, 0]} />
                        <Bar hide={hiddenSeries.includes('comments')} dataKey="comments" name="Comments" fill={CHART_COLORS.comments} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Daily Activity Chart */}
                <div className="bg-white rounded-xl min-w-0">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">Daily Activity</h3>
                        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setChartType('bar')}
                                className={`p-1.5 rounded-md transition-all cursor-pointer ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                title="Bar Chart"
                            >
                                <BarChart2 size={16} />
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={`p-1.5 rounded-md transition-all cursor-pointer ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                title="Line Chart"
                            >
                                <TrendingUp size={16} />
                            </button>
                            <button
                                onClick={() => setChartType('area')}
                                className={`p-1.5 rounded-md transition-all cursor-pointer ${chartType === 'area' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                title="Area Chart"
                            >
                                <Activity size={16} />
                            </button>
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                                title="Expand View"
                            >
                                <Maximize2 size={16} className="cursor-pointer" />
                            </button>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Hashtags Chart */}
                <div className="bg-white rounded-xl min-w-0">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">Top Hashtags</h3>
                    <div className="h-72 w-full flex justify-center">
                        {data?.top_hashtags?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.top_hashtags}
                                        cx="40%"
                                        cy="50%"
                                        innerRadius={0}
                                        outerRadius={80}
                                        paddingAngle={0}
                                        dataKey="count"
                                        onClick={(data) => onHashtagClick && onHashtagClick(data.name)}
                                        cursor="pointer"
                                    >
                                        {data.top_hashtags.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        wrapperStyle={{ fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <span className="text-3xl md:text-4xl mb-2">#</span>
                                <span className="text-xs md:text-sm">No hashtag data available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Chart Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Daily Activity Analysis</h2>
                                <p className="text-sm text-gray-500">Detailed view of posts and comments over time</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setChartType('bar')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        Bar
                                    </button>
                                    <button
                                        onClick={() => setChartType('line')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        Line
                                    </button>
                                    <button
                                        onClick={() => setChartType('area')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${chartType === 'area' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        Area
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                {renderChart(true)}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AnalyticsCharts;
