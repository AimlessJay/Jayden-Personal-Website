CREATE TABLE IF NOT EXISTS `projects` (
`proj_id`        int(11)       NOT NULL AUTO_INCREMENT 	COMMENT 'The project id',
`title`          varchar(100)  DEFAULT NULL                 COMMENT 'Project Title', 
`tools`          varchar(100)  DEFAULT NULL                	COMMENT 'Tools or skills used to complete project',
`text_1`         varchar(200)  DEFAULT NULL             	COMMENT 'Description point 1 of project',
`text_2`         varchar(200)  DEFAULT NULL            	COMMENT 'Description point 2 of project',
`text_3`         varchar(200)  DEFAULT NULL            	COMMENT 'Description point 3 of project',
PRIMARY KEY  (`proj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Projects I have worked on and completed";