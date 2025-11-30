import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface PushNotificationState {
  expoPushToken?: string;
  notification?: Notifications.Notification;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  console.log('[STEP 1] Bắt đầu hàm lấy Token...');
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.log('[LỖI] Đây là máy ảo, không phải thiết bị thật!');
    alert('Phải dùng thiết bị thật để test Push Notification');
    return undefined;
  }
  console.log('[STEP 2] Đã xác nhận là thiết bị thật.');

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log('[STEP 3] Trạng thái quyền hiện tại:', existingStatus);
  
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    console.log('[STEP 3.1] Đang xin quyền...');
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log('[STEP 3.2] Kết quả xin quyền:', finalStatus);
  }

  if (finalStatus !== 'granted') {
    console.log('[LỖI] Người dùng từ chối cấp quyền!');
    alert('Không có quyền thông báo!');
    return undefined;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  
  console.log('[STEP 4] Project ID tìm thấy:', projectId);

  if (!projectId) {
    console.log('[LỖI] Không tìm thấy Project ID trong cấu hình!');
    alert('Chưa cấu hình Project ID trong app.json');
    return undefined;
  }

  try {
    console.log('[STEP 5] Đang gọi server Expo để lấy token...');
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log('[THÀNH CÔNG] EXPO PUSH TOKEN:', pushTokenString); // <--- MỤC TIÊU LÀ ĐÂY
    return pushTokenString;
  } catch (e: unknown) {
    console.error('[LỖI] Exception khi lấy token:', e);
    alert(`Lỗi lấy token: ${e}`);
  }

  return token;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    console.log('[HOOK INIT] Hook usePushNotifications đã được gọi');
    
    registerForPushNotificationsAsync().then((token) => {
        console.log('[HOOK RESULT] Token trả về cho State:', token);
        setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};