interface HashtagFilterProps {
    hashtags: { name: string; count: number }[];
    selectedHashtag: string | null;
    onSelectHashtag: (tag: string | null) => void;
}

function HashtagFilter({ hashtags, selectedHashtag, onSelectHashtag }: HashtagFilterProps) {
    if (hashtags.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Filter by Hashtag</h3>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onSelectHashtag(null)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedHashtag === null
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    All
                </button>
                {hashtags.map((tag) => (
                    <button
                        key={tag.name}
                        onClick={() => onSelectHashtag(tag.name)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedHashtag === tag.name
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        #{tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default HashtagFilter;
