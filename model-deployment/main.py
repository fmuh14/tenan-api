from flask import Flask, jsonify, request
import predict_hotel
import predict_wisata

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return "API is running!"

@app.route('/api/hello', methods=['GET'])
def hello():
    response = {'message': 'Hello, World!'}
    return jsonify(response)

@app.route('/api/predictHotel', methods=['POST'])
def predictHotel():
    longitude = float(request.form["longtitude"])  # replace with your longitude
    latitude = float(request.form["latitude"]) # replace with your latitude

    
    predict_result = predict_hotel.predict_rating(longitude,latitude)
    response = {
        'data': predict_result
        }
    return jsonify(response)

@app.route('/api/predictTourism', methods=['POST'])
def predictTourism():
   city = request.form.get(["nama_daerah"])

   predict_result = predict_wisata.recommend_places(city, top_n=5)
   response = {
       'data' : predict_result
   }
   return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)