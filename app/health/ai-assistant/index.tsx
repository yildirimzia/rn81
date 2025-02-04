import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useBabyContext } from '@/context/BabyContext';
import { TextInput } from 'react-native-gesture-handler';
import { aiApi } from '@/services/api/ai';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

const formatAIResponse = (text: string) => {
    // Başlıkları kalın yap
    text = text.replace(/\*\*(.*?)\*\*/g, '✦ $1');
    
    // Madde işaretlerini özelleştir
    text = text.replace(/\* /g, '• ');
    
    return text.split('\n').filter(line => line.trim() !== '');
};

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    headerTitle: TextStyle;
    messageContainer: ViewStyle;
    messageBubble: ViewStyle;
    userMessage: ViewStyle;
    assistantMessage: ViewStyle;
    aiResponseContainer: ViewStyle;
    aiResponseTitle: TextStyle;
    aiResponseBullet: TextStyle;
    messageText: TextStyle;
    timestamp: TextStyle;
    loadingContainer: ViewStyle;
    inputWrapper: ViewStyle;
    inputContainer: ViewStyle;
    inputIcon: TextStyle;
    input: TextStyle;
    sendButton: ViewStyle;
    sendButtonDisabled: ViewStyle;
}

const AiAssistantScreen = () => {
    const { babies } = useBabyContext();
    const [selectedBaby, setSelectedBaby] = useState(babies[0]?.id || null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const calculateAgeInMonths = (birthDate: Date) => {
        const today = new Date();
        return (today.getFullYear() - birthDate.getFullYear()) * 12 + 
               (today.getMonth() - birthDate.getMonth());
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || !selectedBaby) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const baby = babies.find(b => b.id === selectedBaby);
            if (!baby) {
                console.error('Bebek bulunamadı');
                return;
            }
            
            const ageInMonths = calculateAgeInMonths(new Date(baby.birthDate));
            console.log('İstek gönderiliyor:', {
                question: inputText,
                babyAge: ageInMonths,
                babyGender: baby.gender
            });

            const response = await aiApi.getResponse({
                question: inputText,
                babyAge: ageInMonths,
                babyGender: baby.gender || 'male'
            });

            console.log('API yanıtı:', response);

            if (response.data?.success) {
                const assistantMessage: Message = {
                    id: Date.now().toString(),
                    text: response.data.response,
                    sender: 'assistant',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error('AI yanıt hatası:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="psychology" size={24} color="#4A90E2" />
                <ThemedText style={styles.headerTitle}>Akıllı Asistan</ThemedText>
            </View>

            <ScrollView style={styles.messageContainer}>
                {messages.map(message => (
                    <View 
                        key={message.id} 
                        style={[
                            styles.messageBubble,
                            message.sender === 'user' ? styles.userMessage : styles.assistantMessage
                        ]}
                    >
                        {message.sender === 'assistant' ? (
                            <View style={styles.aiResponseContainer}>
                                {formatAIResponse(message.text).map((line, index) => (
                                    <ThemedText 
                                        key={index}
                                        style={[
                                            styles.messageText,
                                            { 
                                                color: '#333',
                                                ...(line.startsWith('✦') && styles.aiResponseTitle),
                                                ...(line.startsWith('•') && styles.aiResponseBullet)
                                            }
                                        ]}
                                    >
                                        {line}
                                    </ThemedText>
                                ))}
                            </View>
                        ) : (
                            <ThemedText style={[styles.messageText, { color: '#FFF' }]}>
                                {message.text}
                            </ThemedText>
                        )}
                        <ThemedText 
                            style={[
                                styles.timestamp,
                                { color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }
                            ]}
                        >
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </ThemedText>
                    </View>
                ))}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#4A90E2" />
                    </View>
                )}
            </ScrollView>

            <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="chat" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Bebeğiniz hakkında bir soru sorun..."
                        placeholderTextColor="#999"
                        multiline
                        maxLength={500}
                    />
                </View>
                <TouchableOpacity 
                    style={[
                        styles.sendButton,
                        (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                    ]}
                    onPress={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <MaterialIcons 
                            name="send" 
                            size={20} 
                            color="#FFF"
                        />
                    )}
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    messageContainer: {
        flex: 1,
        padding: 16,
        paddingBottom: 80,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: '#4A90E2',
        alignSelf: 'flex-end',
    },
    assistantMessage: {
        backgroundColor: '#F8F9FA',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        maxWidth: '85%',
        padding: 16,
    },
    aiResponseContainer: {
        gap: 8,
    },
    aiResponseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2196F3',
        marginTop: 8,
        marginBottom: 4,
    },
    aiResponseBullet: {
        paddingLeft: 8,
        color: '#666',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 12,
        marginTop: 4,
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    inputWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 24,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        minHeight: 48,
    },
    inputIcon: {
        marginRight: 8,
    } as TextStyle,
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        maxHeight: 100,
        padding: 0, // iOS için padding'i sıfırla
    } as TextStyle,
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#7F00FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7F00FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    sendButtonDisabled: {
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
});

export default AiAssistantScreen; 