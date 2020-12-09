const DEFAULT_IMG_URL = "https://i1.wp.com/www.bitcoincenternyc.com/wp-content/uploads/2019/04/Japan-G20.jpg?fit=4181%2C2787&ssl=1"

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

function gaussianNoise(power = 50) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4) {
        var noise = ((Math.random() + Math.random() - 1) * power);

        data[i] = data[i] + noise;         // red
        data[i + 1] = data[i + 1] + noise; // green
        data[i + 2] = data[i + 2] + noise; // blue
        
    }

    context.putImageData(imageData, 0, 0);
}

function main() {
    
    // Adding listener to load button
    const loadButton = document.getElementById("loadButton");
    
    loadButton.addEventListener("click", () => {
        // Loading image when button is clicked
        
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

    // Specifying url input
    const urlInput = document.getElementById("urlInput");
    urlInput.setAttribute("value", DEFAULT_IMG_URL);


    // Adding listener to binarization
    const noiseButton = document.getElementById("noiseButton");
    
    noiseButton.addEventListener("click", () => {
        gaussianNoise();
    });

    loadButton.click();
}

main()