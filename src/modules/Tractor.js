// Tractor module - 3D tractor with physics
import * as THREE from 'three';

export class Tractor {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.position = new THREE.Vector3(0, 2, 0);
        this.speed = 0;
        this.steering = 0;
        this.maxSpeed = 20;
        this.acceleration = 5;
        this.braking = 8;
        this.steeringSpeed = 2;
        this.maxSteering = 0.6;
        this.friction = 0.95;
        
        this.ploughActive = false;
    }

    create() {
        // Create tractor body - Mahindra style bright red tractor
        this.tractorGroup = new THREE.Group();
        
        // Bright red body material (matching Mahindra)
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xCC0000,  // Bright red
            roughness: 0.6,
            metalness: 0.25
        });
        
        // Engine block section
        const engineGeometry = new THREE.BoxGeometry(1.9, 1.1, 1.5);
        const engine = new THREE.Mesh(engineGeometry, bodyMaterial);
        engine.position.set(0, 1.2, 1.4);
        engine.castShadow = true;
        this.tractorGroup.add(engine);
        
        // Front grille - prominent black grille
        const grilleGeometry = new THREE.BoxGeometry(1.8, 0.7, 0.2);
        const grilleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0a0a0a,
            roughness: 0.9,
            metalness: 0.3
        });
        const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
        grille.position.set(0, 1.3, 2.3);
        grille.castShadow = true;
        this.tractorGroup.add(grille);
        
        // Grille bars - horizontal pattern
        for (let i = 0; i < 4; i++) {
            const barGeometry = new THREE.BoxGeometry(1.7, 0.04, 0.1);
            const bar = new THREE.Mesh(barGeometry, grilleMaterial);
            bar.position.set(0, 0.95 + i * 0.16, 2.3);
            this.tractorGroup.add(bar);
        }
        
        // Yellow stripe on hood (Mahindra signature)
        const stripeGeometry = new THREE.BoxGeometry(1.8, 0.08, 0.6);
        const stripeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFCC00,
            roughness: 0.5,
            metalness: 0.3
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(0, 1.85, 1.6);
        this.tractorGroup.add(stripe);
        
        // Main body/cargo section
        const mainBodyGeometry = new THREE.BoxGeometry(2.2, 1.3, 2.0);
        const mainBody = new THREE.Mesh(mainBodyGeometry, bodyMaterial);
        mainBody.position.set(0, 1.2, -0.6);
        mainBody.castShadow = true;
        this.tractorGroup.add(mainBody);
        
        // Cabin - more boxy and realistic
        const cabinGeometry = new THREE.BoxGeometry(1.6, 1.5, 1.3);
        const cabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.5,
            metalness: 0.3
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 2.3, -0.2);
        cabin.castShadow = true;
        this.tractorGroup.add(cabin);
        
        // Cabin roof - flat canopy style
        const roofGeometry = new THREE.BoxGeometry(1.8, 0.3, 1.5);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            roughness: 0.6,
            metalness: 0.2
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 3.15, -0.2);
        roof.castShadow = true;
        this.tractorGroup.add(roof);
        
        // Front windshield - large and angled
        const frontWindowGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.1);
        const windowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x88CCFF,
            transparent: true,
            opacity: 0.55,
            roughness: 0.08,
            metalness: 0.85
        });
        const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
        frontWindow.position.set(0, 2.4, 0.5);
        frontWindow.rotation.x = -0.15;
        this.tractorGroup.add(frontWindow);
        
        // Side windows - cabin sides
        const sideWindowGeometry = new THREE.BoxGeometry(0.45, 0.7, 0.1);
        const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        leftWindow.position.set(-0.9, 2.4, -0.3);
        this.tractorGroup.add(leftWindow);
        
        const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        rightWindow.position.set(0.9, 2.4, -0.3);
        this.tractorGroup.add(rightWindow);
        
        // Headlights - dual round lights
        const headlightGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 18);
        const headlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFFF99,
            emissive: 0xFFDD00,
            emissiveIntensity: 0.4,
            roughness: 0.15,
            metalness: 0.7
        });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-0.65, 1.5, 2.4);
        leftHeadlight.rotation.z = Math.PI / 2;
        leftHeadlight.castShadow = true;
        this.tractorGroup.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(0.65, 1.5, 2.4);
        rightHeadlight.rotation.z = Math.PI / 2;
        rightHeadlight.castShadow = true;
        this.tractorGroup.add(rightHeadlight);
        
        // Headlight bezels
        const bezelsGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 18);
        const bezelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            roughness: 0.6,
            metalness: 0.5
        });
        
        const leftBezel = new THREE.Mesh(bezelsGeometry, bezelMaterial);
        leftBezel.position.set(-0.65, 1.5, 2.45);
        leftBezel.rotation.z = Math.PI / 2;
        this.tractorGroup.add(leftBezel);
        
        const rightBezel = new THREE.Mesh(bezelsGeometry, bezelMaterial);
        rightBezel.position.set(0.65, 1.5, 2.45);
        rightBezel.rotation.z = Math.PI / 2;
        this.tractorGroup.add(rightBezel);
        
        // Side mirrors - larger and more visible
        const mirrorGeometry = new THREE.BoxGeometry(0.18, 0.35, 0.18);
        const mirrorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xbbbbbb,
            metalness: 0.8,
            roughness: 0.15
        });
        
        const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        leftMirror.position.set(-1.15, 2.3, 0);
        leftMirror.castShadow = true;
        this.tractorGroup.add(leftMirror);
        
        const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        rightMirror.position.set(1.15, 2.3, 0);
        rightMirror.castShadow = true;
        this.tractorGroup.add(rightMirror);
        
        // Exhaust stack - tall and prominent
        const exhaustGeometry = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 14);
        const exhaustMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.85,
            metalness: 0.3
        });
        const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        exhaust.position.set(0.8, 2.4, 1.3);
        exhaust.castShadow = true;
        this.tractorGroup.add(exhaust);
        
        // Exhaust cap/rain cap
        const capGeometry = new THREE.CylinderGeometry(0.18, 0.14, 0.2, 14);
        const cap = new THREE.Mesh(capGeometry, exhaustMaterial);
        cap.position.set(0.8, 3.6, 1.3);
        cap.castShadow = true;
        this.tractorGroup.add(cap);
        
        // Create wheels - with proper proportions (large rear, small front)
        this.wheels = [];
        const wheelPositions = [
            { x: -0.95, z: 1.4 },   // Front left (small)
            { x: 0.95, z: 1.4 },    // Front right (small)
            { x: -1.45, z: -1.1 },  // Rear left (large)
            { x: 1.45, z: -1.1 }    // Rear right (large)
        ];
        
        wheelPositions.forEach((pos, index) => {
            const isRear = index >= 2;
            const wheel = this.createWheel(isRear);
            wheel.position.set(pos.x, isRear ? 1.0 : 0.48, pos.z);
            this.tractorGroup.add(wheel);
            this.wheels.push({
                mesh: wheel,
                isRear: isRear,
                isFront: !isRear,
                side: pos.x < 0 ? 'left' : 'right'
            });
        });
        
        // Plough attachment (initially hidden)
        this.createPlough();
        
        this.tractorGroup.position.copy(this.position);
        this.scene.add(this.tractorGroup);
        
        // Add physics
        this.addPhysics();
    }
    
    createWheel(isLarge) {
        // Rear wheels: 0.95-1.1 radius, Front wheels: 0.45-0.55 radius
        const radius = isLarge ? 1.05 : 0.50;
        const width = isLarge ? 0.55 : 0.32;
        
        const wheelGroup = new THREE.Group();
        
        // Tire - deep black rubber with better visibility
        const tireGeometry = new THREE.CylinderGeometry(radius, radius, width, 32);
        const tireMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.85,
            metalness: 0.05
        });
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);
        
        // Rim - red to match body
        const rimGroup = new THREE.Group();
        const rimOuterGeometry = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, width * 1.08, 18);
        const rimMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xCC0000,  // Mahindra red
            metalness: 0.75,
            roughness: 0.25
        });
        const rimOuter = new THREE.Mesh(rimOuterGeometry, rimMaterial);
        rimOuter.rotation.z = Math.PI / 2;
        rimGroup.add(rimOuter);
        
        // Rim center cap
        const capGeometry = new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, width * 1.15, 18);
        const cap = new THREE.Mesh(capGeometry, rimMaterial);
        cap.rotation.z = Math.PI / 2;
        rimGroup.add(cap);
        
        // Spokes - stronger design
        const numSpokes = isLarge ? 10 : 5;
        for (let i = 0; i < numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2;
            const spokeGeometry = new THREE.BoxGeometry(0.1, radius * 0.55, width * 0.85);
            const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
            spoke.position.set(
                Math.cos(angle) * radius * 0.35,
                Math.sin(angle) * radius * 0.35,
                0
            );
            spoke.rotation.z = angle;
            rimGroup.add(spoke);
        }
        
        wheelGroup.add(rimGroup);
        
        // Deep tread blocks - characteristic of farm tractors
        const treadWidth = isLarge ? 0.3 : 0.18;
        const treadHeight = isLarge ? 0.18 : 0.12;
        const treadBlockGeometry = new THREE.BoxGeometry(treadWidth, treadHeight, width * 0.75);
        const blockMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x0a0a0a,
            roughness: 0.9,
            metalness: 0
        });
        
        const numTreads = isLarge ? 28 : 14;
        for (let i = 0; i < numTreads; i++) {
            let angle = (i / numTreads) * Math.PI * 2;
            // Rotate rear wheel treads by 90 degrees
            if (isLarge) {
                angle += Math.PI / 2;
            }
            // Multiple rows of treads for agricultural grip
            for (let row = -1; row <= 1; row += 1) {
                const tread = new THREE.Mesh(treadBlockGeometry, blockMaterial);
                const distance = radius * 0.80 + row * 0.14;
                tread.position.set(
                    Math.cos(angle) * distance,
                    Math.sin(angle) * distance,
                    0
                );
                tread.rotation.z = angle;
                tread.castShadow = true;
                wheelGroup.add(tread);
            }
        }
        
        return wheelGroup;
    }
    
    createPlough() {
        this.plough = new THREE.Group();
        
        // Main plough frame (tongue)
        const frameGeometry = new THREE.BoxGeometry(0.3, 0.3, 2);
        const frameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            metalness: 0.6,
            roughness: 0.5
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0.8, -1.5);
        frame.castShadow = true;
        this.plough.add(frame);
        
        // Plough blade - curved for better soil penetration simulation
        const bladeGeometry = new THREE.BoxGeometry(2.2, 0.4, 1.2);
        const bladeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x707070,
            metalness: 0.75,
            roughness: 0.3
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.set(0, 0.3, -2.5);
        blade.rotation.x = Math.PI / 5; // More aggressive angle
        blade.castShadow = true;
        this.plough.add(blade);
        
        // Moldboard (side plate)
        const moldboardGeometry = new THREE.BoxGeometry(0.4, 0.8, 1.1);
        const moldboardMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x606060,
            metalness: 0.7,
            roughness: 0.35
        });
        const moldboard = new THREE.Mesh(moldboardGeometry, moldboardMaterial);
        moldboard.position.set(-1.2, 0.6, -2.5);
        moldboard.rotation.z = Math.PI / 8;
        moldboard.castShadow = true;
        this.plough.add(moldboard);
        
        // Depth control wheel
        const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.8
        });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(1.2, 0.4, -2.3);
        wheel.castShadow = true;
        this.plough.add(wheel);
        
        // Wheel rim
        const rimGeometry = new THREE.CylinderGeometry(0.23, 0.23, 0.3, 12);
        const rimMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.7,
            roughness: 0.3
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.z = Math.PI / 2;
        rim.position.set(1.2, 0.4, -2.3);
        this.plough.add(rim);
        
        // Adjustment arms
        const armGeometry = new THREE.BoxGeometry(0.15, 0.15, 1.5);
        const arm1 = new THREE.Mesh(armGeometry, frameMaterial);
        arm1.position.set(-0.5, 0.5, -1.8);
        arm1.castShadow = true;
        this.plough.add(arm1);
        
        const arm2 = new THREE.Mesh(armGeometry, frameMaterial);
        arm2.position.set(0.5, 0.5, -1.8);
        arm2.castShadow = true;
        this.plough.add(arm2);
        
        this.plough.position.set(0, 0.2, -2.5);
        this.plough.visible = false;
        this.tractorGroup.add(this.plough);
    }
    
    addPhysics() {
        if (!this.physicsWorld) return;
        
        const RAPIER = window.RAPIER;
        
        // Create rigid body for tractor
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(this.position.x, this.position.y, this.position.z);
        
        this.rigidBody = this.physicsWorld.createRigidBody(bodyDesc);
        
        // Main body collider
        const colliderDesc = RAPIER.ColliderDesc.cuboid(1, 0.75, 1.75)
            .setTranslation(0, 1, 0)
            .setFriction(0.5)
            .setRestitution(0.1)
            .setDensity(500);
        
        this.physicsWorld.createCollider(colliderDesc, this.rigidBody);
        
        // Prevent rotation on X and Z axes (keep upright)
        // Parameters: (enableX, enableY, enableZ)
        this.rigidBody.setEnabledRotations(false, true, false);
    }
    
    update(deltaTime, controls) {
        if (!this.rigidBody) return;
        
        // Handle steering
        if (controls.left) {
            this.steering = Math.min(this.steering + this.steeringSpeed * deltaTime, this.maxSteering);
        } else if (controls.right) {
            this.steering = Math.max(this.steering - this.steeringSpeed * deltaTime, -this.maxSteering);
        } else {
            this.steering *= 0.9; // Return to center
        }
        
        // Handle acceleration/braking
        let targetSpeed = 0;
        if (controls.forward) {
            targetSpeed = this.maxSpeed;
        } else if (controls.backward) {
            targetSpeed = -this.maxSpeed * 0.5; // Slower reverse
        }
        
        // Apply acceleration or braking
        if (targetSpeed !== 0) {
            const accel = this.acceleration * deltaTime;
            this.speed += (targetSpeed - this.speed) * accel;
        } else {
            // Apply friction
            this.speed *= this.friction;
            if (Math.abs(this.speed) < 0.1) this.speed = 0;
        }
        
        // Get current physics state
        const translation = this.rigidBody.translation();
        const rotation = this.rigidBody.rotation();
        
        // Calculate forward direction
        const euler = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
        );
        
        const forward = new THREE.Vector3(
            Math.sin(euler.y),
            0,
            Math.cos(euler.y)
        );
        
        // Apply velocity
        const velocity = forward.multiplyScalar(this.speed * deltaTime);
        this.rigidBody.setLinvel(
            { x: velocity.x, y: this.rigidBody.linvel().y, z: velocity.z },
            true
        );
        
        // Apply steering (rotation)
        if (Math.abs(this.speed) > 0.5) {
            const angularVel = -this.steering * (this.speed / this.maxSpeed) * 2;
            this.rigidBody.setAngvel({ x: 0, y: angularVel, z: 0 }, true);
        }
        
        // Update visual position
        this.tractorGroup.position.set(translation.x, translation.y, translation.z);
        this.tractorGroup.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
        
        // Rotate wheels
        this.rotateWheels(deltaTime);
        
        // Update plough visibility
        this.plough.visible = this.ploughActive;
        
        return {
            x: translation.x,
            y: translation.y,
            z: translation.z,
            speed: this.speed
        };
    }
    
    rotateWheels(deltaTime) {
        const rotationSpeed = this.speed * deltaTime * 2;
        
        this.wheels.forEach(wheel => {
            // Rotate wheels based on speed
            wheel.mesh.rotation.x += rotationSpeed;
            
            // Steer front wheels
            if (wheel.isFront) {
                wheel.mesh.rotation.y = this.steering;
            }
        });
    }
    
    togglePlough() {
        this.ploughActive = !this.ploughActive;
        return this.ploughActive;
    }
    
    isPloughing() {
        return this.ploughActive && Math.abs(this.speed) > 1;
    }
    
    getPosition() {
        if (this.rigidBody) {
            const translation = this.rigidBody.translation();
            return new THREE.Vector3(translation.x, translation.y, translation.z);
        }
        return this.position;
    }
}
