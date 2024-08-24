-- /*
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS lotto_prize;
-- DROP TABLE IF EXISTS lotto;

-- ALTER TABLE lotto RENAME TO lotto_prize;
-- */

-- CREATE TABLE users (
--     uid INTEGER PRIMARY KEY AUTOINCREMENT,
--     fullname TEXT NOT NULL,
--     username TEXT NOT NULL UNIQUE,
--     email TEXT NOT NULL UNIQUE,
--     phone TEXT NOT NULL UNIQUE,
--     password TEXT NOT NULL,
--     type INTEGER CHECK(type IN (0, 1)) DEFAULT 1 NOT NULL,
--     wallet DECIMAL(10, 2) DEFAULT 0.00,
--     image TEXT DEFAULT NULL
-- );


-- CREATE TABLE lotto (
--   lid INTEGER PRIMARY KEY AUTOINCREMENT,
--   number INTEGER NOT NULL,
--    type TEXT CHECK(type IN ('หวยเดี่ยว', 'หวยชุด')),
--   price DECIMAL(10, 2) DEFAULT 0.00,
--   lotto_quantity INTEGER DEFAULT 0,
--   date TEXT DEFAULT (datetime('now'))
-- );

-- CREATE TABLE lotto_prize (
--   lpid INTEGER PRIMARY KEY AUTOINCREMENT,
--   lid INTEGER NOT NULL,
--   prize INTEGER DEFAULT NULL,
--   FOREIGN KEY (lid) REFERENCES lotto (lid)
-- );


-- INSERT INTO lotto (number, type, price, lotto_quantity) VALUES (123456, 'หวยเดี่ยว', 80, 99);
-- INSERT INTO lotto (number, type, price, lotto_quantity) VALUES (654321, 'หวยชุด', 400, 40);
-- INSERT INTO lotto (number,type, price, lotto_quantity) VALUES (112233, 'หวยเดี่ยว', 80, 54);
-- INSERT INTO lotto (number,type, price, lotto_quantity) VALUES (888999, 'หวยชุด', 400, 19);
-- INSERT INTO lotto (number,type, price, lotto_quantity) VALUES (123321, 'หวยเดี่ยว', 80, 23);
-- INSERT INTO lotto (number,type, price, lotto_quantity) VALUES (111111, 'หวยเดี่ยว', 80, 10);
-- INSERT INTO lotto (number,type, price, lotto_quantity) VALUES (122222, 'หวยเดี่ยว', 80, 9);

-- INSERT INTO lotto_prize (lid, prize) VALUES (3, 1);
-- INSERT INTO lotto_prize (lid, prize) VALUES (2, 2);
-- INSERT INTO lotto_prize (lid, prize) VALUES (1, 3);
-- INSERT INTO lotto_prize (lid, prize) VALUES (5, 4);
-- INSERT INTO lotto_prize (lid, prize) VALUES (4, 5);




-- SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
-- FROM lotto_prize lp
-- JOIN lotto l ON lp.lid = l.lid
-- WHERE lp.prize = 1;


--  SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
--               FROM lotto_prize lp
--               JOIN lotto l ON lp.lid = l.lid
--               WHERE DATE(l.date) = DATE('now');



--   SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
--               FROM lotto_prize lp
--               JOIN lotto l ON lp.lid = l.lid

-- SELECT * FROM lotto


-- PRAGMA table_info(lotto_prize);






-- INSERT INTO users (fullname, username, email, phone, password, type, wallet) 
-- VALUES ('Admin Kung', 'admin_kung', 'adminkung@gmail.com', '0987654321', '1', 0, 0.00);



-- INSERT INTO users (fullname, username, email, phone, password, wallet, image) 
-- VALUES ('อัษฎาวุธ ไชยรักษ์', 'yakukung', 'k@gmail.com', '0910091988', '1', 100.00, 'https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Icon_Emoji_Paimon%27s_Paintings_23_Cyno_1.png/revision/latest?cb=20230506045219');

-- INSERT INTO users (fullname, username, email, phone, password, wallet) 
-- VALUES ('ผู้มาเยือนนิรนาม', 'kung', 'kung@gmail.com', '0950939712', '123', 100.00);

-- INSERT INTO users (fullname, username, email, phone, password, wallet, image) 
-- VALUES ('Yakukung', 'kung123', 'kung123@gmail.com', '0950855604', '123', 100.00, 'https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Icon_Emoji_Paimon%27s_Paintings_23_Cyno_1.png/revision/latest?cb=20230506045219');

-- UPDATE users
-- SET image = 'https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Icon_Emoji_Paimon%27s_Paintings_23_Cyno_1.png/revision/latest?cb=20230506045219'
-- WHERE uid = 3;











-- SELECT * FROM users WHERE uid = 2;


