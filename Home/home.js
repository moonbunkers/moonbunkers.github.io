function redirectTo(page) {
    window.location.href = page; // Redirects to a new page
};

//ensures that only one tab is created
document.getElementById("addTabButton1").replaceWith(document.getElementById("addTabButton1").cloneNode(true)); 
document.getElementById("addTabButton2").replaceWith(document.getElementById("addTabButton2").cloneNode(true));

function addTab(containerId, tabTitle, tabDescription) {
    let tabsContainer = document.getElementById(containerId);
    let newTab = document.createElement("div");
    newTab.classList.add("tab");

    // Create header element
    let titleElement = document.createElement("h3");
    titleElement.innerText = tabTitle;
    
    // Create subtext element
    let descriptionElement = document.createElement("p");
    descriptionElement.innerText = tabDescription;

    // Append elements to tab
    newTab.appendChild(titleElement);
    newTab.appendChild(descriptionElement);

    tabsContainer.appendChild(newTab);
    tabsContainer.scrollLeft = tabsContainer.scrollWidth;

    saveTabs(containerId);
};

function saveTabs(containerId) {
    let tabs = JSON.parse(localStorage.getItem(containerId)) || [];
    
    document.getElementById(containerId).querySelectorAll(".tab").forEach(tab => {
        let title = tab.querySelector("h3") ? tab.querySelector("h3").innerText : "";
        let description = tab.querySelector("p") ? tab.querySelector("p").innerText : "";
        tabs.push({ title, description });
    });
    localStorage.setItem(containerId, JSON.stringify(tabs));
};

function loadTabs(containerId) {
    let tabsContainer = document.getElementById(containerId);
    tabsContainer.innerHTML = ""; // Clear old tabs

    let savedTabs = JSON.parse(localStorage.getItem(containerId)) || [];

    savedTabs.forEach(tabData => {
        let newTab = document.createElement("div");
        newTab.classList.add("tab");

        // Create a flex container for image + text
        let contentWrapper = document.createElement("div");
        contentWrapper.classList.add("tab-content");

        // Create the image element
        let imageElement = document.createElement("img");
        imageElement.classList.add("tab-image");
        imageElement.src = (tabData.images && tabData.images.length > 0) ? tabData.images[0] : "../Help and hero logo.png";
        imageElement.onload = function () {
            adjustImageSize(imageElement);
        };

        
        // Create a text wrapper for title + description
        let textWrapper = document.createElement("div");
        textWrapper.classList.add("tab-text");

        let titleElement = document.createElement("h3");
        titleElement.innerText = tabData.title;

        let descriptionElement = document.createElement("p");
        descriptionElement.innerText = tabData.description;
        
        // Append title & description to text wrapper
        textWrapper.appendChild(titleElement);
        textWrapper.appendChild(descriptionElement);

        // Append image and text to the content wrapper
        contentWrapper.appendChild(imageElement);
        contentWrapper.appendChild(textWrapper);

        // Append everything to the tab container
        newTab.appendChild(contentWrapper);

        newTab.addEventListener("click", function () {
            tabData.containerId = containerId;
            localStorage.setItem("selectedTab", JSON.stringify(tabData));
            window.location.href = "../TabDetails/tabdetails.html"; // Redirect
        });

        tabsContainer.appendChild(newTab);
    });
};

// **Load tabs when the page opens**
window.onload = function() {
    loadTabs("tabContainer1"); 
    loadTabs("tabContainer2"); 
};

document.getElementById("addTabButton1").addEventListener("click", function() {
    document.getElementById("tabModal").setAttribute("data-container", "tabContainer1");
    document.getElementById("tabModal").style.display = "flex";
});
document.getElementById("addTabButton2").addEventListener("click", function() {
    document.getElementById("tabModal").setAttribute("data-container", "tabContainer2");
    document.getElementById("tabModal").style.display = "flex";
});

function createTab(containerId) {

    let tabTitle = document.getElementById("tabTitle").value;
    let tabDescription = document.getElementById("tabDescription").value;
    let tabDlong = document.getElementById("tabDlong").value;

    let newTab = { title: tabTitle, description: tabDescription, dlong: tabDlong };

    //Retrieve existing tabs and add new one
    let savedTabs = JSON.parse(localStorage.getItem(containerId)) || [];
    savedTabs.push(newTab);
    localStorage.setItem(containerId, JSON.stringify(savedTabs));
    
    saveTabs(containerId);
    loadTabs(containerId); // Refresh both Account and Home sections
};

