"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    CheckCircle,
    Plus,
    Trash2,
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    YoutubeIcon,
    Loader2
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { useAuthContext } from "@/lib/AuthContext"
import { getTokenRequest } from "@/lib/redux/actions/authActions"
import axios from "axios"
import Intro from "./components/Intro"

type PlatformStatus = "connected" | "not_connected"

interface PlatformConnectionStatus {
    status: PlatformStatus
}

interface PlatformsConnected {
    facebook?: PlatformConnectionStatus
    instagram?: PlatformConnectionStatus
    twitter?: PlatformConnectionStatus
    youtube?: PlatformConnectionStatus
    [platform: string]: PlatformConnectionStatus | undefined
}

interface ChannelIntegrationsResponse {
    user_id: string
    platforms_connected: PlatformsConnected
}

const integrationConfig = {
    facebook: {
        id: "facebook",
        name: "Facebook",
        description: "Connect your Facebook account",
        icon: <FacebookIcon className="w-4 h-4 text-blue-600" />,
        color: "bg-blue-100",
    },
    instagram: {
        id: "instagram",
        name: "Instagram",
        description: "Connect your Instagram account",
        icon: <InstagramIcon className="w-4 h-4 text-pink-500" />,
        color: "bg-pink-100",
    },
    twitter: {
        id: "twitter",
        name: "Twitter",
        description: "Connect your Twitter account",
        icon: <TwitterIcon className="w-4 h-4 text-sky-500" />,
        color: "bg-blue-200",
    },
    youtube: {
        id: "youtube",
        name: "YouTube",
        description: "Connect your YouTube account",
        icon: <YoutubeIcon className="w-4 h-4 text-red-600" />,
        color: "bg-red-100",
    },
}

export default function ChannelIntegrations() {
    const { token } = useAppSelector((state) => state.auth)
    const { user } = useAuthContext()
    const dispatch = useAppDispatch()
    const [data, setData] = useState<ChannelIntegrationsResponse | null>(null)
    const [hasInitialized, setHasInitialized] = useState(false)
    const [loading, setLoading] = useState(true)
    const [hasStarted, setHasStarted] = useState(true);

    useEffect(() => {
        if (user && !token) {
            dispatch(getTokenRequest())
        }
    }, [user, token, dispatch])

    useEffect(() => {
        const fetchData = async () => {
            if (user && token && !hasInitialized) {
                setLoading(true)
                try {
                    const res = await axios.get(
                        `https://brandvoice-api-995012456302.us-central1.run.app/api/v1/auth/users/${user.uid}/connected-platforms`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )

                    console.log(res.data);

                    setData(res.data);
                } catch (err) {
                    console.error("Failed to fetch integrations:", err)
                } finally {
                    setLoading(false)
                    setHasInitialized(true)
                }
            }
        }

        fetchData()
    }, [user, token, hasInitialized])

    const handleConnect = async (platform: string) => {
        try {
            const response = await axios.get(
                `https://brandvoice-api-995012456302.us-central1.run.app/api/v1/${platform}/connect`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            )
            if (response.status === 200 && response.data?.redirect_to) {
                window.open(response.data.redirect_to, "_blank")
            } else {
                console.error("No redirect URL in response", response)
            }
        } catch (error) {
            console.error(`Failed to connect to ${platform}:`, error)
        }
    };

    const handleDisconnect = async (platform: string) => {
        try {
            const response = await axios.get(
                `https://brandvoice-api-995012456302.us-central1.run.app/api/v1/${platform}/disconnect`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            console.log(response);

        } catch (error) {
            console.error(`Failed to connect to ${platform}:`, error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin w-6 h-6 text-blue-600 mr-2" />
                <span className="text-gray-600 text-sm">Loading integrations...</span>
            </div>
        )
    }

    // if (!data || Object.values(data.platforms_connected || {}).every(p => p?.status !== "connected") && hasStarted) {
    //     return <Intro setHasStarted={() => { setHasStarted }} />
    // }

    const platforms = data?.platforms_connected ?? {}
    const integratedCount = Object.values(platforms).filter((p) => p?.status === "connected").length

    return (
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
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
                            {Object.entries(platforms).map(([platform]) => {
                                const config = integrationConfig[platform as keyof typeof integrationConfig]
                                if (!config) return null
                                const isConnected = platforms[platform]?.status === "connected"

                                return (
                                    <TableRow key={platform}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${config.color}`}>{config.icon}</div>
                                                <span className="font-medium">{config.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">{config.description}</TableCell>
                                        <TableCell>
                                            {isConnected ? (
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
                                            {isConnected ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDisconnect(platform)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Disconnect
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleConnect(platform)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Connect
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}
