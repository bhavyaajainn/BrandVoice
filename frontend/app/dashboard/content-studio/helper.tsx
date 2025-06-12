import { Platform } from "./types";

export const ErrorImage=()=>{
  return(
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
              </div>
  )
}

export const sampleAssets = {
  image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
  video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  gif: "https://media.giphy.com/media/xT9DPIBYf0pAviBLzO/giphy.gif",
  carousel: [
      "https://images.unsplash.com/photo-1470058869958-2a77ade41c02",
      "https://images.unsplash.com/photo-1542728928-0011f81446e5",
      "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f"
  ]
};

export const getInitialPlatformData = (platform: Platform) => {
  if (platform === 'YouTube') {
      return {
          title: "Top 5 Indoor Plants to Boost Productivity 🌱",
          description: "Explore the best indoor plants for your home office.\n#IndoorPlants #ProductivityBoost",
          tags: ["IndoorPlants", "PlantCare", "WorkFromHome"],
          videoUrl: sampleAssets.video,
          thumbnailUrl: sampleAssets.image,
          categoryId: "26",  // How-to & Style
          privacyStatus: "public" as const,
          playlistId: "PLf1XPHghri"
      };
  } else if (platform === 'Instagram') {
      return {
          mentions: ["@plantlovers", "@urbanjungle"]
      };
  } else if (platform === 'Facebook') {
      return {
          taggedPages: ["@GreenRoots"],
          privacy: "Public" as const,
          linkUrl: "https://yourstore.com/indoor-plants"
      };
  } else {
      return {
          mentions: ["@plant_hub"],
          poll: undefined,
          quoteTweetId: undefined
      };
  }
};

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

export const moodboardImages = [
  {
      id: 'modern-minimalist',
      url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45',
      title: 'Modern Minimalist'
  },
  {
      id: 'natural-elegance',
      url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7',
      title: 'Natural Elegance'
  },
  {
      id: 'organic-design',
      url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411',
      title: 'Organic Design'
  },
  {
      id: 'contemporary-green',
      url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      title: 'Contemporary Green'
  },
  {
      id: 'botanical-luxury',
      url: 'https://images.unsplash.com/photo-1505066211281-ed125c006f4c',
      title: 'Botanical Luxury'
  }
];

export const colorPalette = [
  { name: 'Primary', hex: '#174D7C' },
  { name: 'Secondary', hex: '#4C7D8E' },
  { name: 'Text', hex: '#1F2937' },
  { name: 'Subtext', hex: '#6B7280' },
  { name: 'Accent', hex: '#3B82F6' },
  { name: 'Success', hex: '#10B981' },
  { name: 'Warning', hex: '#F59E0B' },
  { name: 'Error', hex: '#EF4444' }
];

export const typographyStyles = [
  {
      category: 'Headings',
      styles: [
          { name: 'H1', font: 'Playfair Display', size: '36px', weight: '700', lineHeight: '1.2' },
          { name: 'H2', font: 'Playfair Display', size: '30px', weight: '700', lineHeight: '1.3' },
          { name: 'H3', font: 'Playfair Display', size: '24px', weight: '600', lineHeight: '1.4' }
      ]
  },
  {
      category: 'Body',
      styles: [
          { name: 'Large', font: 'Inter', size: '18px', weight: '400', lineHeight: '1.6' },
          { name: 'Regular', font: 'Inter', size: '16px', weight: '400', lineHeight: '1.5' },
          { name: 'Small', font: 'Inter', size: '14px', weight: '400', lineHeight: '1.5' }
      ]
  },
  {
      category: 'UI Elements',
      styles: [
          { name: 'Button', font: 'Montserrat', size: '16px', weight: '600', lineHeight: '1' },
          { name: 'Caption', font: 'Inter', size: '12px', weight: '400', lineHeight: '1.4' },
          { name: 'Label', font: 'Inter', size: '14px', weight: '500', lineHeight: '1' }
      ]
  }
];

export const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
};