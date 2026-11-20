// Initial Flashcards

let defaultCards = [
    {
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language",
        category: "Technology",
        mastered: true
    },
    {
        question: "What is CSS used for?",
        answer: "CSS is used to style and design web pages.",
        category: "Programming",
        mastered: false
    },
    {
        question: "What is JavaScript?",
        answer: "JavaScript is a programming language used to make websites interactive.",
        category: "Programming",
        mastered: false
    },
    {
        question: "What is an algorithm?",
        answer: "An algorithm is a step-by-step procedure to solve a problem.",
        category: "General",
        mastered: false
    },
    {
        question: "What is the value of Pi?",
        answer: "The approximate value of Pi is 3.14.",
        category: "Mathematics",
        mastered: false
    }
];


// Load saved cards

let cards = JSON.parse(localStorage.getItem("flashcards")) || defaultCards;

let currentIndex = 0;
let isFlipped = false;


// Save Cards

function saveCards() {
    localStorage.setItem("flashcards", JSON.stringify(cards));
}


// Navigation

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");

    if (pageName === "study") {
        displayCard();
    }

    if (pageName === "dashboard") {
        updateDashboard();
    }
}


// Display Flashcard

function displayCard() {

    if (cards.length === 0) {
        document.getElementById("cardLabel").innerText = "NO CARDS";
        document.getElementById("cardText").innerText = "Create a flashcard first!";
        document.getElementById("cardHint").innerText = "";
        document.getElementById("cardCount").innerText = "Card 0 of 0";
        return;
    }

    if (currentIndex >= cards.length) {
        currentIndex = 0;
    }

    let card = cards[currentIndex];

    isFlipped = false;

    document.getElementById("cardLabel").innerText = "QUESTION";

    document.getElementById("cardText").innerText = card.question;

    document.getElementById("cardHint").innerText =
        "Click the card to reveal the answer";

    document.getElementById("cardCount").innerText =
        `Card ${currentIndex + 1} of ${cards.length}`;
}


// Flip Card

function flipCard() {

    if (cards.length === 0) return;

    let card = cards[currentIndex];

    isFlipped = !isFlipped;

    if (isFlipped) {

        document.getElementById("cardLabel").innerText = "ANSWER";

        document.getElementById("cardText").innerText = card.answer;

        document.getElementById("cardHint").innerText =
            "Click again to see the question";

    } else {

        displayCard();

    }
}


// Next Card

function nextCard() {

    if (cards.length === 0) return;

    currentIndex = (currentIndex + 1) % cards.length;

    displayCard();
}


// Previous Card

function previousCard() {

    if (cards.length === 0) return;

    currentIndex = (currentIndex - 1 + cards.length) % cards.length;

    displayCard();
}


// Mark as Mastered

function markMastered() {

    if (cards.length === 0) return;

    cards[currentIndex].mastered = true;

    saveCards();

    updateDashboard();

    alert("Great! Flashcard mastered ✓");
}


// Shuffle Cards

function shuffleCards() {

    if (cards.length === 0) return;

    for (let i = cards.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [cards[i], cards[j]] = [cards[j], cards[i]];

    }

    currentIndex = 0;

    displayCard();

}


// Create New Flashcard

document.getElementById("cardForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let question = document.getElementById("question").value.trim();

    let answer = document.getElementById("answer").value.trim();

    let category = document.getElementById("category").value;

    if (!question || !answer) return;

    cards.push({

        question: question,

        answer: answer,

        category: category,

        mastered: false

    });

    saveCards();

    document.getElementById("cardForm").reset();

    document.getElementById("successMessage").innerText =
        "Flashcard added successfully! ✓";

    displayCard();

});


// Update Dashboard

function updateDashboard() {

    let masteredCount = cards.filter(card => card.mastered).length;

    let percentage = cards.length === 0
        ? 0
        : Math.round((masteredCount / cards.length) * 100);

    document.getElementById("progressFill").style.width =
        percentage + "%";

    document.getElementById("progressText").innerText =
        percentage + "% completed";


    // Display All Cards

    let cardList = document.getElementById("cardList");

    cardList.innerHTML = "";

    cards.forEach((card, index) => {

        let item = document.createElement("div");

        item.className = "card-item";

        let question = document.createElement("strong");

        question.textContent = card.question;

        let details = document.createElement("div");

        details.textContent =
            `Category: ${card.category} | ` +
            (card.mastered ? "Mastered ✓" : "Not mastered");

        let deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete Card";

        deleteButton.onclick = function() {
            deleteCard(index);
        };

        item.appendChild(question);
        item.appendChild(details);
        item.appendChild(deleteButton);

        cardList.appendChild(item);

    });

}


// Delete Card

function deleteCard(index) {

    if (confirm("Are you sure you want to delete this card?")) {

        cards.splice(index, 1);

        if (currentIndex >= cards.length) {
            currentIndex = Math.max(0, cards.length - 1);
        }

        saveCards();

        displayCard();

        updateDashboard();

    }

}


// Reset Learning Progress

function resetProgress() {

    if (confirm("Reset all learning progress?")) {

        cards.forEach(card => {
            card.mastered = false;
        });

        saveCards();

        updateDashboard();

        displayCard();

        alert("Learning progress has been reset!");

    }

}


// Initial Display

displayCard();

updateDashboard();