// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Simulate some initial data for demo purposes
    simulateInitialData();
});

// Setup all event listeners
function setupEventListeners() {
    // URL/Text toggle
    const urlToggle = document.getElementById('urlToggle');
    const urlInput = document.querySelector('.url-input');
    const textInput = document.querySelector('.text-input');
    
    if (urlToggle) {
        urlToggle.addEventListener('change', function() {
            if (this.checked) {
                urlInput.classList.remove('d-none');
                textInput.classList.add('d-none');
            } else {
                urlInput.classList.add('d-none');
                textInput.classList.remove('d-none');
            }
        });
    }
    
    // File input change
    const mediaFile = document.getElementById('mediaFile');
    const fileName = document.getElementById('fileName');
    
    if (mediaFile) {
        mediaFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = '';
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Simulate initial data for demonstration
function simulateInitialData() {
    // You would replace this with actual API calls in a real implementation
    console.log("VeritasAI initialized");
}

// Analyze article function
function analyzeArticle() {
    const urlToggle = document.getElementById('urlToggle');
    const articleUrl = document.getElementById('articleUrl');
    const articleText = document.getElementById('articleText');
    
    let inputValue = '';
    
    if (urlToggle.checked) {
        inputValue = articleUrl.value.trim();
        if (!inputValue) {
            alert('Please enter a URL to analyze');
            return;
        }
        if (!isValidUrl(inputValue)) {
            alert('Please enter a valid URL');
            return;
        }
    } else {
        inputValue = articleText.value.trim();
        if (!inputValue) {
            alert('Please enter some text to analyze');
            return;
        }
        if (inputValue.split(/\s+/).length < 10) {
            alert('Please enter at least 10 words for accurate analysis');
            return;
        }
    }
    
    // Show loading state
    showLoading('article');
    
    // Simulate API call delay
    setTimeout(() => {
        // For demo purposes, we'll show a fake result
        showArticleResult({
            credibility: Math.floor(Math.random() * 40) + 60, // Random between 60-100
            sourceReliability: Math.floor(Math.random() * 100),
            languageAnalysis: Math.floor(Math.random() * 100),
            factChecking: Math.floor(Math.random() * 100),
            verdict: Math.random() > 0.3 ? 'Likely Authentic' : 'Suspicious'
        });
    }, 2000);
}

// Analyze media function
function analyzeMedia() {
    const mediaFile = document.getElementById('mediaFile');
    
    if (!mediaFile.files || mediaFile.files.length === 0) {
        alert('Please select a file to analyze');
        return;
    }
    
    const file = mediaFile.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/quicktime'];
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
        alert('Please select a valid image (JPEG, PNG, WebP) or video (MP4, MOV) file');
        return;
    }
    
    // Show loading state
    showLoading('media');
    
    // Simulate API call delay
    setTimeout(() => {
        // For demo purposes, we'll show a fake result
        showMediaResult({
            authenticity: Math.floor(Math.random() * 100),
            visualArtifacts: Math.floor(Math.random() * 100),
            metadataAnalysis: Math.floor(Math.random() * 100),
            aiDetection: Math.floor(Math.random() * 100),
            verdict: Math.random() > 0.5 ? 'Likely Authentic' : 'Likely Manipulated'
        });
    }, 3000);
}

// Show article analysis results
function showArticleResult(data) {
    // Hide placeholder, show results
    document.getElementById('articlePlaceholder').classList.add('d-none');
    document.getElementById('articleAnalysisResult').classList.remove('d-none');
    
    // Update score
    document.getElementById('credibilityScore').textContent = data.credibility;
    
    // Update verdict
    const verdictElement = document.getElementById('verdictText');
    verdictElement.textContent = data.verdict;
    
    if (data.credibility >= 70) {
        verdictElement.className = 'badge bg-success';
    } else if (data.credibility >= 40) {
        verdictElement.className = 'badge bg-warning';
    } else {
        verdictElement.className = 'badge bg-danger';
    }
    
    // Update progress bars
    const progressBars = document.querySelectorAll('#articleResult .progress-bar');
    progressBars[0].style.width = `${data.sourceReliability}%`;
    progressBars[1].style.width = `${data.languageAnalysis}%`;
    progressBars[2].style.width = `${data.factChecking}%`;
    
    // Update score circle
    const scoreCircle = document.querySelector('#articleResult .score-circle');
    scoreCircle.style.background = `conic-gradient(var(--success) 0% ${data.credibility}%, var(--light) ${data.credibility}% 100%)`;
}

// Show media analysis results
function showMediaResult(data) {
    // Hide placeholder, show results
    document.getElementById('mediaPlaceholder').classList.add('d-none');
    document.getElementById('mediaAnalysisResult').classList.remove('d-none');
    
    // Switch to media tab
    const mediaTab = new bootstrap.Tab(document.getElementById('media-tab'));
    mediaTab.show();
    
    // Update score
    document.getElementById('authenticityScore').textContent = data.authenticity;
    
    // Update verdict
    const verdictElement = document.getElementById('mediaVerdict');
    verdictElement.textContent = data.verdict;
    
    if (data.authenticity >= 70) {
        verdictElement.className = 'badge bg-success';
    } else if (data.authenticity >= 40) {
        verdictElement.className = 'badge bg-warning';
    } else {
        verdictElement.className = 'badge bg-danger';
    }
    
    // Update progress bars
    const progressBars = document.querySelectorAll('#mediaResult .progress-bar');
    progressBars[0].style.width = `${data.visualArtifacts}%`;
    progressBars[1].style.width = `${data.metadataAnalysis}%`;
    progressBars[2].style.width = `${data.aiDetection}%`;
    
    // Color the progress bars based on values (higher = more suspicious for these metrics)
    progressBars[0].className = `progress-bar ${data.visualArtifacts > 50 ? 'bg-danger' : 'bg-warning'}`;
    progressBars[1].className = `progress-bar ${data.metadataAnalysis > 50 ? 'bg-danger' : 'bg-warning'}`;
    progressBars[2].className = `progress-bar ${data.aiDetection > 50 ? 'bg-danger' : 'bg-warning'}`;
    
    // Update score circle
    const scoreCircle = document.querySelector('#mediaResult .score-circle');
    scoreCircle.style.background = `conic-gradient(var(--success) 0% ${data.authenticity}%, var(--light) ${data.authenticity}% 100%)`;
}

// Show loading state
function showLoading(type) {
    if (type === 'article') {
        // You would implement a proper loading state here
        console.log('Analyzing article...');
    } else if (type === 'media') {
        console.log('Analyzing media...');
    }
}

// Utility function to validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}


// Export functions for global access (if needed)
window.analyzeArticle = analyzeArticle;
window.analyzeMedia = analyzeMedia;