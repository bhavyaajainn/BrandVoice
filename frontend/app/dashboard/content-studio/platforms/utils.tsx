import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Post, Platform } from '../types';

export const downloadContentAssets = async (
  post: Post,
  platform: Platform,
  setIsDownloading?: (loading: boolean) => void,
  uploadedFiles?: File[]
) => {
  if (setIsDownloading) {
    setIsDownloading(true);
  }

  try {
    const zip = new JSZip();

    
    let contentText = '';
    
    
    if (platform === 'YouTube') {
      const youtubePost = post as any;
      contentText += `Title: ${youtubePost.title || ''}\n\n`;
      contentText += `Description: ${youtubePost.description || ''}\n\n`;
      if (youtubePost.tags && youtubePost.tags.length > 0) {
        contentText += `Tags: ${youtubePost.tags.join(', ')}\n\n`;
      }
      if (youtubePost.categoryId) {
        contentText += `Category ID: ${youtubePost.categoryId}\n\n`;
      }
      if (youtubePost.privacyStatus) {
        contentText += `Privacy: ${youtubePost.privacyStatus}\n\n`;
      }
      if (youtubePost.playlistId) {
        contentText += `Playlist ID: ${youtubePost.playlistId}\n\n`;
      }
      if (youtubePost.videoUrl) {
        contentText += `Video URL: ${youtubePost.videoUrl}\n\n`;
      }
    } else if (platform === 'Facebook') {
      const facebookPost = post as any;
      contentText += `Caption: ${post.text}\n\n`;
      if (post.hashtags.length > 0) {
        contentText += `Hashtags: ${post.hashtags.join(' ')}\n\n`;
      }
      if (facebookPost.taggedPages && facebookPost.taggedPages.length > 0) {
        contentText += `Tagged Pages: ${facebookPost.taggedPages.join(' ')}\n\n`;
      }
      if (facebookPost.linkUrl) {
        contentText += `Link URL: ${facebookPost.linkUrl}\n\n`;
      }
      if (facebookPost.privacy) {
        contentText += `Privacy: ${facebookPost.privacy}\n\n`;
      }
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        contentText += `Media URLs:\n${post.mediaUrls.map((url, index) => `${index + 1}. ${url}`).join('\n')}\n\n`;
      }
    } else if (platform === 'Twitter') {
      contentText += `Tweet: ${post.text}\n\n`;
      if (post.hashtags.length > 0) {
        contentText += `Hashtags: ${post.hashtags.join(' ')}\n\n`;
      }
      const twitterPost = post as any;
      if (twitterPost.mentions && twitterPost.mentions.length > 0) {
        contentText += `Mentions: ${twitterPost.mentions.join(' ')}\n\n`;
      }
      if (twitterPost.quoteTweetId) {
        contentText += `Quote Tweet ID: ${twitterPost.quoteTweetId}\n\n`;
      }
      if (twitterPost.poll) {
        contentText += `Poll Options: ${twitterPost.poll.options.join(', ')}\n`;
        contentText += `Poll Duration: ${twitterPost.poll.durationMinutes} minutes\n\n`;
      }
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        contentText += `Media URLs:\n${post.mediaUrls.map((url, index) => `${index + 1}. ${url}`).join('\n')}\n\n`;
      }
    } else if (platform === 'Instagram') {
      contentText += `Caption: ${post.text}\n\n`;
      if (post.hashtags.length > 0) {
        contentText += `Hashtags: ${post.hashtags.join(' ')}\n\n`;
      }
      const instagramPost = post as any;
      if (instagramPost.mentions && instagramPost.mentions.length > 0) {
        contentText += `Mentions: ${instagramPost.mentions.join(' ')}\n\n`;
      }
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        contentText += `Media URLs:\n${post.mediaUrls.map((url, index) => `${index + 1}. ${url}`).join('\n')}\n\n`;
      }
    }

    if (post.locationId) {
      contentText += `Location: ${post.locationId}\n`;
    }

    
    zip.file(`${platform.toLowerCase()}_content.txt`, contentText);

    
    const mediaPromises: Promise<void>[] = [];

    
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach((file, index) => {
        let fileName = '';
        const fileExtension = '.' + (file.name.split('.').pop() || 'bin');
        
        if (file.type.startsWith('video/')) {
          fileName = uploadedFiles.length > 1 ? `video_${index + 1}${fileExtension}` : `video${fileExtension}`;
        } else if (file.type === 'image/gif') {
          fileName = uploadedFiles.length > 1 ? `gif_${index + 1}${fileExtension}` : `gif${fileExtension}`;
        } else if (file.type.startsWith('image/')) {
          fileName = uploadedFiles.length > 1 ? `image_${index + 1}${fileExtension}` : `image${fileExtension}`;
        } else {
          fileName = file.name;
        }
        
        zip.file(fileName, file);
      });
    } else {
      
      if (platform === 'YouTube') {
        const youtubePost = post as any;
        
        
        if (youtubePost.videoUrl) {
          const videoPromise = downloadFromUrl(youtubePost.videoUrl, 'video', zip);
          if (videoPromise) mediaPromises.push(videoPromise);
        }
      } else if (post.mediaUrls && post.mediaUrls.length > 0) {
        
        post.mediaUrls.forEach((url, index) => {
          let filePrefix = '';
          if (post.mediaType === 'video') {
            filePrefix = 'video';
          } else if (post.mediaType === 'gif') {
            filePrefix = 'gif';
          } else {
            filePrefix = post.mediaType === 'carousel' ? `image_${index + 1}` : 'image';
          }
          
          const promise = downloadFromUrl(url, filePrefix, zip);
          if (promise) mediaPromises.push(promise);
        });
      }
    }

    
    await Promise.all(mediaPromises);

    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const fileName = `${platform.toLowerCase()}_content_${new Date().toISOString().split('T')[0]}.zip`;
    saveAs(zipBlob, fileName);

  } catch (error) {
    console.error('Error creating download:', error);
    alert('Failed to download assets. Please try again.');
  } finally {
    if (setIsDownloading) {
      setIsDownloading(false);
    }
  }
};


