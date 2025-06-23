"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
} from "lucide-react"
import Intro from "./components/Intro"
import { Integration } from "@/lib/types"
import axios from 'axios';
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { useAuthContext } from "@/lib/AuthContext"
import { getTokenRequest } from "@/lib/redux/actions/authActions"

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
    ]);
    const { token } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch();
    const { user, loading } = useAuthContext()
    console.log(user?.uid);
    useEffect(() => {
        if (user && !token) {
            dispatch(getTokenRequest())
        }
    }, [user, token, dispatch])

    const handleIntegrationClick = async (integration_name: string) => {
        try {

            console.log("User token",token);
            const response = await axios.get(`https://brandvoice-api-995012456302.us-central1.run.app/api/v1/${integration_name}/connect`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
                throw new Error('Failed to integrate');
            }
            const data = response.data;
            console.log("connected",integration_name);
            setSelectedIntegration(data);
            setFormData({});
        } catch (error) {
            console.error('Error integrating:', error);
        }
    }

    const handleFormSubmit = () => {
        if (!selectedIntegration) return

        const requiredFields = selectedIntegration.fields.filter((field) => field.required)
        const missingFields = requiredFields.filter((field) => !formData[field.name]?.trim())

        if (missingFields.length > 0) {
            alert("Please fill in all required fields")
            return
        }

        setIntegrations((prev) =>
            prev.map((integration) =>
                integration.id === selectedIntegration.id ? { ...integration, isIntegrated: true } : integration,
            ),
        )

        setSelectedIntegration(null)
        setFormData({})

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
            <>
                <div className="min-h-screen bg-gray-50">
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
                                                                    <Button variant="outline" size="sm" onClick={() => handleIntegrationClick(integration.name)}>
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
                                                                    onClick={() => handleIntegrationClick(integration.name)}
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
            </>
        )
    }

    return (
        <Intro setHasStarted={setHasStarted} />
    )
}
