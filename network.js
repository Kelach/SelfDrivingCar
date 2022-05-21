// JavaScript source code
class NeuralNet {
    constructor(neuronCount) {
        this.levels = [];
        for (let i = 0; i < neuronCount.length - 1; i++) {
            this.levels.push(new Level(
                neuronCount[i], neuronCount[i + 1]
            ));
        }
    }
    static feedFoward(givenInputs, network) {
        let outputs = Level.feedFoward(
            givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedFoward(
                outputs, network.levels[i]);
        }
        return outputs;
    }
}
class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weight = [];
        for (let i = 0; i < inputCount; i++) {
            this.weight[i] = new Array(outputCount);
        }
        Level.#randomize(this);
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weight[i][j] = Math.random() * 2 - 1; 
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i]= Math.random() * 2 - 1;
        }
    }

    static feedFoward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weight[j][i];
            }
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}




