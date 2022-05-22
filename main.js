const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;



const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 100;
const cars = generateCars(N);

let delay = 0;
let delay2 = 0;
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if (i != 0) {
            NeuralNet.mutate(cars[i].brain,0.5)
        }
    }
   
}


const traffic = generateTraffic(5, bestCar, "START");


animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateTraffic(N, mainCar, type) {
    let traffic = [];


    // generates N number of "NOKEYS" cars with random speeds, x, and (mainCar.y +) y values). 
    
    for (let i = 1; i <= N; i++) {
        const randMaxSpeed = (Math.random() * 10) + 5;
        let randY = 0;
        if (type == "START") {
            randY = Math.random() < 0.1 ?
                -(100 + Math.abs(mainCar.y)) :
                -(Math.abs((Math.random()) * 100) + Math.abs(mainCar.y));
        } else if (type != "START") {
            randY = -(1000 + Math.abs(mainCar.y));
        }

        
        const randLane = getRandomInt(road.laneCount);
        traffic.push(new Car(road.getLaneCenter(randLane),
            randY, 30, 50, randMaxSpeed, "NOKEYS"))
    }

    if (N == 1) {
        traffic = traffic[0];
    }

    return traffic;
}
function deleteCar(type, car) {
    index = type.findIndex(car=>car.y==car.y);      //not sure what this does but function is needed as arg. 
    type.splice(index, 1);
}
function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,20,"AI"))
    }
    return cars;
}

function animate(time) {

    // finds "best car" defined as Car with most -y
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        ));

    spawnTraffic(bestCar);
    

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[]);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
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