function createAd(containerId) {
    let tabTitle = document.getElementById("tabTitle").value.trim();
    let tabDescription = document.getElementById("tabDescription").value.trim();
    //let tabImageInput = document.getElementById("tabImage").files;
    let tabDlong = document.getElementById("tabDlong").value.trim();

    if (!tabTitle || !tabDescription) {
        alert("Please enter a title and description before adding a tab.");
        return;
    };

    let newTab = {
        title: tabTitle,
        description: tabDescription,
        dlong: tabDlong,
        images: []
    };

    let imageContainers = document.querySelectorAll("#imageupload .imagecontainer img");

    if (imageContainers.length > 0) {
        imageContainers.forEach(img => {
            newTab.images.push(img.src); // ✅ Save image source
        });

        saveTab(containerId, newTab); // ✅ Save tab once images are processed
    } else {
        newTab.images = ["../../Help and hero logo.png"]; // ✅ Default image fallback
        saveTab(containerId, newTab);
    }
};

function saveTab(containerId, newTab) {
    let savedTabs = JSON.parse(localStorage.getItem(containerId)) || [];
    savedTabs.push(newTab);
    localStorage.setItem(containerId, JSON.stringify(savedTabs));
    setTimeout(() => {
        window.location.href = "../account.html";
    }, 100);
    loadTabs(containerId); // Refresh UI
};

function adjustImageSize(imageElement) {
    imageElement.onload = function () {
        let originalWidth = imageElement.naturalWidth;
        let originalHeight = imageElement.naturalHeight;
        let aspectRatio = originalHeight / originalWidth;

        // ✅ Always set a fixed width and height while maintaining proportions
        if (aspectRatio > 1) {
            imageElement.style.height = "135px"; // Fixed height
            imageElement.style.width = (135 / aspectRatio) + "px"; // Adjusted width
        } else {
            imageElement.style.width = "140px"; // Fixed width
            imageElement.style.height = (140 * aspectRatio) + "px"; // Adjusted height
        }
    };
};

function addImage() {
    let imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.accept = "image/*";
    imageInput.style.display = "none";

    imageInput.addEventListener("change", function (event) {
        let selectedImage = event.target.files[0]
        if (selectedImage) {
            console.log("Selected Image:", selectedImage.name)
            displaySelectedImage(selectedImage)
        }
    });
    document.body.appendChild(imageInput);
    imageInput.click();
};

function displaySelectedImage(file) {
    let reader = new FileReader();

    reader.onload = function (e) {
        let imageContainer = document.createElement("div");
        imageContainer.classList.add("imagecontainer"); // ✅ Uses existing styling

        let imgElement = document.createElement("img");
        imgElement.src = e.target.result;
        imgElement.alt = "Selected Image";

        // ✅ Create remove button (Red ❌)
        let removeButton = document.createElement("button");
        removeButton.innerText = "❌";
        removeButton.classList.add("remove-image");
        removeButton.style.border = "1px solid black";
        removeButton.style.background = "white";
        removeButton.style.color = "white";
        removeButton.style.padding = "5px";
        removeButton.style.cursor = "pointer";
        removeButton.style.zIndex = "999";
        removeButton.style.position = "absolute";
        removeButton.style.top = "2px";
        removeButton.style.right = "2px"
        removeButton.style.opacity = "0.25";
        removeButton.addEventListener("mouseover", function () {
            removeButton.style.opacity = "0.9";
        });
        removeButton.addEventListener("mouseout", function (){
            removeButton.style.opacity = "0.25";
        });

        // ✅ Remove image when clicking the button
        removeButton.onclick = function () {
            imageContainer.remove();
        };

        // ✅ Append elements to `imagecontainer`
        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(removeButton);
        document.getElementById("imageupload").appendChild(imageContainer);
    };

    reader.readAsDataURL(file);
};

function scrollimageleft() {
    let tabData = JSON.parse(localStorage.getItem("selectedTab"));
    let imgElement = document.createElement("img");
    if (tabData.images && tabData.images.length > 1) {
        if (tabData.images && tabData.images.length < currentImageIndex++) {
            imgElement.src = tabData.images[currentImageIndex++];
            imgElement.alt = "Tab Image";
            imgElement.style.objectFit = "contain";
            document.getElementById("imagebox").appendChild(imgElement);
            currentImageIndex++;
        } else {
            imgElement.src = images[0];
            imgElement.alt = "Tab Image";
            imgElement.style.objectFit = "contain";
            document.getElementById("imagebox").appendChild(imgElement);
        };
        return;
    };
    };