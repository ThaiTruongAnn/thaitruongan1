import React, { useState, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type ItemData = {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
};

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ItemData | null>(null);
  const [cart, setCart] = useState<ItemData[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const userId = 1;

  // Define the fallback image
  const image = { 
    uri: 'https://cotton4u.vn/files/news/2024/11/01/b0bbefc32189310f4def5fe56d26d7ba.webp'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://192.168.1.2:3000/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        const products = json.map((item: ItemData) => ({
          ...item,
          price: Number(item.price),
        }));
        setData(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      const response = await fetch('http://192.168.1.2:3000/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
          added_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add item to cart: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('Item added to cart:', result);
      setCart(prevCart => [...prevCart, { ...data.find(item => item.id === productId)!, quantity }]);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const filteredData = data.filter(item => item.image && item.image.trim() !== '');

  const renderItem = ({ item }: { item: ItemData }) => (
    <TouchableOpacity style={styles.item} onPress={() => setSelectedProduct(item)}>
      {/* Use the product's image, or fallback to the default image */}
      <Image
        source={item.image ? { uri: item.image } : image} // Check for product image, otherwise use fallback
        style={styles.itemImage}
        defaultSource={image} // Fallback to a default image
      />
      <Text style={styles.itemName}>{item.title}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => addToCart(item.id, quantity)}
      >
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const navigateToCart = () => {
    router.push('/Cart');
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Không",
          onPress: () => console.log("Hủy đăng xuất"),
          style: "cancel",
        },
        {
          text: "Có",
          onPress: () => {
            console.log('Logged out');
            router.back(); // Thay đổi điều hướng để quay lại màn hình trước đó
            setMenuVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.username}>STORE</Text>
        <TouchableOpacity onPress={navigateToCart}>
          <Ionicons name="cart" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Image above the search input */}
      <Image
        source={image}
        style={styles.bannerImage}
        defaultSource={image}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sản phẩm..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#aaa"
      />
      <FlatList
        data={filteredData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />

      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Text style={styles.menuText}>Đăng xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/password')}>
              <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={!!selectedProduct}
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.image || image.uri }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                <Text style={styles.modalPrice}>${selectedProduct.price.toFixed(2)}</Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    addToCart(selectedProduct.id, quantity);
                    setSelectedProduct(null);
                  }}
                >
                  <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 10,
    padding: 10,
    fontSize: 16,
  },
  item: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  columnWrapper: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#007bff',
  },
  buttonSecondary: {
    padding: 10,
    marginTop: 20,
    backgroundColor: '#f1f1f1',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
