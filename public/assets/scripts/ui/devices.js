// Marks one device toggle button as selected and updates its ARIA state.
function setToggleButtonSelected(toggleButton, isSelected) {
    toggleButton.classList.toggle('active', isSelected);
    toggleButton.setAttribute('aria-selected', String(isSelected));
}

// Shows only the device card whose id matches, and hides the other one.
// On desktop both cards stay visible: the CSS only hides inactive cards on mobile.
function showDevicePanel(devicePanels, panelId) {
    for (const devicePanel of devicePanels) {
        devicePanel.classList.toggle('is-active', devicePanel.id === panelId);
    }
}

// Sets up the mobile selector that switches between the Environment Monitor
// and the Container Monitor, so only one device card is shown at a time.
export function setupDevicesToggle() {
    const toggleButtons = document.querySelectorAll('.device-toggle-button');
    const devicePanels = document.querySelectorAll('.devices-carousel .device');
    if (toggleButtons.length === 0 || devicePanels.length === 0) return;

    for (const clickedButton of toggleButtons) {
        clickedButton.addEventListener('click', () => {
            for (const toggleButton of toggleButtons) {
                setToggleButtonSelected(toggleButton, toggleButton === clickedButton);
            }
            showDevicePanel(devicePanels, clickedButton.getAttribute('aria-controls'));
        });
    }
}