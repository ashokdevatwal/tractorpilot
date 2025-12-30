# 🚜 Tractor Pilot - 3D Indian Tractor Farming Simulator

An immersive web-based 3D farming simulator built with Three.js and Rapier physics engine. Experience realistic tractor farming with physics-based controls, ploughing mechanics, and crop management.

## ✨ Features

- **🌾 Realistic Farmland**: Large terrain with soil textures and dynamic ploughing
- **🚜 Indian Tractor**: Detailed 3D tractor model with classic red/orange color scheme
- **⚙️ Physics Engine**: 4-wheel physics simulation using Rapier3D
- **🎮 Smooth Controls**: 
  - WASD/Arrow keys for driving
  - Realistic steering, acceleration, and braking
  - Space bar to toggle plough
- **📷 Dynamic Camera**: Third-person follow camera with smooth tracking
- **🌤️ Atmospheric Effects**: Sunlight, realistic shadows, and distance fog
- **🌱 Farming Mechanics**: 
  - Plough fields to prepare soil
  - Auto-planting system for crops
  - Visual feedback for farmed areas
- **📊 UI Dashboard**: Real-time speedometer and farming statistics
- **🏗️ Modular Code**: Clean ES6 module architecture

## 🎮 Controls

| Key | Action |
|-----|--------|
| **W** or **↑** | Accelerate forward |
| **S** or **↓** | Brake / Reverse |
| **A** or **←** | Steer left |
| **D** or **→** | Steer right |
| **SPACE** | Toggle plough on/off |

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Manual Setup (No Build Tool)

If you prefer to run without a build tool, you can use any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node's http-server
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
tractorpilot/
├── index.html              # Main HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite build configuration
└── src/
    ├── main.js             # Application entry point
    └── modules/
        ├── Terrain.js      # Farmland terrain with ploughing
        ├── Tractor.js      # Tractor 3D model and physics
        ├── Camera.js       # Third-person follow camera
        ├── Controls.js     # Keyboard input handling
        └── UI.js           # Speedometer and stats UI
```

## 🎨 Technical Details

### Graphics
- **Renderer**: WebGL via Three.js
- **Shadows**: PCF soft shadows for realistic lighting
- **Textures**: Procedural canvas-based textures for soil and ploughed fields
- **Post-processing**: Atmospheric fog for depth

### Physics
- **Engine**: Rapier3D (high-performance Rust-based physics)
- **Simulation**: 
  - Rigid body dynamics for tractor
  - Static colliders for terrain
  - Realistic friction coefficients for soil
  - Locked rotations to keep tractor upright

### Architecture
- **Pattern**: Modular ES6 classes
- **Modules**: Single-responsibility components
- **Game Loop**: RequestAnimationFrame with delta time
- **Physics Step**: Fixed-step integration

## 🌾 Gameplay

1. **Drive Around**: Use WASD or arrow keys to navigate your tractor across the farmland
2. **Activate Plough**: Press SPACE to lower/raise the plough attachment
3. **Plough Fields**: Drive over unploughed soil with the plough active to prepare fields
4. **Watch Crops Grow**: Ploughed fields automatically get planted with crops after a short delay
5. **Track Progress**: Monitor your speedometer and farming statistics in the UI

## 🔧 Customization

You can easily customize various aspects:

- **Tractor Speed**: Modify `maxSpeed` in `Tractor.js`
- **Physics**: Adjust friction, restitution in physics modules
- **Camera Angle**: Change `offset` values in `Camera.js`
- **Field Size**: Modify `gridSize` in `Terrain.js`
- **Colors**: Update material colors in respective modules

## 🐛 Troubleshooting

**Black screen on load?**
- Check browser console for errors
- Ensure all dependencies are installed
- Try clearing browser cache

**Physics not working?**
- Rapier WASM must load - check network tab
- Ensure browser supports WebAssembly

**Performance issues?**
- Reduce shadow map size in `main.js`
- Lower terrain grid resolution in `Terrain.js`
- Disable shadows if needed

## 📄 License

MIT License - Feel free to use and modify for your projects!

## 🙏 Credits

- **Three.js**: 3D graphics library
- **Rapier3D**: Physics engine
- **Vite**: Build tool and dev server

---

**Enjoy farming! 🌾🚜**