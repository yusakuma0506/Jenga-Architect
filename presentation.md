# Jenga Architect Presentation

## 6-Minute Presentation Script

### 1. Opening and Landing Page

Hello everyone. Today I will introduce **Jenga Architect**, a hybrid board game and web application for learning Python object-oriented programming.

The idea is to make programming practice more active. Instead of only reading questions on a screen, players use physical Jenga blocks, scan QR codes, answer Python OOP quizzes, and compete through a digital game system.

The application starts from the landing page. From here, users can understand the purpose of the app: learning Python through Solo practice or Multiplayer Jenga gameplay. The landing page is the entry point before login and before choosing a learning mode.

There are two main user types: **normal users**, who play and learn, and **admin users**, who manage users and feedback.

### 2. Normal User: Login

First, users open the application and go to the login page.

There are three ways to log in:

- **Google login**, for normal users who want quick access with a Google account.
- **GitHub login**, which is useful for programming learners and developers.
- **Admin / Demo login**, which is used for sample accounts, including the admin account.

After login, the user arrives at the home screen. From there, they can choose between **Solo mode** and **Multiplayer mode**.

### 3. Normal User: Menu Workflow

After login, normal users can open the menu. The menu is where account and support actions are collected.

The normal user menu includes:

- **Setting**, where the user can manage profile information such as their profile image.
- **Feedback**, where the user can send bugs, quiz issues, typos, suggestions, or other comments.
- **Subscription**, where the user can choose a Pro plan and unlock premium room hosting.
- **Cancel Subscription**, where Pro users can stop renewal while keeping access until the end of the paid period.
- **Print QRs**, where users can open printable QR codes for the physical Jenga blocks.
- **Logout**, where the user signs out from the app.

This menu supports the real user workflow: learning, reporting issues, preparing physical QR blocks, managing payment, and safely leaving the account.

### 4. Normal User: Solo Mode

In **Solo mode**, the user practices alone.

The user chooses a difficulty level, such as Entry, Junior, or Senior. Then the app shows Python OOP quiz questions. The user selects answers, submits them, and receives feedback.

This mode is useful for self-study because the learner can practice at their own pace. It also helps users prepare before joining a multiplayer game.

Some advanced levels are connected to Pro access, so the application can support both free learning and paid premium content.

### 5. Admin Workflow

For the admin side, the workflow also starts with login.

The admin uses the **Admin / Demo login**. After login, the admin has access to protected management pages that normal users cannot open.

The admin has two main responsibilities:

- **Users management**, where the admin can check registered user information and understand who is using the system.
- **Feedback management**, where the admin can review feedback submitted by users, such as bugs, quiz problems, typo reports, or improvement ideas.

This is important in a classroom or workshop situation. Normal users focus on playing and learning, while the admin supports the learning environment and improves the product based on user feedback.

### 6. Main Showcase: Multiplayer Mode

The main showcase of this application is **Multiplayer mode**, because this is where the physical and digital parts work together.

In Multiplayer mode, one user becomes the host and creates a room.

The host chooses the game level:

- Entry for easier questions.
- Junior for medium questions.
- Senior for harder questions.

Junior and Senior hosting are for Pro users or admin users.

After the host creates the room, the application generates an 8-character room code. Other players enter that code to join the same room.

In the lobby, players can see who has joined. When everyone is ready, the host starts the game.

### 7. Multiplayer: Physical and Digital Game Flow

Once the game starts, the app shows the digital Jenga board, the current player, the room code, the ranking, and the game status.

On their turn, the player interacts with the physical Jenga tower. They choose or pull a block from the real tower. Each physical block has a QR code.

The current player scans the QR code using the web app. The scan tells the app which Jenga block was selected. Then the app opens the quiz connected to that block and the selected difficulty level.

The player answers the quiz. If the answer is correct, they gain points. If the answer is wrong, they lose points or use one of their attempts. The app tracks attempts, scores, whose turn it is, and whether the game should continue.

If a player breaks the physical tower, they can report that in the app. The app marks that player as eliminated and updates the ranking.

This is the main hybrid part: the physical Jenga action changes the digital game, and the digital game controls the rules, score, turns, and feedback.

### 8. Closing

In summary, Jenga Architect combines a physical Jenga game with a digital learning system.

Normal users can start from the landing page, log in, use the menu, practice Solo mode, and join Multiplayer mode. Admin users can log in separately and manage users and feedback.

The strongest feature is Multiplayer mode. It is not just a quiz app. It is a hybrid learning game where the physical Jenga tower and the digital system depend on each other.

## Short Slide Outline

1. **Title:** Jenga Architect: Hybrid OOP Learning Game
2. **Landing Page:** Entry point and product purpose.
3. **Normal User Login:** Google, GitHub, Admin / Demo sample account.
4. **Normal User Menu:** Setting, Feedback, Subscription, Cancel Subscription, Print QRs, Logout.
5. **Solo Mode:** Individual Python OOP quiz practice.
6. **Admin Login:** Admin / Demo login.
7. **Admin Management:** Users management and feedback management.
8. **Main Showcase:** Multiplayer room, lobby, QR scan, quiz, score, turn, elimination.
9. **Hybrid Checklist:** Physical parts, digital app, QR interaction, state tracking, real-time feedback.
10. **Conclusion:** Jenga Architect as a physical-digital learning game.

