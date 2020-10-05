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