const WIDTH = innerWidth * 0.65;
const HEIGHT = innerHeight * 0.8;

const WIDTH_SPACE = WIDTH * 0.1;
const HEIGHT_SPACE = HEIGHT * 0.12;

const STROKE_WEIGHT = 1;

const BLACK_COLOR = 0;
const WHITE_COLOR = 255;

var scaleX = innerWidth * 0.015;
var scaleY = innerWidth * 0.015;
var scaleZ = innerWidth * 0.015;

// Copy startPoints array;
var points = startPoints.slice();

function setup() {
    // setup canvas
    let cnv = createCanvas(WIDTH, HEIGHT, P2D);
    cnv.position(WIDTH_SPACE, HEIGHT_SPACE);

    // setup scale inputs
    xScaleInput = createInput(scaleX.toString());
    xScaleInput.size(50);
    xScaleInput.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * 2)

    yScaleInput = createInput(scaleY.toString());
    yScaleInput.size(50);
    yScaleInput.position(WIDTH + WIDTH_SPACE * 2 + 60, HEIGHT_SPACE * 2)

    zScaleInput = createInput(scaleZ.toString());
    zScaleInput.size(50);
    zScaleInput.position(WIDTH + WIDTH_SPACE * 2 + 120, HEIGHT_SPACE * 2)

    // setup scale button
    scaleButton = createButton("Scale");
    scaleButton.mouseClicked(setScale);
    scaleButton.position(WIDTH + WIDTH_SPACE * 2 + 190, HEIGHT_SPACE * 2);
    scaleButton.style("font-size", "15px");

    // Rotation checkboxes
    zRotationCheckBox = createCheckbox('Rotate Z', false);
    zRotationCheckBox.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * 3);

    xRotationCheckBox = createCheckbox('Rotate X', false);
    xRotationCheckBox.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * 4);
    
    yRotationCheckBox = createCheckbox('Rotate Y', false);
    yRotationCheckBox.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * 5);

    // Reset button
    resetButton = createButton("Reset");
    resetButton.mouseClicked(reset);
    resetButton.position(WIDTH + WIDTH_SPACE * 2, HEIGHT_SPACE * 6);
    resetButton.style("font-size", "15px");
}


// Main function
function draw() {
    background(BLACK_COLOR);
    translate(WIDTH / 2, HEIGHT / 2);

    drawAxes();

    // Draw figure
    stroke(WHITE_COLOR);
    strokeWeight(STROKE_WEIGHT);
    
    for(var i = 0; i < points.length; i++) {

        let vector = points[i];

        if(zRotationCheckBox.checked()) {
            vector = zRotation(vector);
        }

        if(xRotationCheckBox.checked()) {
            vector = xRotation(vector);
        }

        if(yRotationCheckBox.checked()) {
            vector = yRotation(vector);
        }
       
        points[i] = vector;

        vector = scaleVector(vector);
        vector =  projection(vector);

        let x = math.subset(vector, math.index(0));
        let y = math.subset(vector, math.index(1));

        point(x, y);
    }

    connectPoints();
    controllFigure();
}

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
            let x = math.subset(points[i], math.index(0));
            let y = math.subset(points[i], math.index(1));
            let z = math.subset(points[i], math.index(2));
    
            x -= movingValue;
    
            points[i] = math.matrix([x, y, z, 1]);
        }
    }

    if(keyIsDown(RIGHT_ARROW)) {
        for(var i = 0; i < points.length; i++) {
            let x = math.subset(points[i], math.index(0));
            let y = math.subset(points[i], math.index(1));
            let z = math.subset(points[i], math.index(2));
    
            x += movingValue;
    
            points[i] = math.matrix([x, y, z, 1]);
        }
    }

    if(keyIsDown(UP_ARROW)) {
        for(var i = 0; i < points.length; i++) {
            let x = math.subset(points[i], math.index(0));
            let y = math.subset(points[i], math.index(1));
            let z = math.subset(points[i], math.index(2));
    
            y -= movingValue;
    
            points[i] = math.matrix([x, y, z, 1]);
        }
    }

    if(keyIsDown(DOWN_ARROW)) {
        for(var i = 0; i < points.length; i++) {
            let x = math.subset(points[i], math.index(0));
            let y = math.subset(points[i], math.index(1));
            let z = math.subset(points[i], math.index(2));
    
            y += movingValue;
    
            points[i] = math.matrix([x, y, z, 1]);
        }
    }
}

// Z rotation
function zRotation(vector) {
    return math.multiply(rotateZMatrix, vector);
}

// X rotation
function xRotation(vector) {
    return math.multiply(rotateXMatrix, vector);
}

// Y rotation
function yRotation(vector) {
    return math.multiply(rotateYMatrix, vector);
}

// Projection
function projection(vector) {
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
}

function setScale() {
    scaleX = parseFloat(xScaleInput.value());
    scaleY = parseFloat(yScaleInput.value());
    scaleZ = parseFloat(zScaleInput.value());
}

// Draw line between points
function connect(point, otherPoint) {
    let vector = scaleVector(point);
    vector = projection(vector);

    let x = math.subset(vector, math.index(0));
    let y = math.subset(vector, math.index(1));

    vector = scaleVector(otherPoint);
    vector = projection(vector);

    let other_x = math.subset(vector, math.index(0));
    let other_y = math.subset(vector, math.index(1));

    stroke(WHITE_COLOR);
    strokeWeight(1);
    line(x, y, other_x, other_y);
}

function drawAxes() {
    const LENGTH = 10000;
    
    // Draw Y axes
    stroke(color(0, 255, 0));
    strokeWeight(1);

    var yVector =  projection(math.matrix([0, LENGTH, 0, 1]));
    var x = math.subset(yVector, math.index(0));
    var y = math.subset(yVector, math.index(1));

    line(0, 0, x, y);

    // Draw X axes
    stroke(color(0, 0, 255));
    
    var xVector =  projection(math.matrix([LENGTH, 0, 0, 1]));
    var x = math.subset(xVector, math.index(0));
    var y = math.subset(xVector, math.index(1));
    
    line(0,0, x, y);

    // Draw Z axes
    stroke(color(255, 0, 0));
    
    var zVector =  projection(math.matrix([0, 0, LENGTH, 1]));
    var x = math.subset(zVector, math.index(0));
    var y = math.subset(zVector, math.index(1));
    
    line(0,0, x, y);
}
