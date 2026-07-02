// Main JavaScript file for Emotion Analysis System

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode / Theme Manager
    const toggleSwitch = document.querySelector('#theme-checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (toggleSwitch) {
        toggleSwitch.checked = currentTheme === 'dark';
    }

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', (e) => {
            const selectedTheme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('theme', selectedTheme);
            updateChartTheme(selectedTheme);
        });
    }

    // 2. AJAX Emotion Analysis
    const analysisForm = document.getElementById('analysis-form');
    if (analysisForm) {
        analysisForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const textInput = document.getElementById('user-text').value.trim();
            if (!textInput) return;

            const submitBtn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');
            const btnSpinner = document.getElementById('btn-spinner');
            const resultContainer = document.getElementById('result-container');

            // Show loading state
            submitBtn.disabled = true;
            btnText.textContent = "Analyzing...";
            btnSpinner.classList.remove('d-none');
            
            resultContainer.innerHTML = `
                <div class="d-flex justify-content-center p-5">
                    <div class="spinner-grow text-primary" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Analyzing...</span>
                    </div>
                </div>
            `;

            // Make AJAX Call
            fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'user_text': textInput,
                    'ajax': 'true'
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response error');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    renderResultCard(data);
                } else {
                    resultContainer.innerHTML = `
                        <div class="alert alert-danger glass-card animate-pop-in p-4 text-center mt-4 border-danger">
                            <i class="fas fa-exclamation-triangle fa-2x mb-3 text-danger"></i>
                            <h4>Analysis Failed</h4>
                            <p class="mb-0">Could not analyze the text. Please try again.</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error during AJAX analysis:', error);
                resultContainer.innerHTML = `
                    <div class="alert alert-danger glass-card animate-pop-in p-4 text-center mt-4 border-danger">
                        <i class="fas fa-exclamation-triangle fa-2x mb-3 text-danger"></i>
                        <h4>Connection Error</h4>
                        <p class="mb-0">Please ensure the backend server is running and database is connected.</p>
                    </div>
                `;
            })
            .finally(() => {
                submitBtn.disabled = false;
                btnText.textContent = "Analyze Emotion";
                btnSpinner.classList.add('d-none');
            });
        });
    }
});

function renderResultCard(data) {
    const resultContainer = document.getElementById('result-container');
    if (!resultContainer) return;

    let cardThemeClass = 'card-neutral';
    let textThemeClass = 'text-gradient-neutral';
    
    switch (data.emotion) {
        case 'Happy':
            cardThemeClass = 'card-happy';
            textThemeClass = 'text-gradient-happy';
            break;
        case 'Sad':
            cardThemeClass = 'card-sad';
            textThemeClass = 'text-gradient-sad';
            break;
        case 'Angry':
            cardThemeClass = 'card-angry';
            textThemeClass = 'text-gradient-angry';
            break;
        case 'Fear':
            cardThemeClass = 'card-fear';
            textThemeClass = 'text-gradient-fear';
            break;
    }

    let keywordsHtml = '';
    if (data.keywords && data.keywords.length > 0) {
        keywordsHtml = data.keywords.map(kw => 
            `<span class="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill me-2 mb-2 fs-7">${kw}</span>`
        ).join('');
    } else {
        keywordsHtml = '<span class="text-muted fst-italic">No emotion keywords found. Defaults to Neutral.</span>';
    }

    resultContainer.innerHTML = `
        <div class="card glass-card ${cardThemeClass} animate-pop-in p-4 text-center mt-4">
            <div class="card-body">
                <span class="emoji-lg animate-float mb-3">${data.emoji}</span>
                <h4 class="text-muted fw-normal mb-1">Analysis Outcome</h4>
                <h1 class="${textThemeClass} display-4 mb-4 fw-bold">${data.emotion}</h1>
                
                <div class="p-3 bg-white bg-opacity-10 rounded border border-white border-opacity-10 mb-4 text-start">
                    <strong class="d-block text-muted mb-1 small text-uppercase tracking-wider">Analyzed Text</strong>
                    <span class="fs-5">"${data.text}"</span>
                </div>
                
                <div class="text-start mb-4">
                    <strong class="d-block text-muted mb-2 small text-uppercase tracking-wider">Matching Keywords</strong>
                    <div class="d-flex flex-wrap">${keywordsHtml}</div>
                </div>
                
                <div class="d-flex justify-content-center gap-3 mt-2">
                    <button class="btn btn-outline-secondary px-4 rounded-pill btn-sm" onclick="clearAnalysis()">
                        <i class="fas fa-sync-alt me-2"></i>Analyze New
                    </button>
                    <a href="/history" class="btn btn-primary px-4 rounded-pill btn-sm shadow">
                        <i class="fas fa-history me-2"></i>View History
                    </a>
                </div>
            </div>
        </div>
    `;
}

function clearAnalysis() {
    const textInput = document.getElementById('user-text');
    const resultContainer = document.getElementById('result-container');
    if (textInput) textInput.value = '';
    if (resultContainer) resultContainer.innerHTML = '';
}

let dashboardChartInstance = null;

function updateChartTheme(theme) {
    if (!dashboardChartInstance) return;
    const isDark = theme === 'dark';
    const textColor = isDark ? '#a0a0a8' : '#2c3e50';

    if (dashboardChartInstance.options.plugins && dashboardChartInstance.options.plugins.legend) {
        dashboardChartInstance.options.plugins.legend.labels.color = textColor;
    }
    if (dashboardChartInstance.options.plugins && dashboardChartInstance.options.plugins.title) {
        dashboardChartInstance.options.plugins.title.color = textColor;
    }
    dashboardChartInstance.update();
}
