import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // Thêm thư viện icon

interface ItemData {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  product_id: number;
}

const CartScreen: React.FC = () => {
  const router = useRouter();
  const [cart, setCart] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://192.168.1.2:3000/api/cart/1`);
        const data = await response.json();
        const validCartItems = data.filter((item: ItemData) => item.price !== undefined && item.title);
        setCart(validCartItems);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const totalAmount = cart.reduce((total, item) => {
    const price = Number(item.price) || 0;
    return total + price * item.quantity;
  }, 0);

  const formattedTotalAmount = totalAmount.toFixed(2);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    setCart(prevCart =>
      prevCart.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const deleteItem = async (productId: number) => {
    try {
      const userId = 1; 
      const response = await fetch(`http://192.168.1.2:3000/api/cart/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });
  
      if (!response.ok) {
        throw new Error('Không thể xóa sản phẩm');
      }
  
      setCart(prevCart => prevCart.filter((item: ItemData) => item.id !== productId));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };
  
  const renderItem = ({ item }: { item: ItemData }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.title}</Text>
        <Text style={styles.cartItemPrice}>${(Number(item.price) || 0).toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <MaterialIcons name="remove" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <MaterialIcons name="add" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.product_id)}>
            <MaterialIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Đang tải giỏ hàng...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Giỏ hàng của bạn</Text>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${item.product_id}-${index}`}
        ListEmptyComponent={<Text style={styles.emptyCartText}>Giỏ hàng của bạn trống</Text>}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng cộng: ${formattedTotalAmount}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/Payment')}>
        <Text style={styles.checkoutButtonText}>Thanh toán</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#007aff',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    padding: 8,
    borderRadius: 8,
  },
  totalContainer: {
    marginVertical: 25,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007aff',
    fontSize: 16,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});

export default CartScreen;
