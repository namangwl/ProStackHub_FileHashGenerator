import CryptoJS from 'crypto-js';

// Dev Note: CryptoJS doesn't natively swallow raw ArrayBuffers well on the client side.
// Doing bitwise magic here to manually map the buffer to a WordArray.
const convertToWordArray = (rawBuffer) => {
    const view = new Uint8Array(rawBuffer);
    const words = [];
    
    // Packing 4 bytes into 32-bit words
    for (let i = 0; i < view.length; i++) {
        words[i >>> 2] |= view[i] << (24 - (i % 4) * 8);
    }
    
    return CryptoJS.lib.WordArray.create(words, view.length);
};

export const analyzeFile = (fileObj) => {
    return new Promise((resolve, reject) => {
        // Bail out early if nothing was passed
        if (!fileObj) return reject("No file selected for processing.");

        // Security/UX check: Warn if file is ridiculously large (e.g., > 100MB)
        // because client-side hashing might freeze the browser tab
        if (fileObj.size > 100 * 1024 * 1024) {
            console.warn("Large file detected. Hashing might take a while.");
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const binaryData = event.target.result;
                const wordArr = convertToWordArray(binaryData);

                // Generating hashes synchronously
                const generatedHashes = {
                    md5: CryptoJS.MD5(wordArr).toString(),
                    sha1: CryptoJS.SHA1(wordArr).toString(),
                    sha256: CryptoJS.SHA256(wordArr).toString()
                };

                resolve({
                    fileName: fileObj.name,
                    fileSize: (fileObj.size / 1024).toFixed(1) + ' KB',
                    mimeType: fileObj.type || 'Unknown/Binary',
                    hashes: generatedHashes
                });
            } catch (error) {
                console.error("Hash generation crashed:", error);
                reject("Crypto engine failed during hashing.");
            }
        };

        reader.onerror = () => reject("Browser I/O failed to read the file.");
        
        // Using ArrayBuffer instead of DataURL to prevent encoding corruption on binaries
        reader.readAsArrayBuffer(fileObj);
    });
};