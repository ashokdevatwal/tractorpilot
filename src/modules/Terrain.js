// Terrain module - Creates farmland with soil texture
import * as THREE from 'three';

export class Terrain {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.ploughedTiles = new Set();
        this.tiles = [];
        this.tileSize = 10;
        this.gridSize = 20;
    }

    create() {
        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(
            this.tileSize * this.gridSize, 
            this.tileSize * this.gridSize, 
            this.gridSize - 1, 
            this.gridSize - 1
        );
        
        // Create soil texture using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Brown soil base
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 512, 512);
        
        // Add texture detail
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 50 + 100}, ${Math.random() * 30 + 50}, ${Math.random() * 20 + 10}, 0.3)`;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 5, Math.random() * 5);
        }
        
        const soilTexture = new THREE.CanvasTexture(canvas);
        soilTexture.wrapS = THREE.RepeatWrapping;
        soilTexture.wrapT = THREE.RepeatWrapping;
        soilTexture.repeat.set(10, 10);
        
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: soilTexture,
            roughness: 0.9,
            metalness: 0.1
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        
        // Create grid for ploughing
        this.createTileGrid();
        
        // Add physics ground
        this.addPhysicsGround();
    }
    
    createTileGrid() {
        const halfGrid = (this.gridSize * this.tileSize) / 2;
        
        for (let x = 0; x < this.gridSize; x++) {
            for (let z = 0; z < this.gridSize; z++) {
                const tileX = x * this.tileSize - halfGrid + this.tileSize / 2;
                const tileZ = z * this.tileSize - halfGrid + this.tileSize / 2;
                
                this.tiles.push({
                    x: tileX,
                    z: tileZ,
                    gridX: x,
                    gridZ: z,
                    ploughed: false,
                    planted: false
                });
            }
        }
    }
    
    addPhysicsGround() {
        if (!this.physicsWorld) return;
        
        const RAPIER = window.RAPIER;
        const groundDesc = RAPIER.ColliderDesc.cuboid(
            (this.tileSize * this.gridSize) / 2,
            0.5,
            (this.tileSize * this.gridSize) / 2
        );
        groundDesc.setFriction(2.0); // High friction for soil
        groundDesc.setRestitution(0.1);
        
        this.physicsWorld.createCollider(groundDesc);
    }
    
    getTileAt(x, z) {
        return this.tiles.find(tile => {
            const dx = Math.abs(tile.x - x);
            const dz = Math.abs(tile.z - z);
            return dx < this.tileSize / 2 && dz < this.tileSize / 2;
        });
    }
    
    ploughTile(x, z) {
        const tile = this.getTileAt(x, z);
        if (tile && !tile.ploughed) {
            tile.ploughed = true;
            this.createPloughMark(tile.x, tile.z);
            return true;
        }
        return false;
    }
    
    createPloughMark(x, z) {
        // Create darker ploughed soil texture
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Darker ploughed soil
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, 0, 128, 128);
        
        // Add furrow lines
        ctx.strokeStyle = '#4a3319';
        ctx.lineWidth = 3;
        for (let i = 0; i < 128; i += 8) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(128, i);
            ctx.stroke();
        }
        
        const ploughTexture = new THREE.CanvasTexture(canvas);
        const ploughMaterial = new THREE.MeshStandardMaterial({ 
            map: ploughTexture,
            roughness: 0.95
        });
        
        const markGeometry = new THREE.PlaneGeometry(this.tileSize - 0.5, this.tileSize - 0.5);
        const mark = new THREE.Mesh(markGeometry, ploughMaterial);
        mark.rotation.x = -Math.PI / 2;
        mark.position.set(x, 0.05, z);
        mark.receiveShadow = true;
        
        this.scene.add(mark);
        this.ploughedTiles.add(mark);
    }
    
    plantCrop(x, z) {
        const tile = this.getTileAt(x, z);
        if (tile && tile.ploughed && !tile.planted) {
            tile.planted = true;
            this.createCrop(tile.x, tile.z);
            return true;
        }
        return false;
    }
    
    createCrop(x, z) {
        // Simple crop visualization - small green plants
        const cropGroup = new THREE.Group();
        
        for (let i = 0; i < 5; i++) {
            const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 4);
            const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5016 });
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            
            const leafGeometry = new THREE.SphereGeometry(0.2, 6, 6);
            const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.y = 0.3;
            leaf.scale.set(1, 0.5, 1);
            
            stem.add(leaf);
            stem.position.set(
                (Math.random() - 0.5) * 3,
                0.25,
                (Math.random() - 0.5) * 3
            );
            stem.castShadow = true;
            
            cropGroup.add(stem);
        }
        
        cropGroup.position.set(x, 0, z);
        this.scene.add(cropGroup);
    }
}
