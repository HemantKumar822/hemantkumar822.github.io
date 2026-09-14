class TerminalResume {
  constructor() {
    this.output = document.getElementById("output");
    this.input = document.getElementById("command-input");
    this.terminal = document.querySelector(".terminal");
    this.terminalContainer = document.querySelector(".terminal-container");
    this.contextMenu = document.querySelector(".context-menu");
    this.terminals = [{ input: this.input, history: [], historyIndex: -1 }];
    this.activeTerminal = 0;
    this.activeTerminalContent = null;
    this.resizing = null;

    // New properties for themes and game
    this.currentTheme = localStorage.getItem("theme") || "default";
    this.projects = [];
    this.skills = {};
    this.fileSystem = {};
    this.gameActive = false;
    this.gameHandler = null;

    // Initialize modals
    this.themeModal = document.getElementById("theme-modal");
    this.projectsModal = document.getElementById("projects-modal");
    this.skillsModal = document.getElementById("skills-modal");

    // Initialize theme selector
    this.themeToggle = document.getElementById("theme-toggle");

    this.setupEventListeners();
    this.loadProjects();
    this.loadSkills();
    this.setupFileSystem();
    this.init();
  }

  closeSplit(terminalContent) {
    const container = terminalContent.parentElement;
    const input = terminalContent.querySelector("input");

    // Remove from terminals array
    const terminalIndex = this.terminals.findIndex((t) => t.input === input);
    if (terminalIndex > -1) {
      this.terminals.splice(terminalIndex, 1);
    }

    // Remove the terminal content
    terminalContent.remove();

    // If container is empty or has only one child, move remaining content up
    if (
      container.children.length <= 1 &&
      container !== this.terminalContainer
    ) {
      if (container.children.length === 1) {
        const remainingContent = container.firstElementChild;
        container.parentElement.insertBefore(remainingContent, container);
      }
      container.remove();
    }

    // Focus the previous terminal
    if (this.terminals.length > 0) {
      const newActiveIndex = Math.min(terminalIndex, this.terminals.length - 1);
      this.terminals[newActiveIndex].input.focus();
      this.activeTerminal = newActiveIndex;
    }
  }

  loadProjects() {
    this.projects = [
      {
        title: "EWTCS",
        description: "Hospital & Medical College Management System built with a team for JECRC University.",
        image: "", // Optionally add a real image path if desired later
        technologies: ["Java", "Full-Stack", "MySQL"],
        demo: "https://github.com/somuyakhandelwal/EWTCS",
        repo: "https://github.com/somuyakhandelwal/EWTCS",
      },
    ];
  }

  loadSkills() {
    this.skills = {
      frontend: {
        JavaScript: 90,
        TypeScript: 80,
        "React.js": 85,
        HTML: 95,
        CSS: 90
      },
      backend: {
        "Node.js": 85,
        Python: 90,
        Java: 80,
        Express: 80
      },
      cloud_and_db: {
        "Google Cloud": 85,
        Docker: 80,
        MongoDB: 85,
        SQL: 85
      },
    };
  }

  setupFileSystem() {
    this.fileSystem = {
      resume: {
        type: "directory",
        contents: {
          "about.txt": { type: "file", content: "About me..." },
          "skills.md": { type: "file", content: "# Skills..." },
          projects: {
            type: "directory",
            contents: {
              "project1.md": { type: "file", content: "Project 1 details..." },
            },
          },
        },
      },
    };
  }

  // Theme handling
  handleThemeChange(theme) {
    this.terminal.className = `terminal theme-${theme}`;
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
    this.closeModal(this.themeModal);
  }

  // Modal handling
  showModal(modal) {
    modal.classList.add("active");
  }

  closeModal(modal) {
    modal.classList.remove("active");
  }

  // Projects showcase
  showProjects() {
    const container = this.projectsModal.querySelector(".projects-container");
    container.innerHTML = this.projects
      .map(
        (project) => `
      <div class="project-card">
        <img src="${project.image}" alt="${
          project.title
        }" class="project-image">
        <div class="project-details">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tech">
            ${project.technologies
              .map(
                (tech) => `
              <span class="tech-tag">${tech}</span>
            `
              )
              .join("")}
          </div>
          <div class="project-links">
            <a href="${project.demo}" class="project-link" target="_blank">
              <i class="fas fa-external-link-alt"></i> Demo
            </a>
            <a href="${project.repo}" class="project-link" target="_blank">
              <i class="fab fa-github"></i> Repository
            </a>
          </div>
        </div>
      </div>
    `
      )
      .join("");
    this.showModal(this.projectsModal);
  }

  // Skills visualization
  showSkillsVisualization() {
    const container = this.skillsModal.querySelector(".skills-container");
    container.innerHTML = Object.entries(this.skills)
      .map(
        ([category, skills]) => `
      <div class="skill-category">
        <h3 class="skill-category-title">${category}</h3>
        <div class="skill-bars">
          ${Object.entries(skills)
            .map(
              ([skill, level]) => `
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${skill}</span>
                <span class="skill-level">${level}%</span>
              </div>
              <div class="skill-progress">
                <div class="skill-progress-bar" style="width: ${level}%"></div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
    this.showModal(this.skillsModal);
  }

  // File explorer
  navigateFileSystem(path) {
    const parts = path.split("/").filter(Boolean);
    let current = this.fileSystem;
    for (const part of parts) {
      if (current.type !== "directory" || !current.contents[part]) {
        return null;
      }
      current = current.contents[part];
    }
    return current;
  }

  // PDF Generation
  async generatePDF() {
    const outputElement = this.terminals[this.activeTerminal].input
      .closest(".terminal-content")
      .querySelector("[id^='output']");
    this.printToOutput(outputElement, "Generating PDF resume...", "info");
    // Placeholder for actual PDF generation
    setTimeout(() => {
      this.printToOutput(
        outputElement,
        "PDF generation is not yet implemented.",
        "error"
      );
    }, 1000);
  }

  // Mini-game - Snake game with p5.js
  initGame() {
    // Clean up any existing game
    this.endGame();

    // Start new game
    this.gameActive = true;

    const outputElement = this.terminals[this.activeTerminal].input
      .closest(".terminal-content")
      .querySelector("[id^='output']");

    const gameContainer = document.createElement("div");
    gameContainer.className = "game-container";
    gameContainer.id = "snake-game-container";
    gameContainer.innerHTML = `
      <div class="game-instructions">
        <p>Snake Game: Use arrow keys to move.</p>
        <p>Press P to pause, SPACE to restart, ESC to exit.</p>
      </div>
      <div id="snake-game-score">Score: 0</div>
      <div id="snake-game-canvas"></div>
    `;

    outputElement.appendChild(gameContainer);

    // Initialize p5.js snake game
    this.initSnakeGame();

    // Scroll to make sure game is visible
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  endGame() {
    if (!this.gameActive) return;

    this.gameActive = false;

    // Remove event listener if it exists
    if (this.gameHandler) {
      document.removeEventListener("keydown", this.gameHandler);
      this.gameHandler = null;
    }

    // Remove p5.js instance if it exists
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }

    // Remove game container if it exists
    const gameContainer = document.getElementById("snake-game-container");
    if (gameContainer) {
      gameContainer.remove();
    }
  }

  initSnakeGame() {
    const sketch = (p) => {
      // Game variables
      const gridSize = 20;
      const canvasWidth = 400;
      const canvasHeight = 300;
      let snake = [];
      let food;
      let direction = { x: 1, y: 0 };
      let nextDirection = { x: 1, y: 0 };
      let score = 0;
      let gameOver = false;
      let frameRate = 10;
      let isPaused = false;

      p.setup = () => {
        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("snake-game-canvas");
        p.frameRate(frameRate);
        resetGame();
      };

      p.draw = () => {
        p.background(0);

        if (isPaused) {
          drawGrid();
          p.fill(255);
          p.textSize(24);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("PAUSED", canvasWidth / 2, canvasHeight / 2);
          p.textSize(16);
          p.text("Press P to resume", canvasWidth / 2, canvasHeight / 2 + 30);
          return;
        }

        if (gameOver) {
          drawGrid();
          p.fill(255, 0, 0);
          p.textSize(24);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("Game Over!", canvasWidth / 2, canvasHeight / 2 - 20);
          p.textSize(16);
          p.text(`Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 20);
          p.text(
            "Press SPACE to restart",
            canvasWidth / 2,
            canvasHeight / 2 + 50
          );
          return;
        }

        // Update game state
        direction = nextDirection;
        moveSnake();
        checkCollision();
        checkFood();

        // Draw game
        drawGrid();
        drawSnake();
        drawFood();
        updateScore();
      };

      p.keyPressed = () => {
        if (p.keyCode === 80) {
          // P key for pause
          isPaused = !isPaused;
          return false;
        }

        if (isPaused) return false;

        if (p.keyCode === p.UP_ARROW && direction.y !== 1) {
          nextDirection = { x: 0, y: -1 };
        } else if (p.keyCode === p.DOWN_ARROW && direction.y !== -1) {
          nextDirection = { x: 0, y: 1 };
        } else if (p.keyCode === p.LEFT_ARROW && direction.x !== 1) {
          nextDirection = { x: -1, y: 0 };
        } else if (p.keyCode === p.RIGHT_ARROW && direction.x !== -1) {
          nextDirection = { x: 1, y: 0 };
        } else if (p.keyCode === 32 && gameOver) {
          // SPACE to restart
          resetGame();
        } else if (p.keyCode === 27) {
          // ESC to exit
          this.endGame();
        }

        // Prevent default behavior for arrow keys
        if (
          [
            p.UP_ARROW,
            p.DOWN_ARROW,
            p.LEFT_ARROW,
            p.RIGHT_ARROW,
            32,
            27,
            80,
          ].includes(p.keyCode)
        ) {
          return false;
        }
      };

      function resetGame() {
        snake = [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 3, y: 5 },
        ];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        gameOver = false;
        placeFood();
        updateScore();
      }

      function moveSnake() {
        // Create new head
        const head = {
          x: snake[0].x + direction.x,
          y: snake[0].y + direction.y,
        };

        // Wrap around edges
        if (head.x < 0) head.x = Math.floor(canvasWidth / gridSize) - 1;
        if (head.x >= canvasWidth / gridSize) head.x = 0;
        if (head.y < 0) head.y = Math.floor(canvasHeight / gridSize) - 1;
        if (head.y >= canvasHeight / gridSize) head.y = 0;

        // Add new head to beginning of snake
        snake.unshift(head);

        // Remove tail unless food was eaten
        if (head.x !== food.x || head.y !== food.y) {
          snake.pop();
        } else {
          placeFood();
          score += 10;
          // Increase speed slightly with each food
          if (frameRate < 20) {
            frameRate += 0.5;
            p.frameRate(frameRate);
          }
        }
      }

      function checkCollision() {
        // Check if snake collides with itself
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
          if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
          }
        }
      }

      function checkFood() {
        const head = snake[0];
        if (head.x === food.x && head.y === food.y) {
          placeFood();
          score += 10;
        }
      }

      function placeFood() {
        // Find a position for food that's not occupied by the snake
        let validPosition = false;
        while (!validPosition) {
          food = {
            x: Math.floor(p.random(canvasWidth / gridSize)),
            y: Math.floor(p.random(canvasHeight / gridSize)),
          };

          validPosition = true;
          // Check if food is on snake
          for (const segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
              validPosition = false;
              break;
            }
          }
        }
      }

      function drawSnake() {
        p.noStroke();

        // Draw snake body
        for (let i = 1; i < snake.length; i++) {
          p.fill(0, 255, 0); // Green body
          p.rect(
            snake[i].x * gridSize,
            snake[i].y * gridSize,
            gridSize - 2,
            gridSize - 2,
            4
          );
        }

        // Draw snake head
        p.fill(0, 200, 0); // Darker green head
        p.rect(
          snake[0].x * gridSize,
          snake[0].y * gridSize,
          gridSize - 2,
          gridSize - 2,
          6
        );
      }

      function drawFood() {
        p.fill(255, 0, 0); // Red food
        p.ellipse(
          food.x * gridSize + gridSize / 2,
          food.y * gridSize + gridSize / 2,
          gridSize * 0.8,
          gridSize * 0.8
        );
      }

      function drawGrid() {
        p.stroke(30);
        p.strokeWeight(0.5);

        // Draw vertical lines
        for (let x = 0; x <= canvasWidth; x += gridSize) {
          p.line(x, 0, x, canvasHeight);
        }

        // Draw horizontal lines
        for (let y = 0; y <= canvasHeight; y += gridSize) {
          p.line(0, y, canvasWidth, y);
        }
      }

      function updateScore() {
        const scoreElement = document.getElementById("snake-game-score");
        if (scoreElement) {
          scoreElement.textContent = `Score: ${score}`;
        }
      }
    };

    // Create new p5 instance
    this.p5Instance = new p5(sketch);
  }

  // Matrix rain effect
  startMatrixEffect(outputElement) {
    // Stop any existing matrix effect
    this.stopMatrixEffect();

    // Create canvas for matrix effect
    const matrixContainer = document.createElement("div");
    matrixContainer.className = "matrix-container";
    matrixContainer.id = "matrix-container";

    const canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    matrixContainer.appendChild(canvas);

    const instructions = document.createElement("div");
    instructions.className = "matrix-instructions";
    instructions.textContent = "Type 'stop-matrix' to exit";
    matrixContainer.appendChild(instructions);

    outputElement.appendChild(matrixContainer);

    // Set up canvas
    const ctx = canvas.getContext("2d");
    canvas.width = matrixContainer.offsetWidth;
    canvas.height = 300;

    // Matrix characters
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const columns = Math.floor(canvas.width / 20);
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -20);
    }

    // Matrix green color in current theme
    const getMatrixColor = () => {
      const themeColors = {
        default: "#00ff00",
        dracula: "#50fa7b",
        solarized: "#859900",
        nord: "#a3be8c",
      };
      return themeColors[this.currentTheme] || "#00ff00";
    };

    // Draw matrix effect
    const drawMatrix = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = getMatrixColor();
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = characters[Math.floor(Math.random() * characters.length)];

        // Draw character
        ctx.fillText(char, i * 20, drops[i] * 20);

        // Move drop down
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Start animation
    this.matrixInterval = setInterval(drawMatrix, 50);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  stopMatrixEffect() {
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
      this.matrixInterval = null;
    }

    const matrixContainer = document.getElementById("matrix-container");
    if (matrixContainer) {
      matrixContainer.remove();
    }
  }

  // Weather command
  async showWeather(location, outputElement) {
    if (!location) {
      this.printToOutput(
        outputElement,
        "Please specify a location. Usage: weather [city name]",
        "error"
      );
      return;
    }

    this.printToOutput(
      outputElement,
      `Fetching weather for ${location}...`,
      "info"
    );

    try {
      // Using OpenWeatherMap API
      const apiKey = "4331a27995f4c5b5e8d1eab1ed3d88b4"; // Free API key with limited usage
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Format weather data
      const weatherHTML = `<div class="weather-container">
        <div class="weather-header">
          <span style="color: #ffff00; font-weight: bold;">ðŸŒ¤ï¸🌤️ Weather for ${
            data.name
          }, ${data.sys.country}</span>
        </div>
        <div class="weather-body">
          <div class="weather-main">
            <span style="font-size: 2rem; color: #ffffff;">${Math.round(
              data.main.temp
            )}Â°C</span>
            <span style="color: #cccccc;">${data.weather[0].main}</span>
          </div>
          <div class="weather-details">
            <div><span style="color: #87cefa;">Feels like:</span> ${Math.round(
              data.main.feels_like
            )}Â°C</div>
            <div><span style="color: #87cefa;">Humidity:</span> ${
              data.main.humidity
            }%</div>
            <div><span style="color: #87cefa;">Wind:</span> ${Math.round(
              data.wind.speed * 3.6
            )} km/h</div>
          </div>
        </div>
      </div>`;

      this.printToOutput(outputElement, weatherHTML, "");
    } catch (error) {
      this.printToOutput(
        outputElement,
        `Failed to fetch weather data: ${error.message}`,
        "error"
      );
    }
  }

  // Calculator command
  calculate(expression, outputElement) {
    if (!expression) {
      this.printToOutput(
        outputElement,
        "Please enter a mathematical expression. Usage: calc [expression]",
        "error"
      );
      return;
    }

    try {
      // Sanitize the expression to prevent code injection
      // Only allow numbers, basic operators, parentheses, and some math functions
      const sanitizedExpression = expression.replace(/[^0-9+\-*/().%\s]/g, "");

      // Evaluate the expression
      const result = Function('return ' + sanitizedExpression)();

      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid result");
      }

      // Format the result
      const formattedResult =
        typeof result === "number" && !Number.isInteger(result)
          ? result.toFixed(4).replace(/\.?0+$/, "")
          : result.toString();

      const calculationHTML = `<div class="calculation">
        <div class="calculation-expression">${this.wrapWithColor(
          expression,
          "#87cefa"
        )}</div>
        <div class="calculation-result">${this.wrapWithColor(
          "= " + formattedResult,
          "#98fb98"
        )}</div>
      </div>`;

      this.printToOutput(outputElement, calculationHTML, "");
    } catch (error) {
      this.printToOutput(
        outputElement,
        `Error: Could not evaluate the expression. Make sure it's a valid mathematical expression.`,
        "error"
      );
    }
  }

  // LinkedIn Cover Generator
  generateLinkedInCover(outputElement) {
    // Create container for the LinkedIn cover
    const coverContainer = document.createElement("div");
    coverContainer.className = "linkedin-cover-container";
    coverContainer.style.width = "100%";
    coverContainer.style.height = "300px";
    coverContainer.style.position = "relative";
    coverContainer.style.overflow = "hidden";
    coverContainer.style.borderRadius = "8px";
    coverContainer.style.marginTop = "10px";
    coverContainer.style.marginBottom = "20px";
    coverContainer.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
    coverContainer.style.border = "1px solid rgba(255,255,255,0.1)";

    // Create terminal-like background
    const background = document.createElement("div");
    background.style.position = "absolute";
    background.style.top = "0";
    background.style.left = "0";
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.backgroundColor = "#1e1e2e";
    background.style.zIndex = "1";
    coverContainer.appendChild(background);

    // Add terminal header
    const terminalHeader = document.createElement("div");
    terminalHeader.style.position = "absolute";
    terminalHeader.style.top = "0";
    terminalHeader.style.left = "0";
    terminalHeader.style.width = "100%";
    terminalHeader.style.height = "30px";
    terminalHeader.style.backgroundColor = "#282a36";
    terminalHeader.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    terminalHeader.style.display = "flex";
    terminalHeader.style.alignItems = "center";
    terminalHeader.style.padding = "0 10px";
    terminalHeader.style.zIndex = "2";

    // Add terminal buttons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "6px";

    const colors = ["#ff5f56", "#ffbd2e", "#27c93f"];
    colors.forEach((color) => {
      const button = document.createElement("div");
      button.style.width = "12px";
      button.style.height = "12px";
      button.style.borderRadius = "50%";
      button.style.backgroundColor = color;
      buttonsContainer.appendChild(button);
    });

    terminalHeader.appendChild(buttonsContainer);

    // Add terminal title
    const terminalTitle = document.createElement("div");
    terminalTitle.textContent = "hemant@kumar: ~/interactive-resume";
    terminalTitle.style.color = "#f8f8f2";
    terminalTitle.style.fontSize = "12px";
    terminalTitle.style.fontFamily = "'Fira Code', monospace";
    terminalTitle.style.margin = "0 auto";
    terminalHeader.appendChild(terminalTitle);

    coverContainer.appendChild(terminalHeader);

    // Add terminal content
    const terminalContent = document.createElement("div");
    terminalContent.style.position = "absolute";
    terminalContent.style.top = "30px";
    terminalContent.style.left = "0";
    terminalContent.style.width = "100%";
    terminalContent.style.height = "calc(100% - 30px)";
    terminalContent.style.padding = "15px";
    terminalContent.style.boxSizing = "border-box";
    terminalContent.style.zIndex = "2";
    terminalContent.style.overflow = "hidden";
    coverContainer.appendChild(terminalContent);

    // Add ASCII art
    const asciiArt = document.createElement("pre");
    asciiArt.style.color = "#d4843e";
    asciiArt.style.margin = "0";
    asciiArt.style.fontSize = "10px";
    asciiArt.style.fontFamily = "'Fira Code', monospace";
    asciiArt.style.lineHeight = "1";
    asciiArt.innerHTML = `â–ˆâ–ˆâ–ˆâ•—   â–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—
â–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â•â–ˆâ–ˆâ•—
â–ˆâ–ˆâ•”â–ˆâ–ˆâ–ˆâ–ˆâ•”â–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•”â•â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘   â–ˆâ–ˆâ•‘
â–ˆâ–ˆâ•‘â•šâ–ˆâ–ˆâ•”â•â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘   â–ˆâ–ˆâ•‘
â–ˆâ–ˆâ•‘ â•šâ•â• â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘â•šâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•”â•
â•šâ•â•     â•šâ•â•â•šâ•â•  â•šâ•â•â•šâ•â•  â•šâ•â•â•šâ•â• â•šâ•â•â•â•â•â• `;
    terminalContent.appendChild(asciiArt);

    // Add divider
    const divider = document.createElement("div");
    divider.style.width = "100%";
    divider.style.height = "1px";
    divider.style.backgroundColor = "#555555";
    divider.style.margin = "8px 0";
    terminalContent.appendChild(divider);

    // Add subtitle
    const subtitle = document.createElement("div");
    subtitle.textContent = "Interactive Terminal Resume";
    subtitle.style.color = "#888888";
    subtitle.style.fontSize = "12px";
    subtitle.style.fontFamily = "'Fira Code', monospace";
    subtitle.style.textAlign = "center";
    subtitle.style.marginBottom = "5px";
    terminalContent.appendChild(subtitle);

    // Add role
    const role = document.createElement("div");
    role.textContent = "AI Developer â€¢ Full-Stack â€¢ Builder";
    role.style.color = "#666666";
    role.style.fontSize = "10px";
    role.style.fontFamily = "'Fira Code', monospace";
    role.style.textAlign = "center";
    role.style.marginBottom = "10px";
    terminalContent.appendChild(role);

    // Add another divider
    const divider2 = document.createElement("div");
    divider2.style.width = "100%";
    divider2.style.height = "1px";
    divider2.style.backgroundColor = "#555555";
    divider2.style.margin = "8px 0";
    terminalContent.appendChild(divider2);

    // Add command prompt
    const promptContainer = document.createElement("div");
    promptContainer.style.display = "flex";
    promptContainer.style.alignItems = "center";
    promptContainer.style.marginTop = "10px";

    const prompt = document.createElement("span");
    prompt.textContent = "âžœ";
    prompt.style.color = "#87af87";
    prompt.style.marginRight = "8px";
    prompt.style.fontSize = "14px";
    promptContainer.appendChild(prompt);

    const command = document.createElement("span");
    command.textContent = "help";
    command.style.color = "#f8f8f2";
    command.style.fontFamily = "'Fira Code', monospace";
    command.style.fontSize = "14px";
    promptContainer.appendChild(command);

    terminalContent.appendChild(promptContainer);

    // Add command output preview
    const commandOutput = document.createElement("div");
    commandOutput.style.marginTop = "10px";

    // Create a mini help menu
    const helpTitle = document.createElement("div");
    helpTitle.textContent = "ðŸš€ Available Commands";
    helpTitle.style.color = "#ffff00";
    helpTitle.style.fontSize = "12px";
    helpTitle.style.fontWeight = "bold";
    helpTitle.style.marginBottom = "8px";
    commandOutput.appendChild(helpTitle);

    // Add main commands category
    const mainCmdTitle = document.createElement("div");
    mainCmdTitle.textContent = "Main Commands:";
    mainCmdTitle.style.color = "#00ffff";
    mainCmdTitle.style.fontSize = "10px";
    mainCmdTitle.style.marginBottom = "4px";
    commandOutput.appendChild(mainCmdTitle);

    // Add some sample main commands
    const mainCommands = [
      { cmd: "about", desc: "Display professional summary" },
      { cmd: "skills", desc: "View technical expertise" },
      { cmd: "experience", desc: "Show work history" },
    ];

    mainCommands.forEach((item) => {
      const cmdLine = document.createElement("div");
      cmdLine.style.display = "flex";
      cmdLine.style.fontSize = "10px";
      cmdLine.style.marginBottom = "4px";

      const cmdName = document.createElement("span");
      cmdName.textContent = "â€¢ " + item.cmd;
      cmdName.style.color = "#98fb98";
      cmdName.style.width = "80px";
      cmdLine.appendChild(cmdName);

      const cmdDesc = document.createElement("span");
      cmdDesc.textContent = item.desc;
      cmdDesc.style.color = "#ffffff";
      cmdLine.appendChild(cmdDesc);

      commandOutput.appendChild(cmdLine);
    });

    // Add utility commands category
    const utilityCmdTitle = document.createElement("div");
    utilityCmdTitle.textContent = "Utility Commands:";
    utilityCmdTitle.style.color = "#00ffff";
    utilityCmdTitle.style.fontSize = "10px";
    utilityCmdTitle.style.marginTop = "8px";
    utilityCmdTitle.style.marginBottom = "4px";
    commandOutput.appendChild(utilityCmdTitle);

    // Add some sample utility commands
    const utilityCommands = [
      { cmd: "game", desc: "Play a mini-game" },
      { cmd: "matrix", desc: "Start Matrix effect" },
    ];

    utilityCommands.forEach((item) => {
      const cmdLine = document.createElement("div");
      cmdLine.style.display = "flex";
      cmdLine.style.fontSize = "10px";
      cmdLine.style.marginBottom = "4px";

      const cmdName = document.createElement("span");
      cmdName.textContent = "â€¢ " + item.cmd;
      cmdName.style.color = "#98fb98";
      cmdName.style.width = "80px";
      cmdLine.appendChild(cmdName);

      const cmdDesc = document.createElement("span");
      cmdDesc.textContent = item.desc;
      cmdDesc.style.color = "#ffffff";
      cmdLine.appendChild(cmdDesc);

      commandOutput.appendChild(cmdLine);
    });

    terminalContent.appendChild(commandOutput);

    // Add URL at the bottom
    const urlContainer = document.createElement("div");
    urlContainer.style.position = "absolute";
    urlContainer.style.bottom = "10px";
    urlContainer.style.left = "0";
    urlContainer.style.width = "100%";
    urlContainer.style.textAlign = "center";

    const url = document.createElement("div");
    url.textContent = "hemantkumar822.github.io";
    url.style.color = "#87cefa";
    url.style.fontSize = "12px";
    url.style.fontFamily = "'Fira Code', monospace";
    urlContainer.appendChild(url);

    terminalContent.appendChild(urlContainer);

    // Add screenshot instructions
    const instructions = document.createElement("div");
    instructions.innerHTML = "";
    instructions.style.position = "absolute";
    instructions.style.bottom = "10px";
    instructions.style.right = "10px";
    instructions.style.color = "#ffffff";
    instructions.style.opacity = "0.7";
    instructions.style.fontSize = "10px";
    instructions.style.zIndex = "3";
    coverContainer.appendChild(instructions);

    // Append the cover to the output
    outputElement.appendChild(coverContainer);

    // Scroll to make sure the cover is visible
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  // â”€â”€â”€ Utility helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  scrollToBottom(container) {
    if (container) container.scrollTop = container.scrollHeight;
  }

  wrapWithColor(text, color) {
    return `<span style="color:${color}">${text}</span>`;
  }

  printToOutput(outputElement, content, type = "") {
    const line = document.createElement("div");
    line.className = `output-line ${type}`;
    if (type === "error") line.style.color = "#ff5555";
    else if (type === "info") line.style.color = "#8be9fd";
    else if (type === "success") line.style.color = "#50fa7b";
    line.innerHTML = content;
    outputElement.appendChild(line);
    this.scrollToBottom(outputElement.closest(".terminal-content"));
  }

  getOutputElement() {
    const content = this.terminals[this.activeTerminal]?.input?.closest(".terminal-content");
    return content ? content.querySelector("[id^='output']") || content.querySelector(".output") : null;
  }

  // â”€â”€â”€ Initialisation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  init() {
    const outputEl = document.getElementById("output");
    if (!outputEl) return;

    const banner = `<pre style="color:#d4843e;font-size:11px;line-height:1.1;margin:0">
â–ˆâ–ˆâ•—  â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ•—   â–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ•—   â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—
â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â•â•â•â–ˆâ–ˆâ–ˆâ–ˆâ•— â–ˆâ–ˆâ–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•—â–ˆâ–ˆâ–ˆâ–ˆâ•—  â–ˆâ–ˆâ•‘â•šâ•â•â–ˆâ–ˆâ•”â•â•â•
â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—  â–ˆâ–ˆâ•”â–ˆâ–ˆâ–ˆâ–ˆâ•”â–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â–ˆâ–ˆâ•— â–ˆâ–ˆâ•‘   â–ˆâ–ˆâ•‘
â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â•  â–ˆâ–ˆâ•‘â•šâ–ˆâ–ˆâ•”â•â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•”â•â•â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘â•šâ–ˆâ–ˆâ•—â–ˆâ–ˆâ•‘   â–ˆâ–ˆâ•‘
â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ•—â–ˆâ–ˆâ•‘ â•šâ•â• â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘  â–ˆâ–ˆâ•‘â–ˆâ–ˆâ•‘ â•šâ–ˆâ–ˆâ–ˆâ–ˆâ•‘   â–ˆâ–ˆâ•‘
â•šâ•â•  â•šâ•â•â•šâ•â•â•â•â•â•â•â•šâ•â•     â•šâ•â•â•šâ•â•  â•šâ•â•â•šâ•â•  â•šâ•â•â•â•   â•šâ•â•</pre>`;
    this.printToOutput(outputEl, banner);
    this.printToOutput(outputEl, `<span style="color:#8be9fd">  AI Developer â€¢ Full-Stack â€¢ Builder</span>`);
    this.printToOutput(outputEl, `<span style="color:#6272a4">  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`);
    this.printToOutput(outputEl, `<span style="color:#f8f8f2">  Welcome! Type </span><span style="color:#50fa7b">help</span><span style="color:#f8f8f2"> to see available commands.</span>`);
    this.printToOutput(outputEl, "");
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    const terminal = document.querySelector(".terminal");
    if (terminal) {
      terminal.className = `terminal theme-${theme}`;
    }
  }

  // â”€â”€â”€ Event listeners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  setupEventListeners() {
    // Keyboard input on main input
    if (this.input) {
      this.input.addEventListener("keydown", (e) => this.handleKeyDown(e, 0));
    }

    // Theme toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => {
        if (this.themeModal) this.showModal(this.themeModal);
      });
    }

    // Theme modal options
    document.querySelectorAll(".theme-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.handleThemeChange(btn.dataset.theme || btn.textContent.toLowerCase().trim());
      });
    });

    // Close modals on backdrop click
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.closeModal(overlay);
      });
    });

    // Close modal buttons
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        if (modal) this.closeModal(modal);
      });
    });

    // Context menu
    document.addEventListener("contextmenu", (e) => {
      if (this.terminal && this.terminal.contains(e.target)) {
        e.preventDefault();
        if (this.contextMenu) {
          this.contextMenu.style.left = e.pageX + "px";
          this.contextMenu.style.top = e.pageY + "px";
          this.contextMenu.classList.add("active");
        }
      }
    });

    document.addEventListener("click", () => {
      if (this.contextMenu) this.contextMenu.classList.remove("active");
    });

    // Focus input when clicking terminal
    if (this.terminal) {
      this.terminal.addEventListener("click", () => {
        const active = this.terminals[this.activeTerminal];
        if (active) active.input.focus();
      });
    }
  }

  handleKeyDown(e, terminalIndex) {
    const termData = this.terminals[terminalIndex];
    if (!termData) return;

    if (e.key === "Enter") {
      const cmd = termData.input.value.trim();
      if (cmd) {
        termData.history.unshift(cmd);
        termData.historyIndex = -1;
        const outputEl = termData.input.closest(".terminal-content")?.querySelector("[id^='output']")
          || termData.input.closest(".terminal-content")?.querySelector(".output");
        if (outputEl) {
          this.printToOutput(outputEl, `<span style="color:#87af87">âžœ</span>  <span style="color:#f8f8f2">${this.escapeHtml(cmd)}</span>`);
          this.processCommand(cmd.toLowerCase(), outputEl);
        }
      }
      termData.input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (termData.historyIndex < termData.history.length - 1) {
        termData.historyIndex++;
        termData.input.value = termData.history[termData.historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (termData.historyIndex > 0) {
        termData.historyIndex--;
        termData.input.value = termData.history[termData.historyIndex];
      } else {
        termData.historyIndex = -1;
        termData.input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = ["about","experience","education","skills","contact","help","clear","game","matrix","stop-matrix","weather","calc","linkedin-cover","theme","projects","split"];
      const partial = termData.input.value.toLowerCase();
      const match = commands.find((c) => c.startsWith(partial));
      if (match) termData.input.value = match;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // â”€â”€â”€ Command processor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  processCommand(cmd, outputEl) {
    const parts = cmd.split(" ");
    const base = parts[0];
    const args = parts.slice(1).join(" ");

    switch (base) {
      case "about":        this.showAbout(outputEl); break;
      case "experience":   this.showExperience(outputEl); break;
      case "education":    this.showEducation(outputEl); break;
      case "skills":       this.showSkills(outputEl); break;
      case "contact":      this.showContact(outputEl); break;
      case "projects":     this.showProjects(); break;
      case "clear":        this.clearTerminal(outputEl); break;
      case "game":         this.initGame(); break;
      case "matrix":       this.startMatrixEffect(outputEl); break;
      case "stop-matrix":  this.stopMatrixEffect(); break;
      case "weather":      this.showWeather(args, outputEl); break;
      case "calc":         this.calculate(args, outputEl); break;
      case "linkedin-cover": this.generateLinkedInCover(outputEl); break;
      case "theme":        if (this.themeModal) this.showModal(this.themeModal); break;
      case "split":        this.splitTerminal(); break;
      case "help":         this.showHelp(outputEl); break;
      default:
        this.printToOutput(outputEl,
          `Command not found: <span style="color:#ff5555">${this.escapeHtml(base)}</span>. Type <span style="color:#50fa7b">help</span> for available commands.`,
          "error");
    }
  }

  clearTerminal(outputEl) {
    if (outputEl) outputEl.innerHTML = "";
  }

  splitTerminal() {
    const container = document.querySelector(".terminal-container");
    if (!container) return;
    const newContent = document.createElement("div");
    newContent.className = "terminal-content";
    const newOutput = document.createElement("div");
    newOutput.id = `output-${Date.now()}`;
    newOutput.className = "output";
    newContent.appendChild(newOutput);

    const inputRow = document.createElement("div");
    inputRow.className = "input-line";
    inputRow.innerHTML = `<span class="prompt">âžœ </span>`;
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.className = "command-input";
    newInput.setAttribute("autocomplete","off");
    newInput.setAttribute("spellcheck","false");
    inputRow.appendChild(newInput);
    newContent.appendChild(inputRow);
    container.appendChild(newContent);

    const newIndex = this.terminals.length;
    this.terminals.push({ input: newInput, history: [], historyIndex: -1 });
    newInput.addEventListener("keydown", (e) => this.handleKeyDown(e, newIndex));
    newInput.focus();
    this.activeTerminal = newIndex;

    const closeBtn = document.createElement("button");
    closeBtn.className = "split-close-btn";
    closeBtn.textContent = "âœ•";
    closeBtn.addEventListener("click", () => this.closeSplit(newContent));
    newContent.prepend(closeBtn);
  }

  // â”€â”€â”€ Help â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  showHelp(outputEl) {
    const lines = [
      `<span style="color:#ffff00;font-weight:bold">ðŸš€ Available Commands</span>`,
      "",
      `<span style="color:#00ffff">â”€â”€ Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`,
      `  <span style="color:#50fa7b">about</span>          Professional summary`,
      `  <span style="color:#50fa7b">experience</span>     Work & community history`,
      `  <span style="color:#50fa7b">education</span>      Academic background`,
      `  <span style="color:#50fa7b">skills</span>         Technical skills`,
      `  <span style="color:#50fa7b">contact</span>        Get in touch`,
      "",
      `<span style="color:#00ffff">â”€â”€ Tools â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`,
      `  <span style="color:#50fa7b">weather [city]</span>  Live weather`,
      `  <span style="color:#50fa7b">calc [expr]</span>     Calculator`,
      `  <span style="color:#50fa7b">matrix</span>          Matrix rain effect`,
      `  <span style="color:#50fa7b">stop-matrix</span>     Stop matrix`,
      `  <span style="color:#50fa7b">game</span>            Snake game`,
      `  <span style="color:#50fa7b">linkedin-cover</span>  Generate LinkedIn cover`,
      `  <span style="color:#50fa7b">theme</span>           Change terminal theme`,
      `  <span style="color:#50fa7b">split</span>           Split terminal`,
      `  <span style="color:#50fa7b">clear</span>           Clear screen`,
      "",
    ];
    lines.forEach((l) => this.printToOutput(outputEl, l));
  }

  // â”€â”€â”€ Content commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  showAbout(outputEl) {
    const lines = [
      `<span style="color:#ffff00;font-weight:bold">â”€â”€ About Me â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`,
      "",
      `  <span style="color:#8be9fd">Name     </span>  Hemant Kumar`,
      `  <span style="color:#8be9fd">Role     </span>  AI & Software Developer`,
      `  <span style="color:#8be9fd">Location </span>  Jaipur, Rajasthan, India`,
      `  <span style="color:#8be9fd">University</span> JECRC University`,
      `  <span style="color:#8be9fd">Degree   </span>  B.Tech CSE (AI & Data Science), 2025â€“2029`,
      "",
      `  I'm a developer passionate about machine learning,`,
      `  full-stack development, and building real-world software.`,
      `  I love turning ideas into products and exploring what's`,
      `  possible at the intersection of AI and software engineering.`,
      "",
      `  Leading the AI/ML community at JECRC and collaborating`,
      `  on impactful tech projects like EWTCS.`,
      "",
    ];
    lines.forEach((l) => this.printToOutput(outputEl, l));
  }

  showExperience(outputEl) {
    const lines = [
      `<span style="color:#ffff00;font-weight:bold">â”€â”€ Experience â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`,
      "",
      `  <span style="color:#50fa7b;font-weight:bold">JECRC AI/ML Community</span>`,
      `  <span style="color:#8be9fd">Role      </span>  Community Lead`,
      `  <span style="color:#8be9fd">Period    </span>  2025 â€“ Present`,
      `  <span style="color:#8be9fd">Location  </span>  Jaipur, India`,
      `    â€¢ Organising workshops, seminars & hackathons on AI/ML`,
      `    â€¢ Mentoring peers in machine learning concepts`,
      `    â€¢ Building a collaborative learning community at JECRC`,
      "",
      `  <span style="color:#50fa7b;font-weight:bold">EWTCS â€“ Hospital Management System</span>`,
      `  <span style="color:#8be9fd">Role      </span>  Collaborator (College Project)`,
      `  <span style="color:#8be9fd">Period    </span>  2025 â€“ Present`,
      `  <span style="color:#8be9fd">Tech      </span>  Full-stack web, Java, MySQL`,
      `    â€¢ Collaborated on a hospital & medical college management system`,
      `    â€¢ Contributed to core modules and system architecture`,
      "",
    ];
    lines.forEach((l) => this.printToOutput(outputEl, l));
  }

  showEducation(outputEl) {
    const lines = [
      `<span style="color:#ffff00;font-weight:bold">â”€â”€ Education â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`,
      "",
      `  <span style="color:#50fa7b;font-weight:bold">JECRC University, Jaipur</span>`,
      `  <span style="color:#8be9fd">Degree  </span>  B.Tech â€“ CSE (AI & Data Science)`,
      `  <span style="color:#8be9fd">Period  </span>  2025 â€“ 2029`,
      `  <span style="color:#8be9fd">Stream  </span>  Artificial Intelligence & Data Science`,
      `    â€¢ Specialising in machine learning, deep learning & data science`,
      `    â€¢ Active in the AI/ML Community as a lead`,
      "",
    ];
    lines.forEach((l) => this.printToOutput(outputEl, l));
  }

  showSkills(outputEl) {
    const lines = [
      `<span style="color:#ffff00;font-weight:bold">â”€â”€ Skills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`,
      "",
      `  <span style="color:#00ffff">AI / ML</span>`,
      `    Python  TensorFlow  PyTorch  scikit-learn  NumPy  Pandas`,
      "",
      `  <span style="color:#00ffff">Frontend</span>`,
      `    React.js  HTML5  CSS3  JavaScript  TypeScript  Bootstrap`,
      "",
      `  <span style="color:#00ffff">Backend</span>`,
      `    Node.js  Express  REST APIs  Java`,
      "",
      `  <span style="color:#00ffff">Databases</span>`,
      `    MongoDB  MySQL  PostgreSQL`,
      "",
      `  <span style="color:#00ffff">Cloud & DevOps</span>`,
      `    Google Cloud  Docker  Git  GitHub`,
      "",
    ];
    lines.forEach((l) => this.printToOutput(outputEl, l));
  }

  showContact(outputEl) {
    const lines = [
      `<span style="color:#ffff00;font-weight:bold">â”€â”€ Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€</span>`,
      "",
      `  <span style="color:#8be9fd">Email    </span>  <span style="color:#50fa7b">hk998035@gmail.com</span>`,
      `  <span style="color:#8be9fd">GitHub   </span>  <span style="color:#50fa7b">github.com/HemantKumar822</span>`,
      `  <span style="color:#8be9fd">LinkedIn </span>  <span style="color:#50fa7b">linkedin.com/in/hemant-kumar-b8a1243b1</span>`,
      `  <span style="color:#8be9fd">Instagram</span>  <span style="color:#50fa7b">instagram.com/hemant.curious</span>`,
      "",
      `  Feel free to reach out â€“ I'm always open to`,
      `  collaborations, projects, and opportunities!`,
      "",
    ];
    lines.forEach((l) => this.printToOutput(outputEl, l));
  }
}

// Initialize the terminal
new TerminalResume();

