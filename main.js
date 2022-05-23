const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 700;

var seconds = 0;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 1000;
const M = 100;

const startTime = performance.now();

const cars = generateCars(N);

let score = 0;
let traffic = [];
let counter = 0;
let delay = 0;
let delay2 = 0;
let delay3 = 0;
let bestCar = cars[0];
let bestFitness = 0

//let carRecord = JSON.parse(                         
//    localStorage.getItem("carRecord"));

let recordV = JSON.parse(
    localStorage.getItem("recordV"));

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if (i != 0) {
            NeuralNet.mutate(cars[i].brain,0.2)
        }
    }
   
}


generateTraffic(2, bestCar, "START");
generateTraffic(1, bestCar, "FIXED");


animate();

function getTime() {
    const currTime = performance.now();
    timeDiff = currTime - startTime;
    seconds = Math.round((timeDiff) / 1000);
    return seconds;
}

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
    localStorage.setItem("recordV",
        JSON.stringify(-bestCar.y/ getTime())

    );
     // my fitness socre
    localStorage.setItem("recordFitness",
        JSON.stringify(bestFitness)

    );
}

function discard() {
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("recordFitness");
    localStorage.removeItem("recordV");
}

function generateTraffic(N, mainCar, type) {


    // generates N number of "NOKEYS" cars with random speeds, x, and (mainCar.y +) y values). 
    
    for (let i = 1; i <= N; i++) {
        const randMaxSpeed = (Math.random() * 10) + 5;
        let randY = 0;
        let randLane = 0;
        if (type != "!START") {
            randY = Math.random() < 0.1 ?
                -(100 + Math.abs(mainCar.y)) :
                -(Math.abs((Math.random()) * 100) + Math.abs(mainCar.y));
        } else if (type == "!START") {
            randY = -(500 + Math.abs(mainCar.y));
        } 

        if (type != "FIXED") {                                  // 'FIXED' arg sets car in middle lane
             randLane = getRandomInt(road.laneCount); 
        } else {
             randLane = 1;
        }

        traffic.push(new Car(road.getLaneCenter(randLane),
            randY, 30, 50, randMaxSpeed, "NOKEYS"))
    }
}

function deleteCar(type, value) {
    index = type.indexOf(value);      
    type.splice(index, 1);
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,20,"AI"))
    }
    return cars;
}

function findFastestCar(cars) {
    let fastestCar = 0;
    let avgVelocities = [];
    for (let i = 0; i < cars.length; i++) {

        avgV = getTime() == 0 ? 0 : -(cars[i].y / getTime());
        avgVelocities.push(avgV);
    }

    const fastestSpeed = Math.max(...avgVelocities)
    const index = avgVelocities.indexOf(fastestSpeed);
    fastestCar = cars[index];

    return fastestCar;


}

function animate(time) {

    recordFitness = JSON.parse(
        localStorage.getItem("recordFitness")
    );

    bestCar = findFastestCar(cars);
    spawnTraffic(bestCar);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    //fastest car will have best fitness
    bestFitness = getTime() == 0 ? 0 : (-bestCar.y / getTime()) + (bestCar.score * 20);

    if (bestFitness > recordFitness) {
        save();
        console.log("saved");
    }

    if ((cars.every(c => c.damaged == true))                                    
        || (bestCar.speed < 3) || (bestCar.damaged)) {                          
        delay3++;                                                               

        if ((delay3 > 400)) {
            console.log("reset needed");
            location.reload();
            counter++
        }

    } else if (bestCar.speed > 4) {
        delay3 = delay3 < 0 ? 0 : delay3 - 2;
    }

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*.7)

    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "gray");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;

    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);

}

