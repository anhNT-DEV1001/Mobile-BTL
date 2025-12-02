import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Animated } from "react-native";
import { Button, Text, Avatar, Surface, Card, Chip, IconButton } from "react-native-paper";
import { useAuth } from "../auth/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "./hooks/useHome";
import { useAuthStore } from "@/src/common/stores";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

// Helper component for stat items
const StatItem = ({ icon, value, label, iconColor = "#003366", valueStyle = {} }: {
    icon: string;
    value: string | number;
    label: string;
    iconColor?: string;
    valueStyle?: any;
}) => (
    <View style={styles.statItem}>
        <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
        <Text variant="bodyMedium" style={[styles.statValue, valueStyle]}>
            {value}
        </Text>
        <Text variant="labelSmall" style={styles.statLabel}>
            {label}
        </Text>
    </View>
);

const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    const createAnimation = (animatedValue: Animated.Value, delay: number) => {
        return Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: -4,
                    duration: 300,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        );
    };

    useEffect(() => {
        createAnimation(dot1, 0).start();
        createAnimation(dot2, 150).start();
        createAnimation(dot3, 300).start();
    }, []);
    return (
        <View style={[styles.chatBubble, styles.botBubble, { flexDirection: "row", gap: 4 }]}>
            <Animated.View style={{ transform: [{ translateY: dot1 }] }}>
                <Text style={{ color: "#fff", fontSize: 20 }}>●</Text>
            </Animated.View>
            <Animated.View style={{ transform: [{ translateY: dot2 }] }}>
                <Text style={{ color: "#fff", fontSize: 20 }}>●</Text>
            </Animated.View>
            <Animated.View style={{ transform: [{ translateY: dot3 }] }}>
                <Text style={{ color: "#fff", fontSize: 20 }}>●</Text>
            </Animated.View>
        </View>
    );
};

