import { FacebookPost } from "../../types";
import Image from 'next/image';

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