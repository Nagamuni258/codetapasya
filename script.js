// Initialize particles background
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        }
    });
});

// Switch between tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Activate clicked button
    event.currentTarget.classList.add('active');
    
    // Clear results
    document.getElementById('results-container').style.display = 'none';
}

// Preview image before upload
function previewImage() {
    const file = document.getElementById('image-input').files[0];
    const preview = document.getElementById('image-preview');
    const analyzeBtn = document.getElementById('analyze-image-btn');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Image preview">`;
            analyzeBtn.disabled = false;
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
        analyzeBtn.disabled = true;
    }
}

// Preview video before upload
function previewVideo() {
    const file = document.getElementById('video-input').files[0];
    const preview = document.getElementById('video-preview');
    const analyzeBtn = document.getElementById('analyze-video-btn');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<video src="${e.target.result}" controls></video>`;
            analyzeBtn.disabled = false;
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
        analyzeBtn.disabled = true;
    }
}

// Simulate text analysis
function analyzeText() {
    const text = document.getElementById('text-input').value;
    if (!text.trim()) {
        alert('Please enter some text to analyze');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
    
    // Simulate API call delay
    setTimeout(() => {
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        
        // Generate random results for demo
        const isFake = Math.random() > 0.5;
        const score = isFake ? Math.random() * 0.5 : 0.5 + Math.random() * 0.5;
        
        // Display results
        showResults('text', {
            text: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
            is_likely_fake: isFake,
            credibility_score: score,
            fake_news_classification: [{label: isFake ? 'FAKE' : 'AUTHENTIC', score: score}],
            sentiment: [{label: isFake ? 'NEGATIVE' : 'NEUTRAL', score: 0.89}],
            fact_check: [{
                source: "FactCheck API",
                results: [
                    {title: "Related Fact-Check Article", url: "#"},
                    {title: "Similar News Verification", url: "#"}
                ]
            }]
        });
        
        // Add to history
        addToHistory(text.substring(0, 50) + (text.length > 50 ? '...' : ''), score);
    }, 2000);
}

// Simulate image analysis
function analyzeImage() {
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
    
    // Simulate API call delay
    setTimeout(() => {
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        
        // Generate random results for demo
        const isFake = Math.random() > 0.6;
        const score = isFake ? 0.6 + Math.random() * 0.3 : Math.random() * 0.4;
        
        // Display results
        showResults('image', {
            filename: document.getElementById('image-input').files[0].name,
            is_likely_fake: isFake,
            deepfake_analysis: {
                score: score,
                indicators: isFake ? 
                    ["Inconsistent lighting", "Digital manipulation artifacts", "Face warping detected"] : 
                    ["Consistent lighting", "Natural skin texture", "No manipulation detected"],
                analysis: isFake ? 
                    "This image shows signs of digital manipulation" : 
                    "This image appears to be authentic with no signs of manipulation"
            }
        });
        
        // Add to history
        addToHistory(document.getElementById('image-input').files[0].name, score);
    }, 2500);
}

// Analyze video with backend API
function analyzeVideo() {
    const fileInput = document.getElementById('video-input');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a video file to analyze');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
    
    // Create form data
    const formData = new FormData();
    formData.append('video', file);
    
    // Send to backend
    fetch('http://localhost:5000/analyze-video', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        
        // Display results
        showResults('video', data);
        
        // Add to history
        addToHistory(file.name, data.deepfake_analysis.score);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        alert('Error analyzing video. Please try again.');
    });
}

// Display results
function showResults(type, data) {
    const resultsContainer = document.getElementById('results-container');
    
    if (type === 'text') {
        resultsContainer.innerHTML = `
            <h2>Analysis Results</h2>
            <div class="credibility-score">
                <h3>Credibility Score: ${(data.credibility_score * 100).toFixed(1)}%</h3>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${data.credibility_score * 100}%"></div>
                </div>
                <p class="${data.is_likely_fake ? 'fake-warning' : 'authentic-message'}">
                    ${data.is_likely_fake ? '⚠️ Likely Fake Content' : '✅ Likely Authentic Content'}
                </p>
            </div>
            <div class="detailed-results">
                <h4>Detailed Analysis:</h4>
                <p>Fake News Classification: ${data.fake_news_classification[0].label} (${(data.fake_news_classification[0].score * 100).toFixed(1)}% confidence)</p>
                <p>Sentiment: ${data.sentiment[0].label} (${(data.sentiment[0].score * 100).toFixed(1)}% confidence)</p>
                <div class="fact-check-results">
                    <h4>Fact Check Results:</h4>
                    <div class="fact-check-item">
                        <p>Source: ${data.fact_check[0].source}</p>
                        ${data.fact_check[0].results.map(result => `
                            <div class="related-article">
                                <a href="${result.url}" target="_blank">${result.title}</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = `
            <h2>Analysis Results</h2>
            <div class="credibility-score">
                <h3>Manipulation Score: ${(data.deepfake_analysis.score * 100).toFixed(1)}%</h3>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${data.deepfake_analysis.score * 100}%"></div>
                </div>
                <p class="${data.is_likely_fake ? 'fake-warning' : 'authentic-message'}">
                    ${data.is_likely_fake ? '⚠️ Likely Manipulated Media' : '✅ Likely Authentic Media'}
                </p>
            </div>
            <div class="detailed-results">
                <h4>Analysis:</h4>
                <p>${data.deepfake_analysis.analysis}</p>
                <div class="indicators-list">
                    <h4>Key Indicators:</h4>
                    <ul>
                        ${data.deepfake_analysis.indicators.map(indicator => `<li>${indicator}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Animate the score bar
    setTimeout(() => {
        document.querySelector('.score-fill').style.width = `${(type === 'text' ? data.credibility_score : data.deepfake_analysis.score) * 100}%`;
    }, 100);
    
    // Show results container
    resultsContainer.style.display = 'block';
}

// Add analysis to history
function addToHistory(text, score) {
    const historyItems = document.getElementById('history-items');
    const isFake = score < 0.5;
    
    historyItems.innerHTML = `
        <div class="history-item">
            <p>${text}</p>
            <span class="credibility-badge ${isFake ? 'fake' : 'authentic'}">${(score * 100).toFixed(0)}% ${isFake ? 'Fake' : 'Authentic'}</span>
        </div>
    ` + historyItems.innerHTML;
}