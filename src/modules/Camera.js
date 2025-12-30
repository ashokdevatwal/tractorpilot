// Camera module - Third-person follow camera
import * as THREE from 'three';

export class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        // Camera follow settings
        this.offset = new THREE.Vector3(0, 8, -15);
        this.lookAtOffset = new THREE.Vector3(0, 2, 5);
        this.smoothness = 0.1;
        
        this.camera.position.set(0, 10, -20);
        this.setupResize();
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }
    
    update(target, deltaTime = 0.016) {
        if (!target) return;
        
        // Get target position
        const targetPosition = target.getPosition();
        
        // Calculate desired camera position
        const tractorGroup = target.tractorGroup;
        const tractorRotation = tractorGroup.quaternion;
        
        // Rotate offset based on tractor rotation
        const rotatedOffset = this.offset.clone().applyQuaternion(tractorRotation);
        const desiredPosition = targetPosition.clone().add(rotatedOffset);
        
        // Smooth camera movement (frame-rate independent)
        // Convert smoothness to a damping factor
        const dampingFactor = 1 - Math.exp(-this.smoothness * 10 * deltaTime);
        this.camera.position.lerp(desiredPosition, dampingFactor);
        
        // Look at point slightly ahead of tractor
        const rotatedLookAt = this.lookAtOffset.clone().applyQuaternion(tractorRotation);
        const lookAtPosition = targetPosition.clone().add(rotatedLookAt);
        
        this.camera.lookAt(lookAtPosition);
    }
    
    getCamera() {
        return this.camera;
    }
}
