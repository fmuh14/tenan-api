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

# Function for recommendation based on city
def recommend_places(city, top_n=5): #top_n = wisata
    # Filter the data based on the input city 
    recommendations = data_model[(data_model['City'].str.contains(city, case=False, na=False))]
    recommendations.sort_values(by='Rating', ascending=True, inplace=True)

    predict_data = recommendations.head(top_n)

    result = predict_data["Place_Id"].tolist()
    # Return the top_n results
    return result
