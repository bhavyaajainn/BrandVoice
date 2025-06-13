import { XPost } from "../../types";
import Image from 'next/image';

export const renderPoll = (
  post: XPost,
  selectedPollOption: number | null,
  setSelectedPollOption: (index: number) => void
) => {
  if (!post.poll) return null;

  const totalVotes = 100; // Mock total votes
  const mockVotes =
    post.poll?.options?.map(
      (_, index) =>
        Math.floor(totalVotes / (post.poll?.options?.length || 1)) +
        (index === 0 ? totalVotes % (post.poll?.options?.length || 1) : 0)
    ) || [];

  return (
    <div className="mt-3 space-y-2 px-3 pb-3">
      {post.poll?.options?.map((option, index) => {
        const percentage = mockVotes[index];
        return (
          <button
            key={index}
            onClick={() => setSelectedPollOption(index)}
            className={`w-full text-left ${
              selectedPollOption !== null
                ? "cursor-default"
                : "hover:bg-gray-50"
            }`}
            disabled={selectedPollOption !== null}
          >
            <div className="relative">
              <div
                className={`absolute inset-0 ${
                  selectedPollOption === index
                    ? "bg-[#1D9BF0]/20"
                    : "bg-gray-100"
                } rounded-full transition-all duration-200 ease-in-out`}
                style={{ width: `${percentage}%` }}
              />
              <div className="relative px-4 py-2 flex justify-between items-center">
                <span className="font-medium">{option}</span>
                {selectedPollOption !== null && (
                  <span className="text-gray-500 ml-2">{percentage}%</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
      <div className="flex items-center text-sm text-gray-500 mt-2">
        {selectedPollOption !== null ? (
          <>
            <span className="font-medium text-black">{totalVotes}</span>
            <span className="ml-1">votes</span>
            <span className="mx-1">•</span>
            <span>Final results</span>
          </>
        ) : (
          <>
            <span>{Math.floor(post.poll.durationMinutes / 1440)}</span>
            <span className="ml-1">
              {post.poll.durationMinutes === 1440 ? "day" : "days"}
            </span>
            <span className="ml-1">left</span>
          </>
        )}
      </div>
    </div>
  );
};

export const MediaVideo = (post: XPost) => {
  return (
    <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
      <iframe
        src={post.mediaUrls[0]}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export const MediaDefault = (post: XPost, setImageError: (error: boolean) => void) => {  
    let gridClass = 'grid-cols-2';
    if (post.mediaUrls.length === 1) gridClass = 'grid-cols-1';
    else if (post.mediaUrls.length === 2) gridClass = 'grid-cols-2';
    else if (post.mediaUrls.length === 3) gridClass = 'grid-cols-2';

    return (
        <div className={`grid ${gridClass} gap-0.5 rounded-2xl overflow-hidden`}>
            {post.mediaUrls.map((url, index) => (
                <div key={index} className={`relative ${
                    post.mediaUrls.length === 3 && index === 0 ? 'col-span-2' : ''
                }`}>
                    <div className="aspect-square relative">
                        <Image
                            src={url}
                            alt={`Media ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                            unoptimized
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
