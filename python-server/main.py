import random as rd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import time

# Function to generate price based on fluctuation
def generate_price(price, neg_fluctuation_range, pos_fluctuation_range):
    fluctuation = rd.uniform(neg_fluctuation_range, pos_fluctuation_range)
    generated_price = price * (1 + fluctuation)  # Apply fluctuation
    return generated_price

# Main simulation function
def simulate(price, mode):
    fluctuation = []
    
    if mode == 1:  # High Positive Value Change (-1% | 2%)
        fluctuation.append(-0.01)
        fluctuation.append(0.02)
    elif mode == 2:  # Neutral Value Change (-2% | 2%)
        fluctuation.append(-0.02)
        fluctuation.append(0.02)
    elif mode == 3:  # High Negative Value change (-2% | 1%)
        fluctuation.append(-0.02)
        fluctuation.append(0.01)

    prices = [price]

    # Function to update the plot every interval
    def update(frame):
        nonlocal price
        price = generate_price(price, fluctuation[0], fluctuation[1])  # Update price
        prices.append(price)  # Add new price to the list

        ax.clear()  # Clear the previous plot
        ax.plot(prices)  # Plot updated prices
        ax.set_title(f"Price Changes Over Time (Mode {mode})")
        ax.set_xlabel('Iterations')
        ax.set_ylabel('Price')
        ax.grid(True)

    # Set up the plot
    fig, ax = plt.subplots()
    ani = FuncAnimation(fig, update, interval=500)  # Update every 100ms (1 second)
    
    plt.show()

# Start simulation with an initial price and mode
simulate(1.0005, 2)