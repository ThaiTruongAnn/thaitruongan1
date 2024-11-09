const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Mật khẩu MySQL trên XAMPP
  database: "myapp", // Tên cơ sở dữ liệu
});

// Kết nối đến MySQL
db.connect((err) => {
  if (err) {
    console.error("Không thể kết nối MySQL:", err);
    return;
  }
  console.log("Đã kết nối MySQL!");
});

// Routes cho bảng user
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy người dùng:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.json(results);
  });
});

// Thêm người dùng
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;
  db.query(
    "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm người dùng:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      res.json({ message: "Thêm user thành công!", userId: results.insertId });
    }
  );
});

// Routes cho đăng nhập
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi đăng nhập:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      if (results.length > 0) {
        const user = results[0];
        res.json({
          message: "Đăng nhập thành công!",
          userId: user.id, 
        });
      } else {
        res.status(401).json({
          message: "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.",
        });
      }
    }
  );
});

// Routes cho bảng product
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM product", (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.json(results);
  });
});

// Thêm sản phẩm
app.post("/api/products", (req, res) => {
  const { name, price, description, image } = req.body; // Thêm trường image
  db.query(
    "INSERT INTO product (name, price, description, image) VALUES (?, ?, ?, ?)",
    [name, price, description, image],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm sản phẩm:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      res.json({ message: "Thêm sản phẩm thành công!", productId: results.insertId });
    }
  );
});

// Routes cho chi tiết sản phẩm
app.get("/api/products/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "Product ID không hợp lệ." });
  }

  db.query(
    "SELECT * FROM product WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.json(results[0]); // Trả về product
    }
  );
});

// Routes cho bảng cart
app.get("/api/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM cart INNER JOIN product ON cart.product_id = product.id WHERE cart.user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      res.json(results);
    }
  );
});

// Thêm sản phẩm vào giỏ hàng
app.post("/api/cart", (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Kiểm tra xem các trường không được null
  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "userId, productId và quantity không được để trống." });
  }

  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
    [userId, productId, quantity, quantity],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm vào giỏ hàng:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      res.json({ message: "Thêm vào giỏ hàng thành công!" });
    }
  );
});

// Xóa sản phẩm khỏi giỏ hàng
app.delete("/api/cart", (req, res) => {
  const { userId, productId } = req.body;

  // Kiểm tra xem userId và productId không được null
  if (!userId || !productId) {
    return res.status(400).json({ message: "userId và productId không được để trống." });
  }

  db.query(
    "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
    [userId, productId],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
      }
      res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công!" });
    }
  );
});
// Routes cho bảng payment
// Lấy tất cả các thanh toán
app.get("/api/payments", (req, res) => {
  db.query("SELECT * FROM payment", (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thanh toán:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.json(results);
  });
});

// Thêm thông tin thanh toán
app.post("/api/payments", (req, res) => {
  const { customer_name, address, phone_number } = req.body;

  if (!customer_name || !address || !phone_number) {
    return res.status(400).json({ message: "Vui lòng cung cấp đủ thông tin thanh toán." });
  }

  db.query(
    "INSERT INTO payment (customer_name, address, phone_number) VALUES (?, ?, ?)",
    [customer_name, address, phone_number],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm thanh toán:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      res.json({ message: "Thêm thông tin thanh toán thành công!", paymentId: results.insertId });
    }
  );
});
// Route đổi mật khẩu
app.put("/api/users/:userId/change-password", (req, res) => {
  const userId = req.params.userId;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Vui lòng cung cấp mật khẩu cũ và mật khẩu mới." });
  }

  // Kiểm tra mật khẩu cũ
  db.query(
    "SELECT * FROM user WHERE id = ? AND password = ?",
    [userId, oldPassword],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi kiểm tra mật khẩu cũ:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Mật khẩu cũ không đúng." });
      }

      // Cập nhật mật khẩu mới
      db.query(
        "UPDATE user SET password = ? WHERE id = ?",
        [newPassword, userId],
        (err, results) => {
          if (err) {
            console.error("Lỗi khi cập nhật mật khẩu:", err);
            return res.status(500).json({ message: "Lỗi server" });
          }
          res.json({ message: "Mật khẩu đã được thay đổi thành công!" });
        }
      );
    }
  );
});




// Khởi động server
app.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});
