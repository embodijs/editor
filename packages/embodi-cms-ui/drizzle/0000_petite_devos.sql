CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`owner` text NOT NULL,
	`provider` text NOT NULL,
	`repo` text NOT NULL,
	`repo_id` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `repoUniqueIndex` ON `project` (lower("provider"),lower("owner"),lower("repo"));--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`git_token` text NOT NULL,
	`provider` text NOT NULL,
	`username` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`github_id` text NOT NULL,
	`email` text NOT NULL,
	`avatar_url` text,
	`name` text NOT NULL
);
