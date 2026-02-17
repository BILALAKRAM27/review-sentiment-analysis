// Main Application Logic
class ReviewAnalysisApp {
    constructor() {
        this.analyzer = new SentimentAnalyzer();
        this.currentResults = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
    }

    setupEventListeners() {
        // Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeReviews());

        // Load sample data button
        document.getElementById('loadSampleBtn').addEventListener('click', () => this.loadSampleData());

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => this.clearData());

        // Add review button
        document.getElementById('addReviewBtn').addEventListener('click', () => this.addReview());

        // Enter key in review input
        document.getElementById('reviewInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.addReview();
            }
        });
    }

    loadSampleData() {
        const textarea = document.getElementById('reviewsInput');
        textarea.value = sampleReviews.map(r => r.text).join('\n\n');
        this.showNotification('Sample data loaded! Click "Analyze Reviews" to see results.', 'success');
    }

    clearData() {
        document.getElementById('reviewsInput').value = '';
        document.getElementById('reviewInput').value = '';
        document.getElementById('results').classList.add('hidden');
        this.currentResults = null;
        this.showNotification('Data cleared', 'info');
    }

    addReview() {
        const input = document.getElementById('reviewInput');
        const textarea = document.getElementById('reviewsInput');
        const reviewText = input.value.trim();

        if (reviewText) {
            if (textarea.value) {
                textarea.value += '\n\n' + reviewText;
            } else {
                textarea.value = reviewText;
            }
            input.value = '';
            this.showNotification('Review added', 'success');
        }
    }

    analyzeReviews() {
        const textarea = document.getElementById('reviewsInput');
        const text = textarea.value.trim();

        if (!text) {
            this.showNotification('Please enter some reviews to analyze', 'error');
            return;
        }

        // Parse reviews (split by double newline or single newline)
        const reviewTexts = text.split(/\n\n+/).filter(t => t.trim().length > 0);

        if (reviewTexts.length === 0) {
            this.showNotification('No valid reviews found', 'error');
            return;
        }

        // Convert to review objects
        const reviews = reviewTexts.map((text, index) => ({
            id: index + 1,
            text: text.trim()
        }));

        // Analyze
        this.currentResults = this.analyzer.analyzeReviews(reviews);

        // Display results
        this.displayResults();

        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }

    displayResults() {
        const resultsSection = document.getElementById('results');
        resultsSection.classList.remove('hidden');

        const { overall, aspects, keyPhrases } = this.currentResults;

        // Update overall sentiment
        this.updateOverallSentiment(overall);

        // Update sentiment distribution
        this.updateSentimentDistribution(overall);

        // Update aspect analysis
        this.updateAspectAnalysis(aspects);

        // Update key insights
        this.updateKeyInsights(overall, aspects, keyPhrases);

        // Animate in
        setTimeout(() => {
            resultsSection.querySelectorAll('.fade-in').forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    updateOverallSentiment(overall) {
        const { percentages } = overall;
        const dominant = percentages.positive > percentages.negative ? 'positive' :
            percentages.negative > percentages.positive ? 'negative' : 'neutral';

        document.getElementById('overallSentiment').textContent = dominant.toUpperCase();
        document.getElementById('overallSentiment').className = `sentiment-badge ${dominant}`;
        document.getElementById('totalReviews').textContent = overall.total;
    }

    updateSentimentDistribution(overall) {
        const { percentages } = overall;

        document.getElementById('positivePercent').textContent = `${percentages.positive}%`;
        document.getElementById('neutralPercent').textContent = `${percentages.neutral}%`;
        document.getElementById('negativePercent').textContent = `${percentages.negative}%`;

        // Update bars
        document.getElementById('positiveBar').style.width = `${percentages.positive}%`;
        document.getElementById('neutralBar').style.width = `${percentages.neutral}%`;
        document.getElementById('negativeBar').style.width = `${percentages.negative}%`;
    }

    updateAspectAnalysis(aspects) {
        const container = document.getElementById('aspectsContainer');
        container.innerHTML = '';

        const aspectLabels = {
            'product_quality': 'Product Quality',
            'delivery': 'Delivery',
            'customer_service': 'Customer Service',
            'price': 'Price',
            'usability': 'Usability'
        };

        for (const [aspect, stats] of Object.entries(aspects)) {
            const aspectCard = document.createElement('div');
            aspectCard.className = 'aspect-card fade-in';

            const dominant = stats.positive > stats.negative ? 'positive' :
                stats.negative > stats.positive ? 'negative' : 'neutral';

            aspectCard.innerHTML = `
                <div class="aspect-header">
                    <h4>${aspectLabels[aspect] || aspect}</h4>
                    <span class="sentiment-badge ${dominant}">${dominant}</span>
                </div>
                <div class="aspect-stats">
                    <div class="stat-item">
                        <span class="stat-label">Positive</span>
                        <span class="stat-value positive">${stats.positive}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Neutral</span>
                        <span class="stat-value neutral">${stats.neutral}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Negative</span>
                        <span class="stat-value negative">${stats.negative}%</span>
                    </div>
                </div>
                <div class="aspect-bar">
                    <div class="bar-segment positive" style="width: ${stats.positive}%"></div>
                    <div class="bar-segment neutral" style="width: ${stats.neutral}%"></div>
                    <div class="bar-segment negative" style="width: ${stats.negative}%"></div>
                </div>
            `;

            container.appendChild(aspectCard);
        }

        if (Object.keys(aspects).length === 0) {
            container.innerHTML = '<p class="no-data">No specific aspects detected in the reviews.</p>';
        }
    }

    updateKeyInsights(overall, aspects, keyPhrases) {
        const container = document.getElementById('insightsContainer');
        container.innerHTML = '';

        const insights = [];

        // Overall sentiment insight
        const { percentages } = overall;
        if (percentages.positive > 50) {
            insights.push({
                type: 'positive',
                icon: '✅',
                text: `${percentages.positive}% of customers had a positive experience`
            });
        } else if (percentages.negative > 50) {
            insights.push({
                type: 'negative',
                icon: '⚠️',
                text: `${percentages.negative}% of customers had a negative experience`
            });
        }

        // Aspect insights
        for (const [aspect, stats] of Object.entries(aspects)) {
            const aspectLabels = {
                'product_quality': 'product quality',
                'delivery': 'delivery',
                'customer_service': 'customer service',
                'price': 'pricing',
                'usability': 'ease of use'
            };

            if (stats.positive > 60) {
                insights.push({
                    type: 'positive',
                    icon: '👍',
                    text: `${stats.positive}% of users liked ${aspectLabels[aspect] || aspect}`
                });
            } else if (stats.negative > 40) {
                insights.push({
                    type: 'negative',
                    icon: '👎',
                    text: `${stats.negative}% of users complained about ${aspectLabels[aspect] || aspect}`
                });
            }
        }

        // Top complaints
        if (keyPhrases.complaints.length > 0) {
            const topComplaint = keyPhrases.complaints[0];
            insights.push({
                type: 'warning',
                icon: '🔴',
                text: `Common complaint: "${topComplaint.phrase.substring(0, 60)}${topComplaint.phrase.length > 60 ? '...' : ''}"`
            });
        }

        // Top praises
        if (keyPhrases.praises.length > 0) {
            const topPraise = keyPhrases.praises[0];
            insights.push({
                type: 'success',
                icon: '🟢',
                text: `Common praise: "${topPraise.phrase.substring(0, 60)}${topPraise.phrase.length > 60 ? '...' : ''}"`
            });
        }

        // Render insights
        insights.forEach(insight => {
            const insightCard = document.createElement('div');
            insightCard.className = `insight-card ${insight.type} fade-in`;
            insightCard.innerHTML = `
                <span class="insight-icon">${insight.icon}</span>
                <p class="insight-text">${insight.text}</p>
            `;
            container.appendChild(insightCard);
        });

        // Update detailed lists
        this.updateDetailedPhrases('complaintsList', keyPhrases.complaints);
        this.updateDetailedPhrases('praisesList', keyPhrases.praises);
    }

    updateDetailedPhrases(elementId, phrases) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        if (phrases.length === 0) {
            container.innerHTML = '<li class="no-data">None detected</li>';
            return;
        }

        phrases.forEach(({ phrase, count }) => {
            const li = document.createElement('li');
            li.className = 'phrase-item fade-in';
            li.innerHTML = `
                <span class="phrase-text">"${phrase}"</span>
                <span class="phrase-count">${count} mention${count > 1 ? 's' : ''}</span>
            `;
            container.appendChild(li);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReviewAnalysisApp();
});
