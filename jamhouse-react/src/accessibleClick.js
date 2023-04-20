function handlePress(e, callback) {
  // Only accept Enter or Space keypresses
  if (!(e.code === "Space" || e.code === "Enter")) {
      return;
  }
  if (e.code === "Space") {
      // Stop page scroll from pressing space
      e.preventDefault();
  }
  callback();
}

export { handlePress }