## 6-Minute Demo Order

1. **0:00-0:30 - Landing Page**
   Show the application title and explain that users can learn Python OOP through Solo or Multiplayer play.

2. **0:30-1:10 - Normal User Login**
   Show the login page and explain the three login options: Google, GitHub, and Admin / Demo sample login.

3. **1:10-2:00 - Normal User Menu**
   Open the menu and explain Setting, Feedback, Subscription, Cancel Subscription, Print QRs, and Logout.

4. **2:00-2:40 - Solo Mode**
   Open Solo mode, show difficulty selection, and explain that this is individual practice before multiplayer.

5. **2:40-3:20 - Admin Workflow**
   Explain admin login, then show or describe users management and feedback management.

6. **3:20-5:40 - Main Showcase: Multiplayer**
   Create or join a room, show the room code, lobby, host start button, game board, current turn, QR scan, quiz page, scoring, ranking, and tower break action.

7. **5:40-6:00 - Closing**
   Connect the showcase back to the hybrid checklist: physical blocks, digital app, QR scan, state tracking, and real-time feedback.

## Hybrid Board Game Checklist Answers

### 1. Physical Components

**Question:** What are the physical components of the game?

**Answer:** The physical component is the real Jenga tower. Each physical Jenga block can have a printed QR code attached to it. Players physically pull or select blocks during the game.

### 2. Digital Component

**Question:** What is the digital component?

**Answer:** The digital component is the web application. It handles login, solo quizzes, multiplayer rooms, room codes, QR scanning, quiz display, scoring, rankings, subscriptions, profiles, and admin feedback.

### 3. Interdependence

**Question:** How do the physical and digital components depend on each other?

**Answer:** The physical game gives the action: players choose or pull Jenga blocks. The digital app gives the rules and learning challenge: each scanned block opens a matching quiz, and the result affects the score and game state. Without the physical blocks, the multiplayer game loses its Jenga action. Without the app, the blocks cannot connect to quizzes, scoring, or turns.

### 4. Digital Interaction

**Question:** How does the digital part respond to physical actions?

**Answer:** When a player scans a QR code on a physical block, the app detects the block ID and opens the correct quiz. If the tower falls, the player reports the break in the app, and the app updates the game result.

### 5. Data Sharing

**Question:** What data is shared between the physical and digital systems?

**Answer:** The main shared data is the block identity. Each physical block has a QR code that represents a specific block ID. The digital app uses that ID to choose the correct quiz and connect the physical action to the room state.

### 6. State Tracking

**Question:** How does the digital system track the game state?

**Answer:** The app tracks the room, players, host, current turn, selected difficulty, quiz attempts, scores, eliminated players, and final ranking. It also tracks whether a room is waiting, playing, or finished.

### 7. Real-Time Feedback

**Question:** How does the game give real-time feedback?

**Answer:** During multiplayer, the app refreshes the room status so players can see whose turn it is, who is in the room, scores, rankings, and whether the game has ended. After a quiz answer, the player immediately receives feedback and the game updates the next turn or score.

## General Questions and Answers

### Q1. What is the main purpose of this application?

The purpose is to make Python OOP learning more active and memorable by combining physical Jenga play with digital quizzes, scoring, and multiplayer competition.

### Q2. Who are the target users?

The target users are beginner and intermediate Python learners, students, teachers, workshop organizers, and people who prefer game-based learning.

### Q3. Why did you choose Jenga?

Jenga creates tension, turn-taking, and physical engagement. It makes the quiz experience less passive because each question is connected to a real action in the physical game.

### Q4. How does a normal user start?

The normal user starts from the landing page, goes to login, signs in with Google, GitHub, or a sample account, and then chooses Solo or Multiplayer from the home screen.

### Q5. How does an admin start?

The admin uses the Admin / Demo login. After login, the admin can access protected admin pages such as feedback and user checking pages.

### Q6. What can normal users do from the menu?

Normal users can open Setting, submit Feedback, manage Subscription, Cancel Subscription, Print QRs for physical blocks, and Logout.

### Q7. Why is Print QRs included in the menu?

Print QRs helps users prepare the physical Jenga blocks. Each QR code can be attached to a real block, so scanning the physical block opens the matching digital quiz.

### Q8. What does the admin manage?

The admin manages user information and user feedback. This helps the admin monitor the learning environment and respond to issues or suggestions.

### Q9. What is feedback management for?

Feedback management lets the admin review reports from users, such as bugs, quiz issues, typos, suggestions, or other comments.

### Q10. What is the difference between Solo and Multiplayer?

Solo mode is self-practice. Multiplayer mode is a group game with room codes, turns, QR scanning, scoring, ranking, and elimination.

