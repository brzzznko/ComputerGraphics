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