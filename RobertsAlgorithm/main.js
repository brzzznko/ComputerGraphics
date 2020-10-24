const WIDTH = innerWidth * 0.65;
const HEIGHT = innerHeight * 0.8;

const WIDTH_SPACE = WIDTH * 0.1;
const HEIGHT_SPACE = HEIGHT * 0.12;

const STROKE_WEIGHT = 1;

const BLACK_COLOR = 0;
const WHITE_COLOR = 255;

const ROTATE_ANGLE = 1 * (Math.PI / 180);

const START_SCALE = innerWidth * 0.07;

var scaleX = START_SCALE;
var scaleY = START_SCALE;
var scaleZ = START_SCALE;

var lineStartPoint = math.matrix([0, 0, 0, 1]);
var lineEndPoint = math.matrix([0, 0, 0, 1]);

var isRotatingAroundLine = false;

// Copy startPoints array;
const startPoints = points.slice();

function setup() {
    // setup canvas
    let cnv = createCanvas(WIDTH, HEIGHT, P2D);
    cnv.position(WIDTH_SPACE, HEIGHT_SPACE);

    let fontSize = "15px";
    let inputSize = 50;

    let elementLineCount = 2;

    // setup scale inputs
    xScaleInput = createInput(scaleX.toString());
    xScaleInput.size(inputSize);
    xScaleInput.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * elementLineCount);

    yScaleInput = createInput(scaleY.toString());
    yScaleInput.size(inputSize);
    yScaleInput.position(WIDTH + WIDTH_SPACE * 2 + 60, HEIGHT_SPACE * elementLineCount);

    zScaleInput = createInput(scaleZ.toString());
    zScaleInput.size(inputSize);
    zScaleInput.position(WIDTH + WIDTH_SPACE * 2 + 120, HEIGHT_SPACE * elementLineCount)

    // setup scale button
    scaleButton = createButton("Scale");
    scaleButton.mouseClicked(setScale);
    scaleButton.position(WIDTH + WIDTH_SPACE * 2 + 190, HEIGHT_SPACE * elementLineCount);
    scaleButton.style("font-size", fontSize);

    // Rotation checkboxes
    elementLineCount++;
    zRotationCheckBox = createCheckbox('Rotate Z', false);
    zRotationCheckBox.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * elementLineCount);

    elementLineCount++;
    xRotationCheckBox = createCheckbox('Rotate X', false);
    xRotationCheckBox.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * elementLineCount);
    
    elementLineCount++;
    yRotationCheckBox = createCheckbox('Rotate Y', false);
    yRotationCheckBox.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * elementLineCount);

    // setup line inputs
    elementLineCount++;
    xStartPointInput = createInput("0");
    xStartPointInput.size(inputSize);
    xStartPointInput.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * elementLineCount);

    yStartPointInput = createInput("0");
    yStartPointInput.size(inputSize);
    yStartPointInput.position(WIDTH + WIDTH_SPACE * 2 + 60, HEIGHT_SPACE * elementLineCount);

    zStartPointInput = createInput("0");
    zStartPointInput.size(inputSize);
    zStartPointInput.position(WIDTH + WIDTH_SPACE * 2 + 120, HEIGHT_SPACE * elementLineCount);

    elementLineCount++;
    xEndPointInput = createInput("0");
    xEndPointInput.size(inputSize);
    xEndPointInput.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * elementLineCount);

    yEndPointInput = createInput("0");
    yEndPointInput.size(inputSize);
    yEndPointInput.position(WIDTH + WIDTH_SPACE * 2 + 60, HEIGHT_SPACE * elementLineCount);

    zEndPointInput = createInput("0");
    zEndPointInput.size(inputSize);
    zEndPointInput.position(WIDTH + WIDTH_SPACE * 2 + 120, HEIGHT_SPACE * elementLineCount);

    // Rotate button
    resetButton = createButton("Rotate");
    resetButton.mouseClicked(rotationAroundLineButtonClicked);
    resetButton.position(WIDTH + WIDTH_SPACE * 2 + 190, HEIGHT_SPACE * elementLineCount);
    resetButton.style("font-size", fontSize);

    // Reset button
    elementLineCount++;
    resetButton = createButton("Reset");
    resetButton.mouseClicked(reset);
    resetButton.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * elementLineCount);
    resetButton.style("font-size", fontSize);
}


