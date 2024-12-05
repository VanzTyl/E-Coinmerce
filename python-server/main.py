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
def insert_or_update_price_to_mongo(coin_id, coin_name, coin_symbol, price, timestamp, db_name="E-Coinmerce", collection_name="coins"):
    # Connect to MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client[db_name]
    collection = db[collection_name]
    
    # Define the update operation
    update_data = {
        "$setOnInsert": {  # These fields will only be set on first insert
            "coin_name": coin_name,
            "coin_symbol": coin_symbol
        },
        "$push": {  # Push new price and timestamp to the 'prices' array
            "prices": {"price": price, "timestamp": timestamp}
        }
    }

    # Find the coin by coin_id and update it
    result = collection.update_one(
        {"coin_id": coin_id},  # Filter to find the coin
        update_data,  # Update data
        upsert=True  # If the document doesn't exist, create it
    )

coin_symbols = [
    "COF", "BTN", "ALC", "BLO", "CHX", "TKX", "CPT", "ETHR", "NNC", "BYC",
    "MTC", "NBX", "VTC", "SLX", "DBY", "BLY", "ZTC", "CRA", "CNUM", "PCT",
    "FXC", "OBX", "VBX", "LNX", "CHP", "HXC", "VTCN", "CRX", "ZNB", "ETHN"
]

# Function to continuously update prices in MongoDB
def continuously_update_prices(coin_names, mode=2, update_interval=1000, total_updates=float('inf')):
    # Initialize coins and their prices
    all_prices = {}

    for i, (coin_name, coin_symbol) in enumerate(zip(coin_names, coin_symbols), 1):
        # Generate coin_id and use the corresponding symbol
        coin_id = f"C{i}"
        random_initial_price = rd.uniform(0.0001, 1.0001)
        fluctuation, prices = simulate_coin_prices(random_initial_price, mode)
        all_prices[coin_name] = {
            "coin_id": coin_id,
            "coin_symbol": coin_symbol,  # Using the new symbol instead of coin_id
            "fluctuation": fluctuation,
            "prices": prices
        }
    
    updates_count = 0
    while updates_count < total_updates:
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        for coin_name, data in all_prices.items():
            price = generate_price(data["prices"][-1]["price"], data["fluctuation"][0], data["fluctuation"][1])
            data["prices"].append({"price": price, "timestamp": current_time})
            
            # Insert or update with all fields
            insert_or_update_price_to_mongo(
                data["coin_id"],
                coin_name,
                data["coin_symbol"],
                price,
                current_time
            )

        print(f"Set #{updates_count + 1}: Done")
        time.sleep(update_interval)
        updates_count += 1

# List of coin names
coin_names = [
    "Coinify", "Bitron", "AltCoin", "Blocko", "Chainix", "Tokenix", "Cryptra", "Etheron", "NanoCoin", "ByteCoin",
    "MetaCrypt", "NeoBit", "VoltCoin", "StellarX", "DashByte", "Blockify", "ZetaCoin", "Cryptara", "Coinium", "PayCrypt",
    "FluxCoin", "OrbitX", "VortexBit", "LunaX", "ChainPay", "HexaCoin", "VirtuCoin", "Cryptex", "ZenBit", "EtherNova"
]

# Run the simulation to continuously update the prices
continuously_update_prices(coin_names, mode=2, update_interval=1, total_updates=float('inf'))