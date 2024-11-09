import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter

const PaymentScreen = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentOption, setPaymentOption] = useState<string>('Tiền mặt');
  const [showQRCode, setShowQRCode] = useState<boolean>(false); // State to control QR code display
  const router = useRouter(); // Initialize the router

  const handlePayment = async () => {
    if (!customerName || !address || !phoneNumber || !amount) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.2:3000/api/payments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName,
          address: address,
          phone_number: phoneNumber,
          amount: amount,
          payment_option: paymentOption,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Hoàn thành', data.message || 'Đặt hàng thành công!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể hoàn tất thanh toán');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Lỗi', `Không thể hoàn tất thanh toán: ${error.message}`);
        console.error(error);
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau.');
        console.error('Unknown error:', error);
      }
    }
  };

  const handlePaymentOption = (option: string) => {
    setPaymentOption(option);
    if (option === 'Online') {
      setShowQRCode(true); // Show QR code when 'Online' is selected
    } else {
      setShowQRCode(false); // Hide QR code when 'Tiền mặt' is selected
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh Toán</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Tên khách hàng"
        />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Địa chỉ"
        />
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          value={amount.toString()}
          onChangeText={(value) => setAmount(Number(value))}
          placeholder="Số tiền"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Phương thức thanh toán</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.paymentButton, paymentOption === 'Tiền mặt' && styles.selectedButton]}
          onPress={() => handlePaymentOption('Tiền mặt')}
        >
          <Text style={styles.buttonText}>Tiền mặt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, paymentOption === 'Online' && styles.selectedButton]}
          onPress={() => handlePaymentOption('Online')}
        >
          <Text style={styles.buttonText}>Online</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render QR code image for Online payment */}
      {showQRCode && (
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodeLabel}>Quét mã QR để thanh toán Online:</Text>
          <Image
            source={require('../assets/images/abcd.jpg')} // Replace with your actual file path
            style={styles.qrCode}
          />
        </View>
      )}

      <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
        <Text style={styles.buttonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>

      {/* Back Button to navigate to HomeScreen */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/HomeScreen')}>
        <Text style={styles.buttonText}>Quay lại HomeScreen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap', // Đảm bảo các nút có thể quấn lại trên các dòng nếu không đủ không gian
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 12,  // Thay đổi padding để nút không quá cao
    backgroundColor: '#ff6347',  // Màu sắc nổi bật
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minWidth: '45%', // Đảm bảo nút không quá nhỏ
  },
  selectedButton: {
    backgroundColor: '#007BFF',  // Màu của nút được chọn
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#28a745',  // Màu xanh lá cho nút xác nhận
    paddingVertical: 12,  // Thay đổi padding cho nút xác nhận
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    minWidth: '45%', // Đảm bảo nút không quá nhỏ
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrCodeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  qrCode: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,  // Giảm chiều cao của nút
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    minWidth: '45%', // Đảm bảo nút không quá nhỏ
  },
});



export default PaymentScreen;
