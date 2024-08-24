// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000; 

const db = new sqlite3.Database("./lotto.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the LOTTO database.");
  }
});

app.use(express.json());

// ------------------------------------------------------------
// DESTINATIONS CRUD
// ------------------------------------------------------------
// Get all destinations
app.get("/", (req, res) => {
  console.log("Hello LOTTO!!!");
  res.send("Hello LOTTO!!!"); 
});

app.get("/allusers", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    handleResponse(res, err, rows);
  });
});


app.post("/login", (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    res.status(400).json({ error: "Username/Email and password are required" });
    return;
  }

  // Regular Expression สำหรับตรวจสอบ email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let sql;
  let params;

  if (emailRegex.test(usernameOrEmail)) {
    // ถ้าค่าที่ป้อนมาเป็นอีเมล
    sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    params = [usernameOrEmail, password];
  } else {
    // ถ้าค่าที่ป้อนมาไม่ใช่อีเมล (จะถือว่าเป็น username)
    sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    params = [usernameOrEmail, password];
  }

  // ค้นหาข้อมูลในฐานข้อมูล
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(401).json({ error: "Invalid username/email or password" });
      return;
    }

    // ลบรหัสผ่านออกจากผลลัพธ์ก่อนส่งกลับ
    const userData = { ...row };
    delete userData.password;

    // ส่งข้อมูลผู้ใช้กลับไป
    res.json({ message: "Login successful", users: userData });
  });
});


app.get("/customers/:uid", (req, res) => {
  const uid = req.params.uid;
  db.get("SELECT * FROM users WHERE uid = ?", [uid], (err, row) => {
    if (err) {
      handleResponse(res, err, null, 404, "Customer not found");
      return;
    }

    if (!row) {
      handleResponse(res, null, null, 404, "Customer not found");
      return;
    }

    const sanitizedRow = { ...row };
    delete sanitizedRow.password;

    handleResponse(res, null, sanitizedRow);
  });
});

app.get("/customers/detail/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM users WHERE uid = ?", [id], (err, row) => {
    if (err) {
      handleResponse(res, err, null, 404, "Customer not found");
      return;
    }

    if (!row) {
      handleResponse(res, null, null, 404, "Customer not found");
      return;
    }

    handleResponse(res, null, row); // ส่งข้อมูลที่ได้กลับไปทั้งหมดรวมทั้งรหัสผ่าน
  });
});

app.put("/customers/detail/update/:id", (req, res) => {
  const id = req.params.id;
  const { username, fullname, email, phone, password, image } = req.body;
  db.run(
    "UPDATE users SET username = ?, fullname = ?, email = ?, phone = ?, password = ?, image = ? WHERE uid = ?",
    [username, fullname, email, phone, password, image, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Customer updated successfully" },
        404,
        "Customer not found",
        this.changes
      );
    }
  );
});

app.delete("/customers/detail/delete/:id", (req, res) => {
  const uid = req.params.id;
  db.run("DELETE FROM users WHERE uid = ?", [uid], function (err) {
    handleResponse(
      res,
      err,
      { message: "Customer deleted successfully" },
      404,
      "Customer not found",
      this.changes
    );
  });
});





app.post("/register", (req, res) => {
  const { fullname, username, email, phone, password, wallet } = req.body;

  db.run(
    "INSERT INTO users (fullname, username, email, phone, password, wallet) VALUES (?, ?, ?, ?, ?, ?)",
    [fullname, username, email, phone, password, wallet],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "register successfully" },
        404,
        "error",
        this.lastID
      );
    }
  );
});



app.put("/customers/:id", (req, res) => {
  const id = req.params.id;
  const { usersname, fullname, phone, email, password, image } = req.body;
  db.run(
    `UPDATE users
     SET usersname = ?, fullname = ?, phone = ?, email = ?, password = ?, image = ?
     WHERE uid = ?`,
    [usersname, fullname, phone, email, password, image, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Customer updated successfully" },
        404,
        "Customer not found",
        this.changes
      );
    }
  );
});



app.get('/lotto', (req, res) => {
  const sql = `
             SELECT * FROM lotto
  `;
  db.all(sql, (err, row) => {
    console.log('Response from DB:', row); // แสดงข้อมูลที่ได้จากฐานข้อมูล
    handleResponse(res, err, row, 404, 'Lotto prize not found');
  });
});


