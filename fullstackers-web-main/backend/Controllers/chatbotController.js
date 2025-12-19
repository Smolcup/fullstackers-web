const Trip = require('../Models/Trip');

// Simple trip-focused chatbot responses
exports.handleChatMessage = async (req, res) => {
  try {
    const { message, tripData } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        msg: 'Message is required'
      });
    }

    const userMessage = message.toLowerCase().trim();
    let response = "";

    // Check if message is trip-related
    const tripKeywords = [
      'trip', 'travel', 'destination', 'price', 'cost', 'date', 'when',
      'where', 'location', 'tour', 'journey', 'adventure', 'explore',
      'sahara', 'desert', 'island', 'beach', 'mountain', 'culture',
      'featured', 'special', 'discount', 'booking', 'reserve',
      'duration', 'days', 'nights', 'group', 'size', 'difficulty',
      'easy', 'medium', 'hard', 'included', 'excluded', 'itinerary'
    ];

    const isTripRelated = tripKeywords.some(keyword => 
      userMessage.includes(keyword)
    );

    if (!isTripRelated) {
      response = "I can only help with trip-related questions! Please ask me about:\n\n" +
                "🗺️ Our destinations and trips\n" +
                "💰 Pricing and costs\n" +
                "📅 Available dates\n" +
                "🌟 Featured trips\n" +
                "🎒 What's included/excluded\n" +
                "⛰️ Trip difficulty levels\n\n" +
                "Try asking: 'What trips do you have?' or 'Show me featured trips'";
    } else {
      // Trip-related responses
      response = await generateTripResponse(userMessage, tripData);
    }

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      msg: 'Error processing chat message',
      error: error.message
    });
  }
};

