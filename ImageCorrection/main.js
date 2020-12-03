const defaultImageUrl = "https://i1.wp.com/www.bitcoincenternyc.com/wp-content/uploads/2019/04/Japan-G20.jpg?fit=4181%2C2787&ssl=1"
const BUTTON_DISTANCE = 30;

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

function drawBrightnessHistogram(chart) {
    // Get image data from canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Compute brightness
    var dict = Array(256).fill(0);

    for (let i = 0; i < data.length; i += 4) {
        var brightness = Math.round(
            0.299 * data[i] + 0.5876 * data[i + 1] + 0.114 * data[i + 2]
        );
        
        dict[brightness] += 1;
    }

    const maxValue = 1500;

    for (let i = 0; i < dict.length; i += 1) {
        if(dict[i] > maxValue) {
            dict[i] = maxValue;
        }
    }

    chart.config.data.datasets[0].data = dict;
    chart.update();

    
}

function invert() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }

    context.putImageData(imageData, 0, 0);
};

function grayscale() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;      // red
        data[i + 1] = avg;  // green
        data[i + 2] = avg;  // blue
    }

    context.putImageData(imageData, 0, 0);
};

function brightnessAdjustment(coefficent) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4) {
        data[i] += coefficent;        // red
        data[i + 1] += coefficent;    // green
        data[i + 2] += coefficent;     // blue

        if (data[i] > 255)
            data[i] = 255;
        else if (data[i] < 0)
            data[i] = 0;
        
        if (data[i + 1] > 255)
            data[i + 1] = 255;
        else if (data[i + 1] < 0)
            data[i + 1] = 0;
        
        if (data[i + 2] > 255)
            data[i + 2] = 255;
        else if (data[i + 2] < 0)
            data[i + 2] = 0;
    }

    context.putImageData(imageData, 0, 0);
}

function main() {
    // Draw histogram
    var ctx = document.getElementById('chart');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from(Array(256).keys()),
            datasets: [{
                barPercentage: 0.5,
                barThickness: 6,
                maxBarThickness: 8,
                minBarLength: 2,
                data: Array(256).fill(0),
                backgroundColor: "rgba(0, 0, 255, 1)",
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                fontSize: 16,
                text: "Brightness Diagram"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
        }
    });

    // Load button
    const loadButton = document.getElementById("loadButton");
    
    // Loading image when button clicked
    loadButton.addEventListener("click", () => {
        var url = urlInput.value;
        
        let image = document.createElement("img");
        
        image.onload = function() {
            canvas.setAttribute("width", canvas.offsetWidth);
            canvas.setAttribute("height", canvas.offsetHeight);

            context.drawImage(image, 0, 0, image.width, image.height,
                 0, 0, canvas.offsetWidth, canvas.offsetHeight);

            drawBrightnessHistogram(chart);
        }

        image.setAttribute("src", url);
        image.setAttribute("crossOrigin", "");
    })

    // Draw brightness histogram button
    const histButton = document.getElementById("histButton");
    histButton.addEventListener("click", () => {drawBrightnessHistogram(chart)});

    // Specifying url input
    const urlInput = document.getElementById("urlInput");
    urlInput.setAttribute("value", defaultImageUrl);

    // Adding listener to grayscaleButton
    const grayscaleButton = document.getElementById("grayscaleButton");
    grayscaleButton.addEventListener("click", () => {
        grayscale();
        drawBrightnessHistogram(chart);
    });

    // Adding listener to invertButton
    const invertButton = document.getElementById("invertButton");
    invertButton.addEventListener("click", () => {
        invert();
        drawBrightnessHistogram(chart);
    });

    const brightnessInput = document.getElementById("brightnessInput");
    const brightnessButton = document.getElementById("brightnessButton");
    
    brightnessButton.addEventListener("click", () => {
        var coefficent =  parseInt(brightnessInput.value);
        brightnessAdjustment(coefficent);
        drawBrightnessHistogram(chart);
    });
}

main()