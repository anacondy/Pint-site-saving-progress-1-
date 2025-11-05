"""
Flask backend for Poetic Image Gallery
Provides secure API endpoints for Pinterest integration
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import logging
from typing import List, Dict, Any
import secrets
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='.')

# Enhanced CORS configuration for security
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:*", "https://*.github.io"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-Requested-With"]
    }
})

# Security headers middleware
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https: http:; "
        "connect-src 'self' https://api.pinterest.com;"
    )
    return response

@app.route('/')
def serve_index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0'
    }), 200

@app.route('/api/pinterest/images', methods=['POST'])
def get_pinterest_images():
    """
    Fetch images from Pinterest board
    
    Note: This is a placeholder implementation. In production, you would:
    1. Set up Pinterest Developer account
    2. Get API credentials
    3. Implement OAuth flow
    4. Use official Pinterest API
    
    For now, returns curated demo images
    """
    try:
        data = request.get_json()
        board_id = data.get('board_id', '470072049909241031')
        
        # Validate board_id (basic sanitization)
        if not board_id or not board_id.isdigit():
            return jsonify({'error': 'Invalid board ID'}), 400
        
        # Demo images - replace with actual Pinterest API call
        demo_images = [
            'https://i.pinimg.com/564x/93/43/d3/9343d3e6c382103f568636f890250917.jpg',
            'https://i.pinimg.com/564x/a2/8b/6e/a28b6e6c4a8f9026d36e2f1e1e4a6a5d.jpg',
            'https://i.pinimg.com/564x/f3/7a/a8/f37aa831c2c31c4f55a1e2f8d3d9241b.jpg',
            'https://i.pinimg.com/564x/4b/9e/a5/4b9ea59a1e1e3b6e7f1e1c3b6e7a2b2e.jpg',
            'https://i.pinimg.com/564x/e7/8a/a5/e78aa5f2a1a8c909e7e7a5d3f2d2a4a7.jpg',
        ]
        
        logger.info(f"Fetched {len(demo_images)} images for board {board_id}")
        
        return jsonify({
            'images': demo_images,
            'board_id': board_id,
            'count': len(demo_images)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching Pinterest images: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/system/theme', methods=['GET'])
def get_system_theme():
    """
    Get recommended theme based on server time
    Client should prefer prefers-color-scheme media query
    """
    from datetime import datetime
    
    now = datetime.now()
    hour = now.hour
    
    # Determine theme based on time
    if 20 <= hour or hour < 6:
        theme = 'dark'
    else:
        theme = 'light'
    
    return jsonify({
        'theme': theme,
        'hour': hour,
        'note': 'Client should use prefers-color-scheme media query'
    }), 200

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle 500 errors"""
    logger.error(f"Internal error: {str(e)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # In production, use a proper WSGI server like gunicorn
    # and enable HTTPS
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    if not debug:
        logger.info("Running in production mode")
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        logger.info("Running in development mode")
        app.run(host='127.0.0.1', port=port, debug=True)
