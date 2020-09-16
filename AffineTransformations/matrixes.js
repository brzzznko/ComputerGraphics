const F = 0.5;
const ANGLE = 45 * (Math.PI / 180);

const projectionMatrix = math.matrix([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [-F * Math.cos(ANGLE), -F * Math.sin(ANGLE), 0, 0],
    [0, 0, 0, 1],
]);

const ROTATE_ANGLE = 1 * (Math.PI / 180);

const rotateZMatrix = math.matrix([
    [Math.cos(ROTATE_ANGLE), Math.sin(ROTATE_ANGLE), 0, 0],
    [-Math.sin(ROTATE_ANGLE), Math.cos(ROTATE_ANGLE), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]);

const rotateXMatrix = math.matrix([
    [1, 0, 0, 0],
    [0, Math.cos(ROTATE_ANGLE), Math.sin(ROTATE_ANGLE), 0],
    [0, -Math.sin(ROTATE_ANGLE), Math.cos(ROTATE_ANGLE), 0],
    [0, 0, 0, 1],
]);

const rotateYMatrix = math.matrix([
    [Math.cos(ROTATE_ANGLE), 0, -Math.sin(ROTATE_ANGLE), 0],
    [0, 1, 0, 0],
    [Math.sin(ROTATE_ANGLE), 0, Math.cos(ROTATE_ANGLE), 0],
    [0, 0, 0, 1],
]);

/*var moveMatrix = math.matrix([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1]
])*/

