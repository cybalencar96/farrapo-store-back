CREATE TABLE "users" (
	"id" serial NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"zip_code" varchar(8) NOT NULL,
	"street_number" integer,
	"complement" varchar(255),
	"phone" varchar(20) NOT NULL,
	"gender_id" integer NOT NULL DEFAULT '1',
	"birth_date" DATE NOT NULL,
	"image_url" varchar(2048),
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(36) NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "categories" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "itens_and_categories" (
	"id" serial NOT NULL,
	"item_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "itens_and_categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "colors" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"hex_code" varchar(6) NOT NULL UNIQUE,
	CONSTRAINT "colors_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sizes" (
	"id" serial NOT NULL,
	"name" varchar(4) NOT NULL UNIQUE,
	CONSTRAINT "sizes_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "itens" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" TEXT,
	"price" DECIMAL (12,2) NOT NULL CHECK ("quantity">=0),
	"color_id" integer NOT NULL,
	"size_id" integer,
	"quantity" integer NOT NULL CHECK ("quantity">=0),
	"image_url" varchar(2048) NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT 'now()',
	CONSTRAINT "itens_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "cart" (
	"id" serial NOT NULL,
	"user_id" integer,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL CHECK ("quantity">0),
	"visitor_id" integer,
	CONSTRAINT "cart_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "purchase_history" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL CHECK ("quantity">0),
	"price" DECIMAL (12,2) NOT NULL CHECK ("quantity">=0),
	"date" timestamp with time zone NOT NULL DEFAULT 'now()',
	CONSTRAINT "purchase_history_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "genders" (
	"id" serial NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	CONSTRAINT "genders_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "visitors" (
	"id" serial NOT NULL,
	"token" varchar(36) NOT NULL UNIQUE,
	CONSTRAINT "visitors_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("gender_id") REFERENCES "genders"("id");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");


ALTER TABLE "itens_and_categories" ADD CONSTRAINT "itens_and_categories_fk0" FOREIGN KEY ("item_id") REFERENCES "itens"("id");
ALTER TABLE "itens_and_categories" ADD CONSTRAINT "itens_and_categories_fk1" FOREIGN KEY ("category_id") REFERENCES "categories"("id");



ALTER TABLE "itens" ADD CONSTRAINT "itens_fk0" FOREIGN KEY ("color_id") REFERENCES "colors"("id");
ALTER TABLE "itens" ADD CONSTRAINT "itens_fk1" FOREIGN KEY ("size_id") REFERENCES "sizes"("id");

ALTER TABLE "cart" ADD CONSTRAINT "cart_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "cart" ADD CONSTRAINT "cart_fk1" FOREIGN KEY ("item_id") REFERENCES "itens"("id");
ALTER TABLE "cart" ADD CONSTRAINT "cart_fk2" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id");

ALTER TABLE "cart" ADD CONSTRAINT "cart_ch0" CHECK ("user_id" <> NULL OR "visitor_id" <> NULL);
ALTER TABLE "cart" ADD CONSTRAINT "cart_ch1" CHECK ("user_id" = NULL OR "visitor_id" = NULL);

ALTER TABLE "purchase_history" ADD CONSTRAINT "purchase_history_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "purchase_history" ADD CONSTRAINT "purchase_history_fk1" FOREIGN KEY ("item_id") REFERENCES "itens"("id");
