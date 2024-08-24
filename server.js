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


















// Get a specific destination
app.get("/destinations/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM destination WHERE idx = ?", [id], (err, row) => {
    handleResponse(res, err, row, 404, "Destination not found");
  });
});

// Create a new destination
app.post("/destinations", (req, res) => {
  const { zone } = req.body;
  db.run("INSERT INTO destination (zone) VALUES (?)", [zone], function (err) {
    handleResponse(
      res,
      err,
      { message: "Destination created successfully", id: this.lastID },
      500,
      "Failed to create destination"
    );
  });
});

// Update a destination
app.put("/destinations/:id", (req, res) => {
  const id = req.params.id;
  const { zone } = req.body;
  db.run(
    "UPDATE destination SET zone = ? WHERE idx = ?",
    [zone, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Destination updated successfully" },
        404,
        "Destination not found",
        this.changes
      );
    }
  );
});

// Delete a destination
app.delete("/destinations/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM destination WHERE idx = ?", [id], function (err) {
    handleResponse(
      res,
      err,
      { message: "Destination deleted successfully" },
      404,
      "Destination not found",
      this.changes
    );
  });
});

// ------------------------------------------------------------
// TRIPS CRUD
// ------------------------------------------------------------
// Get all trips
app.get("/trips", (req, res) => {
  const sql = `
    SELECT 
      t.idx, 
      t.name, 
      t.country, 
      t.coverimage, 
      t.detail, 
      t.price, 
      t.duration,
      d.zone AS destination_zone 
    FROM 
      trip AS t
    JOIN 
      destination AS d ON t.destinationid = d.idx
  `;

  db.all(sql, [], (err, rows) => {
    handleResponse(res, err, rows);
  });
});

