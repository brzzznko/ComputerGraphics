const defaultImageUrl = "https://www.kindpng.com/picc/m/236-2362818_anime-sempai-animegirl-heart-kawaii-cute-anime-girl.png"

function main() {
    // Load button
    const loadButton = document.getElementById("loadButton");
    // Loading image when button clicked
    loadButton.addEventListener("click", () => {
        var url = urlInput.value;
        
        var place = document.getElementById("startImage");
        place.innerHTML = "";

        var image = document.createElement("img");
        image.setAttribute("src", url);
        image.setAttribute("width", "600");
        image.setAttribute("margin-top", "30%");
        
        place.appendChild(image);
    })

    // InputLabel
    const inputLabel = document.getElementById("inputLable");
    
    // Specifying url input
    const urlInput = document.getElementById("urlInput");
    var inputOffset = inputLabel.offsetWidth + loadButton.offsetWidth + 70
    urlInput.style.width = window.innerWidth - inputOffset + "px";
    urlInput.setAttribute("value", defaultImageUrl);

    loadButton.click();
    
    // Getting image
    var image = document.getElementById("startImage").children[0];
}

main()