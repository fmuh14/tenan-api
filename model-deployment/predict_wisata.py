import numpy as np # untuk operasi numerik dan komputasi array multidimensi secara efisien.
import pandas as pd # untuk manipulasi dan analisis data 
import pickle # # untuk serialisasi dan deserialisasi objek Python.
import tensorflow as tf # untuk machine learning dan neural network.

loadedModel = pd.read_hdf('wisata_model_baru.h5', 'df')
with open('scaler_wisata.pkl', 'rb') as f:
    loaded_scaler = pickle.load(f)
data_model = pd.read_csv('destinasi_wisata_baru.csv')

# Select relevant features for dataframe
# data_model = loadedModel[['Place_Name','City', 'Price','Rating', 'Category']]  # create a copy to avoid SettingWithCopyWarning

# Handle duplicates and missing data
data_model.drop_duplicates(inplace=True)
data_model.dropna(inplace=True)

# Function for recommendation based on city and budget
def recommend_places_2(city, budget, top_n=5): #top_n = wisata
    # Filter the data based on the input city and budget
    harga = data_model['Price'] * top_n
    recommendations = data_model[(data_model['City'].str.contains(city, case=False, na=False)) & (harga <= budget)]

    # Calculate the absolute difference between the budget and the price, then sort the data based on this difference
    recommendations['abs_diff'] = abs(recommendations['Price'] - budget)
    recommendations.sort_values(by='abs_diff', ascending=True, inplace=True)

    # Return the top_n results
    return recommendations.head(top_n)
