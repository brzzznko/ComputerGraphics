// cube coordinates
const startPoints = [
    math.matrix([1, 1, 1, 1]),
    math.matrix([1, 2, 1, 1]),
    math.matrix([2, 2, 1, 1]),
    math.matrix([2, 1, 1, 1]),
    math.matrix([1, 1, 2, 1]),
    math.matrix([1, 2, 2, 1]),
    math.matrix([2, 2, 2, 1]),
    math.matrix([2, 1, 2, 1]),
]

// Draw lines between figure points
function connectPoints() {
    connect(points[0], points[1]);
    connect(points[1], points[2]);
    connect(points[2], points[3]);
    connect(points[3], points[0]);

    connect(points[4], points[5]);
    connect(points[5], points[6]);
    connect(points[6], points[7]);
    connect(points[7], points[4]);

    connect(points[0], points[4]);
    connect(points[1], points[5]);
    connect(points[2], points[6]);
    connect(points[3], points[7]);
}