### Q11. What happens when a player scans a QR code?

The app reads the block ID from the QR code, finds the related quiz for the current room level, and sends the player to the quiz screen.

### Q12. What happens if the player answers correctly?

The player gains points, the app records the result, and the turn can move forward.

### Q13. What happens if the player answers incorrectly?

The player can lose points or use an attempt. In multiplayer, the player has limited attempts, so mistakes affect the score and progress.

### Q14. What happens if the Jenga tower falls?

The current player can report the tower break in the app. The app marks that player as eliminated and updates the game ranking.

### Q15. Why does the app need login?

Login is needed to save user identity, control room participation, protect admin pages, track subscriptions, and connect scores or feedback to real users.

### Q16. What is Pro access used for?

Pro access unlocks premium hosting features, especially Junior and Senior multiplayer rooms. Entry-level play remains available for normal access.

### Q17. How does payment work from a user perspective?

The user opens the subscription page, chooses a plan, completes payment through Stripe Checkout, and then the app updates the user to Pro status after Stripe confirms the subscription.

### Q18. What feedback can users submit?

Users can submit feedback such as bugs, typos, quiz issues, suggestions, or other comments. Admins can review this feedback later.

### Q19. Why is this better than a normal online quiz?

A normal online quiz only asks questions. This app combines learning with physical action, turn-taking, risk, competition, room interaction, and immediate game feedback.

## Source Code Questions and Answers

### Q1. Where is authentication handled?

Authentication is handled through NextAuth. The app supports Google, GitHub, and credentials-based Admin / Demo login. User sessions are connected to the database so the app can know each user's role and Pro status.

### Q2. How are admin pages protected?

Admin pages are protected by middleware-style route protection. Normal users are redirected away from admin-only pages such as feedback review and user checking.

### Q3. How does the app prevent users from cheating in multiplayer?

Important multiplayer rules are checked on the server. The server verifies that the user is logged in, belongs to the room, is not eliminated, is playing in an active room, and is the current turn player before accepting quiz or tower-break actions.

### Q4. Where are the physical Jenga blocks represented in the database?

They are represented as Jenga block records. Each block has a physical ID and is connected to one or more quizzes.

### Q5. How does the QR code connect to a quiz?

The QR code contains a block ID such as `BLOCK-01`. After scanning, the app uses that block ID and the room difficulty level to load the correct quiz.

### Q6. How does the app track turns?

The room stores the current turn user. After a correct answer, failed attempts, or elimination, the app advances to the next active player.

### Q7. How does scoring work?

The scoring system gives different point values depending on the difficulty level. Correct answers add points, wrong answers can subtract points, and the app calculates standings from player scores and elimination status.

### Q8. Why are quiz answers checked on the server?

Server-side answer checking prevents users from seeing or changing correct answers in the browser. It keeps quiz validation more secure and fair.

### Q9. How does the app update multiplayer state without WebSockets?

The app refreshes room data regularly. This keeps players updated about room status, turns, rankings, and game progress without requiring a WebSocket server.

### Q10. Where is Stripe used?

Stripe is used for subscription checkout, cancellation, and webhook events. Stripe confirms subscription changes, and the app updates the user's Pro access.

### Q11. Why does Stripe need a webhook?

The webhook lets Stripe notify the app when checkout is completed or a subscription changes. Without the webhook, the app might not reliably know when a user becomes Pro or when a subscription is canceled.

### Q12. What does the webhook secret do?

The webhook secret verifies that webhook requests really came from Stripe. This prevents fake subscription events from being accepted by the app.

### Q13. What data models are most important?

The most important models are User, JengaBlock, Quiz, Room, RoomParticipant, QuizAttempt, UserScore, Subscription, and Feedback.

### Q14. What is one limitation of the current system?

The current app uses polling instead of live WebSockets, so updates are near real-time rather than instant. Also, the physical QR blocks must be prepared and printed before the full hybrid game can be played.

### Q15. What would you improve next?

Good next improvements would be a teacher dashboard, better post-answer explanations, stronger analytics, WebSocket-based live updates, and more automated tests for the full multiplayer flow.

## Quick Defense Answers

### If asked: "Is this really a hybrid board game?"

Yes. It has physical Jenga blocks and a digital app. The physical block selection affects the digital quiz, and the digital app controls turns, scoring, ranking, elimination, and feedback.

### If asked: "Can the game work without QR codes?"

The app can still show quizzes digitally, but the intended hybrid workflow depends on QR codes because they connect each physical block to a digital quiz.

### If asked: "Can normal users access admin pages?"

No. Admin pages are protected. Normal users are redirected away, while admin users can review feedback and user information.

### If asked: "What makes the app useful for education?"

It turns abstract Python OOP topics into short interactive challenges. The physical game keeps students engaged, while the digital app keeps the learning structured and measurable.

### If asked: "What is the most important feature?"

The most important feature is the multiplayer physical-digital loop: pull a Jenga block, scan the QR code, answer a quiz, update score and turn, and continue the game.
