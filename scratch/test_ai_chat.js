
const fs = require('fs');
const tourContent = fs.readFileSync('tour-data.js', 'utf8');
const window = {};
eval(tourContent);

const tourData = window.TOUR_DATA;

function getTourLink(id) { return 'tour-details.html?tour=' + id; }

function generateAIResponse(message) {
  const normalized = message.toLowerCase().trim();
  
  if (normalized.match(/^(hello|hi|hey|assalam|salam|helo|greetings|good morning|good evening|aoa)/i)) {
    return { text: 'Assalam-o-Alaikum! 🏔️ Welcome to Safar Silsila Travel & Tours...' };
  }

  if (normalized.includes('book') || normalized.includes('payment') || normalized.includes('pay') || normalized.includes('deposit')) {
    return { text: 'Booking a tour with Safar Silsila is simple and 100% secure: 50% advance deposit...' };
  }

  const stopWords = ['the', 'a', 'an', 'in', 'on', 'at', 'for', 'of', 'to', 'is', 'are', 'was', 'were', 'tours', 'tour', 'trip', 'trips', 'package', 'packages', 'group', 'groups', 'show', 'tell', 'me', 'about', 'what', 'your', 'any', 'some', 'list', 'please', 'details', 'give'];
  const queryTokens = normalized.split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stopWords.includes(w));

  let matchedTours = [];

  for (const key in tourData) {
    const tour = tourData[key];
    const searchTarget = (tour.id + ' ' + tour.title + ' ' + tour.location + ' ' + tour.duration + ' ' + (tour.highlights || []).join(' ')).toLowerCase();
    
    let matchScore = 0;
    queryTokens.forEach(token => {
      if (searchTarget.includes(token)) {
        matchScore += 2;
        if (tour.title.toLowerCase().includes(token) || tour.location.toLowerCase().includes(token)) {
          matchScore += 3;
        }
      }
    });

    if (matchScore > 0) {
      matchedTours.push({ tour, score: matchScore });
    }
  }

  matchedTours.sort((a, b) => b.score - a.score);

  const isPriceQuery = normalized.includes('price') || normalized.includes('cost') || normalized.includes('how much') || normalized.includes('fee');
  const isItineraryQuery = normalized.includes('itinerary') || normalized.includes('schedule') || normalized.includes('route');
  
  const topMatch = matchedTours.length > 0 ? matchedTours[0].tour : null;

  if (topMatch && (isPriceQuery || isItineraryQuery || matchedTours.length === 1)) {
    if (isPriceQuery) {
      return { text: 'The pricing details for ' + topMatch.title + ' are PKR ' + topMatch.price + ' per person.' };
    }
    if (isItineraryQuery) {
      return { text: 'Here is the day-by-day itinerary for ' + topMatch.title + ' (' + topMatch.duration + ').' };
    }
  }

  if (matchedTours.length > 0) {
    const topResults = matchedTours.slice(0, 5);
    let text = 'Here are the top matching tour packages found for your search:\n\n';
    topResults.forEach(({ tour }, index) => {
      text += (index + 1) + '. ' + tour.title + ' | Duration: ' + tour.duration + ' | Price: PKR ' + tour.price + '\n';
    });
    return { text };
  }

  return { text: 'Comprehensive fallback response...' };
}

const testCases = [
  'Hunza group tours',
  'Swat packages',
  'What is the price of Swat tour?',
  'Show me Skardu itinerary',
  'Kashmir packages',
  'Do you have 3 day tours?',
  'How to book a tour?',
  'Foreigner group trips'
];

testCases.forEach(q => {
  console.log('=== USER ASKED: ' + JSON.stringify(q) + ' ===');
  console.log(generateAIResponse(q).text);
  console.log();
});
