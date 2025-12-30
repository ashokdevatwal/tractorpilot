// Main application - 3D Indian Tractor Farming Simulator
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d';
import { Terrain } from './modules/Terrain.js';
import { Tractor } from './modules/Tractor.js';
import { Camera } from './modules/Camera.js';
import { Controls } from './modules/Controls.js';
import { UI } from './modules/UI.js';

class TractorSimulator {
    constructor() {
        this.canvas = document.getElementById('canvas-container');
        this.scene = null;
        this.renderer = null;
        this.physicsWorld = null;
        this.terrain = null;
        this.tractor = null;
        this.camera = null;
        this.controls = null;
        this.ui = null;
        
        this.clock = new THREE.Clock();
        this.lastPloughCheck = 0;
        this.ploughCheckInterval = 0.5; // Check every 0.5 seconds
    }
    
    async init() {
        try {
            // Rapier v0.12+ auto-initializes the WASM module on import
            // Make it available globally for physics modules
            window.RAPIER = RAPIER;
            
            // Create physics world
            const gravity = { x: 0.0, y: -9.81, z: 0.0 };
            this.physicsWorld = new RAPIER.World(gravity);
            
            // Setup Three.js scene
            this.setupScene();
            this.setupLighting();
            
            // Create game objects
            this.terrain = new Terrain(this.scene, this.physicsWorld);
            this.terrain.create();
            
            this.tractor = new Tractor(this.scene, this.physicsWorld);
            this.tractor.create();
            
            // Setup camera and controls
            this.camera = new Camera(this.canvas);
            this.controls = new Controls();
            this.ui = new UI();
            
            // Show UI
            this.ui.show();
            
            // Start animation loop
            this.animate();
            
            console.log('Tractor Simulator initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize simulator:', error);
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Add fog for atmosphere
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.canvas.appendChild(this.renderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional sunlight
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(50, 80, 30);
        sunLight.castShadow = true;
        
        // Configure shadow properties
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 200;
        sunLight.shadow.bias = -0.0001;
        
        this.scene.add(sunLight);
        
        // Hemisphere light for sky/ground color
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.3);
        this.scene.add(hemisphereLight);
        
        // Add sun visualization
        const sunGeometry = new THREE.SphereGeometry(5, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.copy(sunLight.position);
        this.scene.add(sun);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // Update physics
        if (this.physicsWorld) {
            this.physicsWorld.step();
        }
        
        // Update tractor
        if (this.tractor && this.controls) {
            const controlState = this.controls.getState();
            
            // Handle plough toggle
            if (this.controls.consumePloughToggle()) {
                this.tractor.togglePlough();
            }
            
            const tractorState = this.tractor.update(deltaTime, controlState);
            
            // Update UI with speed
            if (this.ui && tractorState) {
                this.ui.updateSpeed(tractorState.speed);
            }
            
            // Check for ploughing
            if (this.tractor.isPloughing()) {
                this.lastPloughCheck += deltaTime;
                if (this.lastPloughCheck >= this.ploughCheckInterval) {
                    this.lastPloughCheck = 0;
                    const pos = this.tractor.getPosition();
                    
                    if (this.terrain.ploughTile(pos.x, pos.z)) {
                        this.ui.incrementPloughed();
                        
                        // Auto-plant after a short delay (simulated)
                        setTimeout(() => {
                            if (this.terrain.plantCrop(pos.x, pos.z)) {
                                this.ui.incrementCrops();
                            }
                        }, 2000);
                    }
                }
            }
        }
        
        // Update camera
        if (this.camera && this.tractor) {
            this.camera.update(this.tractor, deltaTime);
        }
        
        // Render scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera.getCamera());
        }
    }
}

// Initialize the simulator when page loads
async function initSimulator() {
    const simulator = new TractorSimulator();
    await simulator.init();
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initSimulator);
} else {
    initSimulator();
}
