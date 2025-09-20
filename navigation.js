// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Emergency Function
function emergency() {
    alert('🚨 Emergency Services:\n\nNational Emergency: 112\nMedical Emergency: 102\nPolice: 100\nFire: 101\n\nFor immediate medical assistance, call 102 or visit the nearest hospital.');
}