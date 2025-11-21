import "./style.css";

interface Item {
  name: string;
  baseCost: number;
  rate: number;
  owned: number;
  cost: number;
  description?: string;
  buttonEl?: HTMLButtonElement;
}

const availableItems: Item[] = [
  {
    name: "Pie Tin Converter",
    baseCost: 50,
    rate: 1,
    owned: 0,
    cost: 50,
    description:
      "Make frisbees the old fashioned way. Pie tin and some elbow grease.",
  },
  {
    name: "Artisan Frisbee Store",
    baseCost: 150,
    rate: 3,
    owned: 0,
    cost: 150,
    description: "A small boutique store selling hand-crafted frisbees.",
  },
  {
    name: "Ultimate Frisbee Team",
    baseCost: 300,
    rate: 5,
    owned: 0,
    cost: 300,
    description:
      "A local ultimate frisbee team that donates a portion of their earnings to frisbee production.",
  },
  {
    name: "Disc Golf Factory",
    baseCost: 1000,
    rate: 10,
    owned: 0,
    cost: 1000,
    description: "A factory supplying the booming disc golf industry.",
  },
  {
    name: "Ultimate Tournament",
    baseCost: 5000,
    rate: 50,
    owned: 0,
    cost: 5000,
    description:
      "Host an epic Ultimate Frisbee Tournament for all of your teams.",
  },
];

class ClickerGame {
  private clicks = 0;

  private counterEl!: HTMLDivElement;
  private clickButtonEl!: HTMLButtonElement;
  private autoClickerButtonEl!: HTMLButtonElement;
  private frisbeeShopButtonEl!: HTMLButtonElement;
  private ultimateTeamButtonEl!: HTMLButtonElement;

  constructor() {
    this.setupDOM();
    this.setupStyles();
    this.attachEventListeners();
    this.updateDisplay();

    // Auto-clicker loop
    setInterval(() => {
      availableItems.forEach((item) => {
        this.clicks += item.owned * item.rate;
      }), this.updateDisplay();
    }, 1000);

    setInterval(() => {
      this.updateDisplay();
    }, 200);
  }

  private setupDOM(): void {
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.backgroundColor = "#95d5e6ff";
    document.body.style.fontFamily = "Arial, sans-serif";

    const buttonRow = document.createElement("div");
    buttonRow.style.display = "flex";
    buttonRow.style.flexDirection = "row";
    buttonRow.style.justifyContent = "center";
    buttonRow.style.marginTop = "20px";

    this.counterEl = document.createElement("div");
    this.counterEl.style.fontSize = "36px";
    this.counterEl.style.margin = "20px";

    this.clickButtonEl = document.createElement("button");
    this.clickButtonEl.id = "clickButton";
    this.clickButtonEl.style.width = "200px";
    this.clickButtonEl.style.height = "200px";
    this.clickButtonEl.style.borderRadius = "50%";
    this.clickButtonEl.style.backgroundColor = "red";
    this.clickButtonEl.style.color = "white";
    this.clickButtonEl.style.fontSize = "24px";
    this.clickButtonEl.style.border = "none";
    this.clickButtonEl.style.cursor = "pointer";
    this.clickButtonEl.style.transition = "transform 0.1s";
    this.clickButtonEl.textContent = "Make Frisbee 🥏!";

    availableItems.forEach((item) => {
      const btn = document.createElement("button");
      btn.style.width = "150px";
      btn.style.height = "100px";
      btn.style.margin = "10px";
      btn.style.fontSize = "18px";
      btn.style.border = "none";
      btn.style.borderRadius = "4px";
      btn.style.backgroundColor = "#333";
      btn.style.color = "white";
      btn.style.cursor = "pointer";
      btn.title = item.description ?? "";
      item.buttonEl = btn; // Store reference for later use
      buttonRow.appendChild(btn);
    });

    document.body.prepend(
      this.counterEl,
      this.clickButtonEl,
    );
    document.body.appendChild(buttonRow);
  }

  private setupStyles(): void {
    // Add active-state animation via <style>
    const style = document.createElement("style");
    style.textContent = `
      #clickButton:active {
        transform: scale(0.95);
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  private clickTimestamps: number[] = [];

  private attachEventListeners(): void {
    this.clickButtonEl.addEventListener("click", () => {
      this.clicks++;
      this.clickTimestamps.push(Date.now());
      this.updateDisplay();
    });

    availableItems.forEach((item) => {
      if (item.buttonEl) {
        item.buttonEl.addEventListener("click", () => {
          if (this.clicks >= item.cost) {
            this.clicks -= item.cost;
            item.owned++;
            item.cost = Math.floor(item.baseCost * 1.15 ** item.owned);
            this.updateDisplay();
          }
        });
      }
    });
  }

  private getCPS(): number {
    const now = Date.now();
    this.clickTimestamps = this.clickTimestamps.filter((ts) => now - ts < 1000);
    let cps = this.clickTimestamps.length;
    availableItems.forEach((item) => {
      cps += item.owned * item.rate;
    });
    return cps;
  }

  private updateDisplay(): void {
    // Update main counter and CPS display as usual
    this.counterEl.textContent = `Frisbees: ${this.clicks}`;
    this.clickButtonEl.textContent = `(${this.getCPS()} 🥏PS)`;

    // Loop through availableItems to update each button
    availableItems.forEach((item) => {
      if (item.buttonEl) {
        item.buttonEl.textContent =
          `${item.name} (${item.cost})\nOwned: ${item.owned}`;
        item.buttonEl.disabled = this.clicks < item.cost;
      }
    });
  }
}

// Bootstrap the game when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new ClickerGame());
} else {
  new ClickerGame();
}
