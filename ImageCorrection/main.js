const defaultImageUrl = "https://i1.wp.com/www.bitcoincenternyc.com/wp-content/uploads/2019/04/Japan-G20.jpg?fit=4181%2C2787&ssl=1"

// Get pixel data from canvas
function getPixels(x, y) {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext('2d');
    
    return context.getImageData(x, y, 1, 1);
}

function drawBrightnessHistogram() {
    const canvas = document.getElementById("canvas");
    
    // compute brightness
    var dict = Array(256).fill(0);
    
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            var colors = getPixels(x, y).data;
            
            var brightness = Math.round(0.299 * colors[0] + 0.5876 * colors[1] + 0.114 * colors[2]);
            
            dict[brightness] += 1;
        }
    }

    // Draw histogram
    var ctx = document.getElementById('chart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from(Array(256).keys()),
            datasets: [{
                barPercentage: 0.5,
                barThickness: 6,
                maxBarThickness: 8,
                minBarLength: 2,
                data: dict,
                backgroundColor: "rgba(0, 0, 255, 1)",
            }],
        },
        options: {
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
}

function main() {
    // Load button
    const loadButton = document.getElementById("loadButton");
    // Loading image when button clicked
    loadButton.addEventListener("click", () => {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext('2d');
        
        var url = urlInput.value;
        
        let image = document.createElement("img");
        image.onload = function() {
            canvas.setAttribute("width", canvas.offsetWidth);
            canvas.setAttribute("height", canvas.offsetHeight);

            context.drawImage(image, 0, 0, image.width, image.height,
                 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        }
        image.setAttribute("src", url);
        image.setAttribute("crossOrigin", "");

        
    })

    // Draw brightness histogram button
    const histButton = document.getElementById("histButton");
    histButton.style.left = window.innerWidth - histButton.offsetWidth;
    histButton.addEventListener("click", drawBrightnessHistogram);

    // InputLabel
    const inputLabel = document.getElementById("inputLabel");
    
    // Specifying url input
    const urlInput = document.getElementById("urlInput");
    var inputOffset = inputLabel.offsetWidth + histButton.offsetWidth + 70;
    urlInput.style.width = window.innerWidth - inputOffset + "px";
    urlInput.setAttribute("value", defaultImageUrl);
}

main()