import {
    Brain,
    Target,
    BarChart3,
    Globe,
    Layers,
    Cpu,
    Eye,
    Calendar,
    MessageSquare,
} from "lucide-react"
import { ContentItem } from "./types";

export const features = [
    {
        icon: <Brain className="w-6 h-6" />,
        title: "AI Content Generation",
        description: "Create personalized content that resonates with your audience using advanced AI algorithms",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: "Multi-Platform Optimization",
        description: "Automatically adapt content for different platforms with optimized formatting and tone",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Real-Time Analytics",
        description: "Get instant insights and performance metrics to optimize your marketing strategy",
        color: "bg-violet-50 text-violet-600",
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "Global Reach",
        description: "Scale your content across multiple markets with localization and cultural adaptation",
        color: "bg-orange-50 text-orange-600",
    },
]

export const team = [
    {
        name: "Bhavya Jain",
        role: "Frontend Developer",
        initial: "BJ",
        color: "bg-blue-100 text-blue-700",
        socials: [
            {
                link: "https://www.linkedin.com/in/alex-rivera-0000000000000000000000000000000000000000/",
            },
        ],
    },
    {
        name: "Rohan Singla",
        role: "Frontend Developer",
        initial: "RS",
        color: "bg-emerald-100 text-emerald-700",
        socials: [
            {
                link: "https://www.linkedin.com/in/alex-rivera-0000000000000000000000000000000000000000/",
            },
        ],
    },
    {
        name: "Athul B",
        role: "Backend Developer",
        initial: "AB",
        color: "bg-violet-100 text-violet-700",
        socials: [
            {
                link: "https://www.linkedin.com/in/alex-rivera-0000000000000000000000000000000000000000/",
            },
        ],
    },
    {
        name: "Nikhil Chukka",
        role: "Backend Developer",
        initial: "NC",
        color: "bg-violet-100 text-violet-700",
        socials: [
            {
                link: "https://www.linkedin.com/in/alex-rivera-0000000000000000000000000000000000000000/",
            },
        ],
    },
]

export const timeline = [
    {
        quarter: "Phase 1",
        title: "Core AI Engine",
        description: "Advanced content generation with personalization algorithms",
        status: "current",
        icon: <Cpu className="w-5 h-5" />,
        color: "bg-blue-600",
    },
    {
        quarter: "Phase 2",
        title: "Platform Integration",
        description: "Seamless integration with major social media and marketing platforms",
        status: "upcoming",
        icon: <Layers className="w-5 h-5" />,
        color: "bg-gray-300",
    },
    {
        quarter: "Phase 3",
        title: "Advanced Analytics",
        description: "Predictive analytics and performance optimization features",
        status: "upcoming",
        icon: <Eye className="w-5 h-5" />,
        color: "bg-gray-300",
    },
]

export const keyFeatures = [
    {
        title: "AI-Powered Content Generation",
        description: "Create personalized content that resonates with your audience",
        icon: <Brain className="w-5 h-5" />,
        stat: "10x faster",
        color: "bg-blue-50 border-blue-200",
    },
    {
        title: "Multi-Platform Publishing",
        description: "Publish to all your channels with automatic format adaptation",
        icon: <Globe className="w-5 h-5" />,
        stat: "50+ platforms",
        color: "bg-emerald-50 border-emerald-200",
    },
    {
        title: "Smart Content Scheduling",
        description: "AI-optimized timing for maximum engagement",
        icon: <Calendar className="w-5 h-5" />,
        stat: "32% more engagement",
        color: "bg-violet-50 border-violet-200",
    },
    {
        title: "Advanced Analytics",
        description: "Comprehensive insights to refine your strategy",
        icon: <BarChart3 className="w-5 h-5" />,
        stat: "Real-time data",
        color: "bg-orange-50 border-orange-200",
    },
];

export const beginnerJourneySteps = [
    {
        title: "Create your first content",
        description: "Generate AI-powered content tailored to your brand voice",
        icon: <MessageSquare className="w-5 h-5" />,
        url: "/dashboard/content-generation",
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Connect your channels",
        description: "Link your social media and marketing platforms",
        icon: <Globe className="w-5 h-5" />,
        url: "/dashboard/channel-integrations",
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        title: "Schedule your content",
        description: "Plan and automate your content calendar",
        icon: <Calendar className="w-5 h-5" />,
        url: "/dashboard/smart-scheduler",
        color: "bg-violet-100 text-violet-600",
    },
    {
        title: "Analyze performance",
        description: "Get insights on your content's engagement",
        icon: <BarChart3 className="w-5 h-5" />,
        url: "/dashboard/insight-hub",
        color: "bg-orange-100 text-orange-600",
    },
]

