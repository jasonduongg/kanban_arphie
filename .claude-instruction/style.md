# Style Guide

## Design Principles
- Clean and modern — lots of whitespace, sharp edges, no gradients or drop shadows unless subtle
- Minimal decoration — let content breathe, avoid visual clutter
- 1–2 primary colors only; everything else is neutrals (gray scale)

## Color Palette
- **Primary:** Indigo — `#4F46E5` (indigo-600) for buttons, active states, links
- **Primary hover:** `#4338CA` (indigo-700)
- **Background:** `#F9FAFB` (gray-50) page bg, `#FFFFFF` card/modal bg
- **Border:** `#E5E7EB` (gray-200)
- **Text primary:** `#111827` (gray-900)
- **Text secondary:** `#6B7280` (gray-500)
- **Text muted:** `#9CA3AF` (gray-400)

## Status Colors (semantic only, not decorative)
- Backlog: gray-400
- Todo: blue-400
- In Progress: amber-400
- In Review: purple-400
- Done: green-500

## Priority Colors (semantic)
- P0: red-500
- P1: orange-400
- P2: yellow-400
- P3: gray-400

## Typography
- Font: system-ui / sans-serif stack (no custom font imports)
- Base size: 14px
- Headings: font-semibold, not bold
- Labels/badges: text-xs, uppercase tracking-wide

## Components
- Buttons: rounded-md, px-4 py-2, indigo primary / white secondary with gray border
- Cards: rounded-lg, white bg, gray-200 border, no shadow or very subtle shadow-sm
- Modal: centered, max-w-2xl, white bg, rounded-xl, backdrop blur overlay
- Inputs: rounded-md, gray-200 border, focus ring indigo-500, bg white
- Badges/chips: rounded-full, px-2 py-0.5, text-xs
