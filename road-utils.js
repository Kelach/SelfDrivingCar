// JavaScript source code

function lerp(A, B, t) {
    return A + (B - A) * t
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length],
            );
            if (touch) {
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;

    return ("rgba(" + R + "," + G + "," + B + "," + alpha + ")");
}

function getRandomInt(N) {
   const min = Math.ceil(0);
   const max = Math.floor(N);

    return Math.floor(Math.random() * (N));


}

function spawnTraffic(bestCar) {
    //trafficDistances = Math.abs(...traffic);


   const trafficMax = traffic.find(         //finds traffic farthest(-direction) from main car
        c => c.y == Math.max(
            ...traffic.map(c => c.y)
        ));
    const trafficMin = traffic.find(         //finds traffic farthest(+direction) from main car
        c => c.y == Math.min(
            ...traffic.map(c => c.y)
        ));

    if ( Math.abs(Math.abs(Math.abs(bestCar.y) - Math.abs(trafficMax.y))) > 800) {
        delay++;                                             // deletes farthest car from traffic, and adds new rand car. 
/*        console.log(delay);*/
        if (delay > 70) {
            deleteCar(traffic, trafficMax);
            generateTraffic(1, bestCar, "!START");
            if (traffic.length < 8) {
                generateTraffic(2, bestCar, "!START");
            } else if (traffic.length>5){
                delay3--;
            }

            delay = 0
        }

    } else if (Math.abs(Math.abs(Math.abs(bestCar.y) - Math.abs(trafficMin.y))) > 800) {
        delay2++;
/*        console.log(delay2);*/
        if (delay2 > 50) {
            deleteCar(traffic, trafficMin);
            if (traffic.length < 8) {
            generateTraffic(1, bestCar, "!START");
            }
            delay2 = 0
        }
    }

}