"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Eye, MousePointer, Hash, Heart, MessageCircle, Share } from "lucide-react"
import { engagementData, hashtagData, monthlyData, platformData, viewsData } from "@/lib/data"
import Header from "../components/Header"

export default function InsightHub() {
    const [timeFilter, setTimeFilter] = useState("week")
    const [activeTab, setActiveTab] = useState("overview")

    const getDataByFilter = () => {
        switch (timeFilter) {
            case "day":
                return viewsData.slice(-1)
            case "week":
                return viewsData
            case "month":
                return monthlyData.slice(-4)
            case "year":
                return monthlyData
            default:
                return viewsData
        }
    }

    const getTotalViews = () => {
        const data = getDataByFilter()
        return data.reduce((sum, item) => sum + item.views, 0)
    }

    const getTotalClicks = () => {
        const data = getDataByFilter()
        return data.reduce((sum, item) => sum + item.clicks, 0)
    }

    const getClickThroughRate = () => {
        const totalViews = getTotalViews()
        const totalClicks = getTotalClicks()
        return totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0"
    }

    return (

        <>
        {/* @ts-ignore */}
        <Header />
        <div className="min-h-screen bg-gray-50">

            <div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-2xl font-bold text-gray-900">Insight Hub</h1>
                            <p className="text-gray-600 mt-1">Track your content performance and engagement metrics</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Select value={timeFilter} onValueChange={setTimeFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Time period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Last Day</SelectItem>
                                    <SelectItem value="week">Last Week</SelectItem>
                                    <SelectItem value="month">Last Month</SelectItem>
                                    <SelectItem value="year">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full md:w-auto grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="engagement">Engagement</TabsTrigger>
                        <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                        <TabsTrigger value="platforms">Platforms</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Views</p>
                                            <p className="text-2xl font-bold text-gray-900">{getTotalViews().toLocaleString()}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">+12.5%</span>
                                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                                            <p className="text-2xl font-bold text-gray-900">{getTotalClicks().toLocaleString()}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <MousePointer className="w-6 h-6 text-emerald-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">+8.2%</span>
                                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Click-through Rate</p>
                                            <p className="text-2xl font-bold text-gray-900">{getClickThroughRate()}%</p>
                                        </div>
                                        <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-violet-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                        <span className="text-sm text-red-600">-2.1%</span>
                                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active Hashtags</p>
                                            <p className="text-2xl font-bold text-gray-900">{hashtagData.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Hash className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">+3</span>
                                        <span className="text-sm text-gray-500 ml-1">new this period</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Views & Clicks Over Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={getDataByFilter()}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="views"
                                                stackId="1"
                                                stroke="#3B82F6"
                                                fill="#3B82F6"
                                                fillOpacity={0.6}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="clicks"
                                                stackId="2"
                                                stroke="#10B981"
                                                fill="#10B981"
                                                fillOpacity={0.6}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Platform Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={platformData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {platformData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="engagement" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Engagement Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={engagementData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="likes" fill="#E11D48" />
                                        <Bar dataKey="comments" fill="#3B82F6" />
                                        <Bar dataKey="shares" fill="#10B981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Likes</p>
                                            <p className="text-2xl font-bold text-gray-900">9,780</p>
                                        </div>
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                            <Heart className="w-6 h-6 text-red-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Comments</p>
                                            <p className="text-2xl font-bold text-gray-900">2,750</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Shares</p>
                                            <p className="text-2xl font-bold text-gray-900">1,480</p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <Share className="w-6 h-6 text-emerald-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="hashtags" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hashtag Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 overflow-x-scroll">
                                    {hashtagData.map((hashtag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg w-full"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Hash className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{hashtag.hashtag}</h3>
                                                    <p className="text-sm text-gray-500">{hashtag.posts} posts</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-900">{hashtag.engagement.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-500">Engagement</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-900">{hashtag.reach.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-500">Reach</p>
                                                </div>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    Trending
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="platforms" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {platformData.map((platform, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-gray-900">{platform.name}</h3>
                                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: platform.color }}></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Share</span>
                                                <span className="text-sm font-medium">{platform.value}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full"
                                                    style={{ backgroundColor: platform.color, width: `${platform.value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">{(platform.value * 1000).toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Total Posts</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">{(platform.value * 2500).toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Engagement</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Performance Comparison</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={getDataByFilter()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                                        <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        </>
    )
}
