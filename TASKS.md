# Any1 - Task Board v1.0
> רשימת משימות מלאה לשלב הבא של המוצר
> נוצר: 2026-03-05

---

## 🔴 CRITICAL - בלי זה אין מוצר

---

### TASK-01: Onboarding Flow
**כותרת:** מסך קבלת פנים + בניית זהות ראשונית

**מטרת על:**
המשתמש מרגיש שהאפליקציה מכירה אותו מהרגע הראשון. הפיד, ההמלצות, והחוויה כולה מותאמות אישית.

**דרך ביצוע:**
3 מסכים לינאריים לפני הכניסה לאפליקציה. שמירה ב-localStorage.

**תיאור גרפי:**
- מסך 1: רקע שחור, לוגו ANY1 גדול במרכז, כיתוב "Who are you?" בלבן גדול. מתחת - 3 כרטיסים גדולים בצבעי הסוגים: Investor (זהב), Founder (סגול), Surfer (טורקיז). לחיצה על כרטיס מדגישה אותו עם glow.
- מסך 2: "What's your world?" - רשת של תגיות (Fintech, Design, Engineering, Marketing, VC, Web3, CleanTech...). לחיצה בוחרת עד 3. נבחרים מואר בצבע הסוג שלך.
- מסך 3: "What are you here for?" - 3 אפשרויות: Find people to back / Find collaborators / Find projects to join. + שדה שם + שדה bio קצר.

**תיאור אינטראקציה:**
- Progress dots למעלה (1/3, 2/3, 3/3)
- כפתור Next מואר רק אחרי בחירה
- Swipe forward בין מסכים
- מסך סיום: animation של "Welcome to Any1" עם confetti בצבע הסוג שנבחר

**קריטריון הצלחה:**
משתמש חדש מסיים onboarding תוך 60 שניות. הפיד שרואה אחריו רלוונטי לתחומים שבחר.

**מה מקבלים:**
פרופיל ראשוני, פיד מותאם, type badge מוגדר, 32 reputation נקודות כ-"welcome bonus".

---

### TASK-02: Mission Board
**כותרת:** לוח משימות / פרויקטים פתוחים

**מטרת על:**
הסיבה שיזמים וסרפרים חוזרים כל יום. פרויקטים פתוחים שאפשר להציע עליהם / להצטרף אליהם.

**דרך ביצוע:**
Tab חמישי ב-Bottom Nav ("Missions") עם רשימת מישנים. כל mission הוא כרטיס עם פרטים + כפתור Apply.

**תיאור גרפי:**
- Header: "Missions" עם badge של מספר פתוחים
- כרטיס mission: cover image קטנה (אופציונלי), שם המשימה בולד גדול, שם היוזר שפרסם (עם avatar קטן + type badge), תיאור 2 שורות, תגיות תחום, סכום/תמורה (אם רלוונטי), מספר מועמדים, deadline
- שורת סטטוס: Open / In Progress / Completed עם צבע מתאים
- כפתור "Apply" - ירוק חאקי בולד בתחתית הכרטיס

**תיאור אינטראקציה:**
- פילטר לפי סוג: All / Design / Engineering / Marketing / Writing / Strategy
- לחיצה על כרטיס → דף mission מלא עם תיאור מפורט + Apply form
- Apply form: textarea "Why you?" + כפתור Submit
- אחרי Submit: הכרטיס מראה "Applied ✓" עם counter שעולה
- יוצר המשימה מקבל notification

**קריטריון הצלחה:**
לפחות 3 applications על כל mission שמתפרסם. חזרה יומית של סרפרים לבדוק missions חדשות.

**מה מקבלים:**
- יוצר mission: visibility, applications, collaborators
- מגיש: reputation +10 על כל application, +50 על mission שהתקבל
- משקיע: רואה איזה יזמים פעילים ומפרסמים missions → signal להשקעה

---

### TASK-03: Notification System
**כותרת:** מערכת התראות עם משמעות