// Main function
function draw() {
    background(BLACK_COLOR);
    translate(WIDTH / 2, HEIGHT / 2);
    strokeWeight(STROKE_WEIGHT);

    drawAxises();

    // Draw line to rotating around
    stroke(color(153, 50, 204));
    connect(lineStartPoint, lineEndPoint);
    

    // Draw figure
    stroke(WHITE_COLOR);
    
    for(var i = 0; i < points.length; i++) {
        let vector = points[i];

        // Rotating around line
        if (isRotatingAroundLine) {
            vector = rotationAroundLine(vector, ROTATE_ANGLE);
        }

        // Rotating around Z axis
        if(zRotationCheckBox.checked()) {
            vector = zRotation(vector,  Math.cos(ROTATE_ANGLE), Math.sin(ROTATE_ANGLE));
        }

        // Rotating around X axis
        if(xRotationCheckBox.checked()) {
            vector = xRotation(vector, Math.cos(ROTATE_ANGLE), Math.sin(ROTATE_ANGLE));
        }
        
        // Rotating around Y axis
        if(yRotationCheckBox.checked()) {
            vector = yRotation(vector, Math.cos(ROTATE_ANGLE), Math.sin(ROTATE_ANGLE));
        }
        
        // Save new coordinates
        points[i] = vector;

        // Scale and projection vector
        vector = scaleVector(vector);
        vector =  projection(vector);
    }

    // Draw lines between points
    connectPoints();
    
    // Move figure by arrow keys
    controllFigure();
}

function rotationAroundLineButtonClicked() {
    // Rotating around line is on
    if (!isRotatingAroundLine) {
        isRotatingAroundLine = true;

        // Get points coordinates
        var startX = parseFloat(xStartPointInput.value());
        var startY = parseFloat(yStartPointInput.value());
        var startZ = parseFloat(zStartPointInput.value());

        lineStartPoint = math.matrix([startX, startY, startZ, 1]);

        var endX = parseFloat(xEndPointInput.value());
        var endY = parseFloat(yEndPointInput.value());
        var endZ = parseFloat(zEndPointInput.value());

        lineEndPoint = math.matrix([endX, endY, endZ, 1]);
    } else {
        isRotatingAroundLine = false;
    }
    
}

function reset() {
    // Load figure start coordinates
    points = startPoints.slice();
    
    // Set default scale
    scaleX = START_SCALE;
    scaleY = START_SCALE;
    scaleZ = START_SCALE;

    xScaleInput.value(scaleX.toString());
    yScaleInput.value(scaleY.toString());
    zScaleInput.value(scaleZ.toString());

    // Off rotating around line
    isRotatingAroundLine = false;

    lineStartPoint = math.matrix([0, 0, 0, 1]);
    lineEndPoint = math.matrix([0, 0, 0, 1]);
}

function setScale() {
    scaleX = parseFloat(xScaleInput.value());
    scaleY = parseFloat(yScaleInput.value());
    scaleZ = parseFloat(zScaleInput.value());
}

// Move figure by arrow keys
function controllFigure() {
    let movingValue = 0.1;

    if(keyIsDown(LEFT_ARROW)) {
        for(var i = 0; i < points.length; i++) {
            points[i] = moveVector(points[i], -movingValue, 0, 0);
        }
    }

    if(keyIsDown(RIGHT_ARROW)) {
        for(var i = 0; i < points.length; i++) {    
            points[i] = moveVector(points[i], movingValue, 0, 0);
        }
    }

    if(keyIsDown(UP_ARROW)) {
        for(var i = 0; i < points.length; i++) {
            points[i] = moveVector(points[i], 0, -movingValue, 0);
        }
    }

    if(keyIsDown(DOWN_ARROW)) {
        for(var i = 0; i < points.length; i++) {
            points[i] = moveVector(points[i], 0, movingValue, 0);
        }
    }
}