async function generateTripResponse(message, tripData) {
  let response = "";

  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    response = "Hello! 👋 I'm your Tunisia Travel Assistant. I can help you explore our amazing trips! What would you like to know?";
  }

  // Trip count/availability
  else if (message.includes('trip') && (message.includes('have') || message.includes('available') || message.includes('show'))) {
    if (tripData.length === 0) {
      response = "I don't see any trips available right now. Please check back later!";
    } else {
      const tripCount = tripData.length;
      const destinations = [...new Set(tripData.map(t => t.destination))].join(', ');
      response = `We currently have ${tripCount} amazing trips available to destinations like: ${destinations}.\n\nWould you like me to show you specific types of trips or featured ones?`;
    }
  }

  // Featured trips
  else if (message.includes('featured') || message.includes('special')) {
    const featuredTrips = tripData.filter(t => t.featured);
    if (featuredTrips.length === 0) {
      response = "We don't have any featured trips at the moment, but all our trips are amazing! 🌟";
    } else {
      const featuredList = featuredTrips.slice(0, 3).map(t => 
        `• ${t.title} - ${t.destination} (${t.price} TND)`
      ).join('\n');
      response = `Here are our featured trips:\n\n${featuredList}\n\nWould you like more details about any of these?`;
    }
  }

  // Pricing/Cheapest
  else if (message.includes('price') || message.includes('cost') || message.includes('cheapest') || message.includes('cheap')) {
    const sortedByPrice = [...tripData].sort((a, b) => a.price - b.price);
    const cheapest = sortedByPrice[0];
    const mostExpensive = sortedByPrice[sortedByPrice.length - 1];
    
    response = `Our trips range from ${cheapest.price} TND to ${mostExpensive.price} TND.\n\n💰 Cheapest trip: ${cheapest.title} (${cheapest.price} TND)\n💎 Most expensive: ${mostExpensive.title} (${mostExpensive.price} TND)\n\nWhat price range are you looking for?`;
  }

  // Dates/When
  else if (message.includes('date') || message.includes('when') || message.includes('time')) {
    const upcomingTrips = tripData.filter(t => {
      const dates = t.startDates?.map(d => new Date(d)) || [];
      const futureDates = dates.filter(d => d > new Date());
      return futureDates.length > 0;
    });
    
    if (upcomingTrips.length === 0) {
      response = "I don't see any upcoming trip dates right now. Please contact us for scheduling information!";
    } else {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthTrips = upcomingTrips.filter(t => {
        const dates = t.startDates?.map(d => new Date(d)) || [];
        return dates.some(d => d <= nextMonth);
      });
      
      response = nextMonthTrips.length > 0 
        ? `We have ${nextMonthTrips.length} trips available in the next month!\n\nWould you like to see specific dates?`
        : "We have trips available! Would you like to see the specific dates?";
    }
  }

  // Sahara/Desert trips
  else if (message.includes('sahara') || message.includes('desert')) {
    const desertTrips = tripData.filter(t => 
      t.destination.toLowerCase().includes('sahara') || 
      t.destination.toLowerCase().includes('desert') ||
      t.description.toLowerCase().includes('sahara') ||
      t.description.toLowerCase().includes('desert')
    );
    
    if (desertTrips.length === 0) {
      response = "I don't see any Sahara desert trips currently available, but we have other amazing destinations!";
    } else {
      const desertList = desertTrips.slice(0, 3).map(t => 
        `• ${t.title} - ${t.destination} (${t.duration} days, ${t.price} TND)`
      ).join('\n');
      response = `Here are our Sahara desert trips:\n\n${desertList}\n\nThe Sahara offers incredible dune landscapes and authentic desert experiences!`;
    }
  }

  // Duration/Days
  else if (message.includes('day') || message.includes('duration') || message.includes('long')) {
    const durations = [...new Set(tripData.map(t => t.duration))].sort((a, b) => a - b);
    const shortTrips = tripData.filter(t => t.duration <= 3);
    const longTrips = tripData.filter(t => t.duration >= 7);
    
    response = `We offer trips from ${Math.min(...durations)} to ${Math.max(...durations)} days.\n\n` +
              `⚡ Short trips (1-3 days): ${shortTrips.length} available\n` +
              `🗓️ Long trips (7+ days): ${longTrips.length} available\n\n` +
              `What duration are you interested in?`;
  }

  // Difficulty levels
  else if (message.includes('difficult') || message.includes('easy') || message.includes('hard')) {
    const easyTrips = tripData.filter(t => t.difficulty === 'easy');
    const mediumTrips = tripData.filter(t => t.difficulty === 'medium');
    const hardTrips = tripData.filter(t => t.difficulty === 'hard');
    
    response = `We have trips for all fitness levels:\n\n` +
              `🟢 Easy (${easyTrips.length}): Suitable for everyone, minimal physical activity\n` +
              `🟡 Medium (${mediumTrips.length}): Moderate fitness required\n` +
              `🔴 Hard (${hardTrips.length}): Good fitness level required\n\n` +
              `Which level suits you best?`;
  }

  // What's included
  else if (message.includes('include') || message.includes('what') || message.includes('cover')) {
    const sampleTrip = tripData[0];
    if (sampleTrip && sampleTrip.included?.length > 0) {
      const includedItems = sampleTrip.included.slice(0, 5).join(', ');
      response = `Our trips typically include: ${includedItems} and more!\n\nEach trip is different, so check the specific details for what you're interested in.`;
    } else {
      response = "Each trip includes different things! Generally, our trips include accommodation, some meals, and guided tours. Check the specific trip details for exact inclusions.";
    }
  }

  // Specific trip requests
  else if (message.includes('tell me about') || message.includes('more about') || message.includes('details')) {
    // Extract potential trip title or destination
    const searchTerm = message.replace(/tell me about|more about|details/g, '').trim();
    const relevantTrips = tripData.filter(t => 
      t.title.toLowerCase().includes(searchTerm) || 
      t.destination.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm)
    );
    
    if (relevantTrips.length > 0) {
      const trip = relevantTrips[0];
      response = `Here's information about "${trip.title}":\n\n` +
                `📍 Destination: ${trip.destination}\n` +
                `⏱️ Duration: ${trip.duration} days\n` +
                `💰 Price: ${trip.price} TND\n` +
                `👥 Max group: ${trip.maxGroupSize} people\n` +
                `⭐ Difficulty: ${trip.difficulty}\n\n` +
                `${trip.description.substring(0, 200)}...\n\n` +
                `Would you like to book this trip or see more details?`;
    } else {
      response = "I couldn't find specific information about that. Could you tell me more about what you're looking for? You can ask about destinations, prices, or trip types!";
    }
  }

  // Booking/Reservation
  else if (message.includes('book') || message.includes('reserve') || message.includes('sign up')) {
    response = "I'd love to help you book a trip! 🎉\n\n" +
              "To make a reservation, you can:\n" +
              "1. Browse our trips and click 'Book Now' on any trip card\n" +
              "2. Go to our Destinations page to see all available trips\n" +
              "3. Contact us directly for personalized assistance\n\n" +
              "Which trip interests you most?";
  }

  // Default helpful response
  else {
    const sampleDestinations = [...new Set(tripData.map(t => t.destination))].slice(0, 3).join(', ');
    response = "I can help you with trip-related questions! Try asking about:\n\n" +
              `🌍 Destinations like: ${sampleDestinations}\n` +
              "💰 Prices and costs\n" +
              "📅 Available dates\n" +
              "⭐ Featured trips\n" +
              "⛰️ Difficulty levels\n" +
              "🎒 What's included\n\n" +
              "Or ask me to show you all available trips!";
  }

  return response;
}