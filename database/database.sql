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

CREATE Table regions (
  id_daerah int AUTO_INCREMENT,
  nama_daerah varchar(50)
  PRIMARY KEY (id_daerah)
);

CREATE Table tourisms (
  id_wisata int primary key NOT NULL,
  rating float NOT NULL,
  nama_tempat varchar(255) NOT NULL,
  description text NOT NULL,
  category varchar(100) NOT NULL,
  id_daerah int NOT NULL,
  alamat varchar(255) NOT NULL,
  FOREIGN KEY (id_daerah) REFERENCES city(id_daerah) ON DELETE CASCADE
);

CREATE Table cities (
  id_daerah int primary key NOT NULL,
  nama_daerah varchar(255) NOT NULL
);

INSERT INTO CITIES VALUES (1,"jakarta"),(2,"yogyakarta"),(3,"bandung"),(4,"semarang"),(5,"surabaya");

CREATE Table attimages (
  id_image int primary key AUTO_INCREMENT NOT NULL,
  id_wisata int NOT NULL,
  url_image varchar(255) NOT NULL,
  FOREIGN KEY (id_wisata) REFERENCES tourisms(id_wisata) ON DELETE CASCADE
);

CREATE table tourism_favorites (
  user_id int NOT NULL,
  id_wisata int NOT NULL,
  FOREIGN KEY (id_wisata) REFERENCES tourisms(id_wisata) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);