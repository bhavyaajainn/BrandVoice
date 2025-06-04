"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
    CalendarIcon,
    Edit,
    Facebook,
    Globe,
    Instagram,
    Linkedin,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Twitter,
} from "lucide-react"
import { ContentItem, ScheduledPost } from "@/lib/types"
import { timezones } from "@/lib/data"
import Tips from "./components/Tips"
import SchedulerNav from "./components/SchedulerNav"
import Header from "../components/Header"

export default function SmartScheduler() {
    const [showImportDialog, setShowImportDialog] = useState(false)
    const [showScheduleDialog, setShowScheduleDialog] = useState(false)
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState("12:00")
    const [selectedTimezone, setSelectedTimezone] = useState("UTC")
    const [instantSchedule, setInstantSchedule] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [selectedScheduledPost, setSelectedScheduledPost] = useState<ScheduledPost | null>(null)
    const [activeTab, setActiveTab] = useState("upcoming")

    const contentLibraryItems: ContentItem[] = [
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

    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
        {
            id: "schedule-1",
            contentId: "content-1",
            contentTitle: "Product Launch Announcement",
            platforms: ["twitter", "facebook", "linkedin"],
            scheduledDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            timezone: "UTC",
            status: "scheduled",
        },
        {
            id: "schedule-2",
            contentId: "content-3",
            contentTitle: "Summer Sale Promotion",
            platforms: ["instagram", "facebook"],
            scheduledDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            timezone: "America/New_York",
            status: "scheduled",
        },
        {
            id: "schedule-3",
            contentId: "content-2",
            contentTitle: "Weekly Newsletter",
            platforms: ["email"],
            scheduledDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            timezone: "Europe/London",
            status: "published",
        },
        {
            id: "schedule-4",
            contentId: "content-5",
            contentTitle: "Product Tutorial",
            platforms: ["youtube", "website"],
            scheduledDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            timezone: "Asia/Tokyo",
            status: "failed",
        },
    ])

    const handleImportContent = (content: ContentItem) => {
        setSelectedContent(content)
        setShowImportDialog(false)
        setShowScheduleDialog(true)
    }

    const handleSchedulePost = () => {
        if (!selectedContent || !selectedDate) return

        const newScheduledPost: ScheduledPost = {
            id: `schedule-${Date.now()}`,
            contentId: selectedContent.id,
            contentTitle: selectedContent.title,
            platforms: selectedContent.platforms,
            scheduledDate: new Date(
                selectedDate.setHours(
                    Number.parseInt(selectedTime.split(":")[0]),
                    Number.parseInt(selectedTime.split(":")[1]),
                    0,
                    0,
                ),
            ),
            timezone: selectedTimezone,
            status: "scheduled",
        }

        setScheduledPosts([...scheduledPosts, newScheduledPost])
        setShowScheduleDialog(false)
        setSelectedContent(null)
        setSelectedDate(new Date())
        setSelectedTime("12:00")
        setSelectedTimezone("UTC")
        setInstantSchedule(false)
    }

    const handleEditScheduledPost = (post: ScheduledPost) => {
        setSelectedScheduledPost(post)
        setSelectedDate(new Date(post.scheduledDate))
        setSelectedTime(
            `${post.scheduledDate.getHours().toString().padStart(2, "0")}:${post.scheduledDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}`,
        )
        setSelectedTimezone(post.timezone)
        setShowEditDialog(true)
    }

    const handleUpdateScheduledPost = () => {
        if (!selectedScheduledPost || !selectedDate) return

        const updatedPosts = scheduledPosts.map((post) => {
            if (post.id === selectedScheduledPost.id) {
                return {
                    ...post,
                    scheduledDate: new Date(
                        selectedDate.setHours(
                            Number.parseInt(selectedTime.split(":")[0]),
                            Number.parseInt(selectedTime.split(":")[1]),
                            0,
                            0,
                        ),
                    ),
                    timezone: selectedTimezone,
                }
            }
            return post
        })

        setScheduledPosts(updatedPosts)
        setShowEditDialog(false)
        setSelectedScheduledPost(null)
    }

    const handleDeleteScheduledPost = (postId: string) => {
        const updatedPosts = scheduledPosts.filter((post) => post.id !== postId)
        setScheduledPosts(updatedPosts)
        if (showEditDialog && selectedScheduledPost?.id === postId) {
            setShowEditDialog(false)
            setSelectedScheduledPost(null)
        }
    }

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "twitter":
                return <Twitter className="w-4 h-4" />
            case "facebook":
                return <Facebook className="w-4 h-4" />
            case "instagram":
                return <Instagram className="w-4 h-4" />
            case "linkedin":
                return <Linkedin className="w-4 h-4" />
            default:
                return <Globe className="w-4 h-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "scheduled":
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>
            case "published":
                return <Badge className="bg-green-50 text-green-700 border-green-200">Published</Badge>
            case "failed":
                return <Badge className="bg-red-50 text-red-700 border-red-200">Failed</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const filteredPosts = scheduledPosts.filter((post) => {
        if (activeTab === "upcoming") {
            return post.status === "scheduled" && post.scheduledDate > new Date()
        } else if (activeTab === "published") {
            return post.status === "published"
        } else if (activeTab === "failed") {
            return post.status === "failed"
        }
        return true
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* @ts-ignore */}
            <Header />

            <SchedulerNav setShowImportDialog={setShowImportDialog} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="space-y-8">
                    <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full md:w-auto grid-cols-3">
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="failed">Failed</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <CardTitle>
                                            {activeTab === "upcoming"
                                                ? "Upcoming Posts"
                                                : activeTab === "published"
                                                    ? "Published Posts"
                                                    : "Failed Posts"}
                                        </CardTitle>
                                        <div className="mt-2 md:mt-0">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                                <Input
                                                    type="search"
                                                    placeholder="Search scheduled posts..."
                                                    className="w-full md:w-[250px] pl-8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {filteredPosts.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Content</TableHead>
                                                        <TableHead>Platforms</TableHead>
                                                        <TableHead>Date & Time</TableHead>
                                                        <TableHead>Timezone</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredPosts.map((post) => (
                                                        <TableRow key={post.id}>
                                                            <TableCell className="font-medium">{post.contentTitle}</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-1">
                                                                    {post.platforms.map((platform) => (
                                                                        <div
                                                                            key={platform}
                                                                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                                                                            title={platform}
                                                                        >
                                                                            {getPlatformIcon(platform)}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {format(post.scheduledDate, "MMM d, yyyy")}
                                                                <br />
                                                                <span className="text-gray-500 text-sm">{format(post.scheduledDate, "h:mm a")}</span>
                                                            </TableCell>
                                                            <TableCell>{post.timezone}</TableCell>
                                                            <TableCell>{getStatusBadge(post.status)}</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end space-x-2">
                                                                    {post.status === "scheduled" && (
                                                                        <>
                                                                            <Button variant="outline" size="sm" onClick={() => handleEditScheduledPost(post)}>
                                                                                <Edit className="w-4 h-4" />
                                                                                <span className="sr-only">Edit</span>
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="text-red-600 hover:text-red-700"
                                                                                onClick={() => handleDeleteScheduledPost(post.id)}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                                <span className="sr-only">Delete</span>
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                    {post.status !== "scheduled" && (
                                                                        <Button variant="outline" size="sm">
                                                                            <MoreHorizontal className="w-4 h-4" />
                                                                            <span className="sr-only">More</span>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                                <CalendarIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab} posts</h3>
                                            <p className="text-gray-500">
                                                {activeTab === "upcoming"
                                                    ? "You don't have any upcoming scheduled posts."
                                                    : activeTab === "published"
                                                        ? "You don't have any published posts yet."
                                                        : "You don't have any failed posts."}
                                            </p>
                                            {activeTab === "upcoming" && (
                                                <Button
                                                    onClick={() => setShowImportDialog(true)}
                                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Schedule New Post
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Tips />
                </div>
            </div>

            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Import Content from Library</DialogTitle>
                        <DialogDescription>Select content to schedule across your platforms</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input type="search" placeholder="Search content..." className="w-full pl-8" />
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {contentLibraryItems.map((content) => (
                                <Card key={content.id} className="cursor-pointer hover:border-blue-300 transition-colors">
                                    <CardContent className="p-4 flex flex-col" onClick={() => handleImportContent(content)}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{content.title}</h3>
                                                <p className="text-sm text-gray-500">{content.type}</p>
                                            </div>
                                            <div className="flex space-x-1">
                                                {content.platforms.map((platform) => (
                                                    <div
                                                        key={platform}
                                                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                                                        title={platform}
                                                    >
                                                        {getPlatformIcon(platform)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{content.preview}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Schedule Content</DialogTitle>
                        <DialogDescription>Set when you want to publish this content</DialogDescription>
                    </DialogHeader>

                    {selectedContent && (
                        <div className="space-y-4 py-4">
                            <div className="p-3 bg-gray-50 rounded-md">
                                <h3 className="font-medium text-gray-900">{selectedContent.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{selectedContent.preview}</p>
                                <div className="flex space-x-1 mt-2">
                                    {selectedContent.platforms.map((platform) => (
                                        <div
                                            key={platform}
                                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                                            title={platform}
                                        >
                                            {getPlatformIcon(platform)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                    disabled={instantSchedule}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={setSelectedDate}
                                                    initialFocus
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                            disabled={instantSchedule}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone} disabled={instantSchedule}>
                                        <SelectTrigger id="timezone">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezones.map((timezone) => (
                                                <SelectItem key={timezone.value} value={timezone.value}>
                                                    {timezone.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="instant-schedule"
                                        checked={instantSchedule}
                                        onCheckedChange={(checked) => setInstantSchedule(checked === true)}
                                    />
                                    <Label
                                        htmlFor="instant-schedule"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Schedule for immediate publishing
                                    </Label>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSchedulePost} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Schedule Post
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Scheduled Post</DialogTitle>
                        <DialogDescription>Update the scheduling details for this post</DialogDescription>
                    </DialogHeader>

                    {selectedScheduledPost && (
                        <div className="space-y-4 py-4">
                            <div className="p-3 bg-gray-50 rounded-md">
                                <h3 className="font-medium text-gray-900">{selectedScheduledPost.contentTitle}</h3>
                                <div className="flex space-x-1 mt-2">
                                    {selectedScheduledPost.platforms.map((platform) => (
                                        <div
                                            key={platform}
                                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                                            title={platform}
                                        >
                                            {getPlatformIcon(platform)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-date">Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={setSelectedDate}
                                                    initialFocus
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-time">Time</Label>
                                        <Input
                                            id="edit-time"
                                            type="time"
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-timezone">Timezone</Label>
                                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                                        <SelectTrigger id="edit-timezone">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezones.map((timezone) => (
                                                <SelectItem key={timezone.value} value={timezone.value}>
                                                    {timezone.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                                    Cancel
                                </Button>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => {
                                            handleDeleteScheduledPost(selectedScheduledPost.id)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button onClick={handleUpdateScheduledPost} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
