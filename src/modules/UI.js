// UI module - Speedometer and game stats
export class UI {
    constructor() {
        this.speedometer = document.getElementById('speedometer');
        this.ploughedCount = document.getElementById('ploughed-count');
        this.cropCount = document.getElementById('crop-count');
        this.overlay = document.getElementById('ui-overlay');
        this.instructions = document.getElementById('instructions');
        this.loading = document.getElementById('loading');
        
        this.ploughedTiles = 0;
        this.plantedCrops = 0;
    }
    
    show() {
        if (this.loading) {
            this.loading.style.display = 'none';
        }
        if (this.overlay) {
            this.overlay.style.display = 'block';
        }
        if (this.instructions) {
            this.instructions.style.display = 'block';
        }
    }
    
    updateSpeed(speed) {
        if (this.speedometer) {
            const kmh = Math.abs(speed * 3.6).toFixed(0);
            this.speedometer.textContent = `${kmh} km/h`;
        }
    }
    
    incrementPloughed() {
        this.ploughedTiles++;
        if (this.ploughedCount) {
            this.ploughedCount.textContent = this.ploughedTiles;
        }
    }
    
    incrementCrops() {
        this.plantedCrops++;
        if (this.cropCount) {
            this.cropCount.textContent = this.plantedCrops;
        }
    }
}
