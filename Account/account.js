function redirectTo(page) {
    window.location.href = page; // Redirects to a new page
}

function loadTabs(containerId) {
    let tabsContainer = document.getElementById(containerId);
    tabsContainer.innerHTML = ""; // Clear old tabs


    let savedTabs = JSON.parse(localStorage.getItem(containerId)) || [];

    savedTabs.forEach(tabData => {
        let newTab = document.createElement("div");
        newTab.classList.add("tab");

        let titleElement = document.createElement("h3");
        titleElement.innerText = tabData.title;

        let descriptionElement = document.createElement("p");
        descriptionElement.innerText = tabData.description;

        newTab.appendChild(titleElement);
        newTab.appendChild(descriptionElement);

        tabsContainer.appendChild(newTab);
    });
}

// **Load tabs when the page opens**
window.onload = function() {
    setTimeout(() => {
    loadTabs("tabContainer1"); 
    loadTabs("tabContainer2"); 
    }, 100);
};