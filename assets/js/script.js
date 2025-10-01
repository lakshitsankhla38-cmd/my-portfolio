// --- Section Navigation Logic ---
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach((navLink) => {
    navLink.addEventListener('click', function() {
        const target = this.innerText.trim().toLowerCase();
        pages.forEach(page => {
            if (page.dataset.page === target) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        navigationLinks.forEach(link => {
            if (link === this) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        window.scrollTo(0, 0);
    });
});
'use strict';



// element toggle function
const elementToggleFunc = function(elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function() { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable

const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function() {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");

    // add click event to all modal items
    for (let i = 0; i < testimonialsItem.length; i++) {

        testimonialsItem[i].addEventListener("click", function() {

            modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
            modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
            modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
            modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

            testimonialsModalFunc();

        });
    }
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function() { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function(selectedValue) {
    document.querySelectorAll('[data-filter-item]').forEach(item => {
        if (selectedValue === "all" || selectedValue === item.dataset.category) {
            item.style.display = "block";
            item.classList.add("active");
        } else {
            item.style.display = "none";
            item.classList.remove("active");
        }
    });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function() {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;

    });

}



// Modal elements
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");


// Modal image navigation restricted by filter
let currentImgIndex = 0;
let filteredImgs = [];
let filteredItems = [];

function updateFilteredImgs() {
    // Find active filter
    let activeBtn = document.querySelector('.filter-list .active');
    let filter = activeBtn ? activeBtn.textContent.trim().toLowerCase() : 'all';
    filteredItems = Array.from(document.querySelectorAll('.project-item.active'));
    filteredImgs = filteredItems.map(item => item.querySelector('img')).filter(Boolean);
}

function showModalAtIndex(idx) {
    updateFilteredImgs();
    if (filteredImgs[idx]) {
        modal.style.display = "block";
        modalImg.src = filteredImgs[idx].src;
        modalImg.alt = filteredImgs[idx].alt;
        currentImgIndex = idx;
    }
}

// Add click event to all project images and eye icons to open modal with large image
document.querySelectorAll(".project-item").forEach((item) => {
    const figure = item.querySelector("figure");
    if (!figure) return;
    const img = figure.querySelector("img");
    const iconBox = figure.querySelector(".project-item-icon-box");

    function showModal(e) {
        e.preventDefault();
        updateFilteredImgs();
        // Find index in filteredImgs
        let idx = filteredImgs.findIndex(i => i === img);
        if (idx !== -1) showModalAtIndex(idx);
    }
    if (iconBox) {
        iconBox.addEventListener("click", showModal);
    }
    if (img) {
        img.addEventListener("click", showModal);
        img.style.cursor = "pointer";
    }
});


// Modal navigation: arrow keys
document.addEventListener("keydown", function(e) {
    if (modal.style.display === "block") {
        updateFilteredImgs();
        if (e.key === "ArrowRight") {
            showModalAtIndex((currentImgIndex + 1) % filteredImgs.length);
        } else if (e.key === "ArrowLeft") {
            showModalAtIndex((currentImgIndex - 1 + filteredImgs.length) % filteredImgs.length);
        } else if (e.key === "Escape") {
            modal.style.display = "none";
        }
    }
});


// Mouse drag navigation
let dragStartX = null;
modalImg.addEventListener("mousedown", function(e) {
    dragStartX = e.clientX;
});
modalImg.addEventListener("mouseup", function(e) {
    if (dragStartX !== null) {
        updateFilteredImgs();
        let diff = e.clientX - dragStartX;
        if (diff > 50) {
            showModalAtIndex((currentImgIndex - 1 + filteredImgs.length) % filteredImgs.length);
        } else if (diff < -50) {
            showModalAtIndex((currentImgIndex + 1) % filteredImgs.length);
        }
    }
    dragStartX = null;
});

// Touch swipe navigation
let touchStartX = null;
modalImg.addEventListener("touchstart", function(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
    } else if (e.touches.length === 2) {
        pinchZoomStart(e);
    }
});
modalImg.addEventListener("touchend", function(e) {
    if (touchStartX !== null && e.touches.length === 0) {
        updateFilteredImgs();
        let diff = e.changedTouches[0].clientX - touchStartX;
        if (diff > 50) {
            showModalAtIndex((currentImgIndex - 1 + filteredImgs.length) % filteredImgs.length);
        } else if (diff < -50) {
            showModalAtIndex((currentImgIndex + 1) % filteredImgs.length);
        }
    }
    touchStartX = null;
});

// --- ZOOM FUNCTIONALITY ---
let zoomLevel = 1;
let lastZoomLevel = 1;
let pinchStartDist = null;

function setZoom(level) {
    zoomLevel = Math.max(1, Math.min(level, 5));
    modalImg.style.transform = `scale(${zoomLevel})`;
}

// Mouse wheel zoom
modalImg.addEventListener("wheel", function(e) {
    if (modal.style.display === "block") {
        e.preventDefault();
        let delta = e.deltaY < 0 ? 0.1 : -0.1;
        setZoom(zoomLevel + delta);
    }
});

// Double click to reset zoom
modalImg.addEventListener("dblclick", function() {
    setZoom(1);
});

// Touch pinch zoom
function pinchZoomStart(e) {
    if (e.touches.length === 2) {
        pinchStartDist = getPinchDist(e);
        lastZoomLevel = zoomLevel;
    }
}
modalImg.addEventListener("touchmove", function(e) {
    if (e.touches.length === 2 && pinchStartDist) {
        let newDist = getPinchDist(e);
        let scaleChange = newDist / pinchStartDist;
        setZoom(lastZoomLevel * scaleChange);
    }
});

function getPinchDist(e) {
    let dx = e.touches[0].clientX - e.touches[1].clientX;
    let dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Close modal on × click
closeBtn.onclick = function() {
    modal.style.display = "none";
};

// Close modal if clicking outside the image
modal.onclick = function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};


// EmailJS initialization and safe form handler
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        // Initialize with your public key
        emailjs.init("UyxzG4QrFOf-LEZ22");

        var contactForm = document.querySelector('[data-form]');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.disabled = true;

                // Get form values
                const userEmail = this.querySelector('[name="email"]').value;
                const userName = this.querySelector('[name="fullname"]').value;

                const templateParams = {
                    name: userName,
                    email: userEmail,
                    message: this.querySelector('[name="message"]').value,
                    from_name: userName,              // This will show as the sender's name
                    user_name: userName,
                    user_email: userEmail,
                    to_name: 'Lakshit',
                    to_email: 'lakshitsankhla38@gmail.com',
                    reply_to: userEmail,
                    from_email: userEmail            // This helps identify the sender
                };

                // Send the message using your template
                emailjs.send('service_mb7ucbq', 'template_t1nst5u', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        alert('Thanks for your message! I will get back to you soon.');
                        document.querySelector('[data-form]').reset(); // Clear the form
                    }, function(error) {
                        console.error('FAILED...', error);
                        let errorMsg = (error && error.text) ? error.text : JSON.stringify(error);
                        alert('Failed to send: ' + errorMsg);
                    });
            });
        }
    }
});

