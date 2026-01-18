import React from 'react';
import { Search, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';

interface DashboardFiltersProps {
    startDate: string;
    endDate: string;
    hashtag: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onHashtagChange: (tag: string) => void;
    onSearch: () => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    startDate,
    endDate,
    hashtag,
    onStartDateChange,
    onEndDateChange,
    onHashtagChange,
    onSearch,
}) => {
    // Convert string ISO dates to Date objects for the picker
    const start = new Date(startDate);
    const end = new Date(endDate);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <DatePicker
                        selected={start}
                        onChange={(date: Date | null) => {
                            if (date) onStartDateChange(date.toISOString().split('T')[0]);
                        }}
                        selectsStart
                        startDate={start}
                        endDate={end}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border px-3 cursor-pointer"
                        dateFormat="MMM d, yyyy"
                    />
                </div>
                <span className="self-center text-gray-400 font-medium">to</span>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <DatePicker
                        selected={end}
                        onChange={(date: Date | null) => {
                            if (date) onEndDateChange(date.toISOString().split('T')[0]);
                        }}
                        selectsEnd
                        startDate={start}
                        endDate={end}
                        minDate={start}
                        maxDate={new Date()}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border px-3 cursor-pointer"
                        dateFormat="MMM d, yyyy"
                    />
                </div>
            </div>

            <div className="flex w-full md:w-auto gap-2 items-center">
                <div className="relative rounded-md shadow-sm w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={hashtag}
                        onChange={(e) => onHashtagChange(e.target.value)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border"
                        placeholder="Filter by hashtag..."
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                </div>
                <button
                    onClick={onSearch}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default DashboardFilters;
