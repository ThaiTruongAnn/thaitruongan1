import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  ImageBackground,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const TextInputExample = () => {
  const [name, setName] = React.useState(''); // Thêm state cho tên
  const [email, setEmail] = React.useState(''); // Thêm state cho email
  const [password, setPassword] = React.useState(''); // Thêm state cho mật khẩu
  const [confirmPassword, setConfirmPassword] = React.useState(''); // Thêm state cho xác nhận mật khẩu
  const image = { uri: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3p5bjMya3lsOHRpNnZmd2p0Y2hnMWRtZjlsOHZ2andxd3d6bjB4dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt81XtsGtno6Cju/giphy.gif' };
  const router = useRouter();

  const handleSignUp = () => {
    // Đảm bảo tất cả các trường đều được nhập
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    // Gửi dữ liệu đến API
    fetch('http://192.168.1.2:3000/api/users/', { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name, // Gửi trường name
        email: email, // Gửi trường email
        password: password, // Gửi trường password
      }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(json => {
      console.log(json);
      Alert.alert('ĐĂNG KÍ TÀI KHOẢN THÀNH CÔNG', 'Thông tin tài khoản đã được đăng ký!');
    })
    .catch(error => {
      console.error('Có lỗi xảy ra:', error); // Hiển thị lỗi chi tiết
      Alert.alert('Lỗi', 'Đăng ký không thành công, vui lòng thử lại!');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.header}>TẠO TÀI KHOẢN</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setName} // Thay đổi cho tên
              placeholder="Tên"
              placeholderTextColor="#aaa"
              value={name}
            />
            <TextInput
              style={styles.input}
              onChangeText={setEmail} // Thay đổi cho email
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword} // Thay đổi cho mật khẩu
              value={password}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              onChangeText={setConfirmPassword} // Thay đổi cho xác nhận mật khẩu
              value={confirmPassword}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>ĐĂNG KÍ TÀI KHOẢN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007aff',
    fontSize: 16,
  },
});

export default TextInputExample;
