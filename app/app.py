from flask import Flask, render_template, jsonify
import redis
import os
from datetime import datetime
import pytz

app = Flask(__name__)

# Connect to Redis
cache = redis.Redis(host=os.getenv('REDIS_HOST', 'redis'), port=6379)

def get_visit_stats():
    """Get detailed visit statistics"""
    total_visits = int(cache.get('visits') or 0)
    today_key = datetime.now().strftime('visits:%Y-%m-%d')
    today_visits = int(cache.get(today_key) or 0)
    
    # Increment both counters
    cache.incr('visits')
    cache.incr(today_key)
    
    # Set expiry for daily counter (48 hours)
    cache.expire(today_key, 172800)
    
    return total_visits + 1, today_visits + 1

@app.route('/')
def home():
    total_visits, today_visits = get_visit_stats()
    current_time = datetime.now(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S UTC')
    
    return render_template('index.html',
                         total_visits=total_visits,
                         today_visits=today_visits,
                         current_time=current_time)

@app.route('/api/stats')
def get_stats():
    """API endpoint for automatic updates"""
    total_visits, today_visits = get_visit_stats()
    current_time = datetime.now(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S UTC')
    
    return jsonify({
        'total_visits': total_visits,
        'today_visits': today_visits,
        'current_time': current_time
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
