// Get all book images
const bookCovers = document.querySelectorAll('.book-cover img');

// Add event listeners to each image for mouseover and mouseout
bookCovers.forEach((cover) => {
    cover.addEventListener('mouseover', () => {
        cover.style.transform = 'scale(1.1)';
        cover.style.transition = 'transform 0.3s ease'; // Smooth transition
    });

    cover.addEventListener('mouseout', () => {
        cover.style.transform = 'scale(1)';
    });
});
// MODEL for projects
