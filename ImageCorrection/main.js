const defaultImageUrl = "https://i0.wp.com/www.tommyooi.com/wp-content/uploads/2020/05/david-edelstein-N4DbvTUDikw-unsplash-scaled.jpg?fit=600%2C400&ssl=1"

function getPixels(canvasContext, x, y) {
    return canvasContext.getImageData(x,y, 1, 1);
}

function main() {
    const canvas = document.getElementById("canvas");
    canvas.setAttribute("width", "600");
    canvas.setAttribute("height", "400");
    canvas.setAttribute("margin-top", "30%");
    
    const context = canvas.getContext('2d');

    // Load button
    const loadButton = document.getElementById("loadButton");
    // Loading image when button clicked
    loadButton.addEventListener("click", () => {
        var url = urlInput.value;
        
        let image = document.createElement("img");
        image.setAttribute("src", url);
        image.setAttribute("crossOrigin", "");

        context.drawImage(image, 0, 0);
    })

    // InputLabel
    const inputLabel = document.getElementById("inputLable");
    
    // Specifying url input
    const urlInput = document.getElementById("urlInput");
    var inputOffset = inputLabel.offsetWidth + loadButton.offsetWidth + 70
    urlInput.style.width = window.innerWidth - inputOffset + "px";
    urlInput.setAttribute("value", defaultImageUrl);

    loadButton.click();
}

main()