app.get('/lotto-prize', (req, res) => {
  const sql = `
              SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
              FROM lotto_prize lp
              JOIN lotto l ON lp.lid = l.lid
  `;
  db.all(sql, (err, row) => {
    console.log('Response from DB:', row); // แสดงข้อมูลที่ได้จากฐานข้อมูล
    handleResponse(res, err, row, 404, 'Lotto prize not found');
  });
});


//กรณีอยากแสดงรางวัลต่อวัน
// app.get('/lotto-prize', (req, res) => {
//   const sql = `
//               SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
//               FROM lotto_prize lp
//               JOIN lotto l ON lp.lid = l.lid
//               WHERE DATE(l.date) = DATE('now')
//   `;
//   db.all(sql, (err, row) => {
//     console.log('Response from DB:', row); // แสดงข้อมูลที่ได้จากฐานข้อมูล
//     handleResponse(res, err, row, 404, 'Lotto prize not found');
//   });
// });



app.post('/lotto-types', (req, res) => {
  const { type } = req.body; // รับค่าจาก body ของคำขอ POST

  console.log('Type received:', type);

  if (!type) {
    return res.status(400).json({ error: 'Type parameter is required' });
  }

  const sql = `
    SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
    FROM lotto_prize lp
    JOIN lotto l ON lp.lid = l.lid
    WHERE l.type = ?
  `;
  
  db.all(sql, [type], (err, rows) => {
    if (err) {
      console.error('Database error:', err); 
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lotto prize not found' });
    }

    console.log('Querying for type:', type); 
    console.log('Response from DB:', rows);

    res.status(200).json(rows);
  });
});


app.get('/lotto/types', (req, res) => {
  const { type } = req.query; // รับค่าจาก query string

  console.log('Type received:', type);

  if (!type) {
    return res.status(400).json({ error: 'Type parameter is required' });
  }

  const sql = `
    SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
    FROM lotto_prize lp
    JOIN lotto l ON lp.lid = l.lid
    WHERE l.type = ?
  `;
  
  db.all(sql, [type], (err, rows) => {
    if (err) {
      console.error('Database error:', err); 
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lotto prize not found' });
    }

    console.log('Querying for type:', type); 
    console.log('Response from DB:', rows);

    res.status(200).json(rows);
  });
});





// app.post('/lotto-prize/type/', (req, res) => {
//   const { type } = req.body;

//   console.log('Type received:', type);

//   if (!type) {
//     return res.status(400).json({ error: 'Type parameter is required' });
//   }

//   const sql = `
//     SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
//     FROM lotto_prize lp
//     JOIN lotto l ON lp.lid = l.lid
//     WHERE l.type = ?
//   `;
  
//   db.all(sql, [type], (err, rows) => {
//     if (err) {
//       console.error('Database error:', err); 
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Lotto prize not found' });
//     }

//     console.log('Querying for type:', type); 
//     console.log('Response from DB:', rows);

//     res.status(200).json(rows);
//   });
// });


app.get('/lotto-prize/type', (req, res) => {
  const { type } = req.query; // ใช้ req.query แทน req.body

  console.log('Type received:', type);

  if (!type) {
    return res.status(400).json({ error: 'Type parameter is required' });
  }

  const sql = `
    SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
    FROM lotto_prize lp
    JOIN lotto l ON lp.lid = l.lid
    WHERE l.type = ?
  `;
  
  db.all(sql, [type], (err, rows) => {
    if (err) {
      console.error('Database error:', err); 
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lotto prize not found' });
    }

    console.log('Querying for type:', type); 
    console.log('Response from DB:', rows);

    res.status(200).json(rows);
  });
});



// ------------------------------------------------------------
// HELPER FUNCTION
// ------------------------------------------------------------
// Helper function to handle API responses
function handleResponse(
  res,
  err,
  data,
  notFoundStatusCode = 404,
  notFoundMessage = "Not found",
  changes = null
) {
  if (err) {
    res.status(500).json({ error: err.message });
    return;
  }
  if (!data && !changes) {
    res.status(notFoundStatusCode).json({ error: notFoundMessage });
    return;
  }
  res.json(data);
}

var os = require("os");
var ip = "0.0.0.0";
var ips = os.networkInterfaces();
Object.keys(ips).forEach(function (_interface) {
  ips[_interface].forEach(function (_dev) {
    if (_dev.family === "IPv4" && !_dev.internal) ip = _dev.address;
  });
});

app.listen(port, () => {
  console.log(`LOTTO APP API listening at http://${ip}:${port}`);
});