const downloadFromUrl = (url: string, filePrefix: string, zip: JSZip): Promise<void> | null => {
  
  if (url.startsWith('blob:')) {
    console.warn('Skipping blob URL, file should be handled via uploadedFiles');
    return null;
  }

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      return response.blob();
    })
    .then(blob => {
      let fileExtension = '';
      
      
      if (blob.type.includes('mp4')) fileExtension = '.mp4';
      else if (blob.type.includes('webm')) fileExtension = '.webm';
      else if (blob.type.includes('ogg')) fileExtension = '.ogg';
      else if (blob.type.includes('mov')) fileExtension = '.mov';
      else if (blob.type.includes('avi')) fileExtension = '.avi';
      else if (blob.type.includes('png')) fileExtension = '.png';
      else if (blob.type.includes('gif')) fileExtension = '.gif';
      else if (blob.type.includes('webp')) fileExtension = '.webp';
      else if (blob.type.includes('jpeg') || blob.type.includes('jpg')) fileExtension = '.jpg';
      else if (blob.type.includes('svg')) fileExtension = '.svg';
      else if (blob.type.includes('bmp')) fileExtension = '.bmp';
      else {
        
        const urlParts = url.split('?')[0].split('.');
        const urlExtension = urlParts.length > 1 ? urlParts.pop() : null;
        fileExtension = urlExtension ? `.${urlExtension}` : '.bin';
      }

      const fileName = `${filePrefix}${fileExtension}`;
      zip.file(fileName, blob);
    })
    .catch(error => {
      console.error(`Failed to download ${filePrefix} from ${url}:`, error);
      
    });
};