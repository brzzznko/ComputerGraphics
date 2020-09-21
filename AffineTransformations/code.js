const WIDTH = innerWidth * 0.65;
const HEIGHT = innerHeight * 0.8;

const WIDTH_SPACE = WIDTH * 0.1;
const HEIGHT_SPACE = HEIGHT * 0.12;

const STROKE_WEIGHT = 1;

const BLACK_COLOR = 0;
const WHITE_COLOR = 255;

const ROTATE_ANGLE = 1 * (Math.PI / 180);

var scaleX = innerWidth * 0.015;
var scaleY = innerWidth * 0.015;
var scaleZ = innerWidth * 0.015;

var lineStartPoint = math.matrix([0, 0, 0, 1]);
var lineEndPoint = math.matrix([0, 0, 0, 1]);

var isRotatingAroundLine = false;

// Copy startPoints array;
var points = startPoints.slice();

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
        
        // Draw point
        let x = getX(vector);
        let y = getY(vector);

        point(x, y);
    }

    // Draw lines between points
    connectPoints();
    
    // Move figure by arrow keys
    controllFigure();
}

// Z rotation
function zRotation(vector, cos, sin) {
    var rotateZMatrix = math.matrix([
        [cos, -sin, 0, 0],
        [sin, cos, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]);

    return math.multiply(rotateZMatrix, vector);
}

// X rotation
function xRotation(vector, cos, sin) {
    var rotateXMatrix = math.matrix([
        [1, 0, 0, 0],
        [0, cos, -sin, 0],
        [0, sin, cos, 0],
        [0, 0, 0, 1],
    ]);

    return math.multiply(rotateXMatrix, vector);
}

// Y rotation
function yRotation(vector, cos, sin) {
    var rotateYMatrix = math.matrix([
        [cos, 0, -sin, 0],
        [0, 1, 0, 0],
        [sin, 0, cos, 0],
        [0, 0, 0, 1],
    ]);

    return math.multiply(rotateYMatrix, vector);
}

// Projection
function projection(vector) {
    const F = 0.5;
    const ANGLE = 45 * (Math.PI / 180);

    const projectionMatrix = math.matrix([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [-F * Math.cos(ANGLE), -F * Math.sin(ANGLE), 0, 0],
        [0, 0, 0, 1],
    ]);

    return math.multiply(vector, projectionMatrix);
}

// Scale
function scaleVector(vector) {
    var scaleMatrix = math.matrix([
        [scaleX, 0, 0, 0],
        [0, scaleY, 0, 0],
        [0, 0, scaleZ, 0],
        [0, 0, 0, 1]
    ]);

    return math.multiply(scaleMatrix, vector);
}

// Move
function moveVector(vector, x, y, z) {
    var moveMatrix = math.matrix([
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]
    ]);

    return math.multiply(moveMatrix, vector);
}

function rotationAroundLine(vector, angle) {
    // Get start point corrdinates
    let x = getX(lineStartPoint);
    let y = getY(lineStartPoint);
    let z = getZ(lineStartPoint);

    // Get end point coordinates
    let xEnd = getX(lineEndPoint);
    let yEnd = getY(lineEndPoint);
    let zEnd = getZ(lineEndPoint);

    // directed vector
    directedVector = normalize(math.matrix([xEnd - x, yEnd - y, zEnd - z]));

    var a = getX(directedVector);
    var b = getY(directedVector);
    var c = getZ(directedVector);

    var d = Math.sqrt(b*b + c*c);

    // Step 1: Translate space so that the rotation axis passes through the origin
    vector = moveVector(vector, -x, -y, -z);
    
    // Step 2: Rotate space about the x axis 
    // so that the rotation axis lies in the xz plane
    if(d != 0) {
        vector = xRotation(vector, c/d, b/d);
    }
    
    // Step 3: Rotate space about the y axis 
    // so that the rotation axis lies along the positive z axis.
    vector = yRotation(vector, d, a);

    // Step 4: perform the desired rotation about the z axis
    vector = zRotation(vector, Math.cos(angle), Math.sin(angle));

    // Undo step 3-1.
    vector = yRotation(vector, d, -a);
    
    if (d != 0) {
        vector = xRotation(vector, c/d, -b/d);
    }
   
    vector = moveVector(vector, x, y, z);

    return vector;
}

function normalize(vector) {
    let x = getX(vector);
    let y = getY(vector);
    let z = getZ(vector);

    let range = Math.sqrt(x*x + y*y + z*z);

    if (range == 0)  
        range = 1;

    return math.matrix([x/range, y/range, z/range, 1]);
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
    scaleX = innerWidth * 0.015;
    scaleY = innerWidth * 0.015;
    scaleZ = innerWidth * 0.015;

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

// Draw lines between figure points
function connectPoints() {
    // Connect outer border
    for (let i = 0; i < 8; i++) {
        connect(points[i], points[i + 1]);
    }
    connect(points[0], points[8]);

    // Connect inner border
    for (let i = 9; i < 14; i++) {
        connect(points[i], points[i + 1]);
    }
    connect(points[9], points[14]);

    for (let i = 15; i < 20; i++) {
        connect(points[i], points[i + 1]);
    }
    connect(points[15], points[20]);

    // Connect back outer border
    for (let i = 21; i < 29; i++) {
        connect(points[i], points[i + 1]);
    }
    connect(points[21], points[29]);

    // Connect back inner border
    for (let i = 30; i < 35; i++) {
        connect(points[i], points[i + 1]);
    }
    connect(points[30], points[35]);

    for (let i = 36; i < 41; i++) {
        connect(points[i], points[i + 1]);
    }
    connect(points[36], points[41]);

    // connect back and front
    for (let i = 0; i < 8; i++) {
        connect(points[i], points[i + 21]);
    }
    connect(points[8], points[29]);

    for (let i = 9; i < 14; i++) {
        connect(points[i], points[i + 21]);
    }
    connect(points[14], points[35]);

    for (let i = 15; i < 20; i++) {
        connect(points[i], points[i + 21]);
    }
    connect(points[20], points[41]);

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

// Draw line between points
function connect(point, otherPoint) {
    let vector = scaleVector(point);
    vector = projection(vector);

    let x = getX(vector);
    let y = getY(vector);

    vector = scaleVector(otherPoint);
    vector = projection(vector);

    let other_x = getX(vector);
    let other_y = getY(vector);

    line(x, y, other_x, other_y);
}

function drawAxises() {
    const LENGTH = 10000;
    let zeroVector = math.matrix([0, 0, 0, 1]);
    
    // Draw Y axis
    stroke(color(0, 255, 0));
    var yVector =  math.matrix([0, LENGTH, 0, 1]);
    connect(zeroVector, yVector);

    // Draw X axis
    stroke(color(0, 0, 255));
    var xVector =  math.matrix([LENGTH, 0, 0, 1]);
    connect(zeroVector, xVector);

    // Draw Z axis
    stroke(color(255, 0, 0));
    var zVector =  math.matrix([0, 0, LENGTH, 1]);
    connect(zeroVector, zVector);
}

function getX(vector) {
    return math.subset(vector, math.index(0));
}

function getY(vector) {
    return math.subset(vector, math.index(1));
}

function getZ(vector) {
    return math.subset(vector, math.index(2));
}