// --- Dynamic Portfolio Image Loader ---
function loadPortfolioImages() {
    const categories = [
        { name: 'social media posts', folder: 'social', prefix: 's', count: 50 },
        { name: 'logo design', folder: 'logo', prefix: 'l', count: 20 },
        { name: 'ui design', folder: 'ui', prefix: 'u', count: 20 }
    ];
    const projectList = document.getElementById('dynamic-project-list');
    if (!projectList) return;
    categories.forEach(cat => {
        for (let i = 1; i <= cat.count; i++) {
            const imgName = `${cat.prefix}${i}.png`;
            const imgPath = `./assets/images/${cat.folder}/${imgName}`;
            const item = document.createElement('li');
            item.className = 'project-item active';
            item.setAttribute('data-filter-item', '');
            item.setAttribute('data-category', cat.name);
            item.innerHTML = `
                <a href="#" class="project-link">
                    <figure class="project-img">
                        <div class="project-item-icon-box">
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                        <img src="${imgPath}" alt="${cat.name} ${i}" loading="lazy">
                    </figure>
                    <h3 class="project-title">${cat.name} ${i}</h3>
                    <p class="project-category">${cat.name}</p>
                </a>
            `;
            // Hide grid item if image fails to load and remove from DOM
            item.querySelector('img').addEventListener('error', function() {
                item.remove(); // Completely remove invalid items instead of just hiding them
            });
            projectList.appendChild(item);
        }
    });
    // Attach modal open events to new images
    document.querySelectorAll("#dynamic-project-list .project-item").forEach((item) => {
        const figure = item.querySelector("figure");
        if (!figure) return;
        const img = figure.querySelector("img");
        const iconBox = figure.querySelector(".project-item-icon-box");

        function showModal(e) {
            e.preventDefault();
            updateFilteredImgs();
            let idx = filteredImgs.findIndex(i => i === img);
            if (idx !== -1) showModalAtIndex(idx);
        }
        if (iconBox) iconBox.addEventListener("click", showModal);
        if (img) {
            img.addEventListener("click", showModal);
            img.style.cursor = "pointer";
        }
    });
}
document.addEventListener('DOMContentLoaded', loadPortfolioImages);