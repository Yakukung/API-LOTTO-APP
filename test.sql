/*
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS lotto_prize;
DROP TABLE IF EXISTS lotto;

ALTER TABLE lotto RENAME TO lotto_prize;
*/

CREATE TABLE users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    type INTEGER CHECK(type IN (0, 1)) DEFAULT 1 NOT NULL,
    wallet DECIMAL(10, 2) DEFAULT 0.00,
    image TEXT DEFAULT NULL
);


CREATE TABLE lotto (
  lid INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER NOT NULL,
   type TEXT CHECK(type IN ('หวยเดี่ยว', 'หวยชุด')),
  price DECIMAL(10, 2) DEFAULT 0.00,
  lotto_quantity INTEGER DEFAULT 0,
  date TEXT DEFAULT (datetime('now'))
);

CREATE TABLE lotto_prize (
  lpid INTEGER PRIMARY KEY AUTOINCREMENT,
  lid INTEGER NOT NULL,
  prize INTEGER DEFAULT 0,
  wallet_prize INTEGER DEFAULT 0,
   date TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (lid) REFERENCES lotto (lid)
);




INSERT INTO lotto (number, type, price, lotto_quantity, date) VALUES (123456, 'หวยเดี่ยว', 80, 99, '2024-08-23 13:02:19');
INSERT INTO lotto (number, type, price, lotto_quantity, date) VALUES (654321, 'หวยชุด', 400, 40, '2024-08-23 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (112233, 'หวยเดี่ยว', 80, 54, '2024-08-23 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (888999, 'หวยชุด', 400, 19, '2024-08-23 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (123321, 'หวยเดี่ยว', 80, 23, '2024-08-23 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (111111, 'หวยเดี่ยว', 80, 10, '2024-08-23 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (122222, 'หวยเดี่ยว', 80, 9, '2024-08-23 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (676767, 'หวยเดี่ยว', 80, 9, '2024-08-23 13:02:19');


INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (222222, 'หวยเดี่ยว', 80, 9, '2024-08-24 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (232323, 'หวยชุด', 400, 19, '2024-08-24 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (223333, 'หวยเดี่ยว', 80, 9, '2024-08-24 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (678904, 'หวยเดี่ยว', 80, 9, '2024-08-24 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (567801, 'หวยเดี่ยว', 80, 9, '2024-08-24 13:02:19');
INSERT INTO lotto (number,type, price, lotto_quantity, date) VALUES (567802, 'หวยเดี่ยว', 80, 9, '2024-08-24 13:02:19');

INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (1, 5, '2024-08-23 13:02:19', 100000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (2, 4, '2024-08-23 13:02:19', 500000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (3, 3, '2024-08-23 13:02:19', 1000000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (4, 2, '2024-08-23 13:02:19', 2000000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (5, 1, '2024-08-23 13:02:19', 6000000);

INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (9, 5, '2024-08-23 13:02:19', 100000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (10, 4, '2024-08-23 13:02:19', 500000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (11, 3, '2024-08-23 13:02:19', 1000000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (12, 2, '2024-08-23 13:02:19', 2000000);
INSERT INTO lotto_prize (lid, prize, date, wallet_prize) VALUES (13, 1, '2024-08-23 13:02:19', 6000000);



SELECT * FROM lotto_prize

CREATE TRIGGER update_wallet_prize
AFTER INSERT ON lotto_prize
FOR EACH ROW
WHEN NEW.prize = 1
BEGIN
    UPDATE lotto_prize
    SET wallet_prize = 6000000
    WHERE lpid = NEW.lpid;
END;


SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
FROM lotto_prize lp
JOIN lotto l ON lp.lid = l.lid
WHERE lp.prize = 1;


 SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
              FROM lotto_prize lp
              JOIN lotto l ON lp.lid = l.lid
              WHERE DATE(l.date) = DATE('now');



  SELECT lp.prize, l.number, l.type, price, l.date, lotto_quantity
              FROM lotto_prize lp
              JOIN lotto l ON lp.lid = l.lid

SELECT * FROM lotto


SELECT lp.prize, lp.wallet_prize, l.number, l.type, l.price, l.date, l.lotto_quantity
FROM lotto_prize lp
JOIN lotto l ON lp.lid = l.lid
ORDER BY l.date DESC, lp.prize ASC;



PRAGMA table_info(lotto_prize);






INSERT INTO users (fullname, username, email, phone, password, type, wallet) 
VALUES ('Admin Kung', 'admin_kung', 'adminkung@gmail.com', '0987654321', '1', 0, 0.00);



INSERT INTO users (fullname, username, email, phone, password, wallet, image) 
VALUES ('อัษฎาวุธ ไชยรักษ์', 'yakukung', 'k@gmail.com', '0910091988', '1', 100.00, 'https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Icon_Emoji_Paimon%27s_Paintings_23_Cyno_1.png/revision/latest?cb=20230506045219');

INSERT INTO users (fullname, username, email, phone, password, wallet) 
VALUES ('ผู้มาเยือนนิรนาม', 'kung', 'kung@gmail.com', '0950939712', '123', 100.00);

INSERT INTO users (fullname, username, email, phone, password, wallet, image) 
VALUES ('Yakukung', 'kung123', 'kung123@gmail.com', '0950855604', '123', 100.00, 'https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Icon_Emoji_Paimon%27s_Paintings_23_Cyno_1.png/revision/latest?cb=20230506045219');

INSERT INTO users (fullname, username, email, phone, password, wallet, image) 
VALUES ('คามาโดะ ทันจิโร่', '1', 'tanjiro@gmail.com', '0989898989', '1', 1000.00, NULL);



UPDATE users
SET image = 'https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Icon_Emoji_Paimon%27s_Paintings_23_Cyno_1.png/revision/latest?cb=20230506045219'
WHERE uid = 3;


UPDATE users
SET fullname = '', phone = 0123, email = 'nani@gmail.com', image = NULL
WHERE uid = 2;






SELECT * FROM users WHERE uid = 4;



SELECT * FROM users