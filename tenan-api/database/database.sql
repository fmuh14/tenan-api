CREATE Table users (
  user_id integer AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(100) NOT NULL,
  created_at timestamp,
  PRIMARY KEY (user_id)
);

CREATE Table tokens (
  id_token int AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  token text NOT NULL,
  expires_at timestamp NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (id_token),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE Table tourisms (
  id_wisata int primary key NOT NULL,
  nama_tempat varchar(255) NOT NULL,
  description text NOT NULL,
  category varchar(100) NOT NULL,
  rating float NOT NULL,
  latitude double NOT NULL,
  longtitude double NOT NULL,
  alamat varchar(255) NOT NULL,
  id_daerah int NOT NULL,
  FOREIGN KEY (id_daerah) REFERENCES cities(id_daerah) ON DELETE CASCADE
);

CREATE Table cities (
  id_daerah int primary key NOT NULL,
  nama_daerah varchar(255) NOT NULL
);

INSERT INTO CITIES VALUES (1,"jakarta"),(2,"yogyakarta"),(3,"bandung"),(4,"semarang"),(5,"surabaya");
INSERT INTO CITIES VALUES (6,"Solo"),
    (7,"Bogor"),
    (8,"Denpasar"),
    (9,"Medan"),
    (10,"Banda Aceh"),
    (11,"Padang"),
    (12,"Palembang");

CREATE Table tourimages (
  id_image int primary key AUTO_INCREMENT NOT NULL,
  id_wisata int NOT NULL,
  url_image varchar(255) NOT NULL,
  FOREIGN KEY (id_wisata) REFERENCES tourisms(id_wisata) ON DELETE CASCADE
);

CREATE table tourism_favorites (
  user_id int NOT NULL,
  id_wisata int NOT NULL,
  FOREIGN KEY (id_wisata) REFERENCES tourisms(id_wisata) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, id_wisata),
  UNIQUE KEY user_wisata_unique (user_id, id_wisata)  
);

CREATE Table lodgings (
  id_penginapan int primary key NOT NULL,
  nama_tempat varchar(255) NOT NULL,
  longtitude double NOT NULL,
  latitude double NOT NULL,
  rating float NOT NULL,
  id_daerah int NOT NULL,
  alamat varchar(255) NOT NULL,
  FOREIGN KEY (id_daerah) REFERENCES cities(id_daerah) ON DELETE CASCADE
);

CREATE Table lodimages (
  id_image int primary key AUTO_INCREMENT NOT NULL,
  id_penginapan int NOT NULL,
  url_image varchar(255) NOT NULL,
  FOREIGN KEY (id_penginapan) REFERENCES lodgings(id_penginapan) ON DELETE CASCADE
);

CREATE table lodging_favorites (
  user_id int NOT NULL,
  id_penginapan int NOT NULL,
  FOREIGN KEY (id_penginapan) REFERENCES lodgings(id_penginapan) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, id_penginapan),
  UNIQUE KEY user_penginapan_unique (user_id, id_penginapan)
);

/* Location of tempat_wisata_msyql_csv */
LOAD DATA INFILE 'D:/Project/capstone-projects/tenan-project/tenan-api/database/tempat_wisata_mysql.csv' 
INTO TABLE tourisms
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

/* Location of image_wisata_mysql.csv */
LOAD DATA INFILE 'D:/Project/capstone-projects/tenan-project/tenan-api/database/image_wisata_mysql.csv' 
INTO TABLE tourimages
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

/* Location of data_hotel_mysql.csv */
LOAD DATA INFILE 'D:/Project/capstone-projects/tenan-project/database/data_hotel_mysql.csv' 
INTO TABLE lodgings
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

/* Location of image_wisata_mysql.csv */
LOAD DATA INFILE 'D:/Project/capstone-projects/tenan-project/tenan-api/database/image_hotel_mysql.csv' 
INTO TABLE lodimages
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;