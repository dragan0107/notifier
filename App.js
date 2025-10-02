import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  TextInput,
  ScrollView,
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('Notification received:', notification);
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const requestPermissions = async () => {
    console.log('Manually requesting permissions...');
    try {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      
      if (status === 'granted') {
        alert('✅ Notification permissions granted! You can now test notifications.');
        // Refresh the token
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token);
      } else {
        alert('❌ Notification permissions denied. Please enable them in your device settings.');
      }
    } catch (error) {
      console.log('Error requesting permissions:', error);
      alert('Error requesting permissions: ' + error.message);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🔔 Notification Tester</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Token</Text>
          <Text style={styles.tokenText}>{expoPushToken ? expoPushToken : 'Getting token...'}</Text>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FF6B6B' }]} 
            onPress={requestPermissions}
          >
            <Text style={styles.buttonText}>Request Notification Permissions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tests</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => sendPushNotification(expoPushToken)}
          >
            <Text style={styles.buttonText}>Send Test Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={schedulePushNotification}
          >
            <Text style={styles.buttonText}>Schedule Notification (5s)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={scheduleReminder}
          >
            <Text style={styles.buttonText}>Schedule Reminder (10s)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FF9500' }]} 
            onPress={checkScheduledNotifications}
          >
            <Text style={styles.buttonText}>Check Scheduled Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FF3B30' }]} 
            onPress={clearAllScheduledNotifications}
          >
            <Text style={styles.buttonText}>Clear All Scheduled</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Notification</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={sendCustomNotification}
          >
            <Text style={styles.buttonText}>Send Custom Notification</Text>
          </TouchableOpacity>
        </View>

        {notification && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Notification</Text>
            <Text style={styles.notificationText}>
              Title: {notification.request.content.title}
            </Text>
            <Text style={styles.notificationText}>
              Body: {notification.request.content.body}
            </Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Test Notification',
    body: 'This is a test notification from your app!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function schedulePushNotification() {
  console.log('Scheduling notification for 5 seconds from now...');
  
  const triggerDate = new Date(Date.now() + 5000); // 5 seconds from now
  console.log('Trigger date:', triggerDate);
  
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Scheduled Notification! 📅",
      body: 'This notification was scheduled 5 seconds ago',
      data: { data: 'goes here' },
    },
    trigger: triggerDate,
  });
  console.log('Notification scheduled with ID:', notificationId);
  alert('Notification scheduled for 5 seconds from now!');
}

async function scheduleReminder() {
  console.log('Scheduling reminder for 10 seconds from now...');
  
  const triggerDate = new Date(Date.now() + 10000); // 10 seconds from now
  console.log('Trigger date:', triggerDate);
  
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder! ⏰",
      body: 'This is your scheduled reminder',
      data: { data: 'reminder data' },
    },
    trigger: triggerDate,
  });
  console.log('Reminder scheduled with ID:', notificationId);
  alert('Reminder scheduled for 10 seconds from now!');
}

async function sendCustomNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Custom Notification 🎯",
      body: 'This is a custom notification with special formatting!',
      data: { custom: true },
      sound: 'default',
    },
    trigger: { 
      seconds: 1,
      channelId: 'default'
    },
  });
}

async function checkScheduledNotifications() {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', scheduledNotifications);
    alert(`Found ${scheduledNotifications.length} scheduled notifications. Check console for details.`);
  } catch (error) {
    console.log('Error getting scheduled notifications:', error);
    alert('Error getting scheduled notifications: ' + error.message);
  }
}

async function clearAllScheduledNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cleared');
    alert('All scheduled notifications cleared!');
  } catch (error) {
    console.log('Error clearing scheduled notifications:', error);
    alert('Error clearing scheduled notifications: ' + error.message);
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    console.log('Requesting notification permissions...');
    
    // Request permissions with more specific settings
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Existing permission status:', existingStatus);
    
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      console.log('Requesting new permissions...');
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      finalStatus = status;
      console.log('New permission status:', finalStatus);
    }
    
    if (finalStatus !== 'granted') {
      alert('Notification permissions are required to test notifications. Please enable them in your device settings.');
      return;
    }
    
    console.log('Permissions granted, getting push token...');
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })).data;
      console.log('Push token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
      alert('Error getting push token. Make sure you have an internet connection.');
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});
