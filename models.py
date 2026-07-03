from datetime import datetime

class Emotion:
    """
    Model representing an Emotion analysis record in the database.
    """
    def __init__(self, id, user_text, emotion, created_at):
        self.id = id
        self.user_text = user_text
        self.emotion = emotion
        self.created_at = created_at

    def to_dict(self):
        """
        Convert the Emotion instance to a dictionary, useful for JSON serialization.
        """
        formatted_date = ""
        if isinstance(self.created_at, datetime):
            formatted_date = self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        else:
            formatted_date = str(self.created_at)

        return {
            'id': self.id,
            'user_text': self.user_text,
            'emotion': self.emotion,
            'created_at': formatted_date
        }

    def __repr__(self):
        return f"<Emotion(id={self.id}, text='{self.user_text[:20]}...', emotion='{self.emotion}')>"
