# Poetic Image Gallery

A modern, interactive web application for displaying and managing images with a poetic aesthetic. Features include drag-and-drop uploads, keyboard shortcuts, system theme detection, and a Pinterest slideshow integration.

![Home Page](https://github.com/user-attachments/assets/2522d762-9dc5-48de-acc4-f22c1ca6d690)

## Features

### 🎨 Core Functionality
- **Home Page**: Elegant image display with customizable settings
- **Upload Interface**: Drag-and-drop image uploads with gallery view
- **Retro Settings Page**: System monitoring dashboard with timezone clocks and live statistics
- **Pinterest Calming Page**: Slideshow of curated images with smooth transitions

### 🌓 Theme Support
- **System Theme Detection**: Automatically adapts to your device's light/dark mode preference
- **Time-Based Theme**: Switches to dark mode from 20:00-06:00 IST
- **Manual Toggle**: Override theme in the retro settings page

### ⌨️ Keyboard Shortcuts
- **U + F** (hold for 3 seconds): Open Upload Interface (from home page)
- **S + F** (hold for 3 seconds): Open Retro Settings (from any page)
- **ESC**: Close current overlay and return to home page
- **Arrow Keys**: Navigate image gallery (left/right) when in upload interface

### 🔒 Security Features
- Input sanitization to prevent XSS attacks
- File size validation (max 10MB per image)
- Content Security Policy headers
- HTTPS enforcement in production
- Secure CORS configuration

### 🚀 Performance Optimizations
- Hardware-accelerated CSS transitions
- Debounced input handlers
- Optimized image loading with lazy loading
- Smooth 60fps animations using cubic-bezier easing
- Efficient event delegation

## Installation & Setup

### Frontend Only (Static Hosting)
Simply host the following files on any web server:
- `index.html`
- `script.js`
- `style.css`

### With Backend (Flask)
For Pinterest API integration and enhanced features:

1. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

2. **Run the Flask server**:
```bash
# Development mode
python app.py

# Production mode with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

3. **Access the application**:
```
http://localhost:5000
```

## Project Structure

```
.
├── index.html          # Main HTML structure
├── script.js           # Modern ES6+ JavaScript application logic
├── style.css           # Responsive CSS with animations
├── app.py              # Flask backend (optional)
├── requirements.txt    # Python dependencies
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Usage Guide

### Home Page
- View the main image with poetic background text
- Upload custom images via the settings panel
- Drag and drop images directly onto the image frame
- Type "alan" in the text input to trigger Pinterest slideshow

### Upload Interface
- Click "Grant Gallery Permission" to browse local folders (Chrome/Edge only)
- Drag and drop multiple images into the designated area
- Click "Upload an image" button to select files
- Use arrow keys to scroll through uploaded images
- Press ESC to return to home page

### Retro Settings Page
- View live timezone clocks (IST, GMT, Utah)
- Monitor simulated system statistics (CPU, connections)
- Toggle dark mode manually
- Configure Pinterest Board ID for slideshow
- Press ESC to return to home page

### Pinterest Calming Page
- Triggered by typing "alan" in the home page text input
- Displays a fullscreen slideshow of curated images
- Smooth transitions every 5 seconds
- Press ESC to exit slideshow

## Browser Compatibility

- **Recommended**: Chrome 89+, Edge 89+ (for File System Access API)
- **Supported**: Firefox 87+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome for Android 89+

## Configuration

Edit the `CONFIG` object in `script.js` to customize:

```javascript
const CONFIG = {
    API_BASE_URL: '',                           // Backend API URL
    PRESS_DURATION: 3000,                       // Keyboard shortcut duration (ms)
    SLIDESHOW_INTERVAL: 5000,                   // Pinterest slideshow interval (ms)
    DEFAULT_IMAGE_URL: 'https://...',          // Default placeholder image
    TRIGGER_NAME: 'alan',                      // Trigger word for Pinterest page
    DEFAULT_BOARD_ID: '470072049909241031',    // Default Pinterest board ID
};
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern layout with Grid, Flexbox, and animations
- **JavaScript ES6+**: Modular, async/await, modern DOM APIs

### Backend (Optional)
- **Flask 3.0**: Lightweight Python web framework
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **Gunicorn**: Production WSGI HTTP server

## Development

### Code Style
- Modern ES6+ JavaScript with strict mode
- Functional programming patterns
- Clear documentation and comments
- Consistent naming conventions

### Performance Best Practices
- Minimize DOM manipulation
- Use event delegation
- Debounce expensive operations
- Hardware-accelerated CSS properties (transform, opacity)
- Avoid layout thrashing

## Future Enhancements

The following features could be implemented to further improve the application:

1. **Backend Integration**
   - Full Pinterest API integration with OAuth
   - Image upload to cloud storage (AWS S3, Cloudflare R2)
   - User authentication and profiles
   - Database for storing user preferences

2. **Advanced Features**
   - Image editing tools (crop, resize, filters)
   - Search functionality for uploaded images
   - Tags and categories for organization
   - Batch operations on multiple images
   - Export/import functionality

3. **UI/UX Improvements**
   - Mobile-optimized touch gestures
   - Progressive Web App (PWA) support with offline mode
   - Multiple theme options (not just light/dark)
   - Customizable keyboard shortcuts
   - Zoom and pan for images

4. **Social Features**
   - Share images on social media
   - Collaborative galleries
   - Comments and reactions
   - Public/private gallery visibility

5. **Performance**
   - Image compression and optimization
   - WebP format support with fallbacks
   - Virtual scrolling for large galleries
   - Service Worker for caching

6. **Accessibility**
   - ARIA labels and roles
   - Keyboard-only navigation
   - Screen reader support
   - High contrast mode

## Review & Testing Section

### Last Tested: November 5, 2025

#### ✅ Working Features
| Feature | Status | Notes |
|---------|--------|-------|
| Home Page Display | ✅ Working | Loads correctly with all UI elements visible |
| System Theme Detection | ✅ Working | Responds to `prefers-color-scheme` media query |
| Time-Based Dark Mode | ✅ Working | Switches at 20:00-06:00 IST |
| Image Upload (Settings Panel) | ✅ Working | File input accepts images successfully |
| Drag & Drop (Home Frame) | ✅ Working | Accepts dropped images on image frame |
| Background Text Animation | ✅ Working | Smooth wave animation visible |
| Page Transitions | ✅ Working | Smooth fade in/out between pages |
| Keyboard Shortcuts (U+F) | ✅ Working | Opens upload interface after 3 seconds |
| Keyboard Shortcuts (S+F) | ✅ Working | Opens retro settings after 3 seconds |
| ESC Key Navigation | ✅ Working | Properly closes overlays |
| Upload Interface - File Selection | ✅ Working | Accepts multiple images |
| Upload Interface - Drag & Drop | ✅ Working | Accepts dropped files |
| Gallery Scrolling | ✅ Working | Arrow keys navigate gallery |
| Retro Settings - Clocks | ✅ Working | Live timezone updates every second |
| Retro Settings - Dark Mode Toggle | ✅ Working | Manual theme override functional |
| Retro Settings - CPU Simulation | ✅ Working | Random CPU stats display |
| Pinterest Trigger | ✅ Working | Typing "alan" opens Pinterest page |
| Pinterest Slideshow | ✅ Working | Images transition every 5 seconds |
| Pinterest Image Loading | ✅ Working | Images load with smooth fade effect |
| Close Buttons | ✅ Working | All overlay close buttons functional |

#### ⚠️ Features Requiring External Resources
| Feature | Status | Notes |
|---------|--------|-------|
| Google Fonts | ⚠️ Blocked in Test | Works in production with internet |
| Placeholder Images | ⚠️ Blocked in Test | Works in production with internet |
| Pinterest API | ℹ️ Demo Mode | Using demo images (API requires backend setup) |
| Directory Picker | ℹ️ Chrome/Edge Only | Browser API limitation |

#### 🔧 Improvements Made
1. **Refactored JavaScript**: Modern ES6+ with improved error handling
2. **Enhanced Security**: Input sanitization, file size validation
3. **Performance**: Optimized animations with cubic-bezier easing
4. **Accessibility**: Added ARIA labels for images
5. **Theme Detection**: Added system theme media query support
6. **Code Organization**: Clear separation of concerns with comments
7. **Error Handling**: Graceful fallbacks for failed operations
8. **Backend**: Created Flask backend for future API integration

#### 📋 Known Issues
- None critical. All core functionality working as expected.

#### 🎯 Testing Checklist
- [x] Page loads without console errors
- [x] All buttons are clickable and functional
- [x] Keyboard shortcuts work as expected
- [x] Theme switching works (manual and automatic)
- [x] Image uploads work via both methods
- [x] Animations are smooth without lag
- [x] No memory leaks in long sessions
- [x] Responsive to window resize
- [x] ESC key properly closes all overlays
- [x] Gallery navigation smooth and intuitive

## License

This project is licensed under the terms specified in the LICENSE file.

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly
5. Submit a pull request

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Note**: This is a demonstration project showcasing modern web development techniques. For production use, implement proper backend authentication and Pinterest API integration.