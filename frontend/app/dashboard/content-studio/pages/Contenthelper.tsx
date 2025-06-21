import { sampleAssets } from "../helper";
import { Platform } from "../types";

export const getInitialPlatformData = (platform: Platform) => {
    if (platform === 'YouTube') {
        return {
            title: "Top 5 Indoor Plants to Boost Productivity 🌱",
            description: "Explore the best indoor plants for your home office.\n#IndoorPlants #ProductivityBoost",
            tags: ["IndoorPlants", "PlantCare", "WorkFromHome"],
            videoUrl: sampleAssets.video,
            thumbnailUrl: sampleAssets.image,
            categoryId: "26",  // How-to & Style
            privacyStatus: "public" as const,
            playlistId: "PLf1XPHghri"
        };
    } else if (platform === 'Instagram') {
        return {
            mentions: ["@plantlovers", "@urbanjungle"]
        };
    } else if (platform === 'Facebook') {
        return {
            taggedPages: ["@GreenRoots"],
            privacy: "Public" as const,
            linkUrl: "https://yourstore.com/indoor-plants"
        };
    } else {
        return {
            mentions: ["@plant_hub"],
            poll: undefined,
            quoteTweetId: undefined
        };
    }
};

export const getGridColumns = (imageCount: number) => {
    if (imageCount <= 2) return "grid-cols-2";
    if (imageCount <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };