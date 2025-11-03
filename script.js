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
    const homeTextInput = document.getElementById('homeTextInput'); // New: Text input for name trigger
    const defaultImageUrl = 'https://via.placeholder.com/250x250/808080/FFFFFF?text=Generated+Image';

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
    const pinterestBoardIDInput = document.getElementById('pinterestBoardID'); // New: Pinterest ID input
    const closeRetroSettingsButton = document.getElementById('closeRetroSettings'); // Close button for retro page

    let retroIntervals = null;

    // --- PINTEREST CALMING PAGE ELEMENTS ---
    const pinterestNameText = document.getElementById('pinterestNameText');
    const pinterestImage = document.getElementById('pinterestImage');
    const closePinterestCalmingPageButton = document.getElementById('closePinterestCalmingPage');
    let pinterestSlideshowInterval = null;
    let pinterestImages = []; // Array to hold image URLs
    let currentPinterestImageIndex = 0;
    const MY_NAME = "alan"; // Define your name here for triggering

    // ===================================
    //  HOME PAGE LOGIC (Day/Night & Image D&D)
    // ===================================

    function setDayNightMode() {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23' };
        const currentHourIST = parseInt(new Intl.DateTimeFormat('en-US', options).format(now));

        if (currentHourIST >= 20 || currentHourIST < 6) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        updateRetroToggleStatus();
    }
    setDayNightMode();
    setInterval(setDayNightMode, 60 * 1000);

    // Home Page Image Upload (Settings Panel)
    imageUpload.addEventListener('change', (event) => handleFileForFrame(event.target.files[0]));
    resetImageButton.addEventListener('click', () => {
        displayImage.src = defaultImageUrl;
        imageUpload.value = '';
    });

    // Home Page Drag and Drop (FIXED)
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
        handleFileForFrame(event.dataTransfer.files[0]);
    });

    function handleFileForFrame(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                displayImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // New: Home Page Text Input for Pinterest Page Trigger
    homeTextInput.addEventListener('input', (event) => {
        const text = event.target.value.toLowerCase();
        if (text.includes(MY_NAME)) { // Trigger when the defined name is typed
            showPinterestCalmingPage("Nature"); // Pass a default name for now
            event.target.value = ''; // Clear input after trigger
        }
    });

    // ===================================
    //  UPLOAD INTERFACE LOGIC
    // ===================================

    closeUploadInterfaceButton.addEventListener('click', hideUploadInterface);
    permissionButton.addEventListener('click', async () => {
        try {
            if (!window.showDirectoryPicker) return alert('Your browser does not support the File System Access API. Try on Chrome or Edge.');
            const dirHandle = await window.showDirectoryPicker();
            userGallery.innerHTML = 'Loading images...';
            let imagesFound = 0;
            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    const file = await entry.getFile();
                    if (file.type.startsWith('image/')) {
                        if(imagesFound === 0) userGallery.innerHTML = '';
                        imagesFound++;
                        addImageToScrollGallery(URL.createObjectURL(file));
                    }
                }
            }
            if(imagesFound === 0) userGallery.innerHTML = 'No images found in that folder.';

        } catch (err) {
            if (err.name !== 'AbortError') console.error('Error accessing directory:', err);
            userGallery.innerHTML = 'Could not access folder.';
        }
    });

    // Upload Interface D&D / File Input (FIXED)
    dragDropArea.addEventListener('click', () => uploadImageInput.click());
    uploadButton.addEventListener('click', () => uploadImageInput.click());
    uploadImageInput.addEventListener('change', (event) => handleUploadFiles(event.target.files));
    dragDropArea.addEventListener('dragover', (event) => { event.preventDefault(); event.currentTarget.style.borderColor = '#fff'; });
    dragDropArea.addEventListener('dragleave', (event) => event.currentTarget.style.borderColor = '#777');
    dragDropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        event.currentTarget.style.borderColor = '#777';
        handleUploadFiles(event.dataTransfer.files);
    });

    function handleUploadFiles(files) {
        if(userGallery.innerHTML.includes('...')) userGallery.innerHTML = '';
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => addImageToScrollGallery(e.target.result);
                reader.readAsDataURL(file);
            }
        }
    }
    function addImageToScrollGallery(imageUrl) {
        const div = document.createElement('div');
        div.classList.add('gallery-image');
        div.style.backgroundImage = `url('${imageUrl}')`;
        userGallery.appendChild(div);
        userGallery.scrollLeft = userGallery.scrollWidth;
    }

    // Keyboard Scrolling for User Gallery
    document.addEventListener('keydown', (e) => {
        if (!uploadInterface.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') {
                userGallery.scrollBy({ left: -220, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                userGallery.scrollBy({ left: 220, behavior: 'smooth' });
            }
        }
    });


    // ===================================
    //  FIXED: KEY PRESS LOGIC
    // ===================================

    let keysPressed = {};
    let shortcutTimer = null;
    const PRESS_DURATION = 3000; // 3 seconds

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key !== 'u' && key !== 'f' && key !== 's' && key !== 'escape') return;

        if (key === 'escape') {
            if (!uploadInterface.classList.contains('hidden')) hideUploadInterface();
            else if (!retroSettingsPage.classList.contains('hidden')) hideRetroSettings();
            else if (!pinterestCalmingPage.classList.contains('hidden')) hidePinterestCalmingPage();
            return;
        }

        keysPressed[key] = true;

        if (shortcutTimer) return; // Prevent multiple timers

        // Check for U+F (Upload Interface)
        if (keysPressed['u'] && keysPressed['f']) {
            // Only trigger if Home Page is visible
            if (!homePage.classList.contains('hidden')) {
                shortcutTimer = setTimeout(showUploadInterface, PRESS_DURATION);
            }
        }

        // Check for S+F (Retro Settings)
        if (keysPressed['s'] && keysPressed['f']) {
            // Can be triggered from any page, but we'll hide others
            shortcutTimer = setTimeout(showRetroSettings, PRESS_DURATION);
        }
    });

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();

        if (key === 'u' || key === 'f' || key === 's') {
            if (shortcutTimer) {
                clearTimeout(shortcutTimer);
                shortcutTimer = null;
            }
        }
        delete keysPressed[key];
    });


    // ===================================
    //  PAGE VISIBILITY FUNCTIONS (Updated for Pinterest Page)
    // ===================================

    function showUploadInterface() {
        homePage.classList.add('hidden');
        retroSettingsPage.classList.add('hidden');
        pinterestCalmingPage.classList.add('hidden');
        uploadInterface.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'none';
        stopRetroIntervals();
        stopPinterestSlideshow();
    }

    function hideUploadInterface() {
        uploadInterface.classList.add('hidden');
        homePage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'block';
    }

    function showRetroSettings() {
        homePage.classList.add('hidden');
        uploadInterface.classList.add('hidden');
        pinterestCalmingPage.classList.add('hidden');
        retroSettingsPage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'none';
        startRetroIntervals();
        stopPinterestSlideshow();
    }

    function hideRetroSettings() {
        retroSettingsPage.classList.add('hidden');
        homePage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'block';
        stopRetroIntervals();
    }

    function showPinterestCalmingPage(name) {
        homePage.classList.add('hidden');
        uploadInterface.classList.add('hidden');
        retroSettingsPage.classList.add('hidden');
        pinterestCalmingPage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'none';
        stopRetroIntervals();
        startPinterestSlideshow(name);
    }

    function hidePinterestCalmingPage() {
        pinterestCalmingPage.classList.add('hidden');
        homePage.classList.remove('hidden');
        document.querySelector('.background-text-container').style.display = 'block';
        stopPinterestSlideshow();
    }
    closePinterestCalmingPageButton.addEventListener('click', hidePinterestCalmingPage);


    // ===================================
    //  RETRO SETTINGS LOGIC
    // ===================================

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateRetroToggleStatus();
    });

    function updateRetroToggleStatus() {
        if (body.classList.contains('dark-mode')) {
            darkModeStatus.textContent = 'ON';
            darkModeStatus.classList.add('active');
        } else {
            darkModeStatus.textContent = 'OFF';
            darkModeStatus.classList.remove('active');
        }
    }

    function startRetroIntervals() {
        if (retroIntervals) stopRetroIntervals(); // Clear any existing

        updateRetroClocks();
        simulateUserCounts();
        simulateCpu();

        const clockInterval = setInterval(updateRetroClocks, 1000);
        const userInterval = setInterval(simulateUserCounts, 2500);
        const cpuInterval = setInterval(simulateCpu, 1500);

        retroIntervals = [clockInterval, userInterval, cpuInterval];
    }

    function stopRetroIntervals() {
        if (retroIntervals) {
            retroIntervals.forEach(clearInterval);
            retroIntervals = null;
        }
    }

    // --- Timezones (FIXED - using correct timeZone strings for accuracy) ---
    function updateRetroClocks() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

        timeIST.textContent = now.toLocaleString('en-US', { ...timeOptions, timeZone: 'Asia/Kolkata' });
        timeGMT.textContent = now.toLocaleString('en-US', { ...timeOptions, timeZone: 'UTC' });
        timeUTAH.textContent = now.toLocaleString('en-US', { ...timeOptions, timeZone: 'America/Denver' }); // Utah uses America/Denver
    }

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
    //  NEW: PINTEREST CALMING PAGE LOGIC
    // ===================================

    async function fetchPinterestImages(boardId) {
        // --- IMPORTANT: This is a simulated/placeholder array ---
        // A real implementation would require:
        // 1. A backend server to fetch from Pinterest API (server-side only)
        // 2. Pinterest Developer account and API key.
        // 3. Handling API rate limits and authentication.
        // For this demo, we use a fixed array of nature-themed images.
        // Replace this with your actual image fetching logic if you set up a backend.

        const demoImages = [
            'https://i.pinimg.com/564x/93/43/d3/9343d3e6c382103f568636f890250917.jpg',
            'https://i.pinimg.com/564x/a2/8b/6e/a28b6e6c4a8f9026d36e2f1e1e4a6a5d.jpg',
            'https://i.pinimg.com/564x/f3/7a/a8/f37aa831c2c31c4f55a1e2f8d3d9241b.jpg',
            'https://i.pinimg.com/564x/4b/9e/a5/4b9ea59a1e1e3b6e7f1e1c3b6e7a2b2e.jpg',
            'https://i.i.etsystatic.com/13190806/r/il/a7b594/2183310065/il_fullxfull.2183310065_8k3a.jpg',
            'https://i.pinimg.com/564x/e7/8a/a5/e78aa5f2a1a8c909e7e7a5d3f2d2a4a7.jpg',
            'https://i.pinimg.com/564x/3b/22/e0/3b22e0e0f3e6f9e0e0e0e0e0e0e0e0e0.jpg',
            'https://i.pinimg.com/564x/f1/e3/3e/f1e33eb0c7f2c6e6e6e6e6e6e6e6e6e6.jpg',
            'https://i.pinimg.com/564x/92/8f/d7/928fd7a2d1f4d9c7f1a3b6d2a4e2e2a2.jpg',
            'https://i.pinimg.com/564x/6c/e0/4f/6ce04f8b1b1b1b1b1b1b1b1b1b1b1b1b.jpg'
        ];
        return demoImages;
    }

    async function startPinterestSlideshow(name) {
        stopPinterestSlideshow(); // Ensure no other slideshow is running

        pinterestNameText.textContent = name;
        pinterestNameText.style.transform = 'translateY(0)'; // Reset position

        const boardId = pinterestBoardIDInput.value || "470072049909241031"; // Default ID if empty
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
            pinterestNameText.style.transform = 'translateY(-100%)'; // Slide up
            setTimeout(() => {
                pinterestNameText.textContent = name; // Reset text content if needed, though name is static
                pinterestNameText.style.transform = 'translateY(0)'; // Slide back down
            }, 1000); // After image fades out

        }, 5000); // Change image every 5 seconds
    }

    function loadPinterestImage(url) {
        pinterestImage.style.opacity = '0'; // Start fade out
        setTimeout(() => {
            pinterestImage.src = url;
            pinterestImage.onload = () => {
                pinterestImage.style.opacity = '1'; // Fade in new image
            };
            pinterestImage.onerror = () => {
                console.error("Failed to load Pinterest image:", url);
                pinterestImage.src = 'https://via.placeholder.com/1920x1080/CCCCCC/000000?text=Image+Load+Error'; // Fallback
                pinterestImage.style.opacity = '1';
            };
        }, 1500); // Time for fade out
    }


    function stopPinterestSlideshow() {
        if (pinterestSlideshowInterval) {
            clearInterval(pinterestSlideshowInterval);
            pinterestSlideshowInterval = null;
        }
        pinterestImage.src = ''; // Clear current image
        pinterestImage.style.opacity = '0';
    }

});
