// Shortcut to go stores page.
document.addEventListener('keydown', function (event) {
  if (event.key === "1" || event.key === "numpad1" || event.key === "s") {
    console.log("Shortcut used to go stores page.");
    window.location.href = "http://localhost:3004/stores";
  }
});

// Shortcut to go products page.
document.addEventListener('keydown', function (event) {
  if (event.key === "2" || event.key === "numpad2" || event.key === "p") {
    console.log("Shortcut used to go products page.");
    window.location.href = "http://localhost:3004/products";
  }
});

// Shortcut to go managers page.
document.addEventListener('keydown', function (event) {
  if (event.key === "3" || event.key === "numpad3" || event.key === "m") {
    console.log("Shortcut used to go managers page.");
    window.location.href = "http://localhost:3004/managers";
  }
});

// Shortcut to go back to home page.
document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    console.log('Escape key was pressed!');
    window.location.href = "http://localhost:3004/home";
  }
});