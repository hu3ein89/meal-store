// utils/imageConverter.js
export const convertToWebP = async (imageUrl) => {
    try {
      // Check if the browser supports WebP
      const supportsWebP = await checkWebPSupport();
      if (!supportsWebP) return imageUrl; // Fallback to original if no WebP support
      
      // Check if we already have a cached WebP version
      const cachedWebP = localStorage.getItem(`webp_${imageUrl}`);
      if (cachedWebP) return cachedWebP;
  
      // Fetch the original image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
  
      // Convert to WebP
      const webpBlob = await convertBlobToWebP(blob);
      const webpUrl = URL.createObjectURL(webpBlob);
  
      // Cache the WebP URL (optional)
      localStorage.setItem(`webp_${imageUrl}`, webpUrl);
  
      return webpUrl;
    } catch (error) {
      console.error('Error converting to WebP:', error);
      return imageUrl; // Fallback to original on error
    }
  };
  
  const checkWebPSupport = async () => {
    // Check for WebP support
    if (!self.createImageBitmap) return false;
    
    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  };
  
  const convertBlobToWebP = async (blob) => {
    // Create an image element to draw to canvas
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((webpBlob) => {
          resolve(webpBlob || blob); // Fallback to original if conversion fails
        }, 'image/webp', 0.8); // 0.8 is quality (0-1)
      };
      img.onerror = () => resolve(blob); // Fallback to original on error
    });
  };