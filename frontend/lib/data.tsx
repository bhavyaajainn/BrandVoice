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
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Connect your channels",
        description: "Link your social media and marketing platforms",
        icon: <Globe className="w-5 h-5" />,
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        title: "Schedule your content",
        description: "Plan and automate your content calendar",
        icon: <Calendar className="w-5 h-5" />,
        color: "bg-violet-100 text-violet-600",
    },
    {
        title: "Analyze performance",
        description: "Get insights on your content's engagement",
        icon: <BarChart3 className="w-5 h-5" />,
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