
export const ErrorImage=()=>{
  return(
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
              </div>
  )
}

export const faqs = [
  {
      id: 'content-generation',
      question: "How does the content generation work?",
      answer: "Our AI analyzes your brand preferences and creates tailored content that matches your style and tone while maintaining brand consistency."
  },
  {
      id: 'edit-content',
      question: "Can I edit the generated content?",
      answer: "Yes, all generated content is fully editable. You can modify text, images, and video scripts to perfectly match your needs."
  },
  {
      id: 'supported-formats',
      question: "What formats are supported?",
      answer: "We support various content formats including images, videos, and text posts optimized for different social media platforms."
  }
];

export const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
};