import JSZip from "jszip";
import { colorPalette, moodboardImages, typographyStyles } from "../helper";
import saveAs from "file-saver";

export const generateColorPaletteText = () => {
    return colorPalette.map(color => 
        `${color.name}: ${color.hex}`
    ).join('\n');
};

export const generateTypographyText = () => {
    return typographyStyles.map(category => {
        const styles = category.styles.map(style =>
            `${style.name}:\n` +
            `  Font: ${style.font}\n` +
            `  Size: ${style.size}\n` +
            `  Weight: ${style.weight}\n` +
            `  Line Height: ${style.lineHeight}\n`
        ).join('\n');
        return `${category.category}:\n${styles}`;
    }).join('\n\n');
};

export const downloadAssets = async (setIsDownloading: (isDownloading: boolean) => void) => {
    try {
        setIsDownloading(true);
        const zip = new JSZip();
        zip.file('color-palette.txt', generateColorPaletteText());
        zip.file('typography.txt', generateTypographyText());
        const imagesFolder = zip.folder('images');
        const imagePromises = moodboardImages.map(async (image, index) => {
            try {
                const response = await fetch(image.url);
                const blob = await response.blob();
                const fileName = `image-${index + 1}${image.url.match(/\.[^.]*$/)?.[0] || '.jpg'}`;
                imagesFolder?.file(fileName, blob);
            } catch (error) {
                console.error(`Failed to download image: ${image.url}`, error);
            }
        });

        await Promise.all(imagePromises);

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'brand-assets.zip');
    } catch (error) {
        console.error('Failed to create zip file:', error);
    } finally {
        setIsDownloading(false);
    }
};