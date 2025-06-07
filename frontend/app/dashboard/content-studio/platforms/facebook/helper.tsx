import { FacebookPost } from "../../types";
import Image from 'next/image';

export const Link = (
  post: FacebookPost,
  onInputChange: (field: keyof FacebookPost, value: any) => void
) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Link URL
      </label>
      <input
        type="url"
        value={post.linkUrl || ""}
        onChange={(e) => onInputChange("linkUrl", e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="https://example.com"
      />
    </div>
  );
};

export const Media = (
  post: FacebookPost,
  onDrop: (e: React.DragEvent) => void,
  onDragOver: (e: React.DragEvent) => void,
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  renderUploadPreview: () => React.ReactNode,
  imageError: boolean
) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Media
      </label>
      <div
        className={`mt-1 border-2 border-dashed rounded-lg ${
          imageError ? "border-red-500" : "border-gray-300"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => {
          const input = document.getElementById("file-input");
          if (input) {
            input.click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={onFileUpload}
          accept={post.mediaType === "video" ? "video/*" : "image/*"}
          multiple={false}
        />
        {renderUploadPreview()}
      </div>
    </div>
  );
};

export const MediaVideo=(post: FacebookPost)=>{
    return(
        <div className="w-full aspect-video relative">
                        <iframe
                            src={post.mediaUrls[0]}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
    )
}

export const MediaLink=(post: FacebookPost)=>{
    return(
        <div className="w-full p-4 bg-gray-50 border-t border-b border-gray-200">
                        <a 
                            href={post.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="flex-1">
                                <p className="text-[#1877F2] font-medium">{post.linkUrl}</p>
                                <p className="text-sm text-gray-500 truncate">Visit our store</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div> 
    )
}

export const MediaDefault=(post: FacebookPost, setImageError: (error: boolean) => void)=>{
    return(
        <div className="relative w-full aspect-video">
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