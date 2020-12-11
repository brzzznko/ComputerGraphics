const DEFAULT_IMG_URL = "https://i0.wp.com/www.gamingconviction.com/wp-content/uploads/2020/04/Japan.jpg?fit=2032%2C1269&ssl=1"

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

function convolve(filter, offset = 0) {
    var width = canvas.width;
    var height = canvas.height;
  
    var size = Math.sqrt(filter.length);
    var half = Math.floor(size / 2);
  
    var inputData = context.getImageData(0, 0, width, height).data;
  
    var output = context.createImageData(width, height);
    var outputData = output.data;
  
    for (var pixelY = 0; pixelY < height; pixelY++) {
      for (var pixelX = 0; pixelX < width; pixelX++) {
        var r = 0, g = 0, b = 0, a = 0;
        
        for (var filterY = 0; filterY < size; filterY++) {
          for (var filterX = 0; filterX < size; filterX++) {
            var weight = filter[filterY * size + filterX];
            
            var neighborY = Math.min(
              height - 1, Math.max(0, pixelY + filterY - half)
            );
            var neighborX = Math.min(
              width - 1, Math.max(0, pixelX + filterX - half)
            );

            var inputIndex = (neighborY * width + neighborX) * 4;
            r += inputData[inputIndex] * weight;
            g += inputData[inputIndex + 1] * weight;
            b += inputData[inputIndex + 2] * weight;
            a += inputData[inputIndex + 3] * weight;
          }
        }
        
        var outputIndex = (pixelY * width + pixelX) * 4;
        outputData[outputIndex] = r + offset;
        outputData[outputIndex + 1] = g + offset;
        outputData[outputIndex + 2] = b + offset;
        outputData[outputIndex + 3] = filter.normalized ? a : 255;
      }
    }
    
    context.putImageData(output, 0, 0);
}

function normalize(filter) {
    var len = filter.length;
    var normal = new Array(len);

    var sum = 0;
    for (let i = 0; i < len; ++i) {
      sum += filter[i];
    }

    if (sum <= 0) {
      normal.normalized = false;
      sum = 1;
    } 
    else {
      normal.normalized = true;
    }

    for (i = 0; i < len; ++i) {
      normal[i] = filter[i] / sum;
    }

    return normal;
}

function uniformFilter() {
    let filter = normalize([
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
    ]);

    convolve(filter);
}

function sharpening() {
  let filter = normalize([
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ]);

  convolve(filter, 0);
}

function embossing() {
    let filter = normalize([
        1, 0, 0,
        0, 0, 0,
        0, 0, -1
    ]);
    
    convolve(filter, 128);
}

function laplacianEdgeDetection() {
  let filter = normalize([
    0, 1, 0,
    1, -4, 1,
    0, 1, 0
  ]);
  
  convolve(filter, 255);
}

function sobelEdgeDetection() {
  let filter = normalize([
    1, 2, 1,
    0, 0, 0,
    -1, -2, -1
  ]);
  
  convolve(filter, 255);
}

function simpleNoise() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (var i = 0; i < data.length; i += 4) {
        if(Math.random() > 0.95) {
            data[i] = 255;         // red
            data[i + 1] = 255; // green
            data[i + 2] = 255; // blue
        }
    }

    context.putImageData(imageData, 0, 0);
}

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


    // Adding listener to noiseButton
    const noiseButton = document.getElementById("noiseButton");
    
    noiseButton.addEventListener("click", () => {
        gaussianNoise();
    });

    // Adding listener to uniformButton
    const uniformButton = document.getElementById("uniformButton");
    
    uniformButton.addEventListener("click", () => {
        uniformFilter();
    });

    // Adding listener to sharpeningButton
    const sharpeningButton = document.getElementById("sharpeningButton");
    
    sharpeningButton.addEventListener("click", () => {
        sharpening();
    });

    // Adding listener to embossingButton
    const embossingButton = document.getElementById("embossingButton");
    
    embossingButton.addEventListener("click", () => {
        embossing();
    });

    // Adding listener to embossingButton
    const laplacianButton = document.getElementById("laplacianButton");
    
    laplacianButton.addEventListener("click", () => {
        laplacianEdgeDetection();
    });

    // Adding listener to embossingButton
    const sobelButton = document.getElementById("sobelButton");
    
    sobelButton.addEventListener("click", () => {
        sobelEdgeDetection();
    });

    loadButton.click();
}

main()