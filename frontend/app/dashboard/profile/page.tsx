"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Upload,
    Archive,
    Save,
    Edit,
    Trash2,
    Plus,
    User,
    Target,
    MessageSquare,
    Sparkles,
    AlertTriangle,
    Shield,
    X,
} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getFileIcon } from "@/lib/reuse"
import { brandVoiceOptions, dummybrandifles, industries, targetAudienceOptions } from "@/lib/data"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { fetchUserData } from "@/lib/slices/userslice"
import { useAuthContext } from "@/lib/AuthContext"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { BrandFile } from "@/lib/types"
import Image from "next/image"

export default function BrandProfile() {
    const { user } = useAuthContext();
    const [brandName, setBrandName] = useState("BrandVoice AI")
    const [brandDescription, setBrandDescription] = useState(
        "AI-powered content generation platform that helps businesses create consistent, engaging content across all marketing channels.",
    )
    const [brandLogo, setBrandLogo] = useState<string | null>(null)
    const [industry, setIndustry] = useState("Technology")
    const [isEditing, setIsEditing] = useState(false)
    const [showFileDialog, setShowFileDialog] = useState(false)
    const [brandFiles, setBrandFiles] = useState<BrandFile[]>(dummybrandifles);
    const dispatch = useAppDispatch();
    const { data } = useAppSelector((state) => state.userData);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedAudiences, setSelectedAudiences] = useState<string[]>(["Working Professionals", "Entrepreneurs"])
    const [selectedVoices, setSelectedVoices] = useState<string[]>([
        "Professional & Authoritative",
        "Innovative & Forward-thinking",
    ])
    const handleAudienceToggle = (audience: string) => {
        setSelectedAudiences((prev) => (prev.includes(audience) ? prev.filter((a) => a !== audience) : [...prev, audience]))
    }

    const handleVoiceToggle = (voice: string) => {
        setSelectedVoices((prev) => (prev.includes(voice) ? prev.filter((v) => v !== voice) : [...prev, voice]))
    }
    const handleDeleteAllData = () => {
        setBrandName("")
        setBrandDescription("")
        setBrandLogo(null)
        setIndustry("")
        setSelectedAudiences([])
        setSelectedVoices([])
        setBrandFiles([])
        setShowDeleteDialog(false)
        setIsEditing(false)
    };
    
    useEffect(() => {
        if (user) {
            console.log(user.refreshToken);
            dispatch(fetchUserData(user.uid))
        }
    }, [dispatch, user]);

    // if (error) return <p>Error: {error}</p>

    if (data) {
        console.log("Profile Data", data);
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setBrandLogo(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            Array.from(files).forEach((file) => {
                const newFile: BrandFile = {
                    id: Date.now().toString(),
                    name: file.name,
                    type: file.type.split("/")[1]?.toUpperCase() || "Unknown",
                    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                    uploadDate: new Date().toISOString().split("T")[0],
                    url: URL.createObjectURL(file),
                }
                setBrandFiles((prev) => [...prev, newFile])
            })
        }
        setShowFileDialog(false)
    }

    const handleSave = () => {
        setIsEditing(false)
    }

    const handleDeleteFile = (fileId: string) => {
        setBrandFiles((prev) => prev.filter((file) => file.id !== fileId))
    };

    return (
        <>

            <div className="min-h-screen bg-white relative overflow-hidden">

                <div className="bg-white border-b border-gray-100 shadow-sm relative z-10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                            <div className="mb-4 md:mb-0">
                                <motion.div
                                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-2"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Brand Management
                                </motion.div>
                                <h1 className="text-3xl font-bold text-gray-900">Brand Profile</h1>
                                <p className="text-gray-600 mt-1">Manage your brand information and assets</p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="flex items-center space-x-3"
                            >
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="border-gray-200 hover:border-gray-300"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete All Data
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="flex items-center text-red-600">
                                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                                        Delete All Brand Data
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-600">
                                                        This action will permanently remove all your brand information, including your profile data,
                                                        uploaded assets, and AI training data from our platform. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleDeleteAllData}
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        Delete Everything
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-white py-2">
                                    <CardTitle className="flex items-center text-xl mt-2">
                                        <User className="w-5 h-5 mr-2 text-blue-600" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <Label className="text-sm font-medium text-gray-700 mb-3 block">Brand Logo</Label>
                                            <div className="flex flex-col items-center space-y-4">
                                                <motion.div
                                                    className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                >
                                                    {brandLogo ? (
                                                        <Image
                                                            src={brandLogo || "/placeholder.svg"}
                                                            alt="Brand Logo"
                                                            className="w-full h-full object-cover rounded-xl"
                                                            width={60}
                                                            height={60}
                                                        />
                                                    ) : (
                                                        <Upload className="w-12 h-12 text-gray-400" />
                                                    )}
                                                </motion.div>
                                                {isEditing && (
                                                    <div className="flex flex-col space-y-2 w-full">
                                                        <Input
                                                            id="logo-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleLogoUpload}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => document.getElementById("logo-upload")?.click()}
                                                            className="w-full border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                                        >
                                                            {brandLogo ? "Change Logo" : "Upload Logo"}
                                                        </Button>
                                                        {brandLogo && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setBrandLogo(null)}
                                                                className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                                                            >
                                                                Remove Logo
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="lg:col-span-2 space-y-4">
                                            <div>
                                                <Label htmlFor="brand-name" className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Brand Name
                                                </Label>
                                                <Input
                                                    id="brand-name"
                                                    value={brandName}
                                                    onChange={(e) => setBrandName(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={`${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300 focus:border-blue-300 focus:ring-blue-300"} transition-colors`}
                                                    placeholder="Enter your brand name"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="industry" className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Industry
                                                </Label>
                                                <Select value={industry} onValueChange={setIndustry} disabled={!isEditing}>
                                                    <SelectTrigger
                                                        id="industry"
                                                        className={`${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300 focus:border-blue-300 focus:ring-blue-300"} transition-colors`}
                                                    >
                                                        <SelectValue placeholder="Select your industry" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {industries.map((ind) => (
                                                            <SelectItem key={ind} value={ind}>
                                                                {ind}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="brand-description" className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Brand Description
                                                </Label>
                                                <Textarea
                                                    id="brand-description"
                                                    value={brandDescription}
                                                    onChange={(e) => setBrandDescription(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={`${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300 focus:border-blue-300 focus:ring-blue-300"} transition-colors`}
                                                    rows={4}
                                                    placeholder="Describe your brand, its mission, and what makes it unique..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-white py-4">
                                    <CardTitle className="flex items-center text-xl">
                                        <Target className="w-5 h-5 mr-2 text-emerald-600" />
                                        Target Audience
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">Select all audience segments that apply to your brand</p>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {targetAudienceOptions.map((audience) => (
                                            <motion.div
                                                key={audience}
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            >
                                                <div
                                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedAudiences.includes(audience)
                                                        ? "bg-emerald-50 border-emerald-200 shadow-sm"
                                                        : "bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30"
                                                        } ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
                                                    onClick={() => isEditing && handleAudienceToggle(audience)}
                                                >
                                                    <Checkbox
                                                        checked={selectedAudiences.includes(audience)}
                                                        onCheckedChange={() => isEditing && handleAudienceToggle(audience)}
                                                        disabled={!isEditing}
                                                        className="text-emerald-600 border-emerald-300 focus:ring-emerald-300"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">{audience}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {selectedAudiences.length > 0 && (
                                        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <h4 className="text-sm font-medium text-emerald-900 mb-2">Selected Audiences:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedAudiences.map((audience) => (
                                                    <Badge
                                                        key={audience}
                                                        variant="secondary"
                                                        className="bg-emerald-100 text-emerald-700 border-emerald-200"
                                                    >
                                                        {audience}
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleAudienceToggle(audience)}
                                                                className="ml-1 hover:text-emerald-900"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-violet-300"></div>
                                <CardHeader className="bg-gradient-to-r from-violet-50 to-white py-4">
                                    <CardTitle className="flex items-center text-xl">
                                        <MessageSquare className="w-5 h-5 mr-2 text-violet-600" />
                                        Brand Voice & Tone
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Choose the personality traits that best represent your brand
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {brandVoiceOptions.map((voice) => (
                                            <motion.div
                                                key={voice}
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            >
                                                <div
                                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedVoices.includes(voice)
                                                        ? "bg-violet-50 border-violet-200 shadow-sm"
                                                        : "bg-white border-gray-200 hover:border-violet-200 hover:bg-violet-50/30"
                                                        } ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
                                                    onClick={() => isEditing && handleVoiceToggle(voice)}
                                                >
                                                    <Checkbox
                                                        checked={selectedVoices.includes(voice)}
                                                        onCheckedChange={() => isEditing && handleVoiceToggle(voice)}
                                                        disabled={!isEditing}
                                                        className="text-violet-600 border-violet-300 focus:ring-violet-300"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">{voice}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {selectedVoices.length > 0 && (
                                        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
                                            <h4 className="text-sm font-medium text-violet-900 mb-2">Selected Voice Traits:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedVoices.map((voice) => (
                                                    <Badge
                                                        key={voice}
                                                        variant="secondary"
                                                        className="bg-violet-100 text-violet-700 border-violet-200"
                                                    >
                                                        {voice}
                                                        {isEditing && (
                                                            <button onClick={() => handleVoiceToggle(voice)} className="ml-1 hover:text-violet-900">
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300"></div>
                                <CardHeader className="bg-gradient-to-r from-orange-50 to-white py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center text-xl">
                                                <Archive className="w-5 h-5 mr-2 text-orange-600" />
                                                Brand Assets
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">Upload files that represent your brand identity</p>
                                        </div>
                                        <Button
                                            onClick={() => setShowFileDialog(true)}
                                            variant="outline"
                                            size="sm"
                                            disabled={!isEditing}
                                            className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Files
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {brandFiles.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {brandFiles.map((file, index) => (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                                    whileHover={{ y: -2 }}
                                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg">{getFileIcon(file.type)}</div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{file.name}</h3>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                <span>{file.size}</span>
                                                                <span>•</span>
                                                                <span>Uploaded {file.uploadDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline" className="bg-gray-50">
                                                            {file.type}
                                                        </Badge>
                                                        {isEditing && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteFile(file.id)}
                                                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                                            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4 shadow-md">
                                                <Upload className="w-8 h-8 text-orange-600" />
                                            </div>
                                            <h3 className="text-xl font-medium text-gray-900 mb-2">No brand assets uploaded</h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                Upload brand guidelines, logos, videos, and other assets to help AI understand your brand better.
                                            </p>
                                            {isEditing && (
                                                <Button
                                                    onClick={() => setShowFileDialog(true)}
                                                    variant="outline"
                                                    className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Upload Files
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 py-4">
                                    <CardTitle className="flex items-center text-xl">
                                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                                        AI Content Guidelines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            How this information helps AI create better content
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ul className="text-sm text-blue-800 space-y-2">
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    Brand description helps AI understand your company's mission and values
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    Target audience information ensures content resonates with the right people
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    Brand voice guidelines maintain consistency across all generated content
                                                </li>
                                            </ul>
                                            <ul className="text-sm text-blue-800 space-y-2">
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    Uploaded assets provide visual and contextual references for content creation
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    Industry selection helps AI use appropriate terminology and trends
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    Multi-select options allow for more nuanced brand personality representation
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-orange-600" />
                                </div>
                                <span>Upload Brand Assets</span>
                            </DialogTitle>
                            <DialogDescription>
                                Upload files that represent your brand. These will help AI generate more accurate content.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <motion.div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-300 hover:bg-orange-50/30 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h3>
                                <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                                <Input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    id="file-upload"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                    className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600"
                                >
                                    Choose Files
                                </Button>
                            </motion.div>

                            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                <strong>Supported formats:</strong> PDF, DOC, DOCX, JPG, PNG, GIF, MP4, AVI, MOV, MP3, WAV, ZIP, RAR
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}
