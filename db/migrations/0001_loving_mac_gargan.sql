ALTER TABLE `emails` MODIFY COLUMN `full_name` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `emails` MODIFY COLUMN `email_address` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `emails` MODIFY COLUMN `message` text NOT NULL;