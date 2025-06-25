import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const mockResponses = [
  "שלום! איך אוכל לעזור לך עם השאלות הרפואיות שלך היום?",
  "אני מבין את הדאגה שלך. בוא אעזור לך עם המידע הזה.",
  "על סמך השאלה שלך, הנה מה שאני יכול לומר לך...",
  "תודה שפנית אלי. אני כאן כדי לעזור עם השאלות הרפואיות שלך.",
  "זו שאלה מצוינת. בוא אספק לך את המידע הרלוונטי.",
  "אני מעריך שחלקת איתי את זה. הנה מה שאתה צריך לדעת...",
  "הבריאות והרווחה שלך חשובים. בוא אטפל בדאגה שלך.",
  "אני שמח ששאלת. זה מידע חשוב להבין."
];

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'הודעה נדרשת' });
  }

  const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  setTimeout(() => {
    res.json({ 
      response: randomResponse,
      timestamp: new Date().toISOString()
    });
  }, 1000 + Math.random() * 1000);
});

app.post('/api/feedback', (req, res) => {
  const { messageId, messageText, feedbackType, feedbackText } = req.body;
  
  if (!messageId || !messageText || !feedbackType) {
    return res.status(400).json({ error: 'נתונים חסרים' });
  }

  console.log('Feedback received:', {
    messageId,
    messageText,
    feedbackType,
    feedbackText: feedbackText || null,
    timestamp: new Date().toISOString()
  });

  // Here you would typically save to database
  res.json({ 
    success: true,
    message: 'המשוב נרשם בהצלחה',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`שרת דמה רץ על פורט ${PORT}`);
});