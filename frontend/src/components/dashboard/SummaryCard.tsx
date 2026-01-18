import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color?: string; // e.g. "bg-blue-500"
    loading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, color = "bg-indigo-500", loading = false }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start transition-all duration-200 hover:shadow-md">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 mr-4`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                {loading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                )}
            </div>
        </div>
    );
};

export default SummaryCard;