**מטרת על:**
הסיבה מספר 1 לחזור לאפליקציה. כל notification מספר סיפור ומייצר ערך.

**דרך ביצוע:**
Notification center (icon בHeader עם badge אדום). רשימת events ממוינת לפי זמן.

**תיאור גרפי:**
- Bell icon בHeader עם dot ירוק (יש חדש) / אדום (urgent)
- לחיצה → slide-down panel (לא דף נפרד)
- כל notification: avatar של מי שפעל, טקסט קצר, זמן, צבע accent לפי סוג
- סוגי notifications: Invest (זהב), Follow (סגול), Mission Apply (טורקיז), Price Alert (ירוק/אדום), Milestone (לבן)

**דוגמאות לטקסט:**
- 🟡 "Oren Cohen invested $5 in you"
- 🟣 "Noa Ben David started following you"
- 🟢 "Your portfolio is up 8.3% today"
- 🔴 "Tamir's value dropped 5% - review your position"
- ⚪ "Dana just completed a mission at Wolt"

**תיאור אינטראקציה:**
- Swipe right על notification → dismiss
- Tap → מנווט לפרופיל/mission הרלוונטי
- "Mark all read" בראש הרשימה
- Unread notifications = bold + dot צבעוני

**קריטריון הצלחה:**
CTR על notifications > 40%. משתמש נכנס לפחות פעם ביום בגלל notification.

**מה מקבלים:**
Loop חיים: פעולה → notification → חזרה → פעולה נוספת.

---

### TASK-04: Portfolio שמתנועע
**כותרת:** תיק השקעות חי עם P&L בזמן אמת

**מטרת על:**
כמו Robinhood - פותח כל בוקר לראות כמה שווה התיק שלך. זה הפיצ'ר שמייצר הרגל יומי.

**דרך ביצוע:**
שדרוג עמוד Portfolio הקיים. הוספת live price simulation (כמו ה-ticker הקיים), גרף תיק כולל, P&L יומי/שבועי.

**תיאור גרפי:**
- Hero card בראש: "Your Portfolio" עם סכום גדול (כמו $127.43), שינוי יומי (+$4.21 / +3.4%) בירוק/אדום גדול
- גרף קו של שווי התיק הכולל לאורך זמן (1D / 1W / 1M tabs)
- מתחת: כל position עם mini-chart, % change, unrealized P&L
- "Best performer today" card בצבע זהב

**תיאור אינטראקציה:**
- גרף אינטראקטיבי - לחיצה על נקודה מראה שווי באותו רגע
- Pull-to-refresh מרענן מחירים
- Position card → tap → דף הפרופיל של אותו אדם
- "Add Position" button → מנווט ל-Discover

**קריטריון הצלחה:**
משתמש פותח Portfolio לפחות פעם ביום. זמן ממוצע בעמוד > 45 שניות.

**מה מקבלים:**
הרגל יומי. תחושת ownership אמיתית. סיבה לחקור פרופילים חדשים.

---

## 🟡 IMPORTANT - חסר לחוויה שלמה

---

### TASK-05: Leaderboard שבועי
**כותרת:** Top Movers - לוח המובילים השבועי

**מטרת על:**
Social proof + תחרות בריאה = חזרה שבועית. מי עלה הכי הרבה? מי סגר הכי הרבה missions?

**דרך ביצוע:**
Section בתוך Home Feed (לא דף נפרד) - רצועה אופקית עם scroll.

