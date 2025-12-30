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
        // Create tractor body - classic Indian tractor colors (red/orange)
        this.tractorGroup = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 3.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff4500,
            roughness: 0.6,
            metalness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        this.tractorGroup.add(body);
        
        // Engine hood
        const hoodGeometry = new THREE.BoxGeometry(1.8, 0.8, 1.5);
        const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
        hood.position.set(0, 1.8, 1.5);
        hood.castShadow = true;
        this.tractorGroup.add(hood);
        
        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(1.6, 1.2, 1.5);
        const cabinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.4,
            metalness: 0.4
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 2.1, -0.5);
        cabin.castShadow = true;
        this.tractorGroup.add(cabin);
        
        // Windows
        const windowGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.1);
        const windowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x88ccff,
            transparent: true,
            opacity: 0.6,
            roughness: 0.1,
            metalness: 0.9
        });
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        frontWindow.position.set(0, 2.1, 0.3);
        this.tractorGroup.add(frontWindow);
        
        // Create wheels
        this.wheels = [];
        const wheelPositions = [
            { x: -1.2, z: 1.2 },   // Front left
            { x: 1.2, z: 1.2 },    // Front right
            { x: -1.3, z: -1.3 },  // Rear left
            { x: 1.3, z: -1.3 }    // Rear right
        ];
        
        wheelPositions.forEach((pos, index) => {
            const isRear = index >= 2;
            const wheel = this.createWheel(isRear);
            wheel.position.set(pos.x, isRear ? 0.8 : 0.5, pos.z);
            this.tractorGroup.add(wheel);
            this.wheels.push({
                mesh: wheel,
                isRear: isRear,
                isFront: !isRear,
                side: pos.x < 0 ? 'left' : 'right'
            });
        });
        
        // Exhaust pipe
        const exhaustGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const exhaustMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        exhaust.position.set(0.6, 2, 1.5);
        exhaust.castShadow = true;
        this.tractorGroup.add(exhaust);
        
        // Plough attachment (initially hidden)
        this.createPlough();
        
        this.tractorGroup.position.copy(this.position);
        this.scene.add(this.tractorGroup);
        
        // Add physics
        this.addPhysics();
    }
    
    createWheel(isLarge) {
        const radius = isLarge ? 0.8 : 0.5;
        const width = isLarge ? 0.4 : 0.3;
        
        const wheelGroup = new THREE.Group();
        
        // Tire
        const tireGeometry = new THREE.CylinderGeometry(radius, radius, width, 16);
        const tireMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            roughness: 0.9
        });
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);
        
        // Rim
        const rimGeometry = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width * 1.1, 16);
        const rimMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 0.8,
            roughness: 0.2
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);
        
        // Treads
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const treadGeometry = new THREE.BoxGeometry(0.15, 0.1, width * 0.8);
            const tread = new THREE.Mesh(treadGeometry, tireMaterial);
            tread.position.set(
                Math.cos(angle) * radius * 0.95,
                Math.sin(angle) * radius * 0.95,
                0
            );
            tread.rotation.z = angle;
            wheelGroup.add(tread);
        }
        
        return wheelGroup;
    }
    
    createPlough() {
        this.plough = new THREE.Group();
        
        // Plough blade
        const bladeGeometry = new THREE.BoxGeometry(2, 0.3, 1);
        const bladeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            metalness: 0.7,
            roughness: 0.4
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.rotation.x = Math.PI / 6;
        blade.castShadow = true;
        this.plough.add(blade);
        
        // Connection arm
        const armGeometry = new THREE.BoxGeometry(0.2, 0.2, 1.5);
        const arm = new THREE.Mesh(armGeometry, bladeMaterial);
        arm.position.set(0, 0.5, 0.75);
        arm.castShadow = true;
        this.plough.add(arm);
        
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
