CREATE TABLE "user_freestyle_data" (
	"user_id" text PRIMARY KEY NOT NULL,
	"freestyle_identity" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
