// Returns false if figure face is invisble
function checkPlane(plane) {
    const viewPoint = math.matrix([0, 0, -10000, 1]);

    // Computing plane equation
    var equation = planeEquation(plane[0], plane[1], plane[2]);

    // Correcting equation
    var figureCenter = getCenterPoint();

    if (math.multiply(equation, figureCenter) > 0) {
        equation = math.multiply(equation, -1)
    }

    // Apply projection
    equation = projectEquation(equation);

    // Visability checking
    if (math.multiply(viewPoint, equation) < 0) {
        return false;
    }

    return true;
}

// Calculates the equation of the plane from 3 points
function planeEquation(point, otherPoint, thirdPoint) {
    var a1 = getX(otherPoint) - getX(point);
    var b1 = getY(otherPoint) - getY(point)
    var c1 = getZ(otherPoint) - getZ(point)
    
    var a2 = getX(thirdPoint) - getX(point); 
    var b2 = getY(thirdPoint) - getY(point);  
    var c2 = getZ(thirdPoint) - getZ(point);  
    
    var a = b1 * c2 - b2 * c1 ;
    var b = a2 * c1 - a1 * c2 ;
    var c = a1 * b2 - b1 * a2;
    var d = (-a * getX(point) - b * getY(point) - c * getZ(point));

    return math.matrix([a, b, c, d]);
}

// Projecting plane equation
function projectEquation(equation) {
    const F = 0.5;
    const ANGLE = 45 * (Math.PI / 180);

    // Geting inverse projection matrix
    const projectionMatrix = math.inv([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [-F * Math.cos(ANGLE), -F * Math.sin(ANGLE), 0.1, 0],
        [0, 0, 0, 1],
    ]);

    return math.multiply(projectionMatrix, equation);
}