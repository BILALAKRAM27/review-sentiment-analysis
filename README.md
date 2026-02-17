# Review Sentiment Analysis ⭐

An AI-powered web application that analyzes customer and vendor reviews using NLP sentiment classification and aspect-based analysis to extract actionable insights.

## Features

- **NLP Sentiment Classification** - Automatically classifies reviews as Positive, Neutral, or Negative
- **Aspect-Based Analysis** - Analyzes sentiment for specific aspects (quality, delivery, service, price, usability)
- **Key Insights** - Generates insights like "80% of users liked product quality"
- **Top Complaints & Praises** - Automatically extracts frequently mentioned feedback
- **Premium UI** - Modern dark mode with glassmorphism and smooth animations
- **Real-time Analysis** - Instant client-side processing

## Quick Start

1. Open `index.html` in your web browser
2. Click "Load Sample Data" to see example reviews
3. Click "Analyze Reviews" to see the sentiment analysis
4. Or paste your own reviews (separate each with a blank line)

## How It Works

### Sentiment Analysis Engine
- Uses lexicon-based NLP with positive/negative word dictionaries
- Handles negations ("not good" → negative)
- Supports intensifiers ("very good" → stronger positive)
- Calculates sentiment scores and classifies reviews

### Aspect Detection
Automatically identifies and analyzes sentiment for:
- **Product Quality** - material, build, durability
- **Delivery** - shipping speed, packaging
- **Customer Service** - support, helpfulness
- **Price** - value for money
- **Usability** - ease of use

### Key Phrase Extraction
- Identifies common complaint patterns
- Extracts frequently mentioned praises
- Shows mention counts for each phrase

## Technology Stack

- **HTML5** - Semantic structure with SEO optimization
- **CSS3** - Modern design with glassmorphism and animations
- **Vanilla JavaScript** - No dependencies, pure client-side processing
- **Google Fonts** - Inter font family

## Project Structure

```
review-sentiment-analysis/
├── index.html              # Main application
├── styles.css              # Premium styling
├── app.js                  # Application logic
├── sentiment-analyzer.js   # NLP sentiment engine
├── sample-data.js         # Sample reviews
└── README.md              # This file
```

## Usage Examples

### Quick Add Review
Type a review in the input field and press Enter or click "Add"

### Bulk Analysis
Paste multiple reviews in the textarea, separating each review with a blank line:

```
Great product! Love the quality.

Terrible delivery experience. Very late.

Good value for money but packaging could be better.
```

Then click "Analyze Reviews" to see results.

## Results Display

The analysis shows:

1. **Overall Sentiment** - Dominant sentiment (Positive/Neutral/Negative)
2. **Sentiment Distribution** - Percentage breakdown with visual bars
3. **Key Insights** - Actionable findings with icons
4. **Aspect Analysis** - Detailed sentiment per aspect
5. **Top Complaints** - Most common negative feedback
6. **Top Praises** - Most common positive feedback

## Design Features

- Dark mode with animated gradient background
- Glassmorphic cards with backdrop blur
- Smooth fade-in animations
- Interactive hover effects
- Color-coded sentiment indicators (green/orange/red)
- Fully responsive layout

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Future Enhancements

- Export results as PDF/CSV
- Multi-product comparison
- Sentiment trend analysis
- Integration with review platforms
- Machine learning models
- Multi-language support

## License

Free to use and modify.

---

**Built with ❤️ using Advanced NLP Sentiment Analysis**
