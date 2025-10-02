# 🔔 Notifier - Notification Testing App

A comprehensive Expo React Native app for testing notifications and reminders on your phone.

## Features

- **Push Notifications**: Test local and remote push notifications
- **Scheduled Notifications**: Schedule notifications with custom delays
- **Reminder System**: Create and manage reminders
- **Custom Notifications**: Send notifications with custom content
- **Real-time Testing**: See notification responses in real-time

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI or Expo Go app on your phone
- Physical device (notifications don't work in simulators)

### Installation

1. Navigate to the project directory:
   ```bash
   cd notifier
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your phone

## App Features

### 🔔 Notification Testing
- **Send Test Notification**: Sends an immediate test notification
- **Schedule Notification (5s)**: Schedules a notification to appear in 5 seconds
- **Schedule Reminder (10s)**: Schedules a reminder notification in 10 seconds
- **Custom Notification**: Sends a custom-formatted notification

### 📱 How to Test

1. **Open the app** on your physical device
2. **Grant notification permissions** when prompted
3. **Try different notification types**:
   - Tap "Send Test Notification" for immediate notifications
   - Tap "Schedule Notification (5s)" to test delayed notifications
   - Tap "Schedule Reminder (10s)" to test reminder functionality
   - Tap "Send Custom Notification" for custom content

### 🔧 Technical Details

- Uses `expo-notifications` for local notifications
- Uses Expo Push API for remote notifications
- Configured for both iOS and Android
- Includes proper notification channels for Android
- Handles notification permissions automatically

### 📋 Notification Types

1. **Local Notifications**: Scheduled and triggered by the app
2. **Push Notifications**: Sent via Expo's push service
3. **Scheduled Notifications**: Delayed notifications with custom timing
4. **Reminder Notifications**: Special reminder-style notifications

## Troubleshooting

### Notifications Not Working?
- Make sure you're using a **physical device** (not simulator)
- Check that notification permissions are granted
- Ensure the app is properly configured in `app.json`

### Push Token Issues?
- The app will show your push token in the interface
- Copy this token to send notifications from external services
- Make sure you have an internet connection

## Development

### Adding New Features
- Modify `App.js` to add new notification types
- Update `app.json` for new permissions or configurations
- Test on both iOS and Android devices

### Customization
- Change notification sounds in the configuration
- Modify notification appearance in the styles
- Add new notification triggers and content

## Next Steps

- Test all notification types on your device
- Experiment with different notification schedules
- Try sending notifications from external services using the push token
- Customize the app for your specific testing needs

Happy testing! 🎉