// Chat Widget Component
const ChatWidget = ({ webhookUrl, visible, onClose }: { webhookUrl: string; visible: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<ScrollView>(null);
    const [isTyping, setIsTyping] = useState(false);

    const getChatId = () => {
        let chatId = globalThis.sessionStorage?.getItem("chatId");
        if (!chatId) {
            chatId = "chat_" + Math.random().toString(36).substr(2, 9);
            globalThis.sessionStorage?.setItem("chatId", chatId);
        }
        return chatId;
    };


    const sendMessage = async () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { type: "user", text: input }]);
        const chatId = getChatId();
        const messageToSend = input;
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId, message: messageToSend, route: "general" }),
            });

            const text = await response.text();

            let botText = "Sorry, I couldn't understand that.";

            try {
                const data = JSON.parse(text);

                if (Array.isArray(data)) {
                    // Lấy tất cả output trong array và nối thành một chuỗi
                    botText = data.map(item => item.output).join("\n");
                } else if (data.output) {
                    botText = data.output;
                } else {
                    botText = Object.values(data).join("\n");
                }
            } catch (err) {
                // Nếu không phải JSON, dùng nguyên text
                botText = text;
            }

            setMessages(prev => [...prev, { type: "bot", text: botText }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { type: "bot", text: "Error sending message" }]);
        } finally {
            setIsTyping(false);
        }

        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    if (!visible) return null;

    return (
        <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.chatHeader}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Chat</Text>
                <Pressable onPress={onClose}>
                    <Text style={{ color: "white", fontSize: 18 }}>✖</Text>
                </Pressable>
            </View>
            <ScrollView ref={scrollRef} style={styles.chatBody}>
                {messages.map((msg, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.chatBubble,
                            msg.type === "user" ? styles.userBubble : styles.botBubble,
                        ]}
                    >
                        <Text style={{ color: msg.type === "user" ? "#333" : "#fff" }}>{msg.text}</Text>
                    </View>
                ))}
                {isTyping && <TypingIndicator />}
            </ScrollView>
            <View style={styles.chatFooter}>
                <TextInput
                    style={styles.chatInput}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                />
                <Pressable style={styles.sendButton} onPress={sendMessage}>
                    <MaterialCommunityIcons name="send" size={24} color="white" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default function HomeScreen() {
    const currentUser = useAuthStore((state) => state.user);
    const { workoutsQuery, userBmiLevel, isLoading, isLoadingBmi } = useHome();
    const { logout } = useAuth();
    const navigation = useNavigation();

    const handleLogout = async () => {
        try { await logout(); console.log("Logout successfully"); } 
        catch (error) { console.log("Lỗi đăng xuất: ", error); }
    };

    const getStarCount = (level: string | undefined): number => {
        if (!level) return 0;
        const map: { [key: string]: number } = {
            'underweight': 2,
            'normal weight': 4,
            'overweight': 3,
            'obesity level i': 2,
            'obesity level ii': 1,
        };
        return map[level.toLowerCase()] || 0;
    };

    const getLevelLabel = (level: string | undefined): string => {
        if (!level || typeof level !== 'string') return 'Unknown';
        return level;
    };

    const getStarColor = (currentIndex: number, totalStars: number): string => {
        if (currentIndex <= totalStars) {
            if (totalStars === 4) return '#4CAF50'; // Green - Excellent
            if (totalStars === 3) return '#FFC107'; // Amber/Yellow - Good
            if (totalStars === 2) return '#FF9800'; // Orange - Warning
            if (totalStars === 1) return '#F44336'; // Red - Danger
            return '#CCCCCC';
        }
        return '#CCCCCC'; // Empty stars - gray
    };

    const getBmiIconColor = (stars: number): string => {
        if (stars === 4) return '#4CAF50'; 
        if (stars === 3) return '#FFC107'; 
        if (stars === 2) return '#FF9800'; 
        if (stars === 1) return '#F44336'; 
        return '#9E9E9E'; 
    };

    // Parse BMI data from response
    const bmiData = userBmiLevel.data?.data;
    const bmiMessage = bmiData?.message;
    
    const starCount = getStarCount(bmiMessage ?? undefined);
    const levelLabel = getLevelLabel(bmiMessage ?? undefined);

    // Calculate age from date of birth
    const calculateAge = (dob: Date | undefined): number => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const userAge = calculateAge(currentUser?.profile?.dob);
    const userHeight = currentUser?.profile?.height || 0;
    const userWeight = currentUser?.profile?.weight || 0;

    // TypingIndicator component
    const TypingIndicator = () => {
        const [dotCount, setDotCount] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setDotCount(prev => (prev + 1) % 4); // 0 -> 1 -> 2 -> 3 -> 0
            }, 500);
            return () => clearInterval(interval);
        }, []);

        return (
            <View style={[styles.chatBubble, styles.botBubble]}>
                <Text style={{ color: "#fff" }}>Typing{".".repeat(dotCount)}</Text>
            </View>
        );
    };


    const [chatVisible, setChatVisible] = useState(false);
    const webhookUrl = "https://proctodeal-lissa-godlily.ngrok-free.dev/webhook/eca094ad-fbdc-456c-89e6-937a690fc537/chat";

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <Surface style={styles.header} elevation={2}>
                    <Text variant="headlineSmall" style={styles.headerTitle}>
                        My strength level
                    </Text>
                    <IconButton
                        icon={() => <Avatar.Image size={40} source={require('../../../assets/images/icon.png')} />}
                        onPress={handleLogout}
                    />
                </Surface>

                {/* Profile Section */}
                <Card style={styles.card} elevation={1}>
                    <Card.Content style={styles.profileContent}>
                        <Avatar.Image size={100} source={require('../../../assets/images/icon.png')} />
                        <Text variant="headlineMedium" style={styles.username}>
                            {currentUser?.profile?.name || "Unknown User"}
                        </Text>
                        <Chip mode="outlined" icon="human-male" style={styles.chip}>
                            Male
                        </Chip>
                        <View style={styles.statsRow}>
                            <StatItem icon="human-male-height" value={`${userHeight} cm`} label="HEIGHT" iconColor="#2196F3" />
                            <View style={styles.divider} />
                            <StatItem icon="weight-kilogram" value={`${userWeight} kg`} label="WEIGHT" iconColor="#FF5722" />
                            <View style={styles.divider} />
                            <StatItem icon="cake-variant" value={`${userAge} years`} label="AGE" iconColor="#9C27B0" />
                        </View>
                    </Card.Content>
                </Card>

                {/* Stats & BMI Card */}
                <Card style={styles.card} elevation={1}>
                    <Card.Content style={{ paddingVertical: 16 }}>
                        <View style={styles.statsRow}>
                            <Pressable 
                                style={({ pressed }) => [styles.statItem, pressed && { opacity: 0.6 }]}
                                onPress={() => router.push("/(app)/workout")}
                            >
                                <MaterialCommunityIcons name="dumbbell" size={28} color="#003366"/>
                                <Text variant="displaySmall" style={styles.statNumber}>
                                    {isLoading ? '...' : workoutsQuery.data?.data?.length || 0}
                                </Text>
                                <Text variant="labelLarge" style={styles.statLabel}>
                                    WORKOUTS
                                </Text>
                            </Pressable>
                            <View style={[styles.divider, { height: 80 }]} />
                            <Pressable
                                style={({ pressed }) => [styles.statItem, pressed && { opacity: 0.6 }]}
                                onPress={() => router.push("/(app)/measurement")}
                            >
                                <MaterialCommunityIcons 
                                    name="scale-bathroom" 
                                    size={28} 
                                    color={getBmiIconColor(starCount)} 
                                />
                                <Text variant="displaySmall" style={[styles.statNumber, { color: getBmiIconColor(starCount) }]}>
                                    {isLoadingBmi ? '...' : bmiData?.bmi?.toFixed(1) || '0'}
                                </Text>
                                <View style={styles.starsContainer}>
                                    {isLoadingBmi ? (
                                        <Text variant="bodyLarge">...</Text>
                                    ) : (
                                        [...Array(4)].map((_, index) => (
                                            <MaterialCommunityIcons
                                                key={index}
                                                name={index < starCount ? "star" : "star-outline"}
                                                size={24}
                                                color={getStarColor(index + 1, starCount)}
                                            />
                                        ))
                                    )}
                                </View>

                                <Text variant="labelLarge" style={styles.statLabel}>
                                    {levelLabel.toUpperCase()}
                                </Text>
                            </Pressable>
                        </View>
                    </Card.Content>
                </Card>

                {/* Menu Grid */}
                <View style={styles.menuContainer}>
                    <Card onPress={() => router.push("/(app)/workout")} style={styles.menuCard} elevation={1}>
                        <Card.Content style={styles.menuItem}>
                            <MaterialCommunityIcons name="dumbbell" size={32} color="#003366" />
                            <Text variant="titleMedium" style={styles.menuText}>Workouts</Text>
                        </Card.Content>
                    </Card>

                    <Card onPress={() => router.push("/(app)/exercise")} style={styles.menuCard} elevation={1}>
                        <Card.Content style={styles.menuItem}>
                            <MaterialCommunityIcons name="clipboard-list" size={32} color="#003366" />
                            <Text variant="titleMedium" style={styles.menuText}>Exercises</Text>
                        </Card.Content>
                    </Card>

                    <Card onPress={() => router.push("/(app)/measurement")} style={styles.menuCard} elevation={1}>
                        <Card.Content style={styles.menuItem}>
                            <MaterialCommunityIcons name="tape-measure" size={32} color="#003366" />
                            <Text variant="titleMedium" style={styles.menuText}>Measurements</Text>
                        </Card.Content>
                    </Card>

                    <Card onPress={() => router.push("/(app)/profile")} style={styles.menuCard} elevation={1}>
                        <Card.Content style={styles.menuItem}>
                            <MaterialCommunityIcons name="account" size={32} color="#003366" />
                            <Text variant="titleMedium" style={styles.menuText}>Profile</Text>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>

            {/* Chat Button */}
            {!chatVisible && (
                <Pressable style={styles.chatButton} onPress={() => setChatVisible(true)}>
                    <Text style={{ fontSize: 24 }}>💬</Text>
                </Pressable>
            )}

            {/* Chat Widget */}
            <ChatWidget webhookUrl={webhookUrl} visible={chatVisible} onClose={() => setChatVisible(false)} />
            
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#003366' },
    headerTitle: { color: 'white', fontWeight: 'bold' },
    card: { marginHorizontal: 16, marginBottom: 12, backgroundColor: 'white' },
    profileContent: { alignItems: 'center', paddingTop: 20, paddingBottom: 12 },
    username: { fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
    chip: { marginTop: 8, marginBottom: 12 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8 },
    statItem: { flex: 1, alignItems: 'center', gap: 6 },
    statNumber: { fontWeight: 'bold', color: '#003366' },
    statValue: { fontWeight: '600', color: '#333', fontSize: 15, marginTop: 2 },
    statLabel: { color: '#666', marginTop: 4, letterSpacing: 0.5, fontSize: 10 },
    divider: { width: 1, height: 50, backgroundColor: '#E0E0E0', marginHorizontal: 8 },
    starsContainer: { flexDirection: 'row', gap: 4, marginVertical: 4 },
    menuContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 16, justifyContent: 'space-between' },
    menuCard: { width: '48%', marginBottom: 12, backgroundColor: 'white' },
    menuItem: { alignItems: 'center', paddingVertical: 20 },
    menuText: { marginTop: 12, color: '#003366', fontWeight: '600' },
    chatButton: { 
    position: "absolute", bottom: 20, right: 20, 
    backgroundColor: "#003366", width: 50, height: 50, 
    borderRadius: 25, justifyContent: "center", alignItems: "center", 
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 
},
chatContainer: { 
    position: "absolute", bottom: 20, right: 20, width: 350, height: 500, 
    backgroundColor: "#E8F0FE", borderRadius: 12, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, overflow: "hidden" 
},
chatHeader: { 
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
    padding: 16, backgroundColor: "#003366" 
},
chatBody: { flex: 1, padding: 16, backgroundColor: "#E8F0FE" },
chatBubble: { padding: 12, borderRadius: 8, marginBottom: 12, maxWidth: "80%" },
userBubble: { backgroundColor: "#D1E3FF", alignSelf: "flex-end" }, // user bubble màu xanh nhạt
botBubble: { backgroundColor: "#003366", alignSelf: "flex-start" }, // bot bubble màu xanh đậm
chatFooter: { flexDirection: "row", padding: 12, borderTopWidth: 1, borderColor: "#ccc", alignItems: "center" },
chatInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, backgroundColor: "#fff" },
sendButton: { backgroundColor: "#003366", borderRadius: 8, padding: 8, justifyContent: "center", alignItems: "center" },

});