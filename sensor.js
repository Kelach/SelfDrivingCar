// JavaScript source code

class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 4;
        this.rayLength = 100;
        this.raySpread = Math.PI / 2;

        this.rays = [];
        this.readings = [];
    }
    update(roadBorders) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        }
    }
    #getReading(ray, roadBoarders) {
        let touches = [];
        for (let i = 0; i < roadBoarders.length; i++) {
/*            let roadBorders = road.borders;*/
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBoarders[i][0]
            );
            if (touch) {
                touches.push(touch);
            }
        }
        if (touches.length == 0) {
            return null;
        } else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
    }
    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }
    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            let start = { x: this.car.x, y: this.car.y };
            let end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
            };

            let end2 = end;


            if (this.readings[i]) {
                end2 = this.readings
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                start.x ,
                start.y
            );
            ctx.lineTo(
                end2.x,
                end2.y
            );
            ctx.stroke();


            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                end.x,
                end.y
            );
            ctx.lineTo(
                end2.x,
                end2.y
            );
            ctx.stroke();

        }
    }
}