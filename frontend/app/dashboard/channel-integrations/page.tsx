"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    CheckCircle,
    Globe,
    Instagram,
    Linkedin,
    Mail,
    MessageSquare,
    Plus,
    Settings,
    Twitter,
    Youtube,
    Facebook,
    ArrowRight,
    HelpCircle,
    Zap,
} from "lucide-react"
import { faqs } from "@/lib/data"

interface Integration {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    category: string
    isIntegrated: boolean
    fields: {
        name: string
        label: string
        type: string
        required: boolean
        placeholder: string
        description?: string
    }[]
    color: string
}

export default function ChannelIntegrations() {
    const [hasStarted, setHasStarted] = useState(false)
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: "twitter",
            name: "Twitter/X",
            description: "Share content and engage with your audience on Twitter",
            icon: <Twitter className="w-5 h-5" />,
            category: "Social Media",
            isIntegrated: false,
            color: "bg-blue-50 text-blue-600 border-blue-200",
            fields: [
                {
                    name: "apiKey",
                    label: "API Key",
                    type: "text",
                    required: true,
                    placeholder: "Enter your Twitter API Key",
                    description: "Found in your Twitter Developer Portal",
                },
                {
                    name: "apiSecret",
                    label: "API Secret",
                    type: "password",
                    required: true,
                    placeholder: "Enter your API Secret",
                },
                {
                    name: "accessToken",
                    label: "Access Token",
                    type: "text",
                    required: true,
                    placeholder: "Enter your Access Token",
                },
                {
                    name: "accessTokenSecret",
                    label: "Access Token Secret",
                    type: "password",
                    required: true,
                    placeholder: "Enter your Access Token Secret",
                },
            ],
        },
        {
            id: "facebook",
            name: "Facebook",
            description: "Publish posts and manage your Facebook business page",
            icon: <Facebook className="w-5 h-5" />,
            category: "Social Media",
            isIntegrated: false,
            color: "bg-blue-50 text-blue-600 border-blue-200",
            fields: [
                {
                    name: "pageId",
                    label: "Page ID",
                    type: "text",
                    required: true,
                    placeholder: "Enter your Facebook Page ID",
                    description: "Found in your Facebook Page settings",
                },
                {
                    name: "accessToken",
                    label: "Page Access Token",
                    type: "password",
                    required: true,
                    placeholder: "Enter your Page Access Token",
                },
            ],
        },
        {
            id: "instagram",
            name: "Instagram",
            description: "Share photos, stories, and reels to your Instagram account",
            icon: <Instagram className="w-5 h-5" />,
            category: "Social Media",
            isIntegrated: true,
            color: "bg-pink-50 text-pink-600 border-pink-200",
            fields: [
                {
                    name: "accountId",
                    label: "Instagram Business Account ID",
                    type: "text",
                    required: true,
                    placeholder: "Enter your Instagram Business Account ID",
                },
                {
                    name: "accessToken",
                    label: "Access Token",
                    type: "password",
                    required: true,
                    placeholder: "Enter your Access Token",
                },
            ],
        },
        {
            id: "linkedin",
            name: "LinkedIn",
            description: "Share professional content and company updates",
            icon: <Linkedin className="w-5 h-5" />,
            category: "Professional",
            isIntegrated: false,
            color: "bg-blue-50 text-blue-600 border-blue-200",
            fields: [
                {
                    name: "companyId",
                    label: "Company ID",
                    type: "text",
                    required: true,
                    placeholder: "Enter your LinkedIn Company ID",
                },
                {
                    name: "accessToken",
                    label: "Access Token",
                    type: "password",
                    required: true,
                    placeholder: "Enter your Access Token",
                },
            ],
        },
        {
            id: "youtube",
            name: "YouTube",
            description: "Upload videos and manage your YouTube channel",
            icon: <Youtube className="w-5 h-5" />,
            category: "Video",
            isIntegrated: false,
            color: "bg-red-50 text-red-600 border-red-200",
            fields: [
                {
                    name: "channelId",
                    label: "Channel ID",
                    type: "text",
                    required: true,
                    placeholder: "Enter your YouTube Channel ID",
                },
                {
                    name: "clientId",
                    label: "OAuth Client ID",
                    type: "text",
                    required: true,
                    placeholder: "Enter your OAuth Client ID",
                },
                {
                    name: "clientSecret",
                    label: "OAuth Client Secret",
                    type: "password",
                    required: true,
                    placeholder: "Enter your OAuth Client Secret",
                },
            ],
        },
        {
            id: "mailchimp",
            name: "Mailchimp",
            description: "Send email campaigns and manage your subscriber lists",
            icon: <Mail className="w-5 h-5" />,
            category: "Email Marketing",
            isIntegrated: false,
            color: "bg-yellow-50 text-yellow-600 border-yellow-200",
            fields: [
                {
                    name: "apiKey",
                    label: "API Key",
                    type: "password",
                    required: true,
                    placeholder: "Enter your Mailchimp API Key",
                    description: "Found in your Mailchimp account settings",
                },
                {
                    name: "serverPrefix",
                    label: "Server Prefix",
                    type: "text",
                    required: true,
                    placeholder: "e.g., us1, us2, etc.",
                    description: "The server prefix from your API key",
                },
            ],
        },
        {
            id: "slack",
            name: "Slack",
            description: "Send notifications and updates to your Slack workspace",
            icon: <MessageSquare className="w-5 h-5" />,
            category: "Communication",
            isIntegrated: false,
            color: "bg-purple-50 text-purple-600 border-purple-200",
            fields: [
                {
                    name: "webhookUrl",
                    label: "Webhook URL",
                    type: "text",
                    required: true,
                    placeholder: "Enter your Slack Webhook URL",
                },
                {
                    name: "channel",
                    label: "Default Channel",
                    type: "text",
                    required: false,
                    placeholder: "#general",
                },
            ],
        },
        {
            id: "wordpress",
            name: "WordPress",
            description: "Publish blog posts directly to your WordPress site",
            icon: <Globe className="w-5 h-5" />,
            category: "Content Management",
            isIntegrated: false,
            color: "bg-gray-50 text-gray-600 border-gray-200",
            fields: [
                {
                    name: "siteUrl",
                    label: "Site URL",
                    type: "text",
                    required: true,
                    placeholder: "https://yoursite.com",
                },
                {
                    name: "username",
                    label: "Username",
                    type: "text",
                    required: true,
                    placeholder: "Enter your WordPress username",
                },
                {
                    name: "applicationPassword",
                    label: "Application Password",
                    type: "password",
                    required: true,
                    placeholder: "Enter your Application Password",
                    description: "Generate this in your WordPress admin under Users > Profile",
                },
            ],
        },
    ])

    const handleIntegrationClick = (integration: Integration) => {
        setSelectedIntegration(integration)
        setFormData({})
    }

    const handleFormSubmit = () => {
        if (!selectedIntegration) return

        // Validate required fields
        const requiredFields = selectedIntegration.fields.filter((field) => field.required)
        const missingFields = requiredFields.filter((field) => !formData[field.name]?.trim())

        if (missingFields.length > 0) {
            alert("Please fill in all required fields")
            return
        }

        // Update integration status
        setIntegrations((prev) =>
            prev.map((integration) =>
                integration.id === selectedIntegration.id ? { ...integration, isIntegrated: true } : integration,
            ),
        )

        setSelectedIntegration(null)
        setFormData({})

        // Set hasStarted to true after first integration
        if (!hasStarted) {
            setHasStarted(true)
        }
    }

    const handleDisconnect = (integrationId: string) => {
        setIntegrations((prev) =>
            prev.map((integration) =>
                integration.id === integrationId ? { ...integration, isIntegrated: false } : integration,
            ),
        )
    }

    const groupedIntegrations = integrations.reduce(
        (acc, integration) => {
            if (!acc[integration.category]) {
                acc[integration.category] = []
            }
            acc[integration.category].push(integration)
            return acc
        },
        {} as Record<string, Integration[]>,
    )

    const integratedCount = integrations.filter((i) => i.isIntegrated).length

    if (hasStarted || integratedCount > 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Channel Integrations</h1>
                                <p className="text-gray-600 mt-1">Manage your connected platforms and channels</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                    {integratedCount} Connected
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="space-y-8">
                        {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
                            <div key={category}>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">{category}</h2>
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Platform</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categoryIntegrations.map((integration) => (
                                                <TableRow key={integration.id}>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`p-2 rounded-lg ${integration.color}`}>{integration.icon}</div>
                                                            <span className="font-medium">{integration.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-600">{integration.description}</TableCell>
                                                    <TableCell>
                                                        {integration.isIntegrated ? (
                                                            <Badge className="bg-green-50 text-green-700 border-green-200">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Connected
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-gray-50 text-gray-600">
                                                                Not Connected
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {integration.isIntegrated ? (
                                                            <div className="flex space-x-2">
                                                                <Button variant="outline" size="sm" onClick={() => handleIntegrationClick(integration)}>
                                                                    <Settings className="w-4 h-4 mr-1" />
                                                                    Configure
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDisconnect(integration.id)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    Disconnect
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleIntegrationClick(integration)}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            >
                                                                <Plus className="w-4 h-4 mr-1" />
                                                                Connect
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integration Configuration Dialog */}
                <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                                {selectedIntegration && (
                                    <>
                                        <div className={`p-2 rounded-lg ${selectedIntegration.color}`}>{selectedIntegration.icon}</div>
                                        <span>Configure {selectedIntegration.name}</span>
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                Enter your {selectedIntegration?.name} credentials to connect your account.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedIntegration && (
                            <div className="space-y-4 py-4">
                                {selectedIntegration.fields.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <Label htmlFor={field.name}>
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </Label>
                                        {field.type === "textarea" ? (
                                            <Textarea
                                                id={field.name}
                                                placeholder={field.placeholder}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                            />
                                        ) : (
                                            <Input
                                                id={field.name}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                            />
                                        )}
                                        {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
                                    </div>
                                ))}

                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleFormSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        {selectedIntegration.isIntegrated ? "Update" : "Connect"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Channel Integrations</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect your social media accounts, email platforms, and other marketing channels to publish content
                            seamlessly across all your platforms.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div className="space-y-12">
                    {/* What is Channel Integrations */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>What are Channel Integrations?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700">
                                    Channel integrations allow you to connect all your marketing platforms to BrandVoice AI. Once
                                    connected, you can:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">One-Click Publishing</h4>
                                            <p className="text-sm text-gray-600">Publish to multiple platforms simultaneously</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Auto-Formatting</h4>
                                            <p className="text-sm text-gray-600">Content automatically adapted for each platform</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Unified Analytics</h4>
                                            <p className="text-sm text-gray-600">Track performance across all channels</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Smart Scheduling</h4>
                                            <p className="text-sm text-gray-600">Optimal timing for each platform</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* FAQs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="w-5 h-5" />
                                    <span>Frequently Asked Questions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Get Started */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center"
                    >
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="py-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Connect Your Channels?</h3>
                                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Start by connecting your first platform. We support all major social media networks, email marketing
                                    tools, and content management systems.
                                </p>
                                <Button
                                    size="lg"
                                    onClick={() => setHasStarted(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg group"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
