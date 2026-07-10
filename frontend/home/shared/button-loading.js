// =======================================
// Common Button Loading Helper
// =======================================

function startButtonLoading(button, loadingText) {

    if (!button) return;

    button.dataset.originalText = button.innerHTML;

    // Save current width
    button.style.width = button.offsetWidth + "px";

    button.disabled = true;

    button.innerHTML = loadingText;
}

function stopButtonLoading(button) {

    if (!button) return;

    button.disabled = false;

    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
    }

    // Remove fixed width
    button.style.width = "";
}