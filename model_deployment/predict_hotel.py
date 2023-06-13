import numpy as np # untuk operasi numerik dan komputasi array multidimensi secara efisien.
import pandas as pd # untuk manipulasi dan analisis data 
import pickle # # untuk serialisasi dan deserialisasi objek Python.
import tensorflow as tf # untuk machine learning dan neural network.

loaded_model = tf.keras.models.load_model('data_hotel.h5')
with open('scaler.pkl', 'rb') as f:
    loaded_scaler = pickle.load(f)
data_model = pd.read_csv('processed_data_hotel.csv')

def predict_rating(longitude, latitude):
    # Melakukan penskalaan terhadap longitude dan latitude menggunakan skalar yang telah dimuat sebelumnya.
    scaled_location = loaded_scaler.transform(np.array([longitude, latitude]).reshape(1, -1))

    # Memprediksi rating menggunakan model yang telah dimuat sebelumnya 
    predicted_rating = loaded_model.predict(scaled_location)

    # Mengonversi hasil prediksi rating dari format kategorikal ke rating asli dengan mengambil argumen terbesar dari hasil prediksi dan menambahkan 1.
    predicted_rating = np.argmax(predicted_rating, axis=-1) + 1

    # Mencari tempat terdekat dengan menghitung jarak Euclidean Kemudian, mencari tempat dengan jarak terdekat menggunakan indeks dengan nilai jarak terkecil (idxmin) dan mengambil beberapa informasi terkait tempat tersebut.
    data_model['dist'] = np.sqrt((data_model['longitude'] - longitude)**2 + (data_model['latitude'] - latitude)**2)
    nearest_place = data_model.loc[data_model['dist'].nsmallest(10).index, ['city', 'name', 'displayName', 'region', 'longitude', 'latitude', 'userRating']]

    predict_result = nearest_place["displayName"].tolist()

    return predict_result
