from flask import Flask, render_template, request, redirect, url_for
import requests
import json

app = Flask(__name__)

# Placeholder for storing user data in memory (use a database in production)
users = {}

# Simulated API sources (replace with actual APIs or scraping in production)
DATA_SOURCES = [
    "https://www.fooddatascrape.com/blinkit-grocery-data-scraping-api.php",
    "https://www.fooddatascrape.com/zepto-grocery-data-scraping-api.php",
    "https://www.fooddatascrape.com/kfc-food-data-api.php"
]

@app.route('/')
def index():
    return render_template('register.html')

@app.route('/register', methods=['POST'])
def register():
    user_data = {
        'name': request.form['name'],
        'age': request.form['age'],
        'sex': request.form['sex'],
        'diet': request.form['diet'],
        'state': request.form['state'],
        'city': request.form['city'],
        'pin': request.form['pin']
    }
    users[user_data['name']] = user_data
    return redirect(url_for('search', username=user_data['name']))

@app.route('/search/<username>', methods=['GET', 'POST'])
def search(username):
    if request.method == 'POST':
        query = request.form['query']
        user_info = users[username]
        results = get_recommendations(query, user_info)
        return render_template('results.html', results=results, query=query, username=username)
    return render_template('search.html', username=username)

def get_recommendations(query, user_info):
    recommendations = []
    for source in DATA_SOURCES:
        try:
            response = requests.get(source, params={'query': query, 'location': user_info['pin']})
            if response.status_code == 200:
                data = response.json()
                for item in data.get('products', []):
                    if user_info['diet'].lower() in item.get('tags', '').lower():
                        item['source'] = source
                        recommendations.append(item)
        except Exception as e:
            print(f"Error fetching from {source}: {e}")
    return recommendations

if __name__ == '__main__':
    app.run(debug=True)
