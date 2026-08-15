import { searchProducts } from './mockData';

const getGreeting = () => {
  return "Hello! I'm your AI Shopping Assistant. I can help you find products, compare options, or answer questions about ingredients. How can I help you today?";
};

const MOCK_INTENTS = [
  {
    keywords: ['dry skin', 'moisturizer', 'hydrate'],
    response: "For dry skin, I recommend looking for products with Hyaluronic Acid or Ceramides. Here are a few options:",
    getSuggestions: () => searchProducts('moisturizer').slice(0, 2).map(p => ({ label: p.name, url: `/product/${p.id}` }))
  },
  {
    keywords: ['acne', 'breakout', 'pimples'],
    response: "If you're dealing with acne, ingredients like Salicylic Acid and Tea Tree Oil are very effective. You might want to try these:",
    getSuggestions: () => searchProducts('acne').slice(0, 2).map(p => ({ label: p.name, url: `/product/${p.id}` }))
  },
  {
    keywords: ['compare', 'difference', 'better'],
    response: "I can help you compare products! You can add up to 4 items to your comparison list to see their ingredients side-by-side.",
    getSuggestions: () => [{ label: 'Go to Comparison', url: '/compare' }]
  },
  {
    keywords: ['hi', 'hello', 'hey'],
    response: getGreeting(),
    getSuggestions: () => []
  }
];

const DEFAULT_RESPONSE = "I'm still learning, but I can help you search for products. Try asking me for 'dry skin moisturizers' or 'products with vitamin C'.";

export const getBotResponse = async (userMessage) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  const msgLower = userMessage.toLowerCase();
  
  for (const intent of MOCK_INTENTS) {
    if (intent.keywords.some(kw => msgLower.includes(kw))) {
      return {
        text: intent.response,
        suggestions: intent.getSuggestions()
      };
    }
  }
  
  // If no specific intent matched, do a general product search fallback
  const searchResults = searchProducts(userMessage).slice(0, 3);
  if (searchResults.length > 0) {
    return {
      text: `I found some products that might match what you're looking for:`,
      suggestions: searchResults.map(p => ({ label: p.name, url: `/product/${p.id}` }))
    };
  }
  
  return {
    text: DEFAULT_RESPONSE,
    suggestions: []
  };
};

export const getInitialMessage = () => {
  return {
    id: Date.now().toString(),
    sender: 'bot',
    text: getGreeting(),
    suggestions: []
  };
};
