// Sentiment Analysis Engine
class SentimentAnalyzer {
    constructor() {
        // Positive words lexicon
        this.positiveWords = new Set([
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'perfect',
            'love', 'loved', 'loving', 'best', 'beautiful', 'brilliant', 'outstanding', 'superb',
            'exceptional', 'impressive', 'quality', 'recommend', 'recommended', 'happy', 'satisfied',
            'delighted', 'pleased', 'nice', 'fine', 'solid', 'reliable', 'sturdy', 'durable',
            'fast', 'quick', 'efficient', 'helpful', 'friendly', 'professional', 'polite', 'kind',
            'comfortable', 'smooth', 'easy', 'simple', 'convenient', 'affordable', 'worth',
            'value', 'fresh', 'clean', 'neat', 'pretty', 'gorgeous', 'stunning', 'elegant'
        ]);

        // Negative words lexicon
        this.negativeWords = new Set([
            'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'disappointing', 'disappointed',
            'hate', 'hated', 'dislike', 'ugly', 'broken', 'defective', 'damaged', 'faulty',
            'useless', 'worthless', 'waste', 'overpriced', 'expensive', 'cheap', 'flimsy', 'fragile',
            'slow', 'delayed', 'late', 'never', 'rude', 'unprofessional', 'unhelpful', 'difficult',
            'hard', 'complicated', 'confusing', 'uncomfortable', 'rough', 'dirty', 'messy',
            'wrong', 'incorrect', 'missing', 'incomplete', 'fake', 'counterfeit', 'scam', 'fraud'
        ]);

        // Aspect keywords
        this.aspects = {
            'product_quality': ['quality', 'product', 'material', 'build', 'construction', 'durable', 'sturdy', 'flimsy', 'cheap', 'premium'],
            'delivery': ['delivery', 'shipping', 'delivered', 'shipped', 'arrived', 'package', 'packaging', 'box', 'late', 'delayed', 'fast', 'quick'],
            'customer_service': ['service', 'support', 'staff', 'representative', 'help', 'helpful', 'response', 'customer', 'friendly', 'rude'],
            'price': ['price', 'cost', 'expensive', 'cheap', 'affordable', 'value', 'worth', 'overpriced', 'money'],
            'usability': ['easy', 'simple', 'difficult', 'hard', 'complicated', 'use', 'setup', 'install', 'intuitive', 'confusing']
        };

        // Intensifiers
        this.intensifiers = new Set(['very', 'extremely', 'really', 'absolutely', 'totally', 'completely', 'highly', 'super']);
        
        // Negations
        this.negations = new Set(['not', 'no', 'never', 'neither', 'nobody', 'nothing', 'nowhere', 'hardly', 'barely', 'scarcely']);
    }

    // Tokenize and clean text
    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    // Analyze sentiment of a single review
    analyzeSentiment(text) {
        const tokens = this.tokenize(text);
        let positiveScore = 0;
        let negativeScore = 0;
        let isNegated = false;

        for (let i = 0; i < tokens.length; i++) {
            const word = tokens[i];
            const prevWord = i > 0 ? tokens[i - 1] : null;

            // Check for negation
            if (this.negations.has(word)) {
                isNegated = true;
                continue;
            }

            // Check for intensifier
            const isIntensified = prevWord && this.intensifiers.has(prevWord);
            const multiplier = isIntensified ? 1.5 : 1;

            // Score positive/negative words
            if (this.positiveWords.has(word)) {
                if (isNegated) {
                    negativeScore += multiplier;
                } else {
                    positiveScore += multiplier;
                }
                isNegated = false;
            } else if (this.negativeWords.has(word)) {
                if (isNegated) {
                    positiveScore += multiplier;
                } else {
                    negativeScore += multiplier;
                }
                isNegated = false;
            }
        }

        const totalScore = positiveScore + negativeScore;
        const sentimentScore = totalScore > 0 ? (positiveScore - negativeScore) / totalScore : 0;

        let sentiment;
        if (sentimentScore > 0.2) sentiment = 'positive';
        else if (sentimentScore < -0.2) sentiment = 'negative';
        else sentiment = 'neutral';

        return {
            sentiment,
            score: sentimentScore,
            positiveScore,
            negativeScore
        };
    }

