from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, Response
import csv, io
from dao import save_emotion, get_history, get_emotion_counts, get_total_count

app = Flask(__name__)
app.secret_key = 'emotion_analysis_system_secret_key_2026'

EMOTION_KEYWORDS = {
    'Happy': ['happy', 'good', 'excellent', 'awesome', 'amazing', 'love'],
    'Sad': ['sad', 'cry', 'depressed', 'upset', 'disappointed'],
    'Angry': ['angry', 'hate', 'mad', 'irritated', 'annoyed'],
    'Fear': ['fear', 'scared', 'nervous', 'worried', 'panic']
}
EMOTION_EMOJIS = {'Happy': '😊', 'Sad': '😢', 'Angry': '😠', 'Fear': '😨', 'Neutral': '😐'}

def analyze_text(text):
    text_lower = text.lower()
    score_board = {emotion: 0 for emotion in EMOTION_KEYWORDS}
    for emotion, keywords in EMOTION_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                score_board[emotion] += 1
    detected_emotion = 'Neutral'
    highest_score = 0
    for emotion, score in score_board.items():
        if score > highest_score:
            highest_score = score
            detected_emotion = emotion
    matching_keywords = [kw for kw in EMOTION_KEYWORDS[detected_emotion] if kw in text_lower] if detected_emotion != 'Neutral' else []
    return detected_emotion, matching_keywords

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    user_text = request.form.get('user_text', '').strip()
    is_ajax = request.form.get('ajax', 'false') == 'true'
    emotion, keywords = analyze_text(user_text)
    save_emotion(user_text, emotion)
    
    if is_ajax:
        return jsonify({
            'success': True, 'text': user_text, 'emotion': emotion,
            'emoji': EMOTION_EMOJIS.get(emotion), 'keywords': keywords
        })
    return render_template('result.html', text=user_text, emotion=emotion, emoji=EMOTION_EMOJIS.get(emotion), keywords=keywords)
