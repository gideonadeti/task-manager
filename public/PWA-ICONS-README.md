# PWA Icons Setup

This directory needs PWA icons for the app to be installable.

## Required Icons

Create the following icon files and place them in the `/public` directory:

1. **icon-192x192.png** (192x192 pixels)
2. **icon-512x512.png** (512x512 pixels)
3. **icon-192x192-maskable.png** (192x192 pixels, with safe zone padding)
4. **icon-512x512-maskable.png** (512x512 pixels, with safe zone padding)

## How to Generate Icons

### Option 1: Use an Online Tool

1. Visit [RealFaviconGenerator](https://realfavicongenerator.net/) or [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload your source logo (ideally 512x512 or larger, square format)
3. Download the generated icons
4. Rename and place them in the `/public` directory

### Option 2: Manual Creation

1. Start with your app logo or icon
2. Resize to 192x192 and 512x512 pixels
3. For maskable icons, ensure the important content is within the "safe zone" (center 80% of the image)
4. Save as PNG files with the names above

## Maskable Icons

Maskable icons are used on Android for adaptive icons. They should:

- Have important content in the center 80% (safe zone)
- Use the full canvas (no transparency around the edges for the main design)
- Include padding so the icon looks good when cropped into different shapes (circle, squircle, etc.)

## Quick Start

If you don't have time to create proper icons now:

1. Create simple placeholder icons (solid color squares with your app initial/logo)
2. Replace them later with professionally designed icons

The app will work without these icons, but users won't be able to install it to their home screen until the icons are added.