    // Extract aspects and their sentiments
    extractAspects(text) {
        const tokens = this.tokenize(text);
        const aspectSentiments = {};

        for (const [aspect, keywords] of Object.entries(this.aspects)) {
            // Check if aspect is mentioned
            const mentioned = keywords.some(keyword => tokens.includes(keyword));
            
            if (mentioned) {
                // Get context around aspect keywords (5 words before and after)
                let contextWords = [];
                keywords.forEach(keyword => {
                    const index = tokens.indexOf(keyword);
                    if (index !== -1) {
                        const start = Math.max(0, index - 5);
                        const end = Math.min(tokens.length, index + 6);
                        contextWords = contextWords.concat(tokens.slice(start, end));
                    }
                });

                // Analyze sentiment of context
                const contextText = contextWords.join(' ');
                const sentiment = this.analyzeSentiment(contextText);
                
                aspectSentiments[aspect] = sentiment;
            }
        }

        return aspectSentiments;
    }

    // Extract key phrases (complaints and praises)
    extractKeyPhrases(reviews) {
        const complaints = {};
        const praises = {};

        reviews.forEach(review => {
            const sentiment = this.analyzeSentiment(review.text);
            const sentences = review.text.split(/[.!?]+/).filter(s => s.trim().length > 0);

            sentences.forEach(sentence => {
                const sentenceSentiment = this.analyzeSentiment(sentence);
                const trimmed = sentence.trim();

                if (sentenceSentiment.sentiment === 'negative' && trimmed.length > 10) {
                    complaints[trimmed] = (complaints[trimmed] || 0) + 1;
                } else if (sentenceSentiment.sentiment === 'positive' && trimmed.length > 10) {
                    praises[trimmed] = (praises[trimmed] || 0) + 1;
                }
            });
        });

        // Sort by frequency and get top 5
        const topComplaints = Object.entries(complaints)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([phrase, count]) => ({ phrase, count }));

        const topPraises = Object.entries(praises)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([phrase, count]) => ({ phrase, count }));

        return { complaints: topComplaints, praises: topPraises };
    }

    // Analyze multiple reviews
    analyzeReviews(reviews) {
        const results = reviews.map(review => ({
            id: review.id,
            text: review.text,
            sentiment: this.analyzeSentiment(review.text),
            aspects: this.extractAspects(review.text)
        }));

        // Calculate overall statistics
        const sentimentCounts = {
            positive: 0,
            neutral: 0,
            negative: 0
        };

        const aspectStats = {};

        results.forEach(result => {
            sentimentCounts[result.sentiment.sentiment]++;

            // Aggregate aspect sentiments
            for (const [aspect, sentiment] of Object.entries(result.aspects)) {
                if (!aspectStats[aspect]) {
                    aspectStats[aspect] = { positive: 0, neutral: 0, negative: 0, total: 0 };
                }
                aspectStats[aspect][sentiment.sentiment]++;
                aspectStats[aspect].total++;
            }
        });

        const total = results.length;
        const percentages = {
            positive: Math.round((sentimentCounts.positive / total) * 100),
            neutral: Math.round((sentimentCounts.neutral / total) * 100),
            negative: Math.round((sentimentCounts.negative / total) * 100)
        };

        // Calculate aspect percentages
        const aspectPercentages = {};
        for (const [aspect, stats] of Object.entries(aspectStats)) {
            aspectPercentages[aspect] = {
                positive: Math.round((stats.positive / stats.total) * 100),
                neutral: Math.round((stats.neutral / stats.total) * 100),
                negative: Math.round((stats.negative / stats.total) * 100),
                total: stats.total
            };
        }

        // Extract key phrases
        const keyPhrases = this.extractKeyPhrases(reviews);

        return {
            reviews: results,
            overall: {
                total,
                sentimentCounts,
                percentages
            },
            aspects: aspectPercentages,
            keyPhrases
        };
    }
}
