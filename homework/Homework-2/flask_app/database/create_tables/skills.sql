CREATE TABLE IF NOT EXISTS `skills` (
`skill_id`       int(11)       NOT NULL AUTO_INCREMENT 	COMMENT 'The experiance id',
`xp_id`          int(11)       NOT NULL             COMMENT 'FK:position id from experiance table',
`name`           varchar(100)  NOT NULL                	COMMENT 'The name of the skill',
`skill_level`    int(2)        NOT NULL              	COMMENT 'the level of the skill; 1 being worst, 10 being best',
PRIMARY KEY  (`skill_id`),
FOREIGN KEY (xp_id) REFERENCES experiance(xp_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Skills i have aquired";