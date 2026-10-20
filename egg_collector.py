
import tkinter as tk
import random
import math
import time

# Egg collection automation prototype.
# Uses simulated eggs, not live Roblox game objects.

WIDTH, HEIGHT = 700, 450
PLAYER_SPEED = 180       # Simulated units per second
PICKUP_DISTANCE = 15
SPAWN_INTERVAL = 1.5

EGG_TYPES = [
    ("Common", 10),
    ("Rare", 30),
    ("Epic", 60),
    ("Legendary", 100),
]

class EggCollector:
    def __init__(self, root):
        self.root = root
        self.root.title("Egg Collector - Test Simulator")

        self.canvas = tk.Canvas(
            root, width=WIDTH, height=HEIGHT,
            bg="#20252b", highlightthickness=0
        )
        self.canvas.pack(padx=10, pady=10)

        self.enabled = False
        self.eggs = []
        self.score = 0
        self.target = None
        self.last_tick = time.monotonic()

        self.player_x = WIDTH / 2
        self.player_y = HEIGHT / 2

        controls = tk.Frame(root)
        controls.pack(fill="x", padx=10)

        self.toggle_button = tk.Button(
            controls, text="Turn ON",
            command=self.toggle
        )
        self.toggle_button.pack(side="left")

        self.status = tk.Label(
            controls, text="OFF | Waiting",
            anchor="w"
        )
        self.status.pack(side="left", padx=12)

        self.spawn_egg()
        self.draw()
        self.tick()

    def toggle(self):
        self.enabled = not self.enabled
        self.toggle_button.config(
            text="Turn OFF" if self.enabled else "Turn ON"
        )

    def spawn_egg(self):
        kind, value = random.choice(EGG_TYPES)
        egg = {
            "x": random.randint(25, WIDTH - 25),
            "y": random.randint(25, HEIGHT - 25),
            "kind": kind,
            "value": value,
            "id": time.monotonic_ns(),
        }
        self.eggs.append(egg)

    def choose_target(self):
        if not self.eggs:
            self.target = None
            return

        # Favor valuable eggs while considering travel distance.
        def cost(egg):
            distance = math.hypot(
                egg["x"] - self.player_x,
                egg["y"] - self.player_y
            )
            return distance / max(egg["value"], 1)

        self.target = min(self.eggs, key=cost)

    def move_player(self, dt):
        if not self.target:
            return

        dx = self.target["x"] - self.player_x
        dy = self.target["y"] - self.player_y
        distance = math.hypot(dx, dy)

        if distance <= PICKUP_DISTANCE:
            self.eggs.remove(self.target)
            self.score += self.target["value"]
            self.target = None
            return

        step = min(PLAYER_SPEED * dt, distance)
        self.player_x += dx / distance * step
        self.player_y += dy / distance * step

    def tick(self):
        now = time.monotonic()
        dt = min(now - self.last_tick, 0.05)
        self.last_tick = now

        # Periodically create simulated eggs.
        if random.random() < dt / SPAWN_INTERVAL:
            self.spawn_egg()

        if self.enabled:
            self.choose_target()
            self.move_player(dt)

        self.draw()
        self.root.after(16, self.tick)

    def draw(self):
        self.canvas.delete("all")

        # Draw eggs.
        for egg in self.eggs:
            color = {
                "Common": "#aaaaaa",
                "Rare": "#45a9ff",
                "Epic": "#bb70ff",
                "Legendary": "#ffd34d",
            }[egg["kind"]]

            self.canvas.create_oval(
                egg["x"] - 9, egg["y"] - 9,
                egg["x"] + 9, egg["y"] + 9,
                fill=color, outline="white"
            )

        # Highlight the selected target.
        if self.target in self.eggs:
            self.canvas.create_oval(
                self.target["x"] - 14,
                self.target["y"] - 14,
                self.target["x"] + 14,
                self.target["y"] + 14,
                outline="#45ff91", width=2
            )

        # Draw the player.
        self.canvas.create_oval(
            self.player_x - 10, self.player_y - 10,
            self.player_x + 10, self.player_y + 10,
            fill="#ff6655", outline="white"
        )

        target_name = (
            self.target["kind"] if self.target else "None"
        )
        state = "ON" if self.enabled else "OFF"

        self.status.config(
            text=f"{state} | Target: {target_name} | "
                 f"Eggs: {len(self.eggs)} | Score: {self.score}"
        )

if __name__ == "__main__":
    root = tk.Tk()
    app = EggCollector(root)
    root.mainloop()