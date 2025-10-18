# Tax Clipboard 3D Model

## Overview
A detailed 3D recreation of a professional tax management scene featuring a clipboard with checkmarks, dollar bills, and coin stacks.

## Components

### Main Scene (`TaxClipboard3DScene`)
The complete scene with all elements:

#### 1. **Clipboard**
- Blue rounded board with smooth edges
- White paper/document overlay
- Gold metallic clip with handle ring
- "TAX" header button in blue
- Three checkmark items with list lines

#### 2. **Money Stack**
- 4 stacked green dollar bills
- Dollar symbol ($) representation on each bill
- Accent circles on corners
- Floating and rotating animations
- Positioned on the left side

#### 3. **Coin Stacks**
- Three separate stacks of gold coins
- 6 coins per stack
- Metallic gold material with high reflectivity
- Dollar symbol ($) on top coin
- Detailed rim/edge on each coin
- Individual floating animations

## Features

### Visual Effects
✓ **Shadows** - All objects cast realistic shadows
✓ **Metallic Materials** - Gold coins with 85% metalness
✓ **Emissive Effects** - Subtle glow on clipboard and coins
✓ **Rounded Edges** - Professional smooth corners using RoundedBox
✓ **Multi-layered Lighting** - Ambient, directional, point, and spotlights

### Animations
✓ **Auto-rotation** - Gentle 360° camera rotation
✓ **Floating** - Objects bob gently up and down
✓ **Coin Rotation** - Coins spin individually
✓ **Money Animation** - Bills float and tilt slightly

### Technical Specs
- **Shadow Resolution**: 2048x2048
- **Camera FOV**: 45°
- **Auto-rotate Speed**: 1.5
- **Shadows**: Enabled on all meshes

## Usage

### In Login/Register Pages
```tsx
import { TaxClipboard3DScene } from '../../components/UI/TaxClipboard3D';

<div className="w-full h-full">
  <TaxClipboard3DScene />
</div>
```

### Compact Version (Alternative)
For smaller spaces:
```tsx
import { TaxClipboard3DCompact } from '../../components/UI/TaxClipboard3D';

<div className="w-full h-96">
  <TaxClipboard3DCompact />
</div>
```

## Color Palette

### Clipboard
- Board: `#5b9bd5` (Blue)
- Paper: `#ffffff` (White)
- Clip: `#f4b942` (Gold)
- Header: `#6fa8dc` (Light Blue)

### Money & Coins
- Bills: `#7cb342` (Green)
- Coins: `#f4b942` (Gold)
- Accents: `#90c959`, `#a8d96c`, `#d4941f`

### Checkmarks
- Circle: `#6fa8dc` (Light Blue)
- Check: `#ffffff` (White)

## Performance
- Optimized with `RoundedBox` from drei for smooth edges
- Efficient shadow mapping
- Balanced lighting setup
- Proper use of Float for smooth animations

## Background Recommendations
Works best with:
- `bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100`
- Light blue gradients
- Soft pastel backgrounds

## Browser Compatibility
- Requires WebGL support
- Tested with React Three Fiber v8.13.7
- Three.js v0.160.0
