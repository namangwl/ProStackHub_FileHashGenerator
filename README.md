# 🔐 Cryptographic File Hash Generator

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![CryptoJS](https://img.shields.io/badge/crypto--js-F2C94C?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A purely client-side, zero-knowledge file hashing engine built with React and CryptoJS. This tool allows users to securely generate cryptographic digests (MD5, SHA-1, SHA-256) of any file directly within their browser, ensuring no sensitive data is ever transmitted over the network.

**[🔴 Live Deployment (Vercel)]([prostackhub-file-hash-generator.vercel.app](https://prostackhub-file-hash-generator-mcjshen3m-naman-s-projects9.vercel.app/))**

---

## 🏗️ Technical Architecture & Features
- **100% Client-Side Processing:** Utilizes the HTML5 `FileReader` API and `ArrayBuffer` to process files in memory.
- **Custom Drag-and-Drop Engine:** Engineered a native, dependency-free Drag-and-Drop zone for a seamless UX.
- **Bitwise WordArray Conversion:** Optimized memory handling by manually mapping binary buffers to CryptoJS WordArrays, preventing browser freezing on large files.
- **Asynchronous UI Unblocking:** Hash generation is wrapped in Promises to keep the React thread responsive.

## 🔒 Why Hashing is Crucial (Forensics & Integrity)
As per standard cybersecurity practices:
- **File Integrity Verification:** Hashes act as a digital fingerprint. By comparing the hash of a downloaded file against the hash provided by the author, users can verify the file hasn't been tampered with or corrupted.
- **Malware Analysis:** In digital forensics, security analysts use SHA-256 hashes of suspicious files to check against threat intelligence databases (like VirusTotal) without executing the payload.
- **One-Way Function:** Cryptographic hashes are irreversible, making it impossible to reconstruct the original file from the hash string alone.

---
*Developed as part of the ProStackHub Cybersecurity & Development Internship Track.*
