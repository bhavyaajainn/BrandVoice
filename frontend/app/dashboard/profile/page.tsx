"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Save, Edit, Trash2, Plus } from "lucide-react"
import { BrandFile } from "@/lib/types"
import Header from "../components/Header"
import { getFileIcon } from "@/lib/reuse"
import { dummybrandifles } from "@/lib/data"
import Image from "next/image"

export default function BrandProfile() {
    const [brandName, setBrandName] = useState("BrandVoice AI")
    const [brandDescription, setBrandDescription] = useState(
        "AI-powered content generation platform that helps businesses create consistent, engaging content across all marketing channels.",
    )
    const [brandLogo, setBrandLogo] = useState<string | null>(null)
    const [industry, setIndustry] = useState("Technology")
    const [targetAudience, setTargetAudience] = useState("Marketing professionals and content creators")
    const [brandVoice, setBrandVoice] = useState("Professional, innovative, and approachable")
    const [isEditing, setIsEditing] = useState(false)
    const [showFileDialog, setShowFileDialog] = useState(false)
    const [brandFiles, setBrandFiles] = useState<BrandFile[]>(dummybrandifles);

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
            {/* @ts-ignore */}
            <Header />

            <div className="min-h-screen bg-gray-50">
                <div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                                <h1 className="text-2xl font-bold text-gray-900">Brand Profile</h1>
                                <p className="text-gray-600 mt-1">Manage your brand information and assets</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                                    <div className="mb-6 md:mb-0">
                                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Brand Logo</Label>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                                {brandLogo ? (
                                                    <Image
                                                        src={brandLogo || "/placeholder.svg"}
                                                        alt="Brand Logo"
                                                        width={60}
                                                        height={60}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Upload className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            {isEditing && (
                                                <div className="space-y-2">
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
                                                    >
                                                        {brandLogo ? "Change Logo" : "Upload Logo"}
                                                    </Button>
                                                    {brandLogo && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setBrandLogo(null)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <Label htmlFor="brand-name" className="mb-2">Brand Name</Label>
                                            <Input
                                                id="brand-name"
                                                value={brandName}
                                                onChange={(e) => setBrandName(e.target.value)}
                                                disabled={!isEditing}
                                                className={!isEditing ? "bg-gray-50" : ""}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="industry" className="mb-2">Industry</Label>
                                            <Select value={industry} onValueChange={setIndustry} disabled={!isEditing}>
                                                <SelectTrigger id="industry" className={!isEditing ? "bg-gray-50" : ""}>
                                                    <SelectValue placeholder="Select industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Technology">Technology</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="Finance">Finance</SelectItem>
                                                    <SelectItem value="Education">Education</SelectItem>
                                                    <SelectItem value="Retail">Retail</SelectItem>
                                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                    <SelectItem value="Services">Services</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="brand-description" className="mb-2">Brand Description</Label>
                                    <Textarea
                                        id="brand-description"
                                        value={brandDescription}
                                        onChange={(e) => setBrandDescription(e.target.value)}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                        rows={4}
                                        placeholder="Describe your brand, its mission, and what makes it unique..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="target-audience" className="mb-2">Target Audience</Label>
                                    <Textarea
                                        id="target-audience"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                        rows={2}
                                        placeholder="Describe your target audience demographics and characteristics..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="brand-voice" className="mb-2">Brand Voice & Tone</Label>
                                    <Textarea
                                        id="brand-voice"
                                        value={brandVoice}
                                        onChange={(e) => setBrandVoice(e.target.value)}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                        rows={2}
                                        placeholder="Describe your brand's personality, tone, and communication style..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Brand Assets</CardTitle>
                                    <Button onClick={() => setShowFileDialog(true)} variant="outline" size="sm" disabled={!isEditing}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Files
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {brandFiles.length > 0 ? (
                                    <div className="space-y-3">
                                        {brandFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {getFileIcon(file.type)}
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
                                                    <Badge variant="outline">{file.type}</Badge>
                                                    {isEditing && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteFile(file.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                            <Upload className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No brand assets uploaded</h3>
                                        <p className="text-gray-500 mb-4">
                                            Upload brand guidelines, logos, videos, and other assets to help AI understand your brand better.
                                        </p>
                                        {isEditing && (
                                            <Button onClick={() => setShowFileDialog(true)} variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Upload Files
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>AI Content Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-2">How this information helps AI</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Brand description helps AI understand your company's mission and values</li>
                                        <li>• Target audience information ensures content resonates with the right people</li>
                                        <li>• Brand voice guidelines maintain consistency across all generated content</li>
                                        <li>• Uploaded assets provide visual and contextual references for content creation</li>
                                        <li>• Industry selection helps AI use appropriate terminology and trends</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Upload Brand Assets</DialogTitle>
                            <DialogDescription>
                                Upload files that represent your brand. These will help AI generate more accurate content.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                                    Choose Files
                                </Button>
                            </div>

                            <div className="text-xs text-gray-500">
                                Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, MP4, AVI, MOV, MP3, WAV, ZIP, RAR
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>


    )
}
