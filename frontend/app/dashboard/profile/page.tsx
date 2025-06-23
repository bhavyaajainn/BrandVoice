"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Save,
    Edit,
    Trash2,
    User,
    Sparkles,
    AlertTriangle,
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
import { dummybrandifles } from "@/lib/data"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { useAuthContext } from "@/lib/AuthContext"
import { motion } from "framer-motion"
import { BrandFile } from "@/lib/types"
import Image from "next/image"
import { getBrandRequest, updateBrandRequest } from "@/lib/redux/actions/brandActions"
import { getTokenRequest } from "@/lib/redux/actions/authActions"
import Guidelines from "./components/Guidelines"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"

export default function BrandProfile() {
    const { user } = useAuthContext();
    const [brandName, setBrandName] = useState("BrandVoice AI")
    const [brandDescription, setBrandDescription] = useState(
        "AI-powered content generation platform that helps businesses create consistent, engaging content across all marketing channels.",
    )
    const [brandLogo, setBrandLogo] = useState<File | null>(null)
    const [industry, setIndustry] = useState("Technology")
    const [isEditing, setIsEditing] = useState(false)
    const [brandFiles, setBrandFiles] = useState<BrandFile[]>(dummybrandifles);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const dispatch = useAppDispatch();
    const { brand, loading, error } = useAppSelector((state) => state.brand);
    const [hasInitialized, setHasInitialized] = useState(false)
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const { token } = useAppSelector(state => state.auth)
    const [platforms, setplatforms] = useState<string[]>(brand?.marketing_platforms || []);
    const platformIcons: Record<string, React.ElementType> = {
        youtube: FaYoutube,
        facebook: FaFacebook,
        instagram: FaInstagram,
        twitter: FaTwitter,
    };
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

    useEffect(() => {
        if (brand) {
            setBrandName(brand.brand_name || "");
            setBrandDescription(brand.description || "");
        }
    }, [brand]);


    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBrandLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            if (!user?.uid) {
                throw new Error("User ID is required to save brand profile.");
            }

            if (!brandName) {
                throw new Error("Brand name is required.");
            }

            if (!brandDescription) {
                throw new Error("Brand description is required.");
            }

            const updateData = {
                brandId: user.uid,
                brandData: {
                    brand_id: brand?.brand_id,
                    brand_name: brandName,
                    description: brandDescription,
                    logo: brandLogo,
                    platforms: platforms.join(','),
                },
            };

            dispatch(updateBrandRequest(updateData));

            console.log("Update data payload", updateData);


            setIsEditing(false);
        } catch (error: any) {
            console.log("Error saving brand profile:", error);
            alert(`Failed to save brand profile. ${error.message}. Please try again.`);
        }
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
                                            onClick={() => handleSave()}
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
                                            <div className="flex flex-col space-y-2 w-full">
                                                {isEditing ? (
                                                    <>
                                                        <Input
                                                            id="logo-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleLogoUpload}
                                                        />

                                                        {logoPreview ? (
                                                            <div className="flex w-full items-center justify-center">
                                                                <Image src={logoPreview} alt="Logo preview" width={150} height={150} className="object-contain rounded" />
                                                            </div>
                                                        ) : (
                                                            <div className="flex w-full items-center justify-center">
                                                                <div className="bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => document.getElementById("logo-upload")?.click()}
                                                            className="w-full border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                                        >
                                                            {logoFile ? "Change Logo" : "Upload Logo"}
                                                        </Button>

                                                        {logoFile && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setLogoFile(null);
                                                                    setLogoPreview(null);
                                                                }}
                                                                className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                                                            >
                                                                Remove Logo
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="flex w-full items-center justify-center">
                                                        {brand?.logo_url ? (
                                                            <img src={brand.logo_url} alt="Brand Logo" width={150} height={150} className="object-contain rounded" />
                                                        ) : (
                                                            <div className="bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                                                </svg>
                                                            </div>
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
                                                    value={brandName}
                                                    className={`${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300 focus:border-blue-300 focus:ring-blue-300"} transition-colors`}
                                                    placeholder="Enter brand name"
                                                />
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
                                                    placeholder="Enter description"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                            <label className="block text-xl font-semibold text-slate-800 mb-6 text-center">
                                Marketing Platforms
                            </label>

                            {isEditing ? (
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {["youtube", "facebook", "instagram", "twitter"].map((platform) => (
                                        <div key={platform} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={platform}
                                                name={platform}
                                                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                                                checked={platforms?.includes(platform)}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    const updatedPlatforms = isChecked
                                                        ? [...platforms, platform]
                                                        : platforms.filter((p) => p !== platform);

                                                    setplatforms(updatedPlatforms);
                                                }}
                                            />
                                            <label htmlFor={platform} className="ml-3 block text-sm font-medium text-gray-700">
                                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
                                    {brand ? brand?.marketing_platforms?.length > 0 ? (
                                        brand?.marketing_platforms.map((platform) => {
                                            const platformKey = platform.toLowerCase();
                                            const Icon = platformIcons[platformKey];

                                            return (
                                                <motion.button
                                                    key={platform}
                                                    type="button"
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="flex items-center gap-2 w-full px-4 py-2 rounded-full border-2 transition-all duration-200 bg-white text-slate-800 border-slate-300 hover:bg-blue-50"
                                                >
                                                    {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                                                    <span className="font-medium text-sm capitalize">{platform}</span>
                                                </motion.button>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center text-gray-600">
                                            You have not added any marketing platforms.
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>


                        <Guidelines />

                    </div>
                </div>
            </div>
        </>
    )
}
