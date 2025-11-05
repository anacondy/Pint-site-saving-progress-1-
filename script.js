/**
 * Poetic Image Gallery - Main Application
 * Modern ES6+ JavaScript with enhanced security and performance
 */

'use strict';

// Configuration
const CONFIG = {
    API_BASE_URL: window.location.protocol === 'file:' ? 'http://localhost:5000' : '',
    PRESS_DURATION: 3000, // milliseconds
    SLIDESHOW_INTERVAL: 5000, // milliseconds
    DEFAULT_IMAGE_URL: 'https://via.placeholder.com/250x250/808080/FFFFFF?text=Generated+Image',
    TRIGGER_NAME: 'alan', // Name to trigger Pinterest page
    DEFAULT_BOARD_ID: '470072049909241031',
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
};

// Utility functions
const utils = {
    /**
     * Sanitize user input to prevent XSS
     */
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    /**
     * Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Check if running in production
     */
    isProduction() {
        return window.location.protocol === 'https:' || 
               window.location.hostname !== 'localhost';
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- SHARED ELEMENTS ---
    const body = document.body;
    const homePage = document.getElementById('homePageContainer');
    const uploadInterface = document.getElementById('uploadInterfaceContainer');
    const retroSettingsPage = document.getElementById('retroSettingsContainer');
    const pinterestCalmingPage = document.getElementById('pinterestCalmingPageContainer');

    // --- HOME PAGE ELEMENTS ---
    const displayImage = document.getElementById('displayImage');
    const imageUpload = document.getElementById('imageUpload');
    const resetImageButton = document.getElementById('resetImage');
    const homeImageFrame = document.getElementById('homeImageFrame');
    const homeTextInput = document.getElementById('homeTextInput');
    const defaultImageUrl = CONFIG.DEFAULT_IMAGE_URL;

    // --- UPLOAD INTERFACE ELEMENTS ---
    const permissionButton = document.getElementById('permissionButton');
    const userGallery = document.getElementById('userGallery');
    const dragDropArea = document.getElementById('dragDropArea');
    const uploadImageInput = document.getElementById('uploadImageInput');
    const uploadButton = document.getElementById('uploadButton');
    const closeUploadInterfaceButton = document.getElementById('closeUploadInterface');

    // --- RETRO SETTINGS ELEMENTS ---
    const timeIST = document.getElementById('timeIST');
    const timeGMT = document.getElementById('timeGMT');
    const timeUTAH = document.getElementById('timeUTAH');
    const connWindows = document.getElementById('connWindows');
    const connAndroid = document.getElementById('connAndroid');
    const connIOS = document.getElementById('connIOS');
    const connTotal = document.getElementById('connTotal');
    const retroCpu = document.getElementById('retroCpu');
    const retroUser = document.getElementById('retroUser');
    const retroSys = document.getElementById('retroSys');
    const retroIdle = document.getElementById('retroIdle');
    const darkModeToggle = document.getElementById('retroDarkModeToggle');
    const darkModeStatus = document.getElementById('retroDarkModeStatus');
    const pinterestBoardIDInput = document.getElementById('pinterestBoardID');
    const closeRetroSettingsButton = document.getElementById('closeRetroSettings');

    let retroIntervals = null;

    // --- PINTEREST CALMING PAGE ELEMENTS ---
    const pinterestNameText = document.getElementById('pinterestNameText');
    const pinterestImage = document.getElementById('pinterestImage');
    const closePinterestCalmingPageButton = document.getElementById('closePinterestCalmingPage');
    let pinterestSlideshowInterval = null;
    let pinterestImages = [];
    let currentPinterestImageIndex = 0;

    // ===================================
    //  SYSTEM THEME DETECTION & DAY/NIGHT MODE
    // ===================================

    /**
     * Detect system color scheme preference
     */
    function getSystemThemePreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Set theme based on system preference and time
     */
    function setDayNightMode() {
        // First, check system preference
        const systemPreference = getSystemThemePreference();
        
        // Then check time-based preference
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23' };
        const currentHourIST = parseInt(new Intl.DateTimeFormat('en-US', options).format(now));

        // Apply dark mode if system prefers it OR if it's night time (20:00-06:00 IST)
        if (systemPreference === 'dark' || currentHourIST >= 20 || currentHourIST < 6) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        updateRetroToggleStatus();
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', (e) => {
            setDayNightMode();
        });
    }

    // Initialize theme and check periodically
    setDayNightMode();
    setInterval(setDayNightMode, 60 * 1000);

    // ===================================
    //  HOME PAGE IMAGE HANDLING
    // ===================================

    // Home Page Image Upload (Settings Panel)
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) handleFileForFrame(file);
    });
    
    resetImageButton.addEventListener('click', () => {
        displayImage.src = defaultImageUrl;
        imageUpload.value = '';
    });

    // Home Page Drag and Drop
    homeImageFrame.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.currentTarget.style.border = '2px dashed #007bff';
    });
    
    homeImageFrame.addEventListener('dragleave', (event) => {
        event.currentTarget.style.border = '1px solid #ddd';
    });
    
    homeImageFrame.addEventListener('drop', (event) => {
        event.preventDefault();
        event.currentTarget.style.border = '1px solid #ddd';
        const file = event.dataTransfer.files[0];
        if (file) handleFileForFrame(file);
    });

    /**
     * Handle file selection for image frame
     */
    function handleFileForFrame(file) {
        if (!file || !file.type.startsWith('image/')) {
            console.warn('Invalid file type. Please select an image.');
            return;
        }
        
        // Check file size
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            alert(`File size too large. Please select an image under ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            displayImage.src = e.target.result;
        };
        reader.onerror = () => {
            console.error('Failed to read file');
            alert('Failed to load image. Please try again.');
        };
        reader.readAsDataURL(file);
    }

    /**
     * Home Page Text Input for Pinterest Page Trigger
     */
    homeTextInput.addEventListener('input', (event) => {
        const text = event.target.value.toLowerCase();
        const sanitizedText = utils.sanitizeInput(text);
        
        if (sanitizedText.includes(CONFIG.TRIGGER_NAME)) {
            showPinterestCalmingPage("Nature");
            event.target.value = '';
        }
    });

    // ===================================
    //  UPLOAD INTERFACE LOGIC
    // ===================================

    closeUploadInterfaceButton.addEventListener('click', hideUploadInterface);
    
    /**
     * Request directory permission and load images
     */
    permissionButton.addEventListener('click', async () => {
        try {
            if (!window.showDirectoryPicker) {
                alert('Your browser does not support the File System Access API. Please use Chrome or Edge.');
                return;
            }
            
            const dirHandle = await window.showDirectoryPicker();
            userGallery.innerHTML = '<div style="color: #fff; padding: 20px;">Loading images...</div>';
            let imagesFound = 0;
            
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    if (file.type.startsWith('image/')) {
                        if (imagesFound === 0) userGallery.innerHTML = '';
                        imagesFound++;
                        addImageToScrollGallery(URL.createObjectURL(file));
                    }
                }
            }
            
            if (imagesFound === 0) {
                userGallery.innerHTML = '<div style="color: #fff; padding: 20px;">No images found in that folder.</div>';
            }

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error accessing directory:', err);
            }
            userGallery.innerHTML = '<div style="color: #fff; padding: 20px;">Could not access folder.</div>';
        }
    });

    // Upload Interface Drag & Drop / File Input
    dragDropArea.addEventListener('click', () => uploadImageInput.click());
    uploadButton.addEventListener('click', () => uploadImageInput.click());
    uploadImageInput.addEventListener('change', (event) => {
        handleUploadFiles(event.target.files);
    });
    
    dragDropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.currentTarget.style.borderColor = '#fff';
    });
    
    dragDropArea.addEventListener('dragleave', (event) => {
        event.currentTarget.style.borderColor = '#777';
    });
    
    dragDropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        event.currentTarget.style.borderColor = '#777';
        handleUploadFiles(event.dataTransfer.files);
    });

    /**
     * Handle multiple file uploads
     */
    function handleUploadFiles(files) {
        if (!files || files.length === 0) return;
        
        if (userGallery.innerHTML.includes('...') || userGallery.innerHTML.includes('folder')) {
            userGallery.innerHTML = '';
        }
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                // Check file size
                if (file.size > CONFIG.MAX_FILE_SIZE) {
                    console.warn(`File ${file.name} is too large. Skipping.`);
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => addImageToScrollGallery(e.target.result);
                reader.onerror = () => console.error(`Failed to read ${file.name}`);
                reader.readAsDataURL(file);
            }
        });
    }
    
    /**
     * Add image to the scrollable gallery
     */
    function addImageToScrollGallery(imageUrl) {
        const div = document.createElement('div');
        div.classList.add('gallery-image');
        div.style.backgroundImage = `url('${imageUrl}')`;
        div.setAttribute('role', 'img');
        div.setAttribute('aria-label', 'Uploaded image');
        userGallery.appendChild(div);
        
        // Smooth scroll to the new image
        setTimeout(() => {
            userGallery.scrollLeft = userGallery.scrollWidth;
        }, 100);
    }

    /**
     * Keyboard navigation for gallery scrolling
     */
    document.addEventListener('keydown', (e) => {
        if (!uploadInterface.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                userGallery.scrollBy({ left: -220, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                userGallery.scrollBy({ left: 220, behavior: 'smooth' });
            }
        }
    });


    // ===================================
    //  KEYBOARD SHORTCUT LOGIC
    // ===================================

    let keysPressed = {};
    let shortcutTimer = null;

    /**
     * Handle keyboard shortcuts
     */
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        // Handle ESC key for closing pages
        if (key === 'escape') {
            if (!uploadInterface.classList.contains('hidden')) {
                hideUploadInterface();
            } else if (!retroSettingsPage.classList.contains('hidden')) {
                hideRetroSettings();
            } else if (!pinterestCalmingPage.classList.contains('hidden')) {
                hidePinterestCalmingPage();
            }
            return;
        }

        // Only track U, F, S keys for shortcuts
        if (!['u', 'f', 's'].includes(key)) return;
        
        keysPressed[key] = true;

        // Prevent multiple timers
        if (shortcutTimer) return;

        // Check for U+F (Upload Interface) - only from home page
        if (keysPressed['u'] && keysPressed['f'] && !homePage.classList.contains('hidden')) {
            shortcutTimer = setTimeout(showUploadInterface, CONFIG.PRESS_DURATION);
        }

        // Check for S+F (Retro Settings) - from any page
        if (keysPressed['s'] && keysPressed['f']) {
            shortcutTimer = setTimeout(showRetroSettings, CONFIG.PRESS_DURATION);
        }
    });

    /**
     * Clear keyboard shortcut state on key release
     */
    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();

        if (['u', 'f', 's'].includes(key)) {
            if (shortcutTimer) {
                clearTimeout(shortcutTimer);
                shortcutTimer = null;
            }
            delete keysPressed[key];
        }
    });


    // ===================================
    //  PAGE NAVIGATION FUNCTIONS
    // ===================================

    /**
     * Show upload interface page
     */
    function showUploadInterface() {
        homePage.classList.add('hidden');
        retroSettingsPage.classList.add('hidden');
        pinterestCalmingPage.classList.add('hidden');
        uploadInterface.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'none';
        stopRetroIntervals();
        stopPinterestSlideshow();
    }

    /**
     * Hide upload interface and return to home
     */
    function hideUploadInterface() {
        uploadInterface.classList.add('hidden');
        homePage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'block';
    }

    /**
     * Show retro settings page
     */
    function showRetroSettings() {
        homePage.classList.add('hidden');
        uploadInterface.classList.add('hidden');
        pinterestCalmingPage.classList.add('hidden');
        retroSettingsPage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'none';
        startRetroIntervals();
        stopPinterestSlideshow();
    }

    /**
     * Hide retro settings and return to home
     */
    function hideRetroSettings() {
        retroSettingsPage.classList.add('hidden');
        homePage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'block';
        stopRetroIntervals();
    }

    /**
     * Show Pinterest calming page
     */
    function showPinterestCalmingPage(name) {
        homePage.classList.add('hidden');
        uploadInterface.classList.add('hidden');
        retroSettingsPage.classList.add('hidden');
        pinterestCalmingPage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'none';
        stopRetroIntervals();
        startPinterestSlideshow(name);
    }

    /**
     * Hide Pinterest calming page and return to home
     */
    function hidePinterestCalmingPage() {
        pinterestCalmingPage.classList.add('hidden');
        homePage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'block';
        stopPinterestSlideshow();
    }
    
    closePinterestCalmingPageButton.addEventListener('click', hidePinterestCalmingPage);
    closeRetroSettingsButton.addEventListener('click', hideRetroSettings);


    // ===================================
    //  RETRO SETTINGS PAGE LOGIC
    // ===================================

    /**
     * Toggle dark mode manually
     */
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateRetroToggleStatus();
    });

    /**
     * Update dark mode toggle status display
     */
    function updateRetroToggleStatus() {
        if (body.classList.contains('dark-mode')) {
            darkModeStatus.textContent = 'ON';
            darkModeStatus.classList.add('active');
        } else {
            darkModeStatus.textContent = 'OFF';
            darkModeStatus.classList.remove('active');
        }
    }

    /**
     * Start all retro page intervals
     */
    function startRetroIntervals() {
        if (retroIntervals) stopRetroIntervals();

        updateRetroClocks();
        simulateUserCounts();
        simulateCpu();

        const clockInterval = setInterval(updateRetroClocks, 1000);
        const userInterval = setInterval(simulateUserCounts, 2500);
        const cpuInterval = setInterval(simulateCpu, 1500);

        retroIntervals = [clockInterval, userInterval, cpuInterval];
    }

    /**
     * Stop all retro page intervals
     */
    function stopRetroIntervals() {
        if (retroIntervals) {
            retroIntervals.forEach(clearInterval);
            retroIntervals = null;
        }
    }

    /**
     * Update timezone clocks
     */
    function updateRetroClocks() {
        const now = new Date();
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        };

        timeIST.textContent = now.toLocaleString('en-US', { 
            ...timeOptions, 
            timeZone: 'Asia/Kolkata' 
        });
        timeGMT.textContent = now.toLocaleString('en-US', { 
            ...timeOptions, 
            timeZone: 'UTC' 
        });
        timeUTAH.textContent = now.toLocaleString('en-US', { 
            ...timeOptions, 
            timeZone: 'America/Denver' 
        });
    }

    /**
     * Simulate user connection counts
     */
    function simulateUserCounts() {
        const win = Math.floor(Math.random() * 200) + 50;
        const android = Math.floor(Math.random() * 300) + 100;
        const ios = Math.floor(Math.random() * 150) + 75;
        const total = win + android + ios;

        connWindows.textContent = win;
        connAndroid.textContent = android;
        connIOS.textContent = ios;
        connTotal.textContent = total;
    }

    /**
     * Simulate CPU usage statistics
     */
    function simulateCpu() {
        const user = (Math.random() * 20 + 20).toFixed(1);
        const sys = (Math.random() * 10 + 5).toFixed(1);
        const idle = (100 - user - sys).toFixed(1);

        retroUser.textContent = `${user}%`;
        retroSys.textContent = `${sys}%`;
        retroIdle.textContent = `${idle}%`;
        retroCpu.textContent = `${(parseFloat(user) + parseFloat(sys)).toFixed(1)}%`;
    }

    // ===================================
    //  PINTEREST CALMING PAGE LOGIC
    // ===================================

    /**
     * Fetch Pinterest images from backend API
     */
    async function fetchPinterestImages(boardId) {
        try {
            // Try to fetch from backend API if available
            if (CONFIG.API_BASE_URL) {
                const response = await fetch(`${CONFIG.API_BASE_URL}/api/pinterest/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ board_id: boardId })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return data.images || [];
                }
            }
        } catch (error) {
            console.warn('Backend API not available, using demo images', error);
        }

        // Fallback to demo images
        return [
            'https://i.pinimg.com/564x/93/43/d3/9343d3e6c382103f568636f890250917.jpg',
            'https://i.pinimg.com/564x/a2/8b/6e/a28b6e6c4a8f9026d36e2f1e1e4a6a5d.jpg',
            'https://i.pinimg.com/564x/f3/7a/a8/f37aa831c2c31c4f55a1e2f8d3d9241b.jpg',
            'https://i.pinimg.com/564x/4b/9e/a5/4b9ea59a1e1e3b6e7f1e1c3b6e7a2b2e.jpg',
            'https://i.pinimg.com/564x/e7/8a/a5/e78aa5f2a1a8c909e7e7a5d3f2d2a4a7.jpg',
            'https://i.pinimg.com/564x/3b/22/e0/3b22e0e0f3e6f9e0e0e0e0e0e0e0e0e0.jpg',
            'https://i.pinimg.com/564x/f1/e3/3e/f1e33eb0c7f2c6e6e6e6e6e6e6e6e6e6.jpg',
            'https://i.pinimg.com/564x/92/8f/d7/928fd7a2d1f4d9c7f1a3b6d2a4e2e2a2.jpg',
            'https://i.pinimg.com/564x/6c/e0/4f/6ce04f8b1b1b1b1b1b1b1b1b1b1b1b1b.jpg'
        ];
    }

    /**
     * Start Pinterest slideshow
     */
    async function startPinterestSlideshow(name) {
        stopPinterestSlideshow();

        pinterestNameText.textContent = name;
        pinterestNameText.style.transform = 'translateY(0)';

        const boardId = pinterestBoardIDInput.value || CONFIG.DEFAULT_BOARD_ID;
        pinterestImages = await fetchPinterestImages(boardId);

        if (pinterestImages.length === 0) {
            pinterestImage.src = '';
            pinterestNameText.textContent = 'No images found.';
            return;
        }

        currentPinterestImageIndex = 0;
        loadPinterestImage(pinterestImages[currentPinterestImageIndex]);

        pinterestSlideshowInterval = setInterval(() => {
            currentPinterestImageIndex = (currentPinterestImageIndex + 1) % pinterestImages.length;
            loadPinterestImage(pinterestImages[currentPinterestImageIndex]);

            // Animate text sliding up and resetting
            pinterestNameText.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                pinterestNameText.textContent = name;
                pinterestNameText.style.transform = 'translateY(0)';
            }, 1000);

        }, CONFIG.SLIDESHOW_INTERVAL);
    }

    /**
     * Load a single Pinterest image with fade effect
     */
    function loadPinterestImage(url) {
        pinterestImage.style.opacity = '0';
        
        setTimeout(() => {
            pinterestImage.src = url;
            pinterestImage.onload = () => {
                pinterestImage.style.opacity = '1';
            };
            pinterestImage.onerror = () => {
                console.error('Failed to load Pinterest image:', url);
                pinterestImage.src = 'https://via.placeholder.com/1920x1080/CCCCCC/000000?text=Image+Load+Error';
                pinterestImage.style.opacity = '1';
            };
        }, 1500);
    }

    /**
     * Stop Pinterest slideshow
     */
    function stopPinterestSlideshow() {
        if (pinterestSlideshowInterval) {
            clearInterval(pinterestSlideshowInterval);
            pinterestSlideshowInterval = null;
        }
        pinterestImage.src = '';
        pinterestImage.style.opacity = '0';
    }

});