**תיאור גרפי:**
- כותרת "This Week 🔥" עם subtitle "Top movers"
- רצועה אופקית scroll של כרטיסים קטנים (horizontal cards)
- כל כרטיס: avatar, שם קצר, % עלייה גדולה בירוק, מיקום (#1, #2, #3...) בזהב/כסף/ברונזה
- #1 מקבל border זהב מנצנץ

**תיאור אינטראקציה:**
- Scroll ימינה לראות עוד
- Tap על כרטיס → פרופיל מלא
- "See full leaderboard" → דף נפרד עם top 50

**קריטריון הצלחה:**
CTR על leaderboard cards > 25%. אנשים מדברים על מי נמצא ב-top 3.

**מה מקבלים:**
Aspiration (אני רוצה להיות שם), Discovery (גילוי אנשים חדשים), Competition (נוסטלגיה ל-gamification בריאה).

---

### TASK-06: Reputation System מלא
**כותרת:** מערכת רפוטציה נראית ומורגשת

**מטרת על:**
הרפוטציה צריכה להרגיש כמו נכס אמיתי - לא מספר שרירותי.

**דרך ביצוע:**
מערכת XP עם levels, badges, וactions ברורות שמרוויחות points.

**תיאור גרפי:**
- בפרופיל: progress bar מתחת ל-rep score ("Level 3 · 87/100 to Level 4")
- Badges אייקונים קטנים בשורה: 🎯 First Mission, 💰 First Investment, ⭐ Top Investor, 🔥 7-day streak...
- כל badge עם tooltip מסביר איך הורווח
- Level titles: Newcomer → Explorer → Contributor → Builder → Amplifier → Legend

**טבלת ה-XP:**
- הירשמת = +32
- השלמת mission = +50
- מישהו השקיע בך = +20
- mission application שהתקבל = +30
- 7 ימים ברצף = +25
- חבר שהבאת נרשם = +40

**תיאור אינטראקציה:**
- Level up animation: confetti בצבע הסוג שלך + "Level Up!" overlay
- Tap על badge → מסביר מה זה ואיך להרוויח
- "How to grow faster" CTA → מראה את הactions הכי שוות XP

**קריטריון הצלחה:**
50% מהמשתמשים מגיעים ל-Level 3 תוך שבוע. Level-up events = push notifications.

**מה מקבלים:**
Progression loop. תחושת achievement. Social proof (badge נראה לאחרים).

---

### TASK-07: Chat / DM
**כותרת:** הודעות ישירות בין משתמשים

**מטרת על:**
Collaboration מתחיל בשיחה. בלי chat - אין שום דרך שיזם יפגוש סרפר שמישהו השקיע בשניהם.

**דרך ביצוע:**
כפתור Message בכל פרופיל. Chat view פשוט (לא real-time בשלב הראשון - אפשר mock).

**תיאור גרפי:**
- כפתור "Message" בפרופיל (לצד Follow / Invest)
- Chat view: רקע שחור, bubbles בצבע הסוג של השולח, timestamp קטן
- Header: avatar + שם + type badge + "Active now" dot ירוק
- Input bar בתחתית: שדה טקסט + send button (ירוק חאקי)

**תיאור אינטראקציה:**
- Tap Message → אנימציית slide מהימין
- הודעה נשלחת → bubble מופיע מהימין עם animation
- Read receipt: ✓✓ בירוק כשנקרא
- "Shared a mission" / "Shared a profile" - quick actions מעל keyboard

**קריטריון הצלחה:**
30% מה-follows יובילו לפחות להודעה אחת. Conversation שמתחילה ב-chat תוביל ל-mission application.

**מה מקבלים:**
הגשר בין discovery לcollaboration. בלי זה Any1 זה רק window shopping.

---

### TASK-08: Weekly Digest Push
**כותרת:** סיכום שבועי אישי - push notification / email

**מטרת על:**
אנשים שלא נכנסו 3 ימים - מה יגרום להם לחזור? סיכום שבועי אישי ורלוונטי.

**דרך ביצוע:**
Mock כרגע - מסך "Your Week" שמופיע ב-Sunday בכניסה לאפליקציה.

**תיאור גרפי:**
- Full-screen overlay בכניסה ראשונה של השבוע
- כותרת: "Your week on Any1" עם תאריך
- Cards בגלילה: Portfolio change, Best performing investment, New followers, Missions completed, Rep earned
- Bottom: "See what's new this week" → מנווט ל-feed מסונן לשבוע האחרון

**דוגמת תוכן:**
- "📈 Your portfolio grew 4.2% this week"
- "💰 Oren Cohen is your best bet (+12.3%)"
- "👥 3 new people are following you"
- "🎯 2 new missions match your skills"

**קריטריון הצלחה:**
60% open rate על ה-digest. 40% מהפותחים ממשיכים לגלול ב-feed.

**מה מקבלים:**
Re-engagement mechanism. תחושה שהאפליקציה עובדת בשבילך גם כשאתה לא פתוח.

---

## 🟢 ENHANCEMENTS - לשפר את מה שקיים

---

### TASK-09: Swipe UI - שדרוג
**כותרת:** Swipe עם feedback עשיר יותר

**מטרת על:**
כל swipe צריך להרגיש כמו decision, לא כמו scroll.

**שיפורים:**
- Haptic feedback (mobile vibration) על כל swipe
- Sound effect עדין (אופציונלי, off by default)
- Match animation: כשמישהו שהשקעת בו - following אותך - "It's a match!" overlay
- Super Invest: swipe up (כמו Tinder Super Like) = invest מיד בלי לפתוח modal
- "Why this person?" tooltip קטן שמסביר למה הוא מוצג לך (based on your type/tags)

**תיאור גרפי - Match:**
- Full-screen overlay: שתי תמונות עגולות מתחברות, "You're connected!" טקסט, confetti בצבע שני הסוגים
- שני כפתורים: "Message now" / "Keep swiping"

**קריטריון הצלחה:**
Match screen מגדיל conversations ב-3x לעומת כפתור Message רגיל.

---

### TASK-10: Profile - Edit Mode
**כותרת:** עריכת פרופיל אישי

**מטרת על:**
כרגע הפרופיל שלך הוא "You" עם mock data. צריך שיהיה אמיתי.

**שיפורים:**
- כפתור Edit בפרופיל האישי
- עריכת: שם, handle, bio, תגיות, location
- העלאת תמונת פרופיל (mock - מציג preview)
- העלאת cover (עם crop tool)
- שמירה ב-localStorage

**תיאור גרפי:**
- Edit mode: שדות inline עם border highlight בצבע הסוג
- Cover: tap → אפשרות לבחור מ-3 presets לפי תחום
- Preview mode לפני שמירה

**קריטריון הצלחה:**
80% מהמשתמשים ישנו לפחות שדה אחד ב-24 שעות הראשונות.

---

### TASK-11: הסרת Live Ticker מה-Feed
**כותרת:** ניקוי ה-Header

**מטרת על:**
Ticker מסיח דעת ולא מוסיף ערך בשלב זה. פשוט יותר = ברור יותר.

**מה עושים:**
- מסירים את ה-ticker strip מה-Home feed
- מעבירים את הdata למסך Market נפרד (עתידי)
- ה-Header נהיה נקי יותר: לוגו + Total Market cap (מספר בלבד) + Bell

**קריטריון הצלחה:**
First scroll מהיר יותר. פחות "noise" בכניסה.

---

### TASK-12: UserCard - שדרוג ויזואלי
**כותרת:** כרטיסי משתמש עם יותר חיים

**שיפורים:**
- תמונת ה-cover של המשתמש כ-blurred background של הכרטיס (subtle)
- Online indicator: dot ירוק/אפור ליד avatar
- "Hot" badge: 🔥 על כרטיסים שעלו >5% היום
- "New" badge: ✨ על משתמשים שהצטרפו השבוע
- Mutual connections: "2 people you follow also invested" - מתחת לשם

**תיאור גרפי:**
- כרטיס עם bg של cover image בטשטוש 40px + overlay שחור 80%
- זה נותן צבעוניות ייחודית לכל כרטיס בלי לשבור את ה-dark theme

**קריטריון הצלחה:**
כל כרטיס נראה ייחודי. אי אפשר להחליף בין כרטיסים בלי לשים לב.

---

### TASK-13: Posts - יצירת פוסט
**כותרת:** כפתור יצירת תוכן

**מטרת על:**
כרגע אפשר רק לראות פוסטים. צריך שאנשים יוצרו תוכן - זה מה שמחיה את הפיד.

**שיפורים:**
- כפתור + צף בפינה ימנית תחתונה (FAB - Floating Action Button)
- Modal: בחר סוג פוסט (Update / Milestone / Insight / Work / Thought)
- Textarea + אפשרות לצרף תמונה (URL בשלב mock)
- Character counter (280 max)
- שמירה ב-localStorage ומופיע בפרופיל האישי

**תיאור גרפי:**
- FAB: עיגול 56px, ירוק חאקי, סימן + לבן, shadow מרחף
- Modal עולה מהתחתית (bottom sheet)
- כל סוג פוסט עם צבע ואייקון ייחודי

**קריטריון הצלחה:**
40% מהמשתמשים יוצרים פוסט אחד לפחות ב-7 ימים הראשונים.

---

## 🔵 FUTURE - לשלב הבא

---

### TASK-14: Market Screen
**כותרת:** מסך שוק - כולם נסחרים

**מטרת על:**
הניסוח הגדול של Any1: כל אדם הוא מניה. צריך מסך שמראה את זה ב-full glory.

**תיאור:**
- Tab נפרד: Market
- רשימה/גריד של כל המשתמשים עם מחיר, change%, volume
- Gainers / Losers tabs
- Search + filter
- Live prices (simulation)
- ה-ticker שהסרנו מה-feed - חי כאן

---

### TASK-15: Collateral UI
**כותרת:** נעילת כסף להעלאת שווי שוק

**מטרת על:**
הלב הכלכלי של Any1. כרגע זה מספר בפרופיל. צריך UI שמאפשר "נעילה" מדומה.

**תיאור:**
- בפרופיל: "Lock Collateral" → modal עם slider
- הזזת slider → שווי שוק עולה בזמן אמת
- "Confirm Lock" → animation של 🔒 + עדכון מיידי בשווי
- היסטוריית נעילות

---

### TASK-16: Any1 Score - מדד מרכזי
**כותרת:** ה-MVS (המדד שדיברנו עליו בתחילת הדרך)

**מטרת על:**
מדד אחד שמסכם מי אתה: collateral + ותק + reputation + missions + investments.

**תיאור:**
- מספר אחד גדול בפרופיל (0-1000)
- Breakdown: כמה מכל component
- Historical chart
- "What affects your score" explanation

---

## סיכום - סדר ביצוע מומלץ

| עדיפות | Task | שבועות |
|--------|------|---------|
| 1 | TASK-01: Onboarding | שבוע 1 |
| 2 | TASK-02: Mission Board | שבוע 1-2 |
| 3 | TASK-11: הסרת Ticker | שבוע 1 |
| 4 | TASK-04: Portfolio חי | שבוע 2 |
| 5 | TASK-03: Notifications | שבוע 2-3 |
| 6 | TASK-06: Reputation System | שבוע 3 |
| 7 | TASK-13: יצירת פוסט | שבוע 3 |
| 8 | TASK-10: Edit Profile | שבוע 3 |
| 9 | TASK-12: UserCard שדרוג | שבוע 4 |
| 10 | TASK-05: Leaderboard | שבוע 4 |
| 11 | TASK-09: Swipe שדרוג | שבוע 4 |
| 12 | TASK-07: Chat / DM | שבוע 5 |
| 13 | TASK-08: Weekly Digest | שבוע 5 |
| 14 | TASK-14: Market Screen | Phase 2 |
| 15 | TASK-15: Collateral UI | Phase 2 |
| 16 | TASK-16: Any1 Score | Phase 2 |
