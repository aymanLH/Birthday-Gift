document.addEventListener('DOMContentLoaded', function() {
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  setTimeout(function() {
    window.scrollTo(0, 0);
  }, 100);
});
document.addEventListener('DOMContentLoaded', function() {
      const pages = document.querySelectorAll('.page');
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      let currentPage = 0;
      
      // Set initial z-index for pages
      pages.forEach((page, index) => {
        page.style.zIndex = pages.length - index;
        
        // Add click event for each page
        page.addEventListener('click', function() {
          if (index === currentPage) {
            flipPage(index);
            currentPage++;
            updateButtons();
          }
        });
        
        // Add hover effects for frames
        const frames = page.querySelectorAll('.cute-frame');
        frames.forEach(frame => {
          frame.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
          });
          
          frame.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
          });
        });
      });
      
      // Previous button click
      prevBtn.addEventListener('click', function() {
        if (currentPage > 0) {
          currentPage--;
          unflipPage(currentPage);
          updateButtons();
        }
      });
      
      // Next button click
      nextBtn.addEventListener('click', function() {
        if (currentPage < pages.length) {
          flipPage(currentPage);
          currentPage++;
          updateButtons();
        }
      });
      
      function flipPage(pageIndex) {
        if (pageIndex < pages.length) {
          pages[pageIndex].classList.add('flipped');
        }
      }
      
      function unflipPage(pageIndex) {
        if (pageIndex < pages.length) {
          pages[pageIndex].classList.remove('flipped');
        }
      }
      
      function updateButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length;
        
        // Visual feedback
        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
      }
      
      // Initial button state
      updateButtons();
      
      // Add some floating hearts animation
      function createFloatingHearts() {
        const container = document.querySelector('body');
        const heart = document.createElement('div');
        heart.classList.add('hearts');
        heart.innerHTML = '♥';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.position = 'fixed'; // Changed from absolute to fixed
        heart.style.top = '-20px';
        heart.style.zIndex = '1000'; // Add z-index to ensure hearts appear above other elements
        heart.style.animation = 'float 5s linear forwards';
        heart.style.pointerEvents = 'none'; // Prevent hearts from interfering with clicks
        container.appendChild(heart);
        
        // Remove the setTimeout that deletes the heart
        heart.addEventListener('animationend', () => {
          heart.remove();
        });
        // The element will stay in the DOM after animation
      }
      
      // Create floating hearts animation
      setInterval(createFloatingHearts, 1000);
      
      // Add animation style
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 1; // Changed from 0 to 1 so hearts remain visible
          }
        }
        
        .hearts {
          pointer-events: none; // Ensure hearts don't interfere with page interaction
          z-index: 1000; // Ensure hearts appear above other content
        }
      `;
      document.head.appendChild(style);
    });


    document.addEventListener('DOMContentLoaded', () => {
      const gameBoard = document.getElementById('gameBoard');
      const movesDisplay = document.getElementById('moves');
      const matchesDisplay = document.getElementById('matches');
      const timeDisplay = document.getElementById('time');
      const resetBtn = document.getElementById('resetBtn');
      const winMessage = document.getElementById('winMessage');
      const winStats = document.getElementById('winStats');
      const playAgainBtn = document.getElementById('playAgainBtn');
      
      // Game variables
      let cards = [];
      let firstCard = null;
      let secondCard = null;
      let lockBoard = false;
      let moves = 0;
      let matches = 0;
      let timer = null;
      let seconds = 0;
      let gameStarted = false;
      
      // Emojis for card pairs (birthday themed)
      const emojis = ['🎁', '🎂', '🎈', '🎊', '👑', '🍰', '🎀', '💖'];
      
      // Initialize the game
      function initGame() {
          resetGame();
          createCards();
          renderCards();
      }
      
      // Reset game state
      function resetGame() {
          cards = [];
          firstCard = null;
          secondCard = null;
          lockBoard = false;
          moves = 0;
          matches = 0;
          seconds = 0;
          gameStarted = false;
          
          if (timer) {
              clearInterval(timer);
              timer = null;
          }
          
          movesDisplay.textContent = '0';
          matchesDisplay.textContent = '0/8';
          timeDisplay.textContent = '00:00';
          gameBoard.innerHTML = '';
          winMessage.style.display = 'none';
          
          // Remove any confetti
          document.querySelectorAll('.confetti').forEach(c => c.remove());
      }
      
      // Create array of card objects
      function createCards() {
          let id = 0;
          // Create pairs of cards with matching emojis
          for (let i = 0; i < emojis.length; i++) {
              for (let j = 0; j < 2; j++) {
                  cards.push({
                      id: id++,
                      emoji: emojis[i],
                      isFlipped: false,
                      isMatched: false
                  });
              }
          }
          
          // Shuffle the cards
          shuffleCards();
      }
      
      // Shuffle cards array using Fisher-Yates algorithm
      function shuffleCards() {
          for (let i = cards.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [cards[i], cards[j]] = [cards[j], cards[i]];
          }
      }
      
      // Create card elements and render to game board
      function renderCards() {
          gameBoard.innerHTML = '';
          
          cards.forEach(card => {
              const cardElement = document.createElement('div');
              cardElement.classList.add('card');
              cardElement.dataset.id = card.id;
              
              if (card.isFlipped) {
                  cardElement.classList.add('flipped');
              }
              
              cardElement.innerHTML = `
                  <div class="card-inner">
                      <div class="card-front"></div>
                      <div class="card-back">${card.emoji}</div>
                  </div>
              `;
              
              cardElement.addEventListener('click', () => flipCard(card, cardElement));
              
              gameBoard.appendChild(cardElement);
          });
      }
      
      // Handle card flip logic
      function flipCard(card, cardElement) {
          // Don't allow flipping if board is locked or card is already flipped/matched
          if (lockBoard || card.isFlipped || card.isMatched) return;
          
          // Start the timer on first card flip
          if (!gameStarted) {
              startTimer();
              gameStarted = true;
          }
          
          // Flip the card
          card.isFlipped = true;
          cardElement.classList.add('flipped');
          
          // Check if this is the first or second card flipped
          if (!firstCard) {
              // First card flipped
              firstCard = { card, element: cardElement };
          } else {
              // Second card flipped
              secondCard = { card, element: cardElement };
              
              // Increment moves counter
              moves++;
              movesDisplay.textContent = moves;
              
              // Check for match
              checkForMatch();
          }
      }
      
      // Check if the two flipped cards match
      function checkForMatch() {
          lockBoard = true;
          
          if (firstCard.card.emoji === secondCard.card.emoji) {
              // Cards match!
              firstCard.card.isMatched = true;
              secondCard.card.isMatched = true;
              
              // Update matches counter
              matches++;
              matchesDisplay.textContent = `${matches}/8`;
              
              // Add some visual feedback for a match
              setTimeout(() => {
                  firstCard.element.style.backgroundColor = '#f8bbd0';
                  secondCard.element.style.backgroundColor = '#f8bbd0';
                  resetCardSelection();
                  
                  // Check if game is complete
                  if (matches === 8) {
                      gameWon();
                  }
              }, 500);
          } else {
              // Cards don't match, flip them back
              setTimeout(() => {
                  firstCard.card.isFlipped = false;
                  secondCard.card.isFlipped = false;
                  firstCard.element.classList.remove('flipped');
                  secondCard.element.classList.remove('flipped');
                  resetCardSelection();
              }, 1000);
          }
      }
      
      // Reset the current card selection
      function resetCardSelection() {
          firstCard = null;
          secondCard = null;
          lockBoard = false;
      }
      
      // Start the game timer
      function startTimer() {
          timer = setInterval(() => {
              seconds++;
              const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
              const secs = (seconds % 60).toString().padStart(2, '0');
              timeDisplay.textContent = `${mins}:${secs}`;
          }, 1000);
      }
      
      // Handle game win
      function gameWon() {
          clearInterval(timer);
          
          // Calculate star rating
          let stars;
          if (moves <= 16) {
              stars = '⭐⭐⭐';
          } else if (moves <= 24) {
              stars = '⭐⭐';
          } else {
              stars = '⭐';
          }
          
          // Format time
          const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
          const secs = (seconds % 60).toString().padStart(2, '0');
          const timeString = `${mins}:${secs}`;
          
          // Update win message
          winStats.innerHTML = `
              <p>You completed the game in <b>${timeString}</b> with <b>${moves}</b> moves!</p>
              <p>Your rating: ${stars}</p>
              <p>Happy Birthday! 🎉</p>
          `;
          
          // Show win message with slight delay
          setTimeout(() => {
              winMessage.style.display = 'flex';
              createConfetti();
          }, 500);
      }
      
      // Create confetti effect
      function createConfetti() {
          const colors = ['#ff80ab', '#ff4081', '#f8bbd0', '#ffb6c1', '#f48fb1', 
                         '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457'];
                         
          for (let i = 0; i < 100; i++) {
              const confetti = document.createElement('div');
              confetti.classList.add('confetti');
              
              // Random position, size, color and delay
              const left = Math.random() * 100;
              const size = Math.random() * 10 + 5;
              const background = colors[Math.floor(Math.random() * colors.length)];
              const delay = Math.random() * 3;
              
              confetti.style.left = `${left}vw`;
              confetti.style.width = `${size}px`;
              confetti.style.height = `${size}px`;
              confetti.style.background = background;
              confetti.style.animationDelay = `${delay}s`;
              
              // Random shape
              const shape = Math.floor(Math.random() * 4);
              if (shape === 0) {
                  confetti.style.borderRadius = '50%';
              } else if (shape === 1) {
                  confetti.style.transform = 'rotate(45deg)';
              }
              
              document.body.appendChild(confetti);
              
              // Remove confetti after animation ends
              setTimeout(() => {
                  confetti.remove();
              }, 3000 + delay * 1000);
          }
      }
      
      // Event listeners
      resetBtn.addEventListener('click', initGame);
      playAgainBtn.addEventListener('click', initGame);
      
      // Initialize game on load
      initGame();
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements with specific naming
    const goalsInput = document.getElementById('goals-input');
    const goalsCategorySelect = document.getElementById('goals-category-select');
    const goalsAddButton = document.getElementById('goals-add-button');
    const goalsList = document.getElementById('goals-list');
    const goalsEmptyMessage = document.getElementById('goals-empty-message');
    const goalsErrorMessage = document.getElementById('goals-error-message');
    const goalsTotalCount = document.getElementById('goals-total-count');
    const goalsCompletedCount = document.getElementById('goals-completed-count');
    
    // Load saved goals from localStorage
    goalsLoadSaved();
    
    
    // Event Listeners
    goalsAddButton.addEventListener('click', goalsAdd);
    
    goalsInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        goalsAdd();
      }
    });
    
    goalsInput.addEventListener('input', function() {
      goalsErrorMessage.textContent = '';
    });
    
    goalsCategorySelect.addEventListener('change', function() {
      goalsErrorMessage.textContent = '';
    });
    
    // Add a new goal
    function goalsAdd() {
      const goalText = goalsInput.value.trim();
      const category = goalsCategorySelect.value;
      
      // Validate input
      if (goalText === '') {
        goalsShowError('Please enter a goal 💭');
        return;
      }
      
      if (category === '') {
        goalsShowError('Please select a category 📋');
        return;
      }
      
      // Create new goal item
      const goalId = Date.now();
      const goalData = {
        id: goalId,
        text: goalText,
        category: category,
        completed: false,
        dateAdded: new Date().toISOString()
      };
      
      // Add to UI and save
      goalsAddToList(goalData);
      goalsSave(goalData);
      
      // Reset input fields
      goalsInput.value = '';
      goalsInput.focus();
      
      // Update UI
      goalsUpdateStats();
      goalsUpdateEmptyMessage();
    }
    
    // Add goal to the list
    function goalsAddToList(goalData) {
      const li = document.createElement('li');
      li.classList.add('goals-item');
      li.dataset.id = goalData.id;
      if (goalData.completed) {
        li.classList.add('completed');
      }
      
      // Create category tag
      const categoryLabel = document.createElement('span');
      categoryLabel.classList.add('goals-category-tag', `goals-category-${goalData.category}`);
      categoryLabel.textContent = goalData.category.charAt(0).toUpperCase() + goalData.category.slice(1);
      
      // Create goal text
      const goalTextSpan = document.createElement('span');
      goalTextSpan.classList.add('goals-text');
      goalTextSpan.textContent = goalData.text;
      
      // Create action buttons container
      const actionButtons = document.createElement('div');
      actionButtons.classList.add('goals-action-buttons');
      
      // Create complete button
      const completeBtn = document.createElement('button');
      completeBtn.innerHTML = goalData.completed ? '↩️' : '✓';
      completeBtn.title = goalData.completed ? 'Mark as incomplete' : 'Mark as complete';
      completeBtn.classList.add('goals-complete-button');
      completeBtn.addEventListener('click', function() {
        goalsToggleComplete(goalData.id);
      });
      
      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '✕';
      deleteBtn.title = 'Delete goal';
      deleteBtn.classList.add('goals-delete-button');
      deleteBtn.addEventListener('click', function() {
        goalsDelete(goalData.id);
      });
      
      // Assemble the goal item
      actionButtons.appendChild(completeBtn);
      actionButtons.appendChild(deleteBtn);
      
      li.appendChild(categoryLabel);
      li.appendChild(goalTextSpan);
      li.appendChild(actionButtons);
      
      goalsList.appendChild(li);
    }
    
    // Toggle goal completion status
    function goalsToggleComplete(id) {
      const goals = goalsGetFromStorage();
      const goalIndex = goals.findIndex(goal => goal.id === id);
      
      if (goalIndex !== -1) {
        goals[goalIndex].completed = !goals[goalIndex].completed;
        localStorage.setItem('goals2025', JSON.stringify(goals));
        
        const goalElement = document.querySelector(`.goals-item[data-id="${id}"]`);
        if (goalElement) {
          goalElement.classList.toggle('completed');
          const completeBtn = goalElement.querySelector('.goals-complete-button');
          if (goals[goalIndex].completed) {
            completeBtn.innerHTML = '↩️';
            completeBtn.title = 'Mark as incomplete';
          } else {
            completeBtn.innerHTML = '✓';
            completeBtn.title = 'Mark as complete';
          }
        }
        
        goalsUpdateStats();
      }
    }
    
    // Delete a goal
    function goalsDelete(id) {
      const goals = goalsGetFromStorage();
      const updatedGoals = goals.filter(goal => goal.id !== id);
      localStorage.setItem('goals2025', JSON.stringify(updatedGoals));
      
      const goalElement = document.querySelector(`.goals-item[data-id="${id}"]`);
      if (goalElement) {
        goalElement.style.transform = 'translateX(100px)';
        goalElement.style.opacity = '0';
        
        setTimeout(() => {
          goalElement.remove();
          goalsUpdateStats();
          goalsUpdateEmptyMessage();
        }, 300);
      }
    }
    
    // Save goal to localStorage
    function goalsSave(goalData) {
      const goals = goalsGetFromStorage();
      goals.push(goalData);
      localStorage.setItem('goals2025', JSON.stringify(goals));
    }
    
    // Get goals from localStorage
    function goalsGetFromStorage() {
      const goals = localStorage.getItem('goals2025');
      return goals ? JSON.parse(goals) : [];
    }
    
    // Load saved goals
    function goalsLoadSaved() {
      const goals = goalsGetFromStorage();
      goals.forEach(goal => {
        goalsAddToList(goal);
      });
      
      goalsUpdateStats();
      goalsUpdateEmptyMessage();
    }
    
    // Update empty message visibility
    function goalsUpdateEmptyMessage() {
      goalsEmptyMessage.style.display = goalsList.children.length === 0 ? 'block' : 'none';
    }
    
    // Update statistics
    function goalsUpdateStats() {
      const goals = goalsGetFromStorage();
      goalsTotalCount.textContent = goals.length;
      goalsCompletedCount.textContent = goals.filter(goal => goal.completed).length;
    }
    
    // Show error message
    function goalsShowError(message) {
      goalsErrorMessage.textContent = message;
      goalsErrorMessage.style.opacity = '1';
      
      setTimeout(() => {
        goalsErrorMessage.style.opacity = '0';
        setTimeout(() => {
          goalsErrorMessage.textContent = '';
        }, 300);
      }, 3000);
    }
  });
  document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    // Autoplay when page loads
    // Note: Modern browsers may block autoplay without user interaction
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Autoplay started successfully
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
        })
        .catch(error => {
            // Autoplay was prevented
            console.log("Autoplay prevented by browser policy");
            // We'll keep the play button visible
        });
    }
    
    // Toggle play/pause on button click
    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
        } else {
            audio.pause();
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
        }
    });
});