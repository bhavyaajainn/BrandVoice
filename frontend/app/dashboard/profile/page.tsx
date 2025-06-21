"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Upload,
    Save,
    Edit,
    Trash2,
    User,
    Sparkles,
    AlertTriangle,
    Target,
    Mail,
    Plus,
    Settings,
    Globe,
    Users,
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
import { dummybrandifles, industries } from "@/lib/data"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { useAuthContext } from "@/lib/AuthContext"
import { motion } from "framer-motion"
import { BrandFile } from "@/lib/types"
import Image from "next/image"
import { getBrandRequest, updateBrandRequest } from "@/lib/redux/actions/brandActions"
import { getTokenRequest } from "@/lib/redux/actions/authActions"
import Guidelines from "./components/Guidelines"

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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const dispatch = useAppDispatch();
    const { brand, loading, error } = useAppSelector((state) => state.brand);
    const [hasInitialized, setHasInitialized] = useState(false)

    console.log('brand state:', brand);

    const { token } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (user && !token) {
            dispatch(getTokenRequest())
        }
    }, [user, token, dispatch])

    useEffect(() => {
        if (user && token && !hasInitialized) {
            console.log('Dispatching getBrandRequest for user:', user.uid, brand)
            if (brand == null) {
                dispatch(getBrandRequest(user.uid))
            }
            setHasInitialized(true)
        }
    }, [user, token, hasInitialized, dispatch, brand]);


    const handleSave = async () => {
        const updateData = {
            brandId: user?.uid || "",
            brandData: {
                brand_id: brand?.brand_id,
                brand_name: brandName,
                description: brandDescription,
                logo: brandLogo ? new File([brandLogo], brandLogo, { type: 'image/png' }) : null,
            },
        };

        console.log("Update data payload", updateData);
        if (user?.uid) {
            dispatch(updateBrandRequest(updateData));
        }
        setIsEditing(false);
    }


    const handleDeleteAllData = () => {
        setBrandName("")
        setBrandDescription("")
        setBrandLogo(null)
        setIndustry("")
        setBrandFiles([])
        setShowDeleteDialog(false)
        setIsEditing(false)
    };


    if (error) return <p>Error: {error}</p>

    if (loading || (user && token && !hasInitialized)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (brand) {
        console.log("Profile Data", brand);
    };

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
                                                    {brand?.logo_url ? (
                                                        <Image
                                                            src={brand?.logo_url || "/placeholder.svg"}
                                                            alt="Brand Logo"
                                                            width={60}
                                                            height={60}
                                                            className="w-full h-full object-cover rounded-xl"
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
                                                        {brand?.logo_url && (
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
                                                    onChange={(e) => setBrandName(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={`${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300 focus:border-blue-300 focus:ring-blue-300"} transition-colors`}
                                                    placeholder={`${brand?.brand_name}`}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="brand-description" className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Brand Description
                                                </Label>
                                                <Textarea
                                                    id="brand-description"
                                                    value={brand?.description}
                                                    onChange={(e) => setBrandDescription(e.target.value)}
                                                    disabled={!isEditing}
                                                    className={`${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300 focus:border-blue-300 focus:ring-blue-300"} transition-colors`}
                                                    rows={4}
                                                    placeholder={`${brand?.description}`}
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
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-300"></div>
                                <CardHeader className="bg-gradient-to-r from-green-50 to-white py-2">
                                    <CardTitle className="flex items-center text-xl mt-2">
                                        <Globe className="w-5 h-5 mr-2 text-green-600" />
                                        Marketing Platforms
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-blue-600" />
                                                Social Media
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">f</span>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-900">Facebook</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-xs text-gray-600">Active</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg border border-sky-100">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">T</span>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-900">Twitter</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-xs text-gray-600">Active</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-100">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">IG</span>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-900">Instagram</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                                        <span className="text-xs text-gray-600">Inactive</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 flex items-center">
                                                <Target className="w-4 h-4 mr-2 text-orange-600" />
                                                Advertising
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">G</span>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-900">Google Ads</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-xs text-gray-600">Active</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">FB</span>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-900">Meta Ads</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-xs text-gray-600">Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-purple-600" />
                                                Email & Content
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">MC</span>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-900">Mailchimp</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-xs text-gray-600">Active</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-bold">HB</span>
                                                        </div>
                                                        <span className="ml-3 text-sm font-medium text-gray-900">HubSpot</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                                        <span className="text-xs text-gray-600">Inactive</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <div className="flex items-center mr-4">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                    <span>5 Active</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                                    <span>2 Inactive</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-300">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Platform
                                                </Button>
                                                <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-300">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <Guidelines />

                    </div>
                </div>
            </div>
        </>
    )
}
