import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp', 'Vui lòng nhập lại mật khẩu mới.');
      return;
    }

    try {
      const userId = 1; // Lấy userId từ thông tin đăng nhập
      const response = await axios.put(
        `http://192.168.1.2:3000/api/users/${userId}/change-password`,
        { oldPassword, newPassword }
      );

      if (response.status === 200) {
        Alert.alert('Thành công', 'Mật khẩu đã được thay đổi.');
      } else {
        Alert.alert('Lỗi', 'Đổi mật khẩu không thành công.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Mật khẩu cũ"
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 }}
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        placeholder="Mật khẩu mới"
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 }}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 10 }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Đổi mật khẩu" onPress={handleChangePassword} />
    </View>
    
  );
};

export default ChangePasswordScreen;