// Get a specific trip
app.get("/trips/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT 
      t.idx, 
      t.name, 
      t.country, 
      t.coverimage, 
      t.detail, 
      t.price, 
      t.duration,
      d.zone AS destination_zone 
    FROM 
      trip AS t
    JOIN 
      destination AS d ON t.destinationid = d.idx
    WHERE 
      t.idx = ?
  `;

  db.get(sql, [id], (err, row) => {
    handleResponse(res, err, row, 404, "Trip not found");
  });
});

// Create a new trip
app.post("/trips", (req, res) => {
  const { name, country, destinationid, coverimage, detail, price, duration } =
    req.body;
  db.run(
    "INSERT INTO trip (name, country, destinationid, coverimage, detail, price, duration) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, country, destinationid, coverimage, detail, price, duration],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Trip created successfully", id: this.lastID },
        500,
        "Failed to create trip"
      );
    }
  );
});

// Update a trip
app.put("/trips/:id", (req, res) => {
  const id = req.params.id;
  const { name, country, destinationid, coverimage, detail, price, duration } =
    req.body;
  db.run(
    "UPDATE trip SET name = ?, country = ?, destinationid = ?, coverimage = ?, detail = ?, price = ?, duration = ? WHERE idx = ?",
    [name, country, destinationid, coverimage, detail, price, duration, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Trip updated successfully" },
        404,
        "Trip not found",
        this.changes
      );
    }
  );
});

// Delete a trip
app.delete("/trips/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM trip WHERE idx = ?", [id], function (err) {
    handleResponse(
      res,
      err,
      { message: "Trip deleted successfully" },
      404,
      "Trip not found",
      this.changes
    );
  });
});

// ------------------------------------------------------------
// CUSTOMERS CRUD
// ------------------------------------------------------------
// Get all customers
app.get("/customers", (req, res) => {
  db.all("SELECT * FROM customer", [], (err, rows) => {
    if (err) {
      handleResponse(res, err);
      return;
    }

    // Remove password from each customer object
    const sanitizedRows = rows.map(row => {
      const sanitizedRow = { ...row };
      delete sanitizedRow.password;
      return sanitizedRow;
    });

    handleResponse(res, null, sanitizedRows); 
  });
});



// Create a new customer
app.post("/customers", (req, res) => {
  const { fullname, phone, email, image, password } = req.body;
  db.run(
    "INSERT INTO customer (fullname, phone, email, image, password) VALUES (?, ?, ?, ?, ?)",
    [fullname, phone, email, image, password],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Customer created successfully", id: this.lastID },
        500,
        "Failed to create customer"
      );
    }
  );
});

// Update a customer
app.put("/customers/:id", (req, res) => {
  const id = req.params.id;
  const { fullname, phone, email, image } = req.body;
  db.run(
    "UPDATE customer SET fullname = ?, phone = ?, email = ?, image = ? WHERE idx = ?",
    [fullname, phone, email, image, id],
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

// Delete a customer
app.delete("/customers/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM customer WHERE idx = ?", [id], function (err) {
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


// ------------------------------------------------------------
// MEETINGS CRUD
// ------------------------------------------------------------
// Get all meetings
app.get("/meetings", (req, res) => {
  db.all("SELECT * FROM meeting", [], (err, rows) => {
    handleResponse(res, err, rows);
  });
});

// Get a specific meeting
app.get("/meetings/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM meeting WHERE idx = ?", [id], (err, row) => {
    handleResponse(res, err, row, 404, "Meeting not found");
  });
});

// Create a new meeting
app.post("/meetings", (req, res) => {
  const { detail, meetingdatetime, latitude, longitude } = req.body;
  db.run(
    "INSERT INTO meeting (detail, meetingdatetime, latitude, longitude) VALUES (?, ?, ?, ?)",
    [detail, meetingdatetime, latitude, longitude],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Meeting created successfully", id: this.lastID },
        500,
        "Failed to create meeting"
      );
    }
  );
});

// Update a meeting
app.put("/meetings/:id", (req, res) => {
  const id = req.params.id;
  const { detail, meetingdatetime, latitude, longitude } = req.body;
  db.run(
    "UPDATE meeting SET detail = ?, meetingdatetime = ?, latitude = ?, longitude = ? WHERE idx = ?",
    [detail, meetingdatetime, latitude, longitude, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Meeting updated successfully" },
        404,
        "Meeting not found",
        this.changes
      );
    }
  );
});

// Delete a meeting
app.delete("/meetings/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM meeting WHERE idx = ?", [id], function (err) {
    handleResponse(
      res,
      err,
      { message: "Meeting deleted successfully" },
      404,
      "Meeting not found",
      this.changes
    );
  });
});

// ------------------------------------------------------------
// BOOKINGS CRUD
// ------------------------------------------------------------
// Get all bookings
app.get("/bookings", (req, res) => {
  db.all("SELECT * FROM booking", [], (err, rows) => {
    handleResponse(res, err, rows);
  });
});

// Get a specific booking
app.get("/bookings/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM booking WHERE idx = ?", [id], (err, row) => {
    handleResponse(res, err, row, 404, "Booking not found");
  });
});

// Create a new booking
app.post("/bookings", (req, res) => {
  const { customerid, bookdatetime, tripid, meetingid } = req.body;
  db.run(
    "INSERT INTO booking (customerid, bookdatetime, tripid, meetingid) VALUES (?, ?, ?, ?)",
    [customerid, bookdatetime, tripid, meetingid],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Booking created successfully", id: this.lastID },
        500,
        "Failed to create booking"
      );
    }
  );
});

// Update a booking
app.put("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const { customerid, bookdatetime, tripid, meetingid } = req.body;
  db.run(
    "UPDATE booking SET customerid = ?, bookdatetime = ?, tripid = ?, meetingid = ? WHERE idx = ?",
    [customerid, bookdatetime, tripid, meetingid, id],
    function (err) {
      handleResponse(
        res,
        err,
        { message: "Booking updated successfully" },
        404,
        "Booking not found",
        this.changes
      );
    }
  );
});

// Delete a booking
app.delete("/bookings/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM booking WHERE idx = ?", [id], function (err) {
    handleResponse(
      res,
      err,
      { message: "Booking deleted successfully" },
      404,
      "Booking not found",
      this.changes
    );
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
