'''import random as rd
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

# Start simulation with an initial price and mode
simulate(1.0005, 2) '''

import random as rd
import pymongo
from pymongo import MongoClient
import time
from datetime import datetime

# Function to generate price based on fluctuation
def generate_price(price, neg_fluctuation_range, pos_fluctuation_range):
    fluctuation = rd.uniform(neg_fluctuation_range, pos_fluctuation_range)
    generated_price = price * (1 + fluctuation)  # Apply fluctuation
    return generated_price

# Main simulation function to generate price for each coin
def simulate_coin_prices(initial_price, mode):
    fluctuation = []
    
    # Define fluctuation ranges based on the mode
    if mode == 1:  # High Positive Value Change (-1% | 2%)
        fluctuation.append(-0.01)
        fluctuation.append(0.02)
    elif mode == 2:  # Neutral Value Change (-2% | 2%)
        fluctuation.append(-0.02)
        fluctuation.append(0.02)
    elif mode == 3:  # High Negative Value change (-2% | 1%)
        fluctuation.append(-0.02)
        fluctuation.append(0.01)

    # Start with the initial price
    prices = [{"price": initial_price, "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')}]
    
    return fluctuation, prices

# Function to insert or update the coin prices in MongoDB
def insert_or_update_price_to_mongo(coin_id, price, timestamp, db_name="local", collection_name="coins"):
    # Connect to MongoDB (make sure MongoDB is running locally or update with your remote URI)
    client = MongoClient("mongodb://localhost:27017/")
    
    # Access the database
    db = client[db_name]
    
    # Access the collection
    collection = db[collection_name]
    
    # Define the update operation
    update_data = {
        "$push": {  # Push new price and timestamp to the 'prices' array
            "prices": {"price": price, "timestamp": timestamp}
        }
    }

    # Find the coin by coin_id and update it
    result = collection.update_one(
        {"coin_id": coin_id},  # Filter to find the coin
        update_data,  # Push new price data
        upsert=True  # If the document doesn't exist, create it
    )

# Function to continuously update prices in MongoDB
def continuously_update_prices(num_coins=30, initial_price=1.0005, mode=2, update_interval=1, total_updates=30):
    # Initialize coins and their prices
    all_prices = {}

    for i in range(1, num_coins + 1):
        coin_id = f"Coin_{i}"  # Coin ID
        fluctuation, prices = simulate_coin_prices(initial_price, mode)
        all_prices[coin_id] = {"fluctuation": fluctuation, "prices": prices}
    
    # Track how many updates we've made
    updates_count = 0
    
    while updates_count < total_updates:
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Get current timestamp

        for coin_id, data in all_prices.items():
            # Get the current price for the coin
            price = generate_price(data["prices"][-1]["price"], data["fluctuation"][0], data["fluctuation"][1])
            
            # Add the new price to the coin's list of prices
            data["prices"].append({"price": price, "timestamp": current_time})
            
            # Insert or update the new price in MongoDB
            insert_or_update_price_to_mongo(coin_id, price, current_time)

        # Wait for the next update (1 second)
        print(f"Set #{updates_count + 1}: Done")
        time.sleep(update_interval)
        
        # Increase the updates count
        updates_count += 1

# Run the simulation to continuously update the prices
continuously_update_prices(num_coins=30, initial_price=1.0005, mode=2, update_interval=1, total_updates=(float('inf')))