export
    const faqs = [
        {
            question: "What are channel integrations?",
            answer:
                "Channel integrations allow you to connect your social media accounts, email platforms, and other marketing channels to BrandVoice AI. This enables you to publish content directly from our platform to all your connected channels with a single click.",
        },
        {
            question: "How secure are my credentials?",
            answer:
                "We use industry-standard encryption to protect your credentials. All API keys and tokens are encrypted and stored securely. We never store your actual passwords, only the necessary tokens for API access.",
        },
        {
            question: "Can I disconnect integrations later?",
            answer:
                "Yes, you can disconnect any integration at any time from this page. Simply click on the integrated platform and select 'Disconnect' to revoke access.",
        },
        {
            question: "Do you support custom integrations?",
            answer:
                "Currently, we support the most popular platforms. We're constantly adding new integrations based on user feedback. Contact our support team if you need a specific platform integrated.",
        },
        {
            question: "What happens if my token expires?",
            answer:
                "We'll notify you when tokens are about to expire and guide you through the renewal process. Most platforms provide long-lived tokens, but some may require periodic renewal.",
        },
    ]

export const timezones = [
    { value: "Asia/Kolkata", label: "Indian Standard Time (IST)" },
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
]

export const viewsData = [
    { name: "Mon", views: 2400, clicks: 400 },
    { name: "Tue", views: 1398, clicks: 300 },
    { name: "Wed", views: 9800, clicks: 800 },
    { name: "Thu", views: 3908, clicks: 500 },
    { name: "Fri", views: 4800, clicks: 600 },
    { name: "Sat", views: 3800, clicks: 450 },
    { name: "Sun", views: 4300, clicks: 520 },
]

export const monthlyData = [
    { name: "Jan", views: 65000, clicks: 8500 },
    { name: "Feb", views: 59000, clicks: 7800 },
    { name: "Mar", views: 80000, clicks: 10200 },
    { name: "Apr", views: 81000, clicks: 10800 },
    { name: "May", views: 56000, clicks: 7200 },
    { name: "Jun", views: 55000, clicks: 7000 },
    { name: "Jul", views: 40000, clicks: 5200 },
]

export const hashtagData = [
    { hashtag: "#brandvoice", posts: 45, engagement: 12500, reach: 85000 },
    { hashtag: "#aimarketing", posts: 32, engagement: 9800, reach: 67000 },
    { hashtag: "#contentcreation", posts: 28, engagement: 8200, reach: 54000 },
    { hashtag: "#digitalmarketing", posts: 25, engagement: 7500, reach: 48000 },
    { hashtag: "#socialmedia", posts: 22, engagement: 6800, reach: 42000 },
    { hashtag: "#automation", posts: 18, engagement: 5200, reach: 35000 },
]

export const platformData = [
    { name: "Twitter", value: 35, color: "#1DA1F2" },
    { name: "Facebook", value: 25, color: "#4267B2" },
    { name: "Instagram", value: 20, color: "#E4405F" },
    { name: "LinkedIn", value: 15, color: "#0077B5" },
    { name: "YouTube", value: 5, color: "#FF0000" },
]

export const engagementData = [
    { name: "Mon", likes: 1200, comments: 340, shares: 180 },
    { name: "Tue", likes: 980, comments: 280, shares: 150 },
    { name: "Wed", likes: 1800, comments: 520, shares: 290 },
    { name: "Thu", likes: 1400, comments: 380, shares: 210 },
    { name: "Fri", likes: 1600, comments: 450, shares: 240 },
    { name: "Sat", likes: 1300, comments: 360, shares: 190 },
    { name: "Sun", likes: 1500, comments: 420, shares: 220 },
];

export const dummybrandifles = [
    {
        id: "1",
        name: "Brand Guidelines.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadDate: "2024-01-15",
        url: "#",
    },
    {
        id: "2",
        name: "Logo Variations.zip",
        type: "Archive",
        size: "5.1 MB",
        uploadDate: "2024-01-10",
        url: "#",
    },
    {
        id: "3",
        name: "Brand Video.mp4",
        type: "Video",
        size: "12.8 MB",
        uploadDate: "2024-01-08",
        url: "#",
    },
]

export const contentLibraryItems: ContentItem[] = [
    {
        id: "content-1",
        title: "Product Launch Announcement",
        type: "Social Media Post",
        preview: "Excited to announce our new product launch! Check out the amazing features...",
        platforms: ["twitter", "facebook", "linkedin"],
    },
    {
        id: "content-2",
        title: "Weekly Newsletter",
        type: "Email Campaign",
        preview: "This week's top stories and updates from our team...",
        platforms: ["email"],
    },
    {
        id: "content-3",
        title: "Summer Sale Promotion",
        type: "Social Media Post",
        preview: "Don't miss our biggest summer sale! Up to 50% off on all products...",
        platforms: ["instagram", "facebook"],
    },
    {
        id: "content-4",
        title: "Customer Testimonial",
        type: "Blog Post",
        preview: "Hear what our customers are saying about our services...",
        platforms: ["website", "linkedin"],
    },
    {
        id: "content-5",
        title: "Product Tutorial",
        type: "Video",
        preview: "Learn how to use our product with this step-by-step tutorial...",
        platforms: ["youtube", "website"],
    },
]