const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotPanel = document.getElementById("chatbotPanel");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotForm = document.getElementById("chatbotForm");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotMessages = document.getElementById("chatbotMessages");
const quickButtons = document.querySelectorAll(".quick-actions button");

let perfumeQuizState = {
  currentQuestion: 0,
  scores: {
    Apollo: 0,
    Artemis: 0,
    Dionysus: 0,
    Aphrodite: 0,
    Athena: 0
  }
};

const perfumeQuestions = [
  {
    question: "What is your ideal way to spend a weekend?",
    options: [
      { label: "A - Leading a creative project / painting / writing", perfume: "Apollo" },
      { label: "B - Exploring nature / hiking / moonlit walks", perfume: "Artemis" },
      { label: "C - Hosting friends / parties / celebrations", perfume: "Dionysus" },
      { label: "D - Pampering yourself and loved ones", perfume: "Aphrodite" },
      { label: "E - Strategizing and solving problems", perfume: "Athena" }
    ]
  },
  {
    question: "Which word best describes your personality?",
    options: [
      { label: "A - Radiant", perfume: "Apollo" },
      { label: "B - Free-spirited", perfume: "Artemis" },
      { label: "C - Passionate", perfume: "Dionysus" },
      { label: "D - Charming", perfume: "Aphrodite" },
      { label: "E - Wise", perfume: "Athena" }
    ]
  },
  {
    question: "What draws you most in a person?",
    options: [
      { label: "A - Creativity and inspiration", perfume: "Apollo" },
      { label: "B - Independence and courage", perfume: "Artemis" },
      { label: "C - Fun and spontaneity", perfume: "Dionysus" },
      { label: "D - Beauty and grace", perfume: "Aphrodite" },
      { label: "E - Intelligence and insight", perfume: "Athena" }
    ]
  },
  {
    question: "Pick your favorite element.",
    options: [
      { label: "A - Sun", perfume: "Apollo" },
      { label: "B - Moon", perfume: "Artemis" },
      { label: "C - Wine", perfume: "Dionysus" },
      { label: "D - Rose", perfume: "Aphrodite" },
      { label: "E - Olive / Laurel", perfume: "Athena" }
    ]
  },
  {
    question: "What feeling do you want your perfume to evoke?",
    options: [
      { label: "A - Energy and confidence", perfume: "Apollo" },
      { label: "B - Freedom and mystery", perfume: "Artemis" },
      { label: "C - Passion and joy", perfume: "Dionysus" },
      { label: "D - Romance and allure", perfume: "Aphrodite" },
      { label: "E - Strength and elegance", perfume: "Athena" }
    ]
  }
];

const perfumeLinks = {
  Apollo: "shop.html#apollo",
  Artemis: "shop.html#artemis",
  Dionysus: "shop.html#dionysus",
  Aphrodite: "shop.html#aphrodite",
  Athena: "shop.html#athena"
};

function addMessage(text, sender = "bot") {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function addOptionButtons(options) {
  const wrapper = document.createElement("div");
  wrapper.className = "chatbot-options";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "chatbot-option-btn";
    button.textContent = option.label;

    button.addEventListener("click", () => {
      addMessage(option.label, "user");
      perfumeQuizState.scores[option.perfume] += 1;
      wrapper.remove();
      perfumeQuizState.currentQuestion += 1;
      askNextQuestion();
    });

    wrapper.appendChild(button);
  });

  chatbotMessages.appendChild(wrapper);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getTopPerfume() {
  let topPerfume = "Apollo";
  let topScore = -1;

  for (const perfume in perfumeQuizState.scores) {
    if (perfumeQuizState.scores[perfume] > topScore) {
      topScore = perfumeQuizState.scores[perfume];
      topPerfume = perfume;
    }
  }

  return topPerfume;
}

function addRecommendationButton(perfumeName) {
  const wrapper = document.createElement("div");
  wrapper.className = "chatbot-result-actions";

  const link = document.createElement("a");
  link.href = perfumeLinks[perfumeName];
  link.className = "chatbot-shop-link";
  link.textContent = `Shop ${perfumeName}`;

  wrapper.appendChild(link);
  chatbotMessages.appendChild(wrapper);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function askNextQuestion() {
  if (perfumeQuizState.currentQuestion < perfumeQuestions.length) {
    const current = perfumeQuestions[perfumeQuizState.currentQuestion];
    addMessage(current.question, "bot");
    addOptionButtons(current.options);
  } else {
    const result = getTopPerfume();
    addMessage(`Your ideal fragrance is ${result}.`, "bot");
    addMessage(`Based on your answers, ${result} matches your energy and personality best.`, "bot");
    addRecommendationButton(result);
  }
}

function startPerfumeQuiz() {
  perfumeQuizState = {
    currentQuestion: 0,
    scores: {
      Apollo: 0,
      Artemis: 0,
      Dionysus: 0,
      Aphrodite: 0,
      Athena: 0
    }
  };

  addMessage("Perfect — let’s find your ideal perfume.", "bot");
  askNextQuestion();
}

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", () => {
    chatbotPanel.classList.toggle("open");
  });
}

if (chatbotClose && chatbotPanel) {
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.remove("open");
  });
}

if (chatbotForm) {
  chatbotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatbotInput.value = "";

    addMessage("For now, use the quick options or the perfume quiz. You can send me a custom logic later for free text replies.", "bot");
  });
}

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = button.getAttribute("data-prompt");
    addMessage(prompt, "user");

    if (prompt.toLowerCase().includes("choose a fragrance") || prompt.toLowerCase().includes("choose a perfume")) {
      startPerfumeQuiz();
    } else if (prompt.toLowerCase().includes("promo")) {
      addMessage("Current promo prices are: 30ml for 359 DH instead of 499 DH, 50ml for 559 DH instead of 699 DH, and 100ml for 1159 DH instead of 1299 DH.", "bot");
      addMessage("Bundle offers: 2 x 30ml = 579 DH, 2 x 50ml = 979 DH, and 2 x 100ml = 2179 DH.", "bot");
    } else if (prompt.toLowerCase().includes("delivery")) {
      addMessage("We prepare orders within 1 to 3 business days. Delivery across Morocco usually takes 1 to 5 days depending on your city. Delivery fees are calculated at checkout, and you may benefit from free delivery during promotions. Please make sure your contact details are correct to avoid any delays.",
    "bot");
    } else {
      addMessage("This chatbot is ready for your custom flows.", "bot");
    }
  });
});