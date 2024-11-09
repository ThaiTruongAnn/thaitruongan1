import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Đăng nhập thất bại', 'Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.2:3000/api/login', { // Cập nhật URL nếu cần
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (response.ok) {
        console.log('Đăng nhập thành công:', json);
        // Điều hướng đến HomeScreen và truyền userId
        router.push({
          pathname: '/HomeScreen', // Điều hướng đến HomeScreen
          params: { userId: json.id }, // Truyền userId vào params
        });
      } else {
        Alert.alert('Đăng nhập thất bại', json.message || 'Vui lòng kiểm tra thông tin đăng nhập.');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra trong quá trình đăng nhập:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server. Vui lòng thử lại.');
    }
  };

  const image = {
    uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3p5bjMya3lsOHRpNnZmd2p0Y2hnMWRtZjlsOHZ2andxd3d6bjB4dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt81XtsGtno6Cju/giphy.gif'
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.header}>ĐĂNG NHẬP</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              placeholder="EMAIL"
              value={email}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="MẬT KHẨU"
              secureTextEntry
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/sigin')}>
              <Text style={styles.buttonText}>ĐĂNG KÍ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  image: { flex: 1, justifyContent: 'center' },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: { justifyContent: 'center' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  button: {
    backgroundColor: '#007aff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default LoginScreen;
