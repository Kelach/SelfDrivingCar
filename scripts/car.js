class Car {
    constructor(x, y, width, height, maxSpeed, controlType) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speedMax = maxSpeed/2;
        this.speed = 0; 
        this.angle = 0;
        this.damaged = false;

        this.acceleration = 0.3;
        this.friction = 0.1;

        this.useBrain = controlType == "AI";

        if (controlType != "NOKEYS") {
            this.score = 0;
            this.sensor = new Sensor(this);
            this.brain = new NeuralNet(
                [this.sensor.rayCount, 6, 6, 4]
            );
        } else if (controlType == "NOKEYS") {
            this.passed = false;
            
        }
        this.controls = new Controls(controlType);

        this.polygon=[];



    }

    #createPolygon() {                                          // locates corners of car
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,            // top right
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad              
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });

        return points;

    }


    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                s => s == null?0 : 1 - s.offset
            );
            const outputs = NeuralNet.feedFoward(offsets, this.brain);

            if (this.useBrain) {
                this.controls.left = outputs[0];
                this.controls.reverse = outputs[1];
                this.controls.forward = outputs[2];
                this.controls.right = outputs[3];

            }
        }
        if (this.score >= 0) {
            for (let i = 0; i < traffic.length; i++) {
                if ((this.y < traffic[i].y) && (traffic[i].passed == false)) {
                    traffic[i].passed = true;
                    this.score++;
                }
            }
        }
       


    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #move() {
    if (this.controls.forward) {
        this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
        this.speed -= this.acceleration;
    }
    if (this.speed > this.speedMax) {
        this.speed = this.speedMax;
    }
    if (this.speed < -this.speedMax) {
        this.speed = -this.speedMax;
    }
    if (this.speed > 0) {
        this.speed -= this.friction;
    }
    if (this.speed < 0) {
        this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
        this.speed = 0;
    }

    if (this.speed != 0) {
        const flip = this.speed > 0 ? 1 : -1;

        if (this.controls.right) {
            this.angle -= 0.03 * flip;
        }
        if (this.controls.left) {
            this.angle += 0.03 * flip;
        }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;

    }

    draw(ctx, color, drawSensor=false) {
        if (this.damaged) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if ((this.sensor) && (drawSensor)) {
            this.sensor.draw(ctx);
        }

    }
}