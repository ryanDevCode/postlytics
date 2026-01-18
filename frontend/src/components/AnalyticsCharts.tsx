import {
    BarChart,
    Bar,
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

interface AnalyticsData {
    daily_posts: { date: string; count: number }[];
    top_hashtags: { name: string; count: number }[];
}

interface AnalyticsChartsProps {
    data: AnalyticsData;
    onHashtagClick?: (hashtag: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function AnalyticsCharts({ data, onHashtagClick }: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Daily Posts (Last 7 Days)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.daily_posts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Posts" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Hashtags</h3>
                <div className="h-64">
                    {data?.top_hashtags?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.top_hashtags}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    onClick={(data) => onHashtagClick && onHashtagClick(data.name)}
                                    cursor="pointer"
                                >
                                    {data.top_hashtags.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">No hashtags yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnalyticsCharts;
