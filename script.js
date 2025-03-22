// .....................................................................
// .........__..__..______..__.....__......______.......................
// .........||..||..||......||.....||.....||....||......................
// .........||__||..||____..||.....||.....||....||......................
// .........||..||..||......||.....||.....||....||......................
// .........||..||..||____..||___..||___..||____||......................
// .....................................................................
// .........WILDCARD...ROBOTICS...CODE...YIPPEE!!!......................

const burgerMenu = document.getElementById("burger-menu");
const navbar = document.getElementById("navbar");

// Toggle the navigation menu when the burger icon is clicked
burgerMenu.addEventListener("click", () => {
    navbar.classList.toggle("active");
});

// Close the navbar if clicked outside of it
document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target) && !burgerMenu.contains(event.target)) {
        navbar.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Get the current page's URL
    const currentPage = window.location.pathname.split("/").pop(); // Get the file name (e.g., 'index.html')

    // Get all the links in the navbar
    const navLinks = document.querySelectorAll('.navbar a');

    // Loop through each link and check if its href matches the current page
    navLinks.forEach(function(link) {
        // If the link href matches the current page, add the 'active' class
        if (link.href.includes(currentPage)) {
            link.classList.add('active');
        } else {
            // Otherwise, remove the 'active' class
            link.classList.remove('active');
        }
    });
});

