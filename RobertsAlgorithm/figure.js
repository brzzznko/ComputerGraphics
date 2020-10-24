// cube coordinates
var points = [
    math.matrix([1, 1, 1, 1]),
    math.matrix([1, 2, 1, 1]),
    math.matrix([2, 2, 1, 1]),
    math.matrix([2, 1, 1, 1]),
    math.matrix([1, 1, 2, 1]),
    math.matrix([1, 2, 2, 1]),
    math.matrix([2, 2, 2, 1]),
    math.matrix([2, 1, 2, 1]),
]

// Returns point inside figure
function getCenterPoint() {
    var x = y = z = 0;
    
    for (let i = 0; i < points.length; i++) {
        x += getX(points[i]);
        y += getY(points[i]);
        z += getZ(points[i]);
    }

    return math.matrix([x / points.length, y / points.length, z / points.length, 1]);
}


// Draw lines between figure points
function connectPoints() {
    var faces = [
        [points[0], points[1], points[2], points[3]],
        [points[4], points[5], points[6], points[7]],
        [points[4], points[0], points[1], points[5]],
        [points[6], points[2], points[3], points[7]],
        [points[4], points[0], points[3], points[7]],
        [points[5], points[1], points[2], points[6]],
    ]
    
    for (let i = 0; i < faces.length; i++) {
        // connect points if face is visible
        if (checkPlane(faces[i])) {
            connect(faces[i][0], faces[i][1]);
            connect(faces[i][1], faces[i][2]);
            connect(faces[i][2], faces[i][3]);
            connect(faces[i][3], faces[i][0]);
        }
    }
}