from db_connection import get_connection
from models import Emotion

def save_emotion(user_text, emotion):
    """
    Saves an emotion analysis result to the database.
    """
    conn = get_connection()
    if not conn:
        return False
    try:
        cursor = conn.cursor()
        query = "INSERT INTO emotions (user_text, emotion) VALUES (%s, %s)"
        cursor.execute(query, (user_text, emotion))
        conn.commit()
        cursor.close()
        return True
    except Exception as e:
        print(f"Error in save_emotion: {e}")
        return False
    finally:
        conn.close()

def get_history(search_query=None, emotion_filter=None):
    """
    Fetches the history of emotion analysis records, optionally filtered.
    """
    conn = get_connection()
    if not conn:
        return []
    try:
        cursor = conn.cursor()
        query = "SELECT id, user_text, emotion, created_at FROM emotions"
        params = []
        conditions = []

        if search_query:
            conditions.append("user_text LIKE %s")
            params.append(f"%{search_query}%")
        if emotion_filter and emotion_filter != "":
            conditions.append("emotion = %s")
            params.append(emotion_filter)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY created_at DESC"
        
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()
        
        history = []
        for row in rows:
            history.append(Emotion(id=row[0], user_text=row[1], emotion=row[2], created_at=row[3]))
        
        cursor.close()
        return history
    except Exception as e:
        print(f"Error in get_history: {e}")
        return []
    finally:
        conn.close()

def get_emotion_counts():
    """
    Aggregates the database records to count occurrences of each emotion type.
    """
    conn = get_connection()
    counts = {
        'Happy': 0,
        'Sad': 0,
        'Angry': 0,
        'Fear': 0,
        'Neutral': 0
    }
    if not conn:
        return counts
    try:
        cursor = conn.cursor()
        query = "SELECT emotion, COUNT(*) FROM emotions GROUP BY emotion"
        cursor.execute(query)
        rows = cursor.fetchall()
        for row in rows:
            emotion_name = row[0]
            count_val = row[1]
            if emotion_name in counts:
                counts[emotion_name] = count_val
        cursor.close()
        return counts
    except Exception as e:
        print(f"Error in get_emotion_counts: {e}")
        return counts
    finally:
        conn.close()

def get_total_count():
    """
    Counts the total number of records stored in the emotions table.
    """
    conn = get_connection()
    if not conn:
        return 0
    try:
        cursor = conn.cursor()
        query = "SELECT COUNT(*) FROM emotions"
        cursor.execute(query)
        row = cursor.fetchone()
        count_val = row[0] if row else 0
        cursor.close()
        return count_val
    except Exception as e:
        print(f"Error in get_total_count: {e}")
        return 0
    finally:
        conn.close()
