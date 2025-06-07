import Image from "next/image";
import { InstagramPost, Post } from "../../types";

export const MediaVideo = (post: InstagramPost) => {
  return (
    <div className="w-full h-full relative">
      <iframe
        src={post.mediaUrls[0] || ""}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 to-transparent" />
    </div>
  );
};

export const MediaCarousel = (
  post: InstagramPost,
  currentCarouselIndex: number,
  setCurrentCarouselIndex: (index: number) => void,
  setImageError: (error: boolean) => void
) => {
  return (
    <div className="relative w-full aspect-square">
      {post.mediaUrls[currentCarouselIndex] && (
        <Image
          src={post.mediaUrls[currentCarouselIndex]}
          alt={`Slide ${currentCarouselIndex + 1}`}
          width={500}
          height={500}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          unoptimized
        />
      )}
      {post.mediaUrls.length > 1 && (
        <>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentCarouselIndex(Math.max(0, currentCarouselIndex - 1));
              }}
              className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
              style={{
                visibility: currentCarouselIndex === 0 ? "hidden" : "visible",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentCarouselIndex(
                  Math.min(post.mediaUrls.length - 1, currentCarouselIndex + 1)
                );
              }}
              className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
              style={{
                visibility:
                  currentCarouselIndex === post.mediaUrls.length - 1
                    ? "hidden"
                    : "visible",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1">
            {post.mediaUrls.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCarouselIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentCarouselIndex ? "bg-blue-500" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const MediaDefault=(post: InstagramPost, setImageError: (error: boolean) => void)=>{
    return(
        <div className="relative w-full h-full">
        {post.mediaUrls[0] ? (
          <Image
            src={post.mediaUrls[0]}
            alt="Post image"
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">No image selected</p>
          </div>
        )}
      </div>   
    )
}

export const hasMentions = (post: Post): post is InstagramPost => {
    return "mentions" in post;
  };