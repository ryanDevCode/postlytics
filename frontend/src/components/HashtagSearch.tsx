import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface HashtagSearchProps {
    onSearch: (tag: string) => void;
    availableHashtags: string[];
}

function HashtagSearch({ onSearch, availableHashtags }: HashtagSearchProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = availableHashtags.filter(tag =>
                tag.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [query, availableHashtags]);

    // Handle clicking outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (tag: string) => {
        setQuery(tag);
        onSearch(tag);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(query);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-md" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search by hashtag..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={18} />
                </div>
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((tag) => (
                        <li
                            key={tag}
                            onClick={() => handleSelect(tag)}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
                        >
                            #{tag}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HashtagSearch;
