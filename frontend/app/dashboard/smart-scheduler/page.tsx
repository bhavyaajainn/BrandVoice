"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
    AlertCircle,
    CalendarDays,
    CalendarIcon,
    CheckCircle,
    Clock,
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import { ContentItem, ScheduledPost } from "@/lib/types"
import { contentLibraryItems, timezones } from "@/lib/data"
import Tips from "./components/Tips"
import SchedulerNav from "./components/SchedulerNav"
import { getPlatformIcon, getStatusBadge, getTabIcon } from "@/lib/reuse"

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

    const filteredPosts = scheduledPosts.filter((post) => {
        if (activeTab === "upcoming") {
            return post.status === "scheduled" && post.scheduledDate > new Date()
        } else if (activeTab === "published") {
            return post.status === "published"
        } else if (activeTab === "failed") {
            return post.status === "failed"
        }
        return true
    });

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Elements */}

            {/* Floating Background Shapes - Hidden on smaller screens */}
            <motion.div
                className="absolute top-20 right-20 w-40 h-40 bg-blue-50 rounded-full opacity-40 hidden xl:block"
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 10, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-40 left-10 w-32 h-32 bg-blue-50 rounded-full opacity-30 hidden xl:block"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -15, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            {/* Floating Icons - Hidden on medium and smaller screens */}
            <motion.div
                className="absolute top-32 left-1/12 w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shadow-lg hidden lg:flex"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            >
                <CalendarIcon className="w-8 h-8 text-blue-600" />
            </motion.div>

            <motion.div
                className="absolute top-48 right-1/3 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg hidden lg:flex"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, -8, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                }}
            >
                <Clock className="w-6 h-6 text-blue-600" />
            </motion.div>

            <SchedulerNav setShowImportDialog={setShowImportDialog} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <motion.div
                                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Smart Content Scheduling
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-900">Schedule Your Content</h1>
                            <p className="text-gray-600 mt-1">Plan and automate your content publishing across all platforms</p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Button
                                onClick={() => setShowImportDialog(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Schedule New Post
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full md:w-auto grid-cols-3 p-1 bg-blue-50 border border-blue-100 rounded-lg">
                                {["upcoming", "published", "failed"].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="flex items-center justify-center data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md rounded-md px-4 capitalize"
                                    >
                                        {getTabIcon(tab)}
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value={activeTab} className="mt-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                                        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                <CardTitle className="flex items-center">
                                                    {activeTab === "upcoming" ? (
                                                        <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                                                    ) : activeTab === "published" ? (
                                                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                                                    )}
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
                                                            className="w-full md:w-[250px] pl-8 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
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
                                                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                                <TableHead>Content</TableHead>
                                                                <TableHead>Platforms</TableHead>
                                                                <TableHead>Date & Time</TableHead>
                                                                <TableHead>Timezone</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead className="text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {filteredPosts.map((post, index) => (
                                                                <motion.tr
                                                                    key={post.id}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                                                    className="border-b border-gray-100 hover:bg-blue-50/30"
                                                                >
                                                                    <TableCell className="font-medium">{post.contentTitle}</TableCell>
                                                                    <TableCell>
                                                                        <div className="flex space-x-1">
                                                                            {post.platforms.map((platform) => (
                                                                                <div
                                                                                    key={platform}
                                                                                    className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shadow-sm"
                                                                                    title={platform}
                                                                                >
                                                                                    {getPlatformIcon(platform)}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center">
                                                                            <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                                            <div>
                                                                                {format(post.scheduledDate, "MMM d, yyyy")}
                                                                                <br />
                                                                                <span className="text-gray-500 text-sm">
                                                                                    {format(post.scheduledDate, "h:mm a")}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>{post.timezone}</TableCell>
                                                                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex justify-end space-x-2">
                                                                            {post.status === "scheduled" && (
                                                                                <>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => handleEditScheduledPost(post)}
                                                                                        className="border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                                                                    >
                                                                                        <Edit className="w-4 h-4 text-blue-600" />
                                                                                        <span className="sr-only">Edit</span>
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                                                                                        onClick={() => handleDeleteScheduledPost(post.id)}
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                        <span className="sr-only">Delete</span>
                                                                                    </Button>
                                                                                </>
                                                                            )}
                                                                            {post.status !== "scheduled" && (
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="border-gray-200 hover:border-gray-300"
                                                                                >
                                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                                    <span className="sr-only">More</span>
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </motion.tr>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="text-center py-16 bg-gray-50/50 rounded-lg border border-dashed border-gray-200"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 shadow-md">
                                                        {activeTab === "upcoming" ? (
                                                            <CalendarDays className="w-8 h-8 text-blue-600" />
                                                        ) : activeTab === "published" ? (
                                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                                        ) : (
                                                            <AlertCircle className="w-8 h-8 text-red-600" />
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No {activeTab} posts</h3>
                                                    <p className="text-gray-600 max-w-md mx-auto">
                                                        {activeTab === "upcoming"
                                                            ? "You don't have any upcoming scheduled posts. Start by scheduling your first post."
                                                            : activeTab === "published"
                                                                ? "You don't have any published posts yet. Your published posts will appear here."
                                                                : "You don't have any failed posts. If any posts fail to publish, they will appear here."}
                                                    </p>
                                                    {activeTab === "upcoming" && (
                                                        <Button
                                                            onClick={() => setShowImportDialog(true)}
                                                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Schedule New Post
                                                        </Button>
                                                    )}
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Tips />
                    </motion.div>
                </div>
            </div>

            {/* Import Content Dialog */}
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Plus className="w-5 h-5 text-blue-600" />
                            </div>
                            <span>Import Content from Library</span>
                        </DialogTitle>
                        <DialogDescription>Select content to schedule across your platforms</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Search content..."
                                className="w-full pl-8 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                            />
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {contentLibraryItems.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                >
                                    <Card className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-300">
                                        <CardContent
                                            className="p-4 flex flex-col hover:bg-blue-50/30"
                                            onClick={() => handleImportContent(content)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{content.title}</h3>
                                                    <p className="text-sm text-gray-500">{content.type}</p>
                                                </div>
                                                <div className="flex space-x-1">
                                                    {content.platforms.map((platform) => (
                                                        <div
                                                            key={platform}
                                                            className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shadow-sm"
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
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Schedule Content Dialog */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <span>Schedule Content</span>
                        </DialogTitle>
                        <DialogDescription>Set when you want to publish this content</DialogDescription>
                    </DialogHeader>

                    {selectedContent && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-medium text-gray-900">{selectedContent.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{selectedContent.preview}</p>
                                <div className="flex space-x-1 mt-2">
                                    {selectedContent.platforms.map((platform) => (
                                        <div
                                            key={platform}
                                            className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shadow-sm"
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
                                        <Label htmlFor="date" className="text-gray-700">
                                            Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal border-gray-200 hover:border-blue-300"
                                                    disabled={instantSchedule}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
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
                                                    className="border border-blue-100 rounded-md"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="time" className="text-gray-700">
                                            Time
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
                                            <Input
                                                id="time"
                                                type="time"
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                                disabled={instantSchedule}
                                                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timezone" className="text-gray-700">
                                        Timezone
                                    </Label>
                                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone} disabled={instantSchedule}>
                                        <SelectTrigger id="timezone" className="border-gray-200 focus:border-blue-300 focus:ring-blue-300">
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

                                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <Checkbox
                                        id="instant-schedule"
                                        checked={instantSchedule}
                                        onCheckedChange={(checked) => setInstantSchedule(checked === true)}
                                        className="text-blue-600 border-blue-300 focus:ring-blue-300"
                                    />
                                    <div>
                                        <Label
                                            htmlFor="instant-schedule"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Schedule for immediate publishing
                                        </Label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Content will be published as soon as you click Schedule
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSchedulePost}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Schedule Post
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Scheduled Post Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Edit className="w-5 h-5 text-blue-600" />
                            </div>
                            <span>Edit Scheduled Post</span>
                        </DialogTitle>
                        <DialogDescription>Update the scheduling details for this post</DialogDescription>
                    </DialogHeader>

                    {selectedScheduledPost && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-medium text-gray-900">{selectedScheduledPost.contentTitle}</h3>
                                <div className="flex space-x-1 mt-2">
                                    {selectedScheduledPost.platforms.map((platform) => (
                                        <div
                                            key={platform}
                                            className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shadow-sm"
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
                                        <Label htmlFor="edit-date" className="text-gray-700">
                                            Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal border-gray-200 hover:border-blue-300"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
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
                                                    className="border border-blue-100 rounded-md"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-time" className="text-gray-700">
                                            Time
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
                                            <Input
                                                id="edit-time"
                                                type="time"
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-timezone" className="text-gray-700">
                                        Timezone
                                    </Label>
                                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                                        <SelectTrigger
                                            id="edit-timezone"
                                            className="border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                                        >
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
                                        className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                                        onClick={() => {
                                            handleDeleteScheduledPost(selectedScheduledPost.id)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                    <Button
                                        onClick={handleUpdateScheduledPost}
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                